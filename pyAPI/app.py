from flask import Flask, render_template, Response, g, redirect, url_for, request,jsonify, make_response
import time, os, re
import pandas as pd
import numpy as np
from flask_cors import CORS
import requests, ast
import json
import logging
import tensorflow as tf
import tensorflow_probability as tfp

app = Flask(__name__)
CORS(app)
logging.basicConfig(filename='pyAPI/logs/flask.log',level=logging.DEBUG,format='%(asctime)s %(levelname)s %(name)s %(threadName)s : %(message)s') #https://www.scalyr.com/blog/getting-started-quickly-with-flask-logging/
path_parent = os.getcwd()

# Non-callable functions
def prepare_data(filename):
    A=pd.read_csv(path_parent+'/data/inputs/'+filename) # Reading file
    A=A.drop(['min_t'], axis=1) # Drop this axis
    A=A.dropna() # Drop axis with 'NA' values
    return A
def NLL(y, distr): 
    sy = distr.mean()
    return 1*-distr.log_prob(y)+tf.keras.losses.mean_squared_error(y, sy)

my_model = tf.keras.models.load_model(path_parent+"/data/models/model_rnn_probab_nonsol.h5", custom_objects={'NLL': NLL})

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