/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
import React, { Component } from 'react';
import { connect } from "react-redux";
import * as $ from "jquery";
import * as d3 from "d3";
import _ from 'lodash';
import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import Grid from '@mui/material/Grid';



class ModelsSelectionOptions extends Component {
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
        var default_variables = {"net load 15 min ahead":["temperature", "humidity", "apparent power"],
                         "net load 24 hr ahead": ["temperature", "humidity", "apparent power"],
                         "net load v2": ["wind speed", "temperature"]}
        this.props.set_selected_model(event.target.name)
        this.props.set_selected_variables_temp(default_variables[event.target.name])
    }
    render() {
        // css design is in App.css
        var models = ["net load 15 min ahead", "net load 24 hr ahead", "net load v2"];


        return <Grid container spacing={0}>
        <Grid item xs={12}><b>Models</b></Grid>    
        {models.map(model=>{
                return <Grid item xs={12} key={model}><FormControlLabel 
                        label={model}
                        key={model}
                        control={<Radio onChange={this.handleChange} name={model} checked={this.props.selected_model === model} key={model} />}
                
                        /></Grid>
            })} 
      </Grid>
       
    }
  
};
const maptstateToprop = (state) => {
    return {
        blank_placeholder:state.blank_placeholder,
        selected_model: state.selected_model,
        selected_variables_temp: state.selected_variables_temp,
    }
}
const mapdispatchToprop = (dispatch) => {
    return {
        set_blank_placeholder: (val) => dispatch({ type: "blank_placeholder", value: val }),
        set_selected_model: (val) => dispatch({ type: "selected_model", value: val }),
        set_selected_variables_temp:(val)=>dispatch({type:"selected_variables_temp",value:val}), 
    }
}
export default connect(maptstateToprop, mapdispatchToprop)(ModelsSelectionOptions);