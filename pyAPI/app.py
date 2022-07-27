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

app = Flask(__name__)
CORS(app)
logging.basicConfig(filename='pyAPI/logs/flask.log',level=logging.DEBUG,format='%(asctime)s %(levelname)s %(name)s %(threadName)s : %(message)s') #https://www.scalyr.com/blog/getting-started-quickly-with-flask-logging/
path_parent = os.getcwd()


### UTILITY CLASS FOR SEQUENCES SCALING ###

class Scaler1D:
    
    def fit(self, X):
        self.mean = np.nanmean(np.asarray(X).ravel())
        self.std = np.nanstd(np.asarray(X).ravel())
        return self
        
    def transform(self, X):
        return (X - np.min(X,0))/(np.max(X,0)-np.min(X,0))
    
    def inverse_transform(self, X):
        return X*(np.max(X,0)-np.min(X,0)) + np.min(X,0)

# Non-callable functions
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

my_model = tf.keras.models.load_model(path_parent+"/data/models/model_rnn_probab_nonsol.h5", custom_objects={'NLL': NLL})

def my_autoencoder():
    ## HYPERPARAMETERS
    latent_dim =20
    enc=latent_dim
    SEQUENCE_LEN=48
    EMBED_SIZE=4
    NUM_FILTERS=2
    NUM_WORDS=2
    pool_size=2

    inputs = Input(shape=(SEQUENCE_LEN, EMBED_SIZE), name="input")
    x=Reshape((4,48))(inputs)
    x = Conv1D(filters=16, kernel_size=NUM_WORDS,
                activation="selu")(x)
    x = MaxPooling1D(pool_size=pool_size)(x)
    x = Conv1D(filters=16, kernel_size=NUM_WORDS,
                activation="selu")(inputs)
    x = MaxPooling1D(pool_size=pool_size)(x)
    x = Conv1D(filters=32, kernel_size=NUM_WORDS,
                activation="selu")(x)
    x = MaxPooling1D(pool_size=pool_size)(x)
    x=Flatten()(x)
    encoded=Dense(enc)(x)
    x=Dense(11*32)(encoded)
    x=Reshape((11,32))(x)
    x = Conv1DTranspose(filters=16, kernel_size=NUM_WORDS,
                activation="selu")(x)
    x = UpSampling1D(size=4)(x)
    x = Conv1DTranspose(filters=8, kernel_size=NUM_WORDS,
                activation="selu")(x)
    decoded = Conv1D(filters=4, kernel_size=NUM_WORDS,
                activation="selu")(x)

    autoencoder = Model(inputs, decoded)
    autoencoder.summary()

    encoder = Model(inputs, encoded)
    encoder.summary()

    autoencoder.compile(optimizer='adam', loss='mse')
    callback = tf.keras.callbacks.EarlyStopping(monitor='loss', patience=3)
    return encoder, autoencoder

def kernel(x, y):
    return math.exp(-np.linalg.norm(x - y)/2)

def train(file):
  A = loadmat(file)
  idx = np.random.permutation(A['data'].shape[0])
  x = A['data'][idx[:2000]]
  K = np.zeros((x.shape[0], x.shape[0]))
  for i in range(x.shape[0]):
    for j in range(x.shape[0]):
      K[i][j] = kernel(x[i], x[j])

  z = np.random.multivariate_normal(np.zeros((20,)), np.eye(20), x.shape[0])
  L = np.zeros((x.shape[0], x.shape[0]))
  for i in range(x.shape[0]):
    for j in range(x.shape[0]):
      L[i][j] = kernel(z[i], z[j])

  Kinv = np.linalg.pinv(K + 0.001*2000)
  np.save('dict.npy', {'kinv':Kinv, 'L':L, 'x':x, 'z':z})

def draw_samples(nsamples):
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

  s = L@Kinv@nv
  ind = np.argsort(-s, 0)[:gamma,:]

  latent_gen = np.zeros((nsamples, latent_dim))
  for i in range(nsamples):
    _sum = 0
    for j in range(gamma):
      latent_gen[i] += s[ind[j][i]][i] * x[ind[j][i]]
      _sum += s[ind[j][i]][i]
    latent_gen[i] /= _sum
  return latent_gen

sequence_length = 24*2
def gen_seq(id_df, seq_length, seq_cols):

    data_matrix =  id_df[seq_cols]
    num_elements = data_matrix.shape[0]

    for start, stop in zip(range(0, num_elements-seq_length, 1), range(seq_length, num_elements, 1)):
        
        yield data_matrix[stop-sequence_length:stop].values.reshape((-1,len(seq_cols)))


def prepare_data(filename):
    A=pd.read_csv(path_parent+'/data/inputs/'+filename) # Reading file
    A=A.drop(['min_t'], axis=1) # Drop this axis
    A=A.dropna() # Drop axis with 'NA' values
    my_data = A.iloc[[35]]
    
    sequence_length = 24*2 # Length of historical datapoints to use for forecast

    sequence_input = []
    sequence_target = []
    for seq in tqdm(gen_seq(A, sequence_length, A.columns)):
        sequence_input.append(seq)
        
    sequence_input = np.asarray(sequence_input) 
    sequence_input.shape
    
    total_train=int(len(sequence_input)-48)

    y_ground=[]
    for i in range(total_train):
        y_ground.append(A.iloc[i+48]['power'])
        
    y_ground=np.asarray(y_ground)

    sequence_length = 24*2
    y_prev = []
    sequence_target = []
    #AA=A
    B=A.drop(['apparent_power', 'humidity','temp'], axis=1)
    for seq in tqdm(gen_seq(B, sequence_length, B.columns)):
        y_prev.append(seq)
    y_prev=np.asarray(y_prev)
    y_prev=y_prev.reshape((y_prev.shape[0],y_prev.shape[1]))
    y_prev=y_prev[0:total_train,:]

    scaler_target = Scaler1D().fit(sequence_input)

    encoder, autoencoder = my_autoencoder()
    seq_inp_norm = scaler_target.transform(sequence_input)
    pred_train=encoder.predict(seq_inp_norm)

    data={'data':pred_train}
    io.savemat('data.mat',data)

    train('data.mat')
    aa=(draw_samples(10000))
    
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

    X_train=X[0:int(X.shape[0]*0.8),:,:]
    Y_train=Y[0:int(X.shape[0]*0.8)]

    X_test=X[int(X.shape[0]*0.8):,:,:]
    Y_test=Y[int(X.shape[0]*0.8):]

    
    y_pred=my_model.predict(X_test)
    y_pred=y_pred*(np.max(total_train_data[:,41])-np.min(total_train_data[:,41]))+np.min(total_train_data[:,41])
    Y_test=Y_test*(np.max(total_train_data[:,41])-np.min(total_train_data[:,41]))+np.min(total_train_data[:,41])

    
    return 1#sequence_input




# Callable functions
@app.route('/processor',methods = ['POST', 'GET'])
def processor():
    final_result2 ={"message": "This is not an error. This endpoint is not configured for public use."}
    input = "df1_solar_50_pen.csv"
    prepared_data = prepare_data(input)
    model = ""
    output = ""
    print(prepared_data)
    
    response=make_response(jsonify(final_result2), 200) #removed processing
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response;

@app.route('/',methods = ['POST', 'GET'])
def index():
    final_result2 ={"message": "This is not an error. This endpoint is not configured for public use."}
    
    response=make_response(jsonify(final_result2), 200) #removed processing
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response;