/* eslint-disable no-useless-constructor */
/* eslint-disable no-unused-vars */
import React, {Component} from 'react';
import { connect } from "react-redux";
import { Card, CardGroup} from 'react-bootstrap';
import Grid from '@mui/material/Grid';
import * as $ from "jquery";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from '@mui/material/Button';
import Sensitivity from '../charts/Sensitivity';
import Tooltip from '@mui/material/Tooltip';
import InputVariables from '../create_jobs/InputVariables';
import NoiseDirection from '../create_jobs/NoiseDirection';
import DateSelector from '../create_jobs/DateSelector';

export class  CardOne extends Component {
  //const classes = useStyles();
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
//const { selected_list } = this.state;  
return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12}><InputVariables></InputVariables></Grid>
        <Grid item xs={12}><DateSelector></DateSelector></Grid>
        <Grid item xs={12}>Months</Grid>
        <Grid item xs={12}>Noise Level</Grid>
        <Grid item xs={12}><NoiseDirection></NoiseDirection></Grid>
        <Grid item xs={12}>Name</Grid>
        <Grid item xs={12}>Description</Grid>
      </Grid>
    </div>
    
  );
 } //return ends
}

const maptstateToprop = (state) => {
  return {
      blank_placeholder: state.blank_placeholder,
      isLoadingUpdate: state.isLoadingUpdate,
      net_load_df: state.net_load_df,
      enable_seasons_choice: state.enable_seasons_choice,
      mae_values: state.mae_values,
  }
}
const mapdispatchToprop = (dispatch) => {
  return {
      set_blank_placeholder: (val) => dispatch({ type: "blank_placeholder", value: val }),
  }
}

export default connect(maptstateToprop, mapdispatchToprop)(CardOne);