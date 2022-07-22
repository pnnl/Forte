/* eslint-disable no-unused-vars */
import React, {Component} from 'react';
import {connect} from "react-redux";
import Grid from '@mui/material/Grid';
import AppBar from './Components/appbar/AppBar';
import * as d3 from "d3";
//import logo from './logo.svg';
import './App.css';
import CardLeft from './Components/layouts/CardLeft';
import CardRight from './Components/layouts/CardRight';
import moment from 'moment-timezone';



class App extends Component{
  constructor(props){
    super(props);
    moment.tz.setDefault('UTC');
    console.log();
  }

  componentDidMount(){

  }

  componentDidUpdate(){

  }

  render(){

    return(
      <Grid container spacing={0} >
          <Grid item xs={12}><AppBar style={{height:"5vh"}}></AppBar></Grid>
          <Grid item xs={12}>
          {/* <Grid container style={{opacity:(this.props.isLoadingUpdate)?0.4:1}}> */}
          <Grid container>
          <Grid item xs={12} lg={6}><CardLeft></CardLeft></Grid>
          <Grid item xs={12} lg={6}><CardRight></CardRight></Grid>
          </Grid>
        </Grid>
        </Grid>
    )
  }
}

const mapStateToProp = (state) => {
  return {
    blank_placeholder: state.blank_placeholder,
  }
}

const mapDispatchToProp = (dispatch) => {
  return{
    set_blank_placeholder: (val) => dispatch({ type: "blank_placeholder", value: val}),
  }
}
export default connect(mapStateToProp,mapDispatchToProp)(App);