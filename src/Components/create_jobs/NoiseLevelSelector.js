/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
import React, { Component } from 'react';
import { connect } from "react-redux";
import * as $ from "jquery";
import * as d3 from "d3";
import _ from 'lodash';
import Grid from '@mui/material/Grid';
import { fontSize, fontWeight } from '@mui/system';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';



class NoiseLevelSelector extends Component {
    constructor(props) {
        super(props)
        console.log();
        this.handleChangeNoiseLevel = this.handleChangeNoiseLevel.bind(this);
        this.handleChangeNumberOfObservations = this.handleChangeNumberOfObservations.bind(this);
    }
    componentDidMount() {
        //this.setState({ temp: 0 });
    }
    componentDidUpdate(prevProps, prevState) {
    }
    handleChangeNoiseLevel(event){
        this.props.set_noise_level_sa(event.target.value)
        console.log(event.target.value)
    }
    handleChangeNumberOfObservations(event){
        this.props.set_number_of_observations_sa(event.target.value)
        console.log(event.target.value)
    }
    render() {
        // css design is in App.css
        var noise_level_array = [...Array(31).keys()];
        noise_level_array.shift();
        var number_of_observations_array = [...Array(51).keys()];
        number_of_observations_array.shift();
        return <div>
        <Grid container>
            <Grid item xs={2} style={{fontWeight:800, fontSize:"1.5em"}}>Noise Level:</Grid>
            <Grid item xs={10} style={{fontSize:"1.5em"}}>
                <Grid container spacing={0}>
                    <Grid item xs={3}>
                        <FormControl sx={{width:120}}>
                            <InputLabel id="select_label_noise_level">Noise Levels</InputLabel>
                            <Select
                                labelId="select_label_noise_level"
                                id="select_noise_level"
                                value={this.props.noise_level_sa}
                                label="Noise Level"
                                onChange={this.handleChangeNoiseLevel}
                            >
                                <MenuItem value={"None"} disabled>None</MenuItem>
                                {noise_level_array.map((d)=>{
                                    return <MenuItem value={d} key={d}>Upto {d} %</MenuItem>
                                })}
                                
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={9}>
                        <Grid container>
                            <Grid item xs={6} style={{fontWeight:800, fontSize:"1em"}}>Number of Observations:</Grid>
                            <Grid item xs={6} style={{fontSize:"1.5em"}}>
                                <FormControl sx={{width:120}}>
                                    <InputLabel id="select_label_observations">Observations</InputLabel>
                                    <Select
                                        labelId="select_label_observations"
                                        id="select_observations"
                                        value={this.props.number_of_observations_sa}
                                        label="Observations"
                                        onChange={this.handleChangeNumberOfObservations}
                                    >
                                        <MenuItem value={"None"} disabled>None</MenuItem>
                                        {number_of_observations_array.map((d)=>{
                                            return <MenuItem value={d} key={d}>{d}</MenuItem>
                                        })}
                                        
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        
                    </Grid>
                    
                </Grid>
            
            </Grid>
        </Grid>
      </div>
       
    }
  
};
const maptstateToprop = (state) => {
    return {
        blank_placeholder:state.blank_placeholder,
        noise_level_sa: state.noise_level_sa,
        number_of_observations_sa: state.number_of_observations_sa,
    }
}
const mapdispatchToprop = (dispatch) => {
    return {
        set_blank_placeholder: (val) => dispatch({ type: "blank_placeholder", value: val }),
        set_noise_level_sa: (val) => dispatch({ type: "noise_level_sa", value: val }),
        set_number_of_observations_sa: (val) => dispatch({ type: "number_of_observations_sa", value: val }),
    }
}
export default connect(maptstateToprop, mapdispatchToprop)(NoiseLevelSelector);