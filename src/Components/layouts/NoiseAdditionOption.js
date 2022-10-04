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



class NoiseAdditionOption extends Component {
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {
        //this.setState({ temp: 0 });
    }
    componentDidUpdate(prevProps, prevState) {
    }

    handleChange(event){
        this.props.set_noise_temperature_temp(event.target.value);
    }
    render() {
        // css design is in App.css
        // Tutorial: https://mui.com/material-ui/react-select/

        return <FormControl sx={{ m: 0, minWidth: 70 }} size="small">
        <InputLabel id="demo-select-small">Add Noise</InputLabel>
        <Select
          labelId="demo-select-small"
          id="demo-select-small"
          disabled={this.props.isLoadingUpdate}
          value={this.props.noise_temperature_temp}
          label="Add Noise"
          onChange={this.handleChange}
        >
          {/* <MenuItem value="">
            <em>None</em>
          </MenuItem> */}
          <MenuItem value={5}>5%</MenuItem>
        </Select>
      </FormControl>
       
    }
  
};
const maptstateToprop = (state) => {
    return {
        blank_placeholder:state.blank_placeholder,
        isLoadingUpdate: state.isLoadingUpdate,
        noise_temperature_temp: state.noise_temperature_temp,
    }
}
const mapdispatchToprop = (dispatch) => {
    return {
        set_blank_placeholder: (val) => dispatch({ type: "blank_placeholder", value: val }),
        set_noise_temperature_temp: (val) => dispatch({ type: "noise_temperature_temp", value: val }),
    }
}
export default connect(maptstateToprop, mapdispatchToprop)(NoiseAdditionOption);