from tracemalloc import start
from flask import Flask, render_template, Response, g, redirect, url_for, request,jsonify, make_response
import time, os, re
import pandas as pd
import numpy as np
from flask_cors import CORS
import requests, ast
import json 
from tqdm import tqdm# as tqdm1
import logging
import tensorflow as tf
import tensorflow_probability as tfp
import math
from scipy import io
from scipy.io import loadmat
from keras.layers import Input, Dense, LSTM, Reshape, Conv1D, MaxPooling1D, Flatten,UpSampling1D,Conv1DTranspose
from keras.models import Model
from sklearn.metrics import mean_absolute_error, mean_squared_error, mean_absolute_percentage_error
#import properscoring as ps
import matplotlib.pyplot as plt
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)
logging.basicConfig(filename='pyAPI/logs/flask.log',level=logging.DEBUG,format='%(asctime)s %(levelname)s %(name)s %(threadName)s : %(message)s') #https://www.scalyr.com/blog/getting-started-quickly-with-flask-logging/
path_parent = os.getcwd()
np.random.seed(7)
tf.random.set_seed(7)


### Utility functions ###

class Scaler1D:
    """
    Utility class for sequence scaling
    """
    def fit(self, X):
        np.random.seed(7)
        tf.random.set_seed(7)
        self.mean = np.nanmean(np.asarray(X).ravel())
        self.std = np.nanstd(np.asarray(X).ravel())
        return self
        
    def transform(self, X):
        return (X - np.min(X,0))/(np.max(X,0)-np.min(X,0))
    
    def inverse_transform(self, X):
        return X*(np.max(X,0)-np.min(X,0)) + np.min(X,0)

sequence_length = 24*2
def gen_seq(id_df, seq_length, seq_cols):
    """
    This function converts the dataframe into numpy array of arrays
    Inputs:
    id_df: dataframe
    seq_length: length of historical datapoints to use for forecast
    seq_cols: columns of the dataframe id_df

    Output:
    numpy array of arrays for each sequence
    Example:
    Sequence 1 would be the df rows (0,48)
    Sequence 2 would be the df rows (1,49)
    Sequence 3 would be the df rows (2,50)
    ...
    Sequence n would be the df rows (26180,26228)
    """
    data_matrix =  id_df[seq_cols]
    num_elements = data_matrix.shape[0]

    for start, stop in zip(range(0, num_elements-seq_length, 1), range(seq_length, num_elements, 1)):
        
        yield data_matrix[stop-sequence_length:stop].values.reshape((-1,len(seq_cols)))

def NLL(y, distr): 
    sy = distr.mean()
    return 1*-distr.log_prob(y)+tf.keras.losses.mean_squared_error(y, sy)

def kernel(x, y):
    return math.exp(-np.linalg.norm(x - y)/2)

def pbb_calculation(obs, pred):
    mean = np.mean(pred)
    sd = np.std(pred)
    upper_bound = mean + sd
    lower_bound = mean -sd
    pbb = ((len(list(x for x in obs if lower_bound < x < upper_bound)))/len(obs))*100
    return pbb
### Loading the models ###
autoencoder_models, encoder_models, lstm_models = {}, {}, {}
for i in ["0","10","20","50"]:
    autoencoder_models[i] = tf.keras.models.load_model(path_parent+"/data/models/pen_"+i+"/autoencoder.h5")
    encoder_models[i] = tf.keras.models.load_model(path_parent+"/data/models/pen_"+i+"/encoder.h5")
    lstm_models[i] = tf.keras.models.load_model(path_parent+"/data/models/pen_"+i+"/model_rnn_probab_nonsol.h5", custom_objects={'NLL': NLL})

### Pipeline functions and others (non-callable externally) ###

def prepare_input(start_date, end_date, solar_penetration):
    t = time.process_time()
    A=pd.read_csv(path_parent+"/data/inputs/df1_solar_"+str(solar_penetration)+"_pen.csv") # Reading file
    my_data = A.loc[(A['min_t'] >= start_date) & (A['min_t'] < end_date)]
    #my_data = A
    my_data=my_data.drop(['min_t'], axis=1) # Drop this axis
    my_data=my_data.fillna(99999)

    sequence_length = 24*2 # Length of historical datapoints to use for forecast
    sequence_input = []
    for seq in tqdm(gen_seq(my_data, sequence_length, my_data.columns)):
        sequence_input.append(seq)    
    sequence_input = np.asarray(sequence_input) 
    #print(sequence_input)
    
    y_ground=[]
    for i in range(len(sequence_input)):
        y_ground.append(my_data.iloc[i+48]['power'])   # Original code
        #y_ground.append(my_data.iloc[i]['power'])   
    y_ground=np.asarray(y_ground)
    pd.DataFrame(y_ground).to_csv(path_parent+"/data/outputs/pen_"+str(solar_penetration)+"/y_ground.csv", header=None, index=None)

    temperature = []
    for i in range(len(sequence_input)):
        temperature.append(my_data.iloc[i+48]['temp'])
    humidity = []
    for i in range(len(sequence_input)):
        humidity.append(my_data.iloc[i+48]['humidity'])
    apparent_power = []
    for i in range(len(sequence_input)):
        apparent_power.append(my_data.iloc[i+48]['apparent_power'])        
  

    y_prev = []
    sequence_target = []
    #AA=A
    B=my_data.drop(['apparent_power', 'humidity','temp'], axis=1)
    for seq in tqdm(gen_seq(B, sequence_length, B.columns)):
        y_prev.append(seq)
    y_prev=np.asarray(y_prev)
    y_prev=y_prev.reshape((y_prev.shape[0],y_prev.shape[1]))
    elapsed_time_prepare_input = time.process_time() - t
    return sequence_input, y_ground, y_prev, temperature, humidity, apparent_power, elapsed_time_prepare_input

def autoencoder_func(sequence_input, solar_penetration):
    t = time.process_time()
    scaler_target = Scaler1D().fit(sequence_input)
    seq_inp_norm = scaler_target.transform(sequence_input)
    #pred_train=autoencoder_model.predict(seq_inp_norm) # this one does not work
    encoder_model = encoder_models[str(solar_penetration)]
    pred_train=encoder_model.predict(seq_inp_norm)
    #print(pred_train)
    #pd.DataFrame(pred_train).to_csv(path_parent+'/data/outputs/pen_"+str(solar_penetration)+"/pred_train.csv', header=None, index=None)
    elapsed_time_autoencoder = time.process_time() - t
    return pred_train, elapsed_time_autoencoder

def kPF_func(pred_train, solar_penetration):
    t = time.process_time()
    nsamples = 10000
    gamma = 10
    #A = np.load(path_parent+"/data/models/pen_"+str(solar_penetration)+"/dict.npy", allow_pickle=True).item()
    A = np.load("dict.npy", allow_pickle=True).item()
    Kinv = A['kinv']
    L = A['L']
    z = A['z']
    x = A['x']
    ntrain = x.shape[0]
    latent_dim = x.shape[1]
    nz = np.random.multivariate_normal(np.zeros((latent_dim,)), np.eye(latent_dim), nsamples)

    nv = np.zeros((ntrain, nsamples))
    for i in range(ntrain):
        for j in range(nsamples):
            nv[i][j] = kernel(z[i], nz[j])
    s = L@Kinv@nv   #matrix multiplication
    ind = np.argsort(-s, 0)[:gamma,:]
    latent_gen = np.zeros((nsamples, latent_dim))
    for i in range(nsamples):
        _sum = 0
        for j in range(gamma):
            latent_gen[i] += s[ind[j][i]][i] * x[ind[j][i]]
            _sum += s[ind[j][i]][i]
        latent_gen[i] /= _sum
    #print(latent_gen)
    elapsed_time_kpf = time.process_time() - t
    return latent_gen, elapsed_time_kpf

def lstm_func(latent_gen, sequence_input, pred_train, y_ground, y_prev, solar_penetration):
    t = time.process_time()
    aa = (latent_gen)
    #total_train=int(len(sequence_input) - 48) # did not use this since we are not using training data
    total_train=int(len(sequence_input))
    yyy=np.zeros((total_train,40))
    for index in tqdm(range(total_train)):
        yyy[index,0:20]=np.mean(aa[np.argsort(np.linalg.norm(aa[:,:]-pred_train[index,:],axis=1))[0:10],:],axis=0)
        yyy[index,20:40]=np.std(aa[np.argsort(np.linalg.norm(aa[:,:]-pred_train[index,:],axis=1))[0:10],:],axis=0)
        
    yyy1=np.concatenate((yyy,y_prev[:,47].reshape((len(y_prev),1))),axis=1)

    y_train_sol=y_ground
    total_train_data=np.concatenate((yyy1,y_train_sol.reshape((len(y_train_sol),1))),axis=1)
    scaler_target = Scaler1D().fit(total_train_data)
    total_norm_train = scaler_target.transform(total_train_data)
    X=total_norm_train[:,0:41].reshape((total_norm_train.shape[0],41,1))
    Y=total_norm_train[:,41]

    lstm_model = lstm_models[str(solar_penetration)]
    y_pred = lstm_model.predict(X)
    y_pred=y_pred*(np.max(total_train_data[:,41])-np.min(total_train_data[:,41]))+np.min(total_train_data[:,41])
    Y_test=Y*(np.max(total_train_data[:,41])-np.min(total_train_data[:,41]))+np.min(total_train_data[:,41])
    #y_pred = y_pred.flatten()
    #print(y_pred, Y_test)
    print(y_pred.shape, Y_test.shape)
    np.savetxt(path_parent+"/data/outputs/pen_"+str(solar_penetration)+"/y_pred.csv", y_pred, delimiter=",")
    np.savetxt(path_parent+"/data/outputs/pen_"+str(solar_penetration)+"/Y_test.csv", Y_test, delimiter=",")
    mae = mean_absolute_error(Y_test, y_pred)
    # mape = mean_absolute_percentage_error(Y_test, y_pred)
    # crps = ps.crps_ensemble(y_pred.flatten(), Y_test).mean()
    # pbb = pbb_calculation(Y_test, y_pred.flatten())
    mse = mean_squared_error(Y_test, y_pred)
    elapsed_time_lstm = time.process_time() - t
    #return y_pred, Y_test, mae, mape, crps, pbb, mse, elapsed_time_lstm
    return y_pred, Y_test, mae, elapsed_time_lstm

def generate_comparison_image(y_pred, Y_test, solar_penetration):
    """
    This function generates an image(through matplotlib) comparing 
    the actual and predicted net load values through line charts

    Inputs:
    y_pred: the predicted net load
    Y_test: the actual net load

    Output:
    Image: saved in the folder /data/outputs/comparison.png 
    (path is relative to the project folder)
    """
    plt.plot(Y_test, label="actual")
    plt.plot(y_pred.flatten(), label="prediction")
    plt.legend(loc="upper right")
    plt.title("Comparison of Net Load Actual vs. Prediction")
    plt.xlabel("Time Interval Index")
    plt.ylabel("Net Load (kW)")
    plt.savefig(path_parent+"/data/outputs/pen_"+str(solar_penetration)+"/comparison.png")
    return 1

def validate_start_date(start_date):
    received_start_date = datetime.strptime(start_date, "%Y-%m-%d %H:%M:%S")
    edited_start_date = datetime.strftime((received_start_date - timedelta(hours = 12)), "%Y-%m-%d %H:%M:%S" )
    # Handle sending lesser than 1st Jan dates
    return edited_start_date

### Callable functions ###

@app.route('/api/v1/processor',methods = ['POST', 'GET'])
def processor():
    t = time.process_time()
    start_date, end_date, solar_penetration = "2020-05-01 00:00:00", "2020-05-03 00:00:00", 50
    start_date = validate_start_date(start_date)
    print(start_date)
    if(request.is_json):
        req = request.get_json()
        start_date = validate_start_date(req["start_date"])
        end_date = req["end_date"]
        solar_penetration = req["solar_penetration"]
    filename = "df1_solar_"+str(solar_penetration)+"_pen.csv"
    sequence_input, y_ground, y_prev, temperature, humidity, apparent_power, elapsed_time_prepare_input = prepare_input(start_date, end_date, solar_penetration)
    pred_train, elapsed_time_autoencoder = autoencoder_func(sequence_input, solar_penetration)
    latent_gen, elapsed_time_kpf = kPF_func(pred_train, solar_penetration)
    #y_pred, Y_test, mae, mape, crps, pbb, mse, elapsed_time_lstm = lstm_func(latent_gen, sequence_input, pred_train, y_ground, y_prev)
    y_pred, Y_test, mae, elapsed_time_lstm = lstm_func(latent_gen, sequence_input, pred_train, y_ground, y_prev, solar_penetration)
    #generate_comparison_image(y_pred, Y_test, solar_penetration)
    elapsed_time_total = time.process_time() - t
    #final_result ={"1. message":"Program executed", "2. time taken (prepare input)": elapsed_time_prepare_input, "3. time taken (autoencoder)":elapsed_time_autoencoder, "4. time taken (kPF)": elapsed_time_kpf, "5. time taken (LSTM)": elapsed_time_lstm, "6. total time taken":elapsed_time_total, "7. MAE": mae, "8. MAPE": mape, "9. CRPS": crps, "10. PBB": pbb, "11. MSE": mse}
    final_result ={"1. message":"Program executed", "2. time taken (prepare input)": elapsed_time_prepare_input, "3. time taken (autoencoder)":elapsed_time_autoencoder, "4. time taken (kPF)": elapsed_time_kpf, "5. time taken (LSTM)": elapsed_time_lstm, "6. total time taken":elapsed_time_total, "7. MAE": mae, "predicted_net_load":y_pred.flatten().tolist(), "actual_net_load": Y_test.tolist(), "temperature":temperature, "humidity":humidity, "apparent_power":apparent_power}
    response=make_response(jsonify(final_result), 200) #removed processing
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response;


@app.route('/api/v1/stability_check', methods = ['POST', 'GET'])
def stability_check():
    """
    This function checks for the stability of the program.
    Calls to the random functions make it difficult to produce reproducible results.
    This function specifically runs multiple times to check if outputs are same with same input

    Input:(optional)
    n: the number of times to execute the program
    If supplying different value of n, use the following query:
    /api/v1/stability_check?n=5

    Output:
    JSON output with the stability result, n, and average execution time
    """
    time_array, mae_array, mape_array, crps_array, pbb_array, answer = [], [], [], [], [], ""
    n = request.args.get('n', default = 3, type = int)
    for i in range(n):
        print("Stability Check Round %d" %i)
        output = processor()
        output = output.get_json()
        time_array.append(output["6. total time taken"])
        mae_array.append(output["7. MAE"])
        # mape_array.append(output["8. MAPE"])
        # crps_array.append(output["9. CRPS"])
        # pbb_array.append(output["10. PBB"])
    #if((len(set(mae_array)) == 1) & (len(set(mape_array)) == 1) & (len(set(crps_array)) == 1) & (len(set(pbb_array)) == 1)): answer = "Program is stable"
    if((len(set(mae_array)) == 1)): answer = "Program is stable"
    else: answer = "Program is NOT stable"  
    #message={"1. message": answer, "2. Number of times executed": n, "3. Average execution time (seconds)": sum(time_array)/len(time_array), "4. MAE": mae_array[0], "5. MAPE": mape_array[0], "6. CRPS": crps_array[0], "7. PBB": pbb_array[0]}
    message={"1. message": answer, "2. Number of times executed": n, "3. Average execution time (seconds)": sum(time_array)/len(time_array), "4. MAE": mae_array[0]}
    app.logger.info(message)
    return message

@app.errorhandler(404)
def handle_404(e):
    # handle all other routes here
    return 'No such API endpoint available.'

@app.route('/',methods = ['POST', 'GET'])
def index():
    final_result2 ={"message": "This is not an error. This endpoint is not configured for public use."}
    
    response=make_response(jsonify(final_result2), 200) #removed processing
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response;