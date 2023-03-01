/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
import React, { Component } from 'react';
import { connect } from "react-redux";
import Grid from '@mui/material/Grid';
import * as $ from "jquery";
import * as d3 from "d3";
import _ from 'lodash';
import Plots from './Plots';



class ShowJob extends Component {
    constructor(props) {
        super(props)
        console.log();
    }
    componentDidMount() {
        //this.setState({ temp: 0 });
    }
    componentDidUpdate(prevProps, prevState) {
    }
    render() {
        // css design is in App.css

        return <div>
        <Grid container>
            <Grid item><Plots></Plots></Grid>
        </Grid>
      </div>
       
    }
  
};
const maptstateToprop = (state) => {
    return {
        blank_placeholder:state.blank_placeholder,
        selected_job_name_sa: state.selected_job_name_sa,
    }
}
const mapdispatchToprop = (dispatch) => {
    return {
        set_blank_placeholder: (val) => dispatch({ type: "blank_placeholder", value: val }),
    }
}
export default connect(maptstateToprop, mapdispatchToprop)(ShowJob);