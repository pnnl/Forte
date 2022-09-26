/* eslint-disable no-useless-constructor */
/* eslint-disable no-unused-vars */
import React, {Component} from 'react';
import { connect } from "react-redux";
import { Card, CardGroup} from 'react-bootstrap';
import Grid from '@mui/material/Grid';
import * as $ from "jquery";
import 'bootstrap/dist/css/bootstrap.min.css';
import MetricsChart from '../charts/MetricsChart2';
import Button from '@mui/material/Button';
import * as jsonCall from "../../Algorithms/JSONCall"

export class  CardRight extends Component {
  
  constructor(props) {
    super(props);
    console.log();
  
}
componentDidMount() {}
componentDidUpdate() {}
shouldComponentUpdate(nextProps, nextState){
    return true
}



render(){ 
var metrics = ["temperature", "humidity", "apparent_power"];
var metrics_unit = [" (°F)", " (%)", " (kVA)"];
var metrics_data = [[...this.props.temperature_df], this.props.humidity_df, this.props.apparent_power_df];
var metrics_nan_percentage = [Math.round(this.props.temperature_nans_percentage), Math.round(this.props.humidity_nans_percentage), Math.round(this.props.apparent_power_nans_percentage)];
var mini_card_height = (100/metrics.length) + "%";


return (
    <div style={{height: "94vh"}}>
    {metrics.map((metric, metric_index) =>{
        return <Card key={metric_index} style={{height: mini_card_height}}>
        <Card.Header>
          <Grid container direction="row" spacing={1}>
          <Grid item xs={9} sm={9}>{metric.replaceAll("_", " ")+metrics_unit[metric_index]}   {(metrics_nan_percentage[metric_index] > 0)?<i className={"fa fa-info-circle metrics_nans_info_icon_"+metric} aria-hidden="true"></i>:null}</Grid>
          <Grid item xs={3} sm={3}>{(["temperature"].includes(metric))?<Button size="small" color="secondary" style={{ backgroundColor: "#efefef", opacity: 1, borderRadius: 0, color: "black", marginTop: -2 }}
          onClick={()=>{
            this.props.set_isLoadingUpdate(true);
            var converted_start_date = new Date(this.props.start_date_temp)
            converted_start_date = (converted_start_date.toISOString()).replace("T", " ").replace(".000Z", "")
            var converted_end_date = new Date(this.props.end_date_temp)
            converted_end_date = (converted_end_date.toISOString()).replace("T", " ").replace(".000Z", "")
            console.log(this.props.updated_temperature);

            jsonCall.download(this.props.url + "/api/v1.2/processor", {start_date: converted_start_date, end_date: converted_end_date, solar_penetration:this.props.solar_penetration_temp}).then(res =>{
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
          }}>{this.props.isLoadingUpdate ? 'Loading…' : 'Update'}</Button>:null}</Grid>
          </Grid>
        </Card.Header>
        <Card.Body style={{opacity:(this.props.isLoadingUpdate)?0.4:1}}>
            {(["temperature", "humidity", "apparent_power"].includes(metric) & (this.props.net_load_df).length >0 & ([...this.props.temperature_df]).length >0)?<MetricsChart the_metric={metric} the_data={metrics_data[metric_index]} the_nans_percentage={metrics_nan_percentage[metric_index]}></MetricsChart>:null}
        </Card.Body>
        </Card>
    })}    
    
    </div>  

    
  );
 } //return ends
}

const maptstateToprop = (state) => {
  return {
      blank_placeholder: state.blank_placeholder,
      url: state.url,
      isLoadingUpdate: state.isLoadingUpdate,
      start_date: state.start_date,
      end_date: state.end_date,
      start_date_temp: state.start_date_temp,
      end_date_temp: state.end_date_temp,
      solar_penetration_temp: state.solar_penetration_temp,
      net_load_df: state.net_load_df,
      temperature_df: state.temperature_df,
      humidity_df: state.humidity_df,
      apparent_power_df : state.apparent_power_df,
      temperature_nans_percentage: state.temperature_nans_percentage,
      humidity_nans_percentage: state.humidity_nans_percentage,
      apparent_power_nans_percentage: state.apparent_power_nans_percentage,
      updated_temperature: state.updated_temperature,
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
      set_solar_penetration: (val) => dispatch({ type: "solar_penetration", value: val}),
  }
}

export default connect(maptstateToprop, mapdispatchToprop)(CardRight);