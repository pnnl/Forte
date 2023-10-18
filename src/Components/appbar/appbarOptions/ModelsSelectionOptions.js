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
        var default_variables = {"15 min ahead":(this.props.url_version === "1.3")?["temperature", "humidity", "apparent_power"]:["Temperature", "Wind_Speed"],
                         "24 hr ahead": (this.props.url_version === "1.3")?["temperature", "humidity"]:["Temperature", "Wind_Speed"],
                        }
        var changed_variables = default_variables[event.target.name];                 
        this.props.set_selected_variables_temp([...changed_variables])
        this.props.set_selected_model(event.target.name)
        
    }
    render() {
        // css design is in App.css
        var models = ["15 min ahead", "24 hr ahead"];


        return <Grid container spacing={0}>
        <Grid item xs={12}><b>Prediction Horizons</b></Grid>    
        {models.map(model=>{
                return <Grid item xs={12} key={model}><FormControlLabel 
                        label={model}
                        key={model}
                        disabled={(model === "24 hr ahead")}
                        control={<Radio onChange={this.handleChange} name={model} checked={this.props.selected_model === model} key={model} />}
                
                        /></Grid>
            })} 
      </Grid>
       
    }
  
};
const maptstateToprop = (state) => {
    return {
        blank_placeholder:state.blank_placeholder,
        url_version: state.url_version,
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