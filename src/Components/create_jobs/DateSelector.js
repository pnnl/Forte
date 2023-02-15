/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
import React, { Component } from 'react';
import { connect } from "react-redux";
import * as $ from "jquery";
import * as d3 from "d3";
import _ from 'lodash';
import Grid from '@mui/material/Grid';
import { fontSize, fontWeight } from '@mui/system';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';



class DateSelector extends Component {
    constructor(props) {
        super(props)
        console.log();
        this.handleChangeStartDate = this.handleChangeStartDate.bind(this);
        this.handleChangeEndDate = this.handleChangeEndDate.bind(this);
    }
    componentDidMount() {
        //this.setState({ temp: 0 });
    }
    componentDidUpdate(prevProps, prevState) {
    }
    handleChangeStartDate(event){
        this.props.set_start_date_sa(event.target.value)
        console.log(event.target.value)
    }
    handleChangeEndDate(event){
        this.props.set_end_date_sa(event.target.value)
        console.log(event.target.value)
    }
    render() {
        // css design is in App.css
        var dates_array = [...Array(29).keys()];
        dates_array.shift();
        return <div>
        <Grid container>
            <Grid item xs={2} style={{fontWeight:800, fontSize:"1.5em"}}>Dates:</Grid>
            <Grid item xs={10} style={{fontSize:"1.5em"}}>
                <Grid container spacing={0}>
                    <Grid item xs={3}>
                        <FormControl sx={{width:120}}>
                        <InputLabel id="select_label_start_date">Start Date</InputLabel>
                        <Select
                            labelId="select_label_start_date"
                            id="select_start_date"
                            value={this.props.start_date_sa}
                            label="Start date"
                            onChange={this.handleChangeStartDate}
                        >
                            <MenuItem value={"Start Date"} disabled>Start Date</MenuItem>
                            {dates_array.map((d)=>{
                                return <MenuItem value={d} key={d}>{d}</MenuItem>
                            })}
                            
                        </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={3}>
                    <FormControl sx={{width:120}}>
                        <InputLabel id="select_label_start_date">End Date</InputLabel>
                        <Select
                            labelId="select_label_end_date"
                            id="select_end_date"
                            value={this.props.end_date_sa}
                            label="End date"
                            onChange={this.handleChangeEndDate}
                        >
                            <MenuItem value={"End Date"} disabled>End Date</MenuItem>
                            {dates_array.map((d)=>{
                                return (d>this.props.start_date_sa)?<MenuItem value={d} key={d}>{d}</MenuItem>:null
                            })}
                            
                        </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            
            </Grid>
        </Grid>
      </div>
       
    }
  
};
const maptstateToprop = (state) => {
    return {
        blank_placeholder:state.blank_placeholder,
        start_date_sa: state.start_date_sa,
        end_date_sa: state.end_date_sa,
    }
}
const mapdispatchToprop = (dispatch) => {
    return {
        set_blank_placeholder: (val) => dispatch({ type: "blank_placeholder", value: val }),
        set_start_date_sa: (val) => dispatch({ type: "start_date_sa", value: val }),
        set_end_date_sa: (val) => dispatch({ type: "end_date_sa", value: val }),
    }
}
export default connect(maptstateToprop, mapdispatchToprop)(DateSelector);