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



class SeasonSelector extends Component {
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
        this.props.set_enable_seasons_choice_temp(event.target.value);
    }
    render() {
        // css design is in App.css
        // Tutorial: https://mui.com/material-ui/react-select/

        return <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
        <InputLabel id="demo-select-small-season">Show Seasons</InputLabel>
        <Select
          labelId="demo-select-small-season"
          id="demo-select-small-season"
          disabled={this.props.isLoadingUpdate}
          value={this.props.enable_seasons_choice_temp}
          label="Show Seasons"
          onChange={this.handleChange}
        >
          {/* <MenuItem value="">
            <em>None</em>
          </MenuItem> */}
          <MenuItem value={1}>Yes</MenuItem>
          <MenuItem value={0}>No</MenuItem>
        </Select>
      </FormControl>
       
    }
  
};
const maptstateToprop = (state) => {
    return {
        blank_placeholder:state.blank_placeholder,
        isLoadingUpdate: state.isLoadingUpdate,
        enable_seasons_choice_temp: state.enable_seasons_choice_temp,
    }
}
const mapdispatchToprop = (dispatch) => {
    return {
        set_blank_placeholder: (val) => dispatch({ type: "blank_placeholder", value: val }),
        set_enable_seasons_choice_temp: (val) => dispatch({ type: "enable_seasons_choice_temp", value: val }),
    }
}
export default connect(maptstateToprop, mapdispatchToprop)(SeasonSelector);