/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
import React, { Component } from 'react';
import { connect } from "react-redux";
import * as $ from "jquery";
import * as d3 from "d3";
import _ from 'lodash';
import Grid from '@mui/material/Grid';
import { fontSize, fontWeight } from '@mui/system';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';



class InputVariables extends Component {
    constructor(props) {
        super(props)
        console.log();
    }
    componentDidMount() {
        //this.setState({ temp: 0 });
    }
    componentDidUpdate(prevProps, prevState) {
    }
    handleChange(event){
        console.log(event.target.value)
    }
    render() {
        // css design is in App.css

        return <div>
        <Grid container>
            <Grid item xs={2} style={{fontWeight:800, fontSize:"1.5em"}}>Input Variables:</Grid>
            <Grid item xs={10} style={{fontSize:"1.5em"}}>
            <FormControl>
                {/* <FormLabel id="demo-row-radio-buttons-group-label">Gender</FormLabel> */}
                <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row_radio_buttons_group_input_variables"
                    onChange={this.handleChange}
                >
                    <FormControlLabel value="temperature" control={<Radio />} label={<div style={{fontSize:"1.3em"}}>Temperature</div>} />
                    <FormControlLabel value="humidity" control={<Radio />} label={<div style={{fontSize:"1.3em"}}>Humidity</div>} />
                    <FormControlLabel value="apparent_power" control={<Radio />} label={<div style={{fontSize:"1.3em"}}>Apparent Power</div>} />
                </RadioGroup>
        </FormControl>
                {/* <Grid container spacing={6}>
                    <Grid item><FormControlLabel name="1" value="female" control={<Radio />} label="Temperature" /></Grid>
                    <Grid item><FormControlLabel name="1" value="female" control={<Radio />} label="Humidity" /></Grid>
                    <Grid item><FormControlLabel name="1" value="female" control={<Radio />} label="Apparent Power" /></Grid>
                </Grid> */}
            </Grid>
        </Grid>
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
export default connect(maptstateToprop, mapdispatchToprop)(InputVariables);