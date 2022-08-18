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
var metrics = ["temperature", "humidity", "apparent power"];
var mini_card_height = (100/metrics.length) + "%";
return (
    <div style={{height: "94vh"}}>
    {metrics.map((metric, index) =>{
        return <Card key={index} style={{height: mini_card_height}}>
        <Card.Header>
          <Grid container direction="row" spacing={1}>
          <Grid item xs={12} sm={12}>{metric}</Grid>
          </Grid>
        </Card.Header>
        <Card.Body style={{opacity:(this.props.isLoadingUpdate)?0.4:1}}>
            {(metric === "temperature" & (this.props.net_load_df).length >0 & (this.props.temperature_df).length >0)?<MetricsChart the_metric={metric} the_data={this.props.temperature_df}></MetricsChart>:null}
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
  }
}
const mapdispatchToprop = (dispatch) => {
  return {
      set_blank_placeholder: (val) => dispatch({ type: "blank_placeholder", value: val }),
  }
}

export default connect(maptstateToprop, mapdispatchToprop)(CardRight);