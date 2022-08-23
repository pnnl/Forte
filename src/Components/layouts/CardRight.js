/* eslint-disable no-useless-constructor */
/* eslint-disable no-unused-vars */
import React, {Component} from 'react';
import { connect } from "react-redux";
import { Card, CardGroup} from 'react-bootstrap';
import Grid from '@mui/material/Grid';
import * as $ from "jquery";
import 'bootstrap/dist/css/bootstrap.min.css';
import MetricsChart from '../charts/MetricsChart';

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
var metrics_data = [this.props.temperature_df, this.props.humidity_df, this.props.apparent_power_df];
var metrics_nan_percentage = [Math.round(this.props.temperature_nans_percentage), Math.round(this.props.humidity_nans_percentage), Math.round(this.props.apparent_power_nans_percentage)];
var mini_card_height = (100/metrics.length) + "%";
console.log(this.props.temperature_nans_percentage);


return (
    <div style={{height: "94vh"}}>
    {metrics.map((metric, metric_index) =>{
        return <Card key={metric_index} style={{height: mini_card_height}}>
        <Card.Header>
          <Grid container direction="row" spacing={1}>
          <Grid item xs={12} sm={12}>{metric.replaceAll("_", " ")+metrics_unit[metric_index]}   {(metrics_nan_percentage[metric_index] > 0)?<i class={"fa fa-info-circle matches_question_mark_"+metric} aria-hidden="true"></i>:null}</Grid>
          </Grid>
        </Card.Header>
        <Card.Body style={{opacity:(this.props.isLoadingUpdate)?0.4:1}}>
            {(["temperature", "humidity", "apparent_power"].includes(metric) & (this.props.net_load_df).length >0 & (this.props.temperature_df).length >0)?<MetricsChart the_metric={metric} the_data={metrics_data[metric_index]} the_nans_percentage={metrics_nan_percentage[metric_index]}></MetricsChart>:null}
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
      isLoadingUpdate: state.isLoadingUpdate,
      net_load_df: state.net_load_df,
      temperature_df: state.temperature_df,
      humidity_df: state.humidity_df,
      apparent_power_df : state.apparent_power_df,
      temperature_nans_percentage: state.temperature_nans_percentage,
      humidity_nans_percentage: state.humidity_nans_percentage,
      apparent_power_nans_percentage: state.apparent_power_nans_percentage,
  }
}
const mapdispatchToprop = (dispatch) => {
  return {
      set_blank_placeholder: (val) => dispatch({ type: "blank_placeholder", value: val }),
  }
}

export default connect(maptstateToprop, mapdispatchToprop)(CardRight);