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
        var selected_variables 
        //this.props.set_selected_model(event.target.name)
        if(this.props.selected_variables_temp.includes(event.target.name)){
            var temp=this.props.selected_variables_temp.filter(item=>item !== event.target.name)
            this.props.set_selected_variables_temp(temp)
        }  
        else{
            this.props.set_selected_variables_temp([...this.props.selected_variables_temp,event.target.name])
        }
    }
    render() {
        // css design is in App.css
        var models = ["15 min ahead", "24 hr ahead"];
        var variables = (this.props.url_version === "1.3")?{"15 min ahead":["temperature", "humidity", "apparent_power"],
                         "24 hr ahead": ["temperature", "humidity", "apparent_power"]}
                         :
                         {"15 min ahead":["SZA", "AZM", "ETR", "GHI", "Wind_Speed", "Temperature"],
                         "24 hr ahead": ["SZA", "AZM", "ETR", "GHI", "Wind_Speed", "Temperature"]};
        var size = (variables[this.props.selected_model]).length;
        var size_key = (size<=3)?12:4;

        return <Grid container spacing={0}>
        <Grid item xs={12}><b>Variables to display</b></Grid>    
        {variables[this.props.selected_model].map(variable=>{
                return <Grid item xs={size_key} key={variable}><FormControlLabel 
                        label={variable}
                        key={variable}
                        control={<Checkbox onChange={this.handleChange} name={variable}  key={variable} checked={(this.props.selected_variables_temp).includes(variable)} />}
                
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
export default connect(maptstateToprop, mapdispatchToprop)(VariablesSelectionOptions);