/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
import React, { Component } from 'react';
import { connect } from "react-redux";
import * as $ from "jquery";
import * as d3 from "d3";
import _ from 'lodash';
import Grid from '@mui/material/Grid';
import { fontSize, fontWeight } from '@mui/system';
import Button from '@mui/material/Button';



class CreateJobButton extends Component {
    constructor(props) {
        super(props)
        console.log();
        this.handleChangeName = this.handleChangeName.bind(this);
    }
    componentDidMount() {
        //this.setState({ temp: 0 });
    }
    componentDidUpdate(prevProps, prevState) {
    }
    handleChangeName(event){
        this.props.set_name_sa(event.target.value)
        console.log(event.target.value)
    }
   
    render() {
        // css design is in App.css
        return <div>
        <Grid container>
            <Grid item xs={2} style={{fontWeight:620, fontSize:"1.5em"}}> </Grid>
            <Grid item xs={10} style={{fontSize:"1.5em"}}>
                <Grid container spacing={0}>
                <Button variant="contained" size="large">Create Job</Button>
                    
                </Grid>
            
            </Grid>
        </Grid>
      </div>
       
    }
  
};
const maptstateToprop = (state) => {
    return {
        blank_placeholder:state.blank_placeholder,
        name_sa: state.name_sa,
    }
}
const mapdispatchToprop = (dispatch) => {
    return {
        set_blank_placeholder: (val) => dispatch({ type: "blank_placeholder", value: val }),
        set_name_sa: (val) => dispatch({ type: "name_sa", value: val }),
    }
}
export default connect(maptstateToprop, mapdispatchToprop)(CreateJobButton);