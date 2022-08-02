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
from sklearn.metrics import mean_absolute_error, mean_squared_error

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
        np.random.seed(7)
        tf.random.set_seed(7)
        return (X - np.min(X,0))/(np.max(X,0)-np.min(X,0))
    
    def inverse_transform(self, X):
        np.random.seed(7)
        tf.random.set_seed(7)
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
    np.random.seed(7)
    tf.random.set_seed(7)
    data_matrix =  id_df[seq_cols]
    num_elements = data_matrix.shape[0]

    for start, stop in zip(range(0, num_elements-seq_length, 1), range(seq_length, num_elements, 1)):
        
        yield data_matrix[stop-sequence_length:stop].values.reshape((-1,len(seq_cols)))

def NLL(y, distr): 
    np.random.seed(7)
    tf.random.set_seed(7)
    sy = distr.mean()
    return 1*-distr.log_prob(y)+tf.keras.losses.mean_squared_error(y, sy)

def kernel(x, y):
    np.random.seed(7)
    tf.random.set_seed(7)
    return math.exp(-np.linalg.norm(x - y)/2)

### Loading the models ###
autoencoder_model = tf.keras.models.load_model(path_parent+"/data/models/autoencoder.h5")
encoder_model = tf.keras.models.load_model(path_parent+"/data/models/encoder.h5")
lstm_model = tf.keras.models.load_model(path_parent+"/data/models/model_rnn_probab_nonsol.h5", custom_objects={'NLL': NLL})

### Pipeline functions (non-callable externally) ###

def prepare_input(filename):
    t = time.process_time()
    np.random.seed(7)
    tf.random.set_seed(7)
    A=pd.read_csv(path_parent+'/data/inputs/'+filename) # Reading file
    my_data = A.loc[(A['min_t'] >= '2020-05-01 00:00:00') & (A['min_t'] <= '2020-05-02 23:45:00')]
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
        y_ground.append(my_data.iloc[i+48]['power'])   
    y_ground=np.asarray(y_ground)
    pd.DataFrame(y_ground).to_csv(path_parent+'/data/outputs/y_ground.csv', header=None, index=None)

    y_prev = []
    sequence_target = []
    #AA=A
    B=my_data.drop(['apparent_power', 'humidity','temp'], axis=1)
    for seq in tqdm(gen_seq(B, sequence_length, B.columns)):
        y_prev.append(seq)
    y_prev=np.asarray(y_prev)
    y_prev=y_prev.reshape((y_prev.shape[0],y_prev.shape[1]))
    elapsed_time_prepare_input = time.process_time() - t
    return sequence_input, y_ground, y_prev, elapsed_time_prepare_input

def autoencoder_func(sequence_input):
    t = time.process_time()
    np.random.seed(7)
    tf.random.set_seed(7)
    scaler_target = Scaler1D().fit(sequence_input)
    seq_inp_norm = scaler_target.transform(sequence_input)
    #pred_train=autoencoder_model.predict(seq_inp_norm) # this one does not work
    pred_train=encoder_model.predict(seq_inp_norm)
    #print(pred_train)
    #pd.DataFrame(pred_train).to_csv(path_parent+'/data/outputs/pred_train.csv', header=None, index=None)
    elapsed_time_autoencoder = time.process_time() - t
    return pred_train, elapsed_time_autoencoder

def kPF_func(pred_train):
    t = time.process_time()
    np.random.seed(7)
    tf.random.set_seed(7)
    nsamples = 10000
    gamma = 10
    A = np.load('dict.npy', allow_pickle=True).item()
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
    print(latent_gen)
    elapsed_time_kpf = time.process_time() - t
    return latent_gen, elapsed_time_kpf

def lstm_func(latent_gen, sequence_input, pred_train, y_ground, y_prev):
    t = time.process_time()
    np.random.seed(7)
    tf.random.set_seed(7)
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

    y_pred = lstm_model.predict(X)
    y_pred=y_pred*(np.max(total_train_data[:,41])-np.min(total_train_data[:,41]))+np.min(total_train_data[:,41])
    Y_test=Y*(np.max(total_train_data[:,41])-np.min(total_train_data[:,41]))+np.min(total_train_data[:,41])
    #y_pred = y_pred.flatten()
    print(y_pred, Y_test)
    print(y_pred.shape, Y_test.shape)
    np.savetxt(path_parent+'/data/outputs/y_pred.csv', y_pred, delimiter=",")
    np.savetxt(path_parent+'/data/outputs/Y_test.csv', Y_test, delimiter=",")
    mae = mean_absolute_error(Y_test, y_pred)
    mse = mean_squared_error(Y_test, y_pred)
    print("Mean Absolute Error (MAE): ", mae)
    print("Mean Squared Error (MSE): ", mse)
    elapsed_time_lstm = time.process_time() - t
    return y_pred, Y_test, mae, mse, elapsed_time_lstm 

### Callable functions ###

@app.route('/processor',methods = ['POST', 'GET'])
def processor():
    t = time.process_time()
    np.random.seed(7)
    tf.random.set_seed(7)
    filename = "df1_solar_50_pen.csv"
    sequence_input, y_ground, y_prev, elapsed_time_prepare_input = prepare_input(filename)
    pred_train, elapsed_time_autoencoder = autoencoder_func(sequence_input)
    latent_gen, elapsed_time_kpf = kPF_func(pred_train)
    y_pred, Y_test, mae, mse, elapsed_time_lstm = lstm_func(latent_gen, sequence_input, pred_train, y_ground, y_prev)
    elapsed_time_total = time.process_time() - t
    final_result2 ={"1. message":"Program executed", "2. time taken (prepare input)": elapsed_time_prepare_input, "3. time taken (autoencoder)":elapsed_time_autoencoder, "4. time taken (kPF)": elapsed_time_kpf, "5. time taken (LSTM)": elapsed_time_lstm, "6. total time taken":elapsed_time_total, "7. MAE": mae, "8. MSE": mse}
    response=make_response(jsonify(final_result2), 200) #removed processing
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response;

@app.route('/',methods = ['POST', 'GET'])
def index():
    final_result2 ={"message": "This is not an error. This endpoint is not configured for public use."}
    
    response=make_response(jsonify(final_result2), 200) #removed processing
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response;