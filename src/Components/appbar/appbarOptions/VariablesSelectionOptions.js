/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
import React, { Component } from 'react';
import { connect } from "react-redux";
import * as $ from "jquery";
import * as d3 from "d3";
import _ from 'lodash';
import { Checkbox, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import Grid from '@mui/material/Grid';



class VariablesSelectionOptions extends Component {
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
        //this.props.set_selected_model(event.target.name)
    }
    render() {
        // css design is in App.css
        var models = ["net load 15 min ahead", "net load 24 hr ahead", "real power"];
        var variables = {"net load 15 min ahead":["temperature", "humidity", "apparent power"],
                         "net load 24 hr ahead": ["temperature", "humidity", "apparent power"],
                         "real power": ["SZA", "AZM", "ETR", "GHI", "wind speed", "temperature"]}
        var size = (variables[this.props.selected_model]).length;
        var size_key = (size<=3)?12:4;

        return <Grid container spacing={0}>
        <Grid item xs={12}><b>Variables</b></Grid>    
        {variables[this.props.selected_model].map(variable=>{
                var size
                return <Grid item xs={size_key} key={variable}><FormControlLabel 
                        label={variable}
                        key={variable}
                        control={<Checkbox onChange={this.handleChange} name={variable}  key={variable} />}
                
                        /></Grid>
            })} 
      </Grid>
       
    }
  
};
const maptstateToprop = (state) => {
    return {
        blank_placeholder:state.blank_placeholder,
        selected_model: state.selected_model,
    }
}
const mapdispatchToprop = (dispatch) => {
    return {
        set_blank_placeholder: (val) => dispatch({ type: "blank_placeholder", value: val }),
        set_selected_model: (val) => dispatch({ type: "selected_model", value: val }),
    }
}
export default connect(maptstateToprop, mapdispatchToprop)(VariablesSelectionOptions);