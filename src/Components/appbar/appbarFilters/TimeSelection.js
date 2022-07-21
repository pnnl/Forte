/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
import React, { Component } from 'react';
import { connect } from "react-redux";
import * as $ from "jquery";
import * as d3 from "d3";
import _ from 'lodash';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';




class TimeSelection extends Component {
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

        return <div>
        {/* <LocalizationProvider dateAdapter={AdapterDateFns}> */}
        <LocalizationProvider dateAdapter={AdapterDateFns}>   
            <DateTimePicker
                label="Start date"
                renderInput={(params) => <TextField {...params} />}
                value={new Date(this.props.start_date)}
                onChange={(newValue) => {
                    this.props.set_start_date(newValue.valueOf());
                  }}
            />&nbsp;
             <DateTimePicker
                label="End date"
                renderInput={(params) => <TextField {...params} />}
                value={new Date(this.props.end_date)}
                onChange={(newValue) => {
                    this.props.set_end_date(newValue.valueOf());
                  }}
            />
        </LocalizationProvider>
      </div>
       
    }
  
};
const maptstateToprop = (state) => {
    return {
        blank_placeholder:state.blank_placeholder,
        start_date: state.start_date,
        end_date: state.end_date,
    }
}
const mapdispatchToprop = (dispatch) => {
    return {
        set_blank_placeholder: (val) => dispatch({ type: "blank_placeholder", value: val }),
        set_start_date: (val) => dispatch({ type: "start_date", value: val }),
        set_end_date: (val) => dispatch({ type: "end_date", value: val }),
    }
}
export default connect(maptstateToprop, mapdispatchToprop)(TimeSelection);