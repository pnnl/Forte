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
        var start_date = new Date('2020-01-02T00:00:00.000Z')
        var end_date = new Date('2020-01-03T00:00:00.000Z')

        return <div>
        {/* <LocalizationProvider dateAdapter={AdapterDateFns}> */}
        <LocalizationProvider dateAdapter={AdapterDateFns}>   
            <DateTimePicker
                label="Start date"
                renderInput={(params) => <TextField {...params} />}
                value={start_date}
            />&nbsp;
             <DateTimePicker
                label="End date"
                renderInput={(params) => <TextField {...params} />}
                value={end_date}
            />
        </LocalizationProvider>
      </div>
       
    }
  
};
const maptstateToprop = (state) => {
    return {
        blank_placeholder:state.blank_placeholder,
    }
}
const mapdispatchToprop = (dispatch) => {
    return {
        set_blank_placeholder: (val) => dispatch({ type: "blank_placeholder", value: val }),
    }
}
export default connect(maptstateToprop, mapdispatchToprop)(TimeSelection);