/* eslint-disable no-unused-vars, array-callback-return */
import React, {Component} from 'react';
import {connect} from "react-redux";
import _ from 'lodash';
import Grid from '@mui/material/Grid';
import AppBar from './Components/appbar/AppBar';
import * as d3 from "d3";
//import logo from './logo.svg';
import './App.css';
import CardLeft from './Components/layouts/CardLeft';
import CardRight from './Components/layouts/CardRight';
import CardOne from './Components/layouts/CardOne';
import moment from 'moment-timezone';
import * as jsonCall from "./Algorithms/JSONCall";



class App extends Component{
  constructor(props){
    super(props);
    moment.tz.setDefault('UTC');
    console.log();
  }

  componentDidMount(){
    this.props.set_isLoadingUpdate(true); 
    var converted_start_date = new Date(this.props.start_date)
    converted_start_date = (converted_start_date.toISOString()).replace("T", " ").replace(".000Z", "")
    var converted_end_date = new Date(this.props.end_date)
    converted_end_date = (converted_end_date.toISOString()).replace("T", " ").replace(".000Z", "")
    var metrics_updated ={}
    var metrics = ["temperature", "humidity", "apparent_power"]
    metrics.map(em => {metrics_updated[em] = (em === "temperature")?1:0}) // none of the metrics should be updated
    var values_array = _.range(0.1,3,0.1);
    values_array = values_array.map(em => parseFloat(em).toFixed(1))
    var mae_values = [];
    var mape_values = []
    values_array.map(el =>{
      console.log("Started for noise: "+el)
      this.handle_change_constant_bias(el);
      jsonCall.download(this.props.url + "/api/v@latest/processor", {start_date: converted_start_date, end_date: converted_end_date, solar_penetration:this.props.solar_penetration, temperature_updated:1,humidity_updated:0, apparent_power_updated:0, metrics_updated:metrics_updated, updated_metric:this.props.updated_metric}).then(res =>{
        this.props.set_net_load_df(res["net_load_df"]);
        this.props.set_conf_95_df(res["conf_95_df"]);
        this.props.set_temperature_df(res["temperature_df"]);
        this.props.set_humidity_df(res["humidity_df"]);
        this.props.set_apparent_power_df(res["apparent_power_df"]);
        this.props.set_temperature_nans_percentage(res["temperature_nans_percentage"]);
        this.props.set_humidity_nans_percentage(res["humidity_nans_percentage"]);
        this.props.set_apparent_power_nans_percentage(res["apparent_power_nans_percentage"]);
        this.props.set_mae(res["7. MAE"]);
        this.props.set_mape(res["8. MAPE"]);
        this.props.set_isLoadingUpdate(false);
        mae_values.push([el, res["7. MAE"]])
        mape_values.push([el, res["8. MAPE"]])
        console.log("Completed for noise: "+el)
        this.props.set_mae_values(mae_values);
        this.props.set_mape_values(mape_values);
        
        })
    })
   console.log(mae_values);
    
  }

  // componentDidMount(){}
  componentDidUpdate(){}
  // componentDidUpdate(){
  //   this.props.set_isLoadingUpdate(true); 
  //   var converted_start_date = new Date(this.props.start_date)
  //   converted_start_date = (converted_start_date.toISOString()).replace("T", " ").replace(".000Z", "")
  //   var converted_end_date = new Date(this.props.end_date)
  //   converted_end_date = (converted_end_date.toISOString()).replace("T", " ").replace(".000Z", "")
  //   var metrics_updated ={}
  //   var metrics = ["temperature", "humidity", "apparent_power"]
  //   metrics.map(em => {metrics_updated[em] = (em === "temperature")?1:0}) // none of the metrics should be updated
  //   var values_array = _.range(0.1,3,0.1);
  //   values_array = values_array.map(em => parseFloat(em).toFixed(1))
  //   var mae_values = [];
  //   var mape_values = []
  //   values_array.map(el =>{
  //     console.log("Started for noise: "+el)
  //     this.handle_change_constant_bias(el);
  //     jsonCall.download(this.props.url + "/api/v@latest/processor", {start_date: converted_start_date, end_date: converted_end_date, solar_penetration:this.props.solar_penetration, temperature_updated:1,humidity_updated:0, apparent_power_updated:0, metrics_updated:metrics_updated, updated_metric:this.props.updated_metric}).then(res =>{
  //       this.props.set_net_load_df(res["net_load_df"]);
  //       this.props.set_conf_95_df(res["conf_95_df"]);
  //       this.props.set_temperature_df(res["temperature_df"]);
  //       this.props.set_humidity_df(res["humidity_df"]);
  //       this.props.set_apparent_power_df(res["apparent_power_df"]);
  //       this.props.set_temperature_nans_percentage(res["temperature_nans_percentage"]);
  //       this.props.set_humidity_nans_percentage(res["humidity_nans_percentage"]);
  //       this.props.set_apparent_power_nans_percentage(res["apparent_power_nans_percentage"]);
  //       this.props.set_mae(res["7. MAE"]);
  //       this.props.set_mape(res["8. MAPE"]);
  //       this.props.set_isLoadingUpdate(false);
  //       mae_values.push([el, res["7. MAE"]])
  //       mape_values.push([el, res["8. MAPE"]])
  //       console.log("Completed for noise: "+el)
  //       this.props.set_mae_values(mae_values);
  //       this.props.set_mape_values(mape_values);
        
  //       })
  //   })
  //  console.log(mae_values);
    
  // }

  convert_to_Array_of_Arrays(input, the_metric){
    var output = input.map(function(obj) {
        return [obj.dummy, obj.timeline, obj.wasNan, obj[the_metric]]
      }); 
    return output;  
  }

  handle_change_uniform_noise(noise){
      console.log(this.calculate_uniform_noise([1,3,5], noise));
      this.props.set_noise_temperature_temp(noise);
      var the_metric = "temperature"

      var updated_metric =this.props.updated_metric;
      var formatted_array = ((updated_metric[the_metric]).length === 0)?this.convert_to_Array_of_Arrays(this.props.temperature_df, the_metric):updated_metric[the_metric];
      console.log("Initial",formatted_array);
      var formatted_array_edited = this.calculate_uniform_noise(formatted_array.map(em => em[3]),noise);
      formatted_array = formatted_array.map((em,i) => [em[0], em[1], em[2],formatted_array_edited[i]])
      updated_metric[the_metric] = formatted_array;
      this.props.set_updated_metric(updated_metric);
      if(the_metric==="temperature"){this.props.set_updated_temperature(formatted_array);}
      else if(the_metric==="humidity"){this.props.set_updated_humidity(formatted_array);}
      else if(the_metric==="apparent_power"){this.props.set_updated_apparent_power(formatted_array);}
      console.log("Final", formatted_array);
  }
  handle_change_constant_bias(noise){
    console.log(this.calculate_constant_bias([1,3,5], noise));
    this.props.set_noise_temperature_temp(noise);
    var the_metric = "temperature"

    var updated_metric =this.props.updated_metric;
    var formatted_array = ((updated_metric[the_metric]).length === 0)?this.convert_to_Array_of_Arrays(this.props.temperature_df, the_metric):updated_metric[the_metric];
    console.log("Initial",formatted_array);
    var formatted_array_edited = this.calculate_constant_bias(formatted_array.map(em => em[3]),noise);
    formatted_array = formatted_array.map((em,i) => [em[0], em[1], em[2],formatted_array_edited[i]])
    updated_metric[the_metric] = formatted_array;
    this.props.set_updated_metric(updated_metric);
    if(the_metric==="temperature"){this.props.set_updated_temperature(formatted_array);}
    else if(the_metric==="humidity"){this.props.set_updated_humidity(formatted_array);}
    else if(the_metric==="apparent_power"){this.props.set_updated_apparent_power(formatted_array);}
    console.log("Final", formatted_array);
}

  getRandomArbitrary(min, max) {
      return Math.random() * (max - min) + min;
    }

  calculate_uniform_noise(arr,noise){
      var lower_number = 1-(noise/100);//0.95;
      var upper_number = 1+(noise/100);//1.05
      var noisy_arr = arr.map((el)=>this.getRandomArbitrary(lower_number*el, upper_number*el));
      return noisy_arr;
  }
  calculate_constant_bias(arr,noise){
    var lower_number = 1-(noise/100);//0.95;
    var upper_number = 1+(noise/100);//1.05
    var noisy_arr = arr.map((el)=>el+noise);
    return noisy_arr;
}



  render(){

    return(
      <Grid container spacing={0} >
          <Grid item xs={12}><AppBar style={{height:"5vh"}}></AppBar></Grid>
          <Grid item xs={12}>
          {/* <Grid container style={{opacity:(this.props.isLoadingUpdate)?0.4:1}}> */}
          <Grid container>
          <Grid item xs={6} lg={6}><CardOne type={"MAE"}></CardOne></Grid>
          <Grid item xs={6} lg={6}><CardOne type={"MAPE"}></CardOne></Grid>
          </Grid>
        </Grid>
        </Grid>
    )
  }
}

const mapStateToProp = (state) => {
  return {
    blank_placeholder: state.blank_placeholder,
    url: state.url,
    isLoadingUpdate: state.isLoadingUpdate,
    actual_net_load: state.actual_net_load,
    predicted_net_load: state.predicted_net_load,
    apparent_power: state.apparent_power,
    humidity: state.humidity,
    temperature: state.temperature,
    solar_penetration: state.solar_penetration,
    start_date: state.start_date,
    end_date: state.end_date,
    updated_metric: state.updated_metric,
    temperature_df: state.temperature_df

  }
}

const mapDispatchToProp = (dispatch) => {
  return{
    set_blank_placeholder: (val) => dispatch({ type: "blank_placeholder", value: val}),
    set_isLoadingUpdate: (val) => dispatch({ type: "isLoadingUpdate", value: val }),
    set_actual_net_load: (val) => dispatch({ type: "actual_net_load", value: val}),
    set_predicted_net_load: (val) => dispatch({ type: "predicted_net_load", value: val}),
    set_apparent_power: (val) => dispatch({ type: "apparent_power", value: val}),
    set_humidity: (val) => dispatch({ type: "humidity", value: val}),
    set_temperature: (val) => dispatch({ type: "temperature", value: val}),
    set_net_load_df: (val) => dispatch({ type: "net_load_df", value: val}),
    set_conf_95_df: (val) => dispatch({ type: "conf_95_df", value: val}),
    set_temperature_df: (val) => dispatch({ type: "temperature_df", value: val}),
    set_humidity_df: (val) => dispatch({ type: "humidity_df", value: val}),
    set_apparent_power_df: (val) => dispatch({ type: "apparent_power_df", value: val}),
    set_temperature_nans_percentage: (val) => dispatch({ type: "temperature_nans_percentage", value: val}),
    set_humidity_nans_percentage: (val) => dispatch({ type: "humidity_nans_percentage", value: val}),
    set_apparent_power_nans_percentage: (val) => dispatch({ type: "apparent_power_nans_percentage", value: val}),
    set_mae: (val) => dispatch({ type: "mae", value: val}),
    set_mape: (val) => dispatch({ type: "mape", value: val}),
    set_noise_temperature_temp: (val) => dispatch({ type: "noise_temperature_temp", value: val }),
    set_noise_control: (val) => dispatch({ type: "noise_control", value: val }),
    set_updated_temperature: (val) => dispatch({ type: "updated_temperature", value: val }),
    set_updated_humidity: (val) => dispatch({ type: "updated_humidity", value: val }),
    set_updated_apparent_power: (val) => dispatch({ type: "updated_apparent_power", value: val }),
    set_updated_metric: (val) => dispatch({ type: "updated_metric", value: val }),
    set_mae_values: (val) => dispatch({ type: "mae_values", value: val }),
    set_mape_values: (val) => dispatch({ type: "mape_values", value: val }),
  }
}
export default connect(mapStateToProp,mapDispatchToProp)(App);