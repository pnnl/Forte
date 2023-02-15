/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
import React, { Component } from 'react';
import { connect } from "react-redux";
import * as $ from "jquery";
import * as d3 from "d3";
import _ from 'lodash';
import Grid from '@mui/material/Grid';
import { fontSize, fontWeight } from '@mui/system';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
// import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';



class CreateJobButton extends Component {
    constructor(props) {
        super(props)
        console.log();
        this.calculateJobTime = this.calculateJobTime.bind(this);
    }
    componentDidMount() {
        //this.setState({ temp: 0 });
    }
    componentDidUpdate(prevProps, prevState) {
    }

    secondsToHms(d) {
        d = Number(d);
        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);
        var s = Math.floor(d % 3600 % 60);
    
        var hDisplay = h > 0 ? h + (h === 1 ? " hour, " : " hours, ") : "";
        var mDisplay = m > 0 ? m + (m === 1 ? " minute, " : " minutes, ") : "";
        var sDisplay = s > 0 ? s + (s === 1 ? " second" : " seconds") : "";
        return hDisplay + mDisplay + sDisplay; 
    }
    calculateJobTime(){
        var number_of_dates = this.props.end_date_sa - this.props.start_date_sa +1
        var job_time = 90*this.props.number_of_observations_sa*this.props.noise_level_sa*number_of_dates*(this.props.months_sa).length;
        //var job_time = 90;
        var formatted_time = this.secondsToHms(job_time)
        return formatted_time;
    }
   
    render() {
        // css design is in App.css
        return <div>
        <Grid container>
            <Grid item xs={2} style={{fontWeight:620, fontSize:"1.5em"}}> </Grid>
            <Grid item xs={10} style={{fontSize:"1.5em"}}>
                <Grid container spacing={2}>
                    <Grid item>
                        <Button variant="contained" size="large">Create Job</Button>
                    </Grid>
                    <Grid item>
                        <Chip 
                        // icon={<AccessAlarmIcon />}
                        label={"Estimated Time: "+this.calculateJobTime()} />
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
        number_of_observations_sa: state.number_of_observations_sa,
        noise_level_sa: state.noise_level_sa,
        start_date_sa: state.start_date_sa,
        end_date_sa: state.end_date_sa,
        months_sa: state.months_sa,

    }
}
const mapdispatchToprop = (dispatch) => {
    return {
        set_blank_placeholder: (val) => dispatch({ type: "blank_placeholder", value: val }),
        set_name_sa: (val) => dispatch({ type: "name_sa", value: val }),
    }
}
export default connect(maptstateToprop, mapdispatchToprop)(CreateJobButton);