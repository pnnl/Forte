/* eslint-disable no-unused-vars */
import React, {Component} from 'react';
import {connect} from "react-redux";
import { Grid } from '@mui/material/Grid';
import * as d3 from "d3";
//import logo from './logo.svg';
import './App.css';



class App extends Component{
  constructor(props){
    super(props);
    console.log()
  }

  componentDidMount(){

  }

  componentDidUpdate(){

  }

  render(){

    return(
      "Hello"
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