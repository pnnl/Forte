/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
import React, { Component } from 'react';
import { connect } from "react-redux";
import * as $ from "jquery";
import * as d3 from "d3";
import _ from 'lodash';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as jsonCall from "../../../Algorithms/JSONCall";



class UpdateButton extends Component {
    constructor(props) {
        super(props)
        this.state = { temp: 1 }
    }
    componentDidMount() {
        //this.setState({ temp: 0 });
    }
    componentDidUpdate(prevProps, prevState) {
    }
    
    handleButtonClick=()=>{
        this.props.set_isLoadingUpdate(true); 
        if(this.props.start_date_temp< this.props.end_date_temp){
            this.props.set_start_date(this.props.start_date_temp);
            this.props.set_end_date(this.props.end_date_temp);
            this.props.set_solar_penetration(this.props.solar_penetration_temp);
            var converted_start_date = new Date(this.props.start_date_temp)
            converted_start_date = (converted_start_date.toISOString()).replace("T", " ").replace(".000Z", "")
            var converted_end_date = new Date(this.props.end_date_temp)
            converted_end_date = (converted_end_date.toISOString()).replace("T", " ").replace(".000Z", "")
            console.log(converted_start_date, converted_end_date)

            var processor = "processor_15min_ahead";
            if(this.props.selected_model === "net load 15 min ahead"){processor = "processor_15min_ahead"}
            else if(this.props.selected_model === "net load 24 hr ahead"){processor = "processor_24hr_ahead"}

            var metrics_updated ={}
            var metrics = ["temperature", "humidity", "apparent_power"]
            metrics.map(em => {metrics_updated[em]=((this.props.updated_metric[em]).length>0)?0:0}) // capturing which metrics are updated; reset all metrics when this button is clicked

            jsonCall.download(this.props.url + "/api/v@"+this.props.url_version+"/processor", {start_date: converted_start_date, end_date: converted_end_date, solar_penetration:this.props.solar_penetration_temp, temperature_updated:0, humidity_updated:0, apparent_power_updated:0, metrics_updated:metrics_updated, updated_metric:this.props.updated_metric, selected_model: this.props.selected_model}).then(res =>{
                console.log(res);
                this.props.set_net_load_df_old(this.props.net_load_df);
                this.props.set_conf_95_df_old(this.props.conf_95_df); //Saving the older values
                this.props.set_net_load_df(res["net_load_df"]);
                this.props.set_conf_95_df(res["conf_95_df"]);
                this.props.set_temperature_df(res["temperature_df"]);
                this.props.set_humidity_df(res["humidity_df"]);
                this.props.set_apparent_power_df(res["apparent_power_df"]);
                this.props.set_temperature_nans_percentage(res["temperature_nans_percentage"]);
                this.props.set_humidity_nans_percentage(res["humidity_nans_percentage"]);
                this.props.set_apparent_power_nans_percentage(res["apparent_power_nans_percentage"]);
                this.props.set_enable_seasons_choice(this.props.enable_seasons_choice_temp);
                console.log("Selected Variables Temp: ",this.props.selected_variables_temp);
                this.props.set_selected_variables(this.props.selected_variables_temp)
                var updated_metric = this.props.updated_metric;
                var noise_control = this.props.noise_control;
                metrics.map(el => {
                    updated_metric[el] = [];
                    noise_control[el] = -1;
                
                }) // resetting all the metrics
                this.props.set_updated_metric(updated_metric);
                this.props.set_noise_temperature_temp(-1);
                this.props.set_noise_control(noise_control);
                this.props.set_mae(res["7. MAE"]);
                this.props.set_mape(res["8. MAPE"]);
                this.props.set_isLoadingUpdate(false);
                
                })
        }
        else{
           alert("Please select an end date later than the start date");
           this.props.set_isLoadingUpdate(false);
        }
        
        
    } 
    render() {
        // css design is in App.css

        return (
           <div>
            &nbsp;&nbsp;
                <Button 
                variant="secondary"
                style={{backgroundColor: (this.props.color_buttons)["general"], color:"black", marginTop:"10%"}}
                disabled={this.props.isLoadingUpdate}
                onClick={!this.props.isLoadingUpdate ?this.handleButtonClick : null}
                >{this.props.isLoadingUpdate ? 'Loading…' : 'Update'}</Button>
          
          </div>
          );
       
    }
  
};
const maptstateToprop = (state) => {
    return {
        blank_placeholder:state.blank_placeholder,
        url: state.url,
        url_version: state.url_version,
        color_buttons: state.color_buttons,
        isLoadingUpdate: state.isLoadingUpdate,
        start_date: state.start_date,
        end_date: state.end_date,
        start_date_temp: state.start_date_temp,
        end_date_temp: state.end_date_temp,
        solar_penetration_temp: state.solar_penetration_temp,
        updated_metric: state.updated_metric,
        enable_seasons_choice_temp: state.enable_seasons_choice_temp,
        noise_control: state.noise_control,
        net_load_df: state.net_load_df,
        conf_95_df: state.conf_95_df,
        selected_model: state.selected_model,
        selected_variables_temp: state.selected_variables_temp,
    }
}
const mapdispatchToprop = (dispatch) => {
    return {
        set_blank_placeholder: (val) => dispatch({ type: "blank_placeholder", value: val }),
        set_isLoadingUpdate: (val) => dispatch({ type: "isLoadingUpdate", value: val }),
        set_start_date: (val) => dispatch({ type: "start_date", value: val }),
        set_end_date: (val) => dispatch({ type: "end_date", value: val }),
        set_net_load_df: (val) => dispatch({ type: "net_load_df", value: val}),
        set_conf_95_df: (val) => dispatch({ type: "conf_95_df", value: val}),
        set_net_load_df_old: (val) => dispatch({ type: "net_load_df_old", value: val}),
        set_conf_95_df_old: (val) => dispatch({ type: "conf_95_df_old", value: val}),
        set_temperature_df: (val) => dispatch({ type: "temperature_df", value: val}),
        set_humidity_df: (val) => dispatch({ type: "humidity_df", value: val}),
        set_apparent_power_df: (val) => dispatch({ type: "apparent_power_df", value: val}),
        set_temperature_nans_percentage: (val) => dispatch({ type: "temperature_nans_percentage", value: val}),
        set_humidity_nans_percentage: (val) => dispatch({ type: "humidity_nans_percentage", value: val}),
        set_apparent_power_nans_percentage: (val) => dispatch({ type: "apparent_power_nans_percentage", value: val}),
        set_solar_penetration: (val) => dispatch({ type: "solar_penetration", value: val}),
        set_enable_seasons_choice: (val) => dispatch({ type: "enable_seasons_choice", value: val}),
        set_updated_metric: (val) => dispatch({ type: "updated_metric", value: val }),
        set_noise_temperature_temp: (val) => dispatch({ type: "noise_temperature_temp", value: val }),
        set_noise_control: (val) => dispatch({ type: "noise_control", value: val }),
        set_mae: (val) => dispatch({ type: "mae", value: val}),
        set_mape: (val) => dispatch({ type: "mape", value: val}),
        set_selected_variables: (val) => dispatch({ type: "selected_variables", value: val}),
    }
}
export default connect(maptstateToprop, mapdispatchToprop)(UpdateButton);