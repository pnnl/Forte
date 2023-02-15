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



class NoiseDirection extends Component {
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
            <Grid item xs={2} style={{fontWeight:800, fontSize:"1.5em"}}>Noise Direction:</Grid>
            <Grid item xs={10} style={{fontSize:"1.5em"}}>
            <FormControl>
                {/* <FormLabel id="demo-row-radio-buttons-group-label">Gender</FormLabel> */}
                <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row_radio_buttons_group_noise_direction"
                    onChange={this.handleChange}
                >
                    <FormControlLabel value="bidirectional" control={<Radio />} label={<div style={{fontSize:"1.3em"}}>Bidirectional</div>} />
                    <FormControlLabel value="positive_direction" control={<Radio />} label={<div style={{fontSize:"1.3em"}}>Positive Direction</div>} />
                    <FormControlLabel value="negative_direction" control={<Radio />} label={<div style={{fontSize:"1.3em"}}>Negative Direction</div>} />
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
export default connect(maptstateToprop, mapdispatchToprop)(NoiseDirection);