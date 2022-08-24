/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
import React, { Component } from 'react';
import { connect } from "react-redux";
import * as $ from "jquery";
import * as d3 from "d3";
import _ from 'lodash';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
//import moment from 'moment-timezone';




class TimeSelection extends Component {
    constructor(props) {
        super(props);
        //moment.tz.setDefault('UTC');
        console.log();
    }
    componentDidMount() {
        //this.setState({ temp: 0 });
    }
    componentDidUpdate(prevProps, prevState) {
    }
    render() {

        return <div>
        {/* <LocalizationProvider dateAdapter={AdapterDateFns}> */}
        <LocalizationProvider dateAdapter={AdapterMoment} >   
            <DateTimePicker
                label="Start date"
                disabled={this.props.isLoadingUpdate}
                renderInput={(params) => <TextField {...params} />}
                //value={new Date(this.props.start_date_temp).toLocaleString("en-US", {timeZone: "UTC"})}
                value={new Date(this.props.start_date_temp)}
                onChange={(newValue) => {
                    this.props.set_start_date_temp(newValue.valueOf());
                  }}
            />&nbsp;
             <DateTimePicker
                label="End date"
                disabled={this.props.isLoadingUpdate}
                renderInput={(params) => <TextField {...params} />}
                // value={new Date(this.props.end_date_temp).toLocaleString("en-US", {timeZone: "UTC"})}
                value={new Date(this.props.end_date_temp)}
                onChange={(newValue) => {
                    this.props.set_end_date_temp(newValue.valueOf());
                  }}
            />
        </LocalizationProvider>
      </div>
       
    }
  
};
const maptstateToprop = (state) => {
    return {
        blank_placeholder:state.blank_placeholder,
        isLoadingUpdate: state.isLoadingUpdate,
        start_date_temp: state.start_date_temp,
        end_date_temp: state.end_date_temp,
    }
}
const mapdispatchToprop = (dispatch) => {
    return {
        set_blank_placeholder: (val) => dispatch({ type: "blank_placeholder", value: val }),
        set_start_date_temp: (val) => dispatch({ type: "start_date_temp", value: val }),
        set_end_date_temp: (val) => dispatch({ type: "end_date_temp", value: val }),
    }
}
export default connect(maptstateToprop, mapdispatchToprop)(TimeSelection);