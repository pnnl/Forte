/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
import React, { Component } from 'react';
import { connect } from "react-redux";
import * as $ from "jquery";
import * as d3 from "d3";
import _ from 'lodash';
import Form from 'react-bootstrap/Form';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';



class SolarPenetrationOption extends Component {
    constructor(props) {
        super(props)
        console.log();
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {
        //this.setState({ temp: 0 });
    }
    componentDidUpdate(prevProps, prevState) {
    }

    handleChange(event){
        this.props.set_solar_penetration_temp(event.target.value);
    }
    render() {
        // css design is in App.css
        // Tutorial: https://mui.com/material-ui/react-select/

        return <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
        <InputLabel id="demo-select-small">Solar Penetration</InputLabel>
        <Select
          labelId="demo-select-small"
          id="demo-select-small"
          value={this.props.solar_penetration_temp}
          label="Solar Penetration Level"
          onChange={this.handleChange}
        >
          {/* <MenuItem value="">
            <em>None</em>
          </MenuItem> */}
          <MenuItem value={0}>0%</MenuItem>
          <MenuItem value={10}>10%</MenuItem>
          <MenuItem value={20}>20%</MenuItem>
          <MenuItem value={50}>50%</MenuItem>
        </Select>
      </FormControl>
       
    }
  
};
const maptstateToprop = (state) => {
    return {
        blank_placeholder:state.blank_placeholder,
        solar_penetration_temp: state.solar_penetration_temp,
    }
}
const mapdispatchToprop = (dispatch) => {
    return {
        set_blank_placeholder: (val) => dispatch({ type: "blank_placeholder", value: val }),
        set_solar_penetration_temp: (val) => dispatch({ type: "solar_penetration_temp", value: val }),
    }
}
export default connect(maptstateToprop, mapdispatchToprop)(SolarPenetrationOption);