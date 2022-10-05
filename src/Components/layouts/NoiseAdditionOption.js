/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
import React, { Component } from 'react';
import { connect } from "react-redux";
import * as $ from "jquery";
import * as d3 from "d3";
import _ from 'lodash';
import Form from 'react-bootstrap/Form';
import { styled } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import NativeSelect from '@mui/material/NativeSelect';
import InputBase from '@mui/material/InputBase';

const BootstrapInput = styled(InputBase)(({ theme }) => ({
    '& .MuiInputBase-input': {
      borderRadius: 3,
      position: 'relative',
      backgroundColor: theme.palette.background.paper,
      border: '1px solid #ced4da',
      fontSize: 11,
    //   padding: '10px 26px 10px 12px',
    marginTop:'2px',
      padding: '4px 0px 2px 8px',
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      // Use the system font instead of the default Roboto font.
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      '&:focus': {
        borderRadius: 4,
        borderColor: '#80bdff',
        boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
      },
    },
  }));


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

        return <FormControl sx={{ m: -0.5, minWidth: 70 }} size="small" variant="standard">
        {/* <InputLabel id="demo-select-small">Add Noise</InputLabel> */}
        <Select
           labelId="demo-select-small"
           id="demo-select-small"
          disabled={this.props.isLoadingUpdate}
          value={this.props.noise_temperature_temp}
          
          onChange={this.handleChange}
          input={<BootstrapInput />}
        >
        <MenuItem disabled value={-1}>
            Add Noise
          </MenuItem>
          <MenuItem value={0}>
            <em>None</em>
          </MenuItem>
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