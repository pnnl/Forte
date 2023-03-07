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
            <Grid item>{
                (this.props.is_job_ready_sa)?<Plots></Plots>:
                <Grid container direction="row" alignItems="center" height="95vh">
                    <Grid item>
                        <Grid container direction="column" alignItems="center" width="80vw">
                            <Grid item><h3>This job is not ready yet</h3></Grid>
                        </Grid>
                    </Grid>
                </Grid>
                }</Grid>
        </Grid>
      </div>
       
    }
  
};
const maptstateToprop = (state) => {
    return {
        blank_placeholder:state.blank_placeholder,
        selected_job_name_sa: state.selected_job_name_sa,
        is_job_ready_sa: state.is_job_ready_sa,
    }
}
const mapdispatchToprop = (dispatch) => {
    return {
        set_blank_placeholder: (val) => dispatch({ type: "blank_placeholder", value: val }),
    }
}
export default connect(maptstateToprop, mapdispatchToprop)(ShowJob);