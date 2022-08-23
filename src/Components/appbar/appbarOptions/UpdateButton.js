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
            var converted_start_date = new Date(this.props.start_date_temp)
            converted_start_date = (converted_start_date.toISOString()).replace("T", " ").replace(".000Z", "")
            var converted_end_date = new Date(this.props.end_date_temp)
            converted_end_date = (converted_end_date.toISOString()).replace("T", " ").replace(".000Z", "")
            console.log(converted_start_date, converted_end_date)

            jsonCall.download(this.props.url + "/api/v@latest/processor", {start_date: converted_start_date, end_date: converted_end_date, solar_penetration:50}).then(res =>{
                console.log(res);
                this.props.set_net_load_df(res["net_load_df"]);
                this.props.set_temperature_df(res["temperature_df"]);
                this.props.set_humidity_df(res["humidity_df"]);
                this.props.set_apparent_power_df(res["apparent_power_df"]);
                this.props.set_temperature_nans_percentage(res["temperature_nans_percentage"]);
                this.props.set_humidity_nans_percentage(res["humidity_nans_percentage"]);
                this.props.set_apparent_power_nans_percentage(res["apparent_power_nans_percentage"]);
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
        color_buttons: state.color_buttons,
        isLoadingUpdate: state.isLoadingUpdate,
        start_date: state.start_date,
        end_date: state.end_date,
        start_date_temp: state.start_date_temp,
        end_date_temp: state.end_date_temp,
    }
}
const mapdispatchToprop = (dispatch) => {
    return {
        set_blank_placeholder: (val) => dispatch({ type: "blank_placeholder", value: val }),
        set_isLoadingUpdate: (val) => dispatch({ type: "isLoadingUpdate", value: val }),
        set_start_date: (val) => dispatch({ type: "start_date", value: val }),
        set_end_date: (val) => dispatch({ type: "end_date", value: val }),
        set_net_load_df: (val) => dispatch({ type: "net_load_df", value: val}),
        set_temperature_df: (val) => dispatch({ type: "temperature_df", value: val}),
        set_humidity_df: (val) => dispatch({ type: "humidity_df", value: val}),
        set_apparent_power_df: (val) => dispatch({ type: "apparent_power_df", value: val}),
        set_temperature_nans_percentage: (val) => dispatch({ type: "temperature_nans_percentage", value: val}),
        set_humidity_nans_percentage: (val) => dispatch({ type: "humidity_nans_percentage", value: val}),
        set_apparent_power_nans_percentage: (val) => dispatch({ type: "apparent_power_nans_percentage", value: val}),
    }
}
export default connect(maptstateToprop, mapdispatchToprop)(UpdateButton);