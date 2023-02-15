/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
import React, { Component } from 'react';
import { connect } from "react-redux";
import * as $ from "jquery";
import * as d3 from "d3";
import _ from 'lodash';
import Grid from '@mui/material/Grid';
import { fontSize, fontWeight } from '@mui/system';
import TextField from '@mui/material/TextField';



class DescriptionSelector extends Component {
    constructor(props) {
        super(props)
        console.log();
        this.handleChangeDescription = this.handleChangeDescription.bind(this);
    }
    componentDidMount() {
        //this.setState({ temp: 0 });
    }
    componentDidUpdate(prevProps, prevState) {
    }
    handleChangeDescription(event){
        this.props.set_description_sa(event.target.value)
        console.log(event.target.value)
    }
   
    render() {
        // css design is in App.css
        return <div>
        <Grid container>
            <Grid item xs={2} style={{fontWeight:620, fontSize:"1.5em"}}>Description:</Grid>
            <Grid item xs={10} style={{fontSize:"1.5em"}}>
                <Grid container spacing={0}>
                <TextField
                        id="outlined-description"
                        label="Description"
                        sx={{ m: 1, width: '25ch' }}
                        multiline
                        rows={4}
                        // value={name}
                        onChange={this.handleChangeDescription}
                    />
                    
                </Grid>
            
            </Grid>
        </Grid>
      </div>
       
    }
  
};
const maptstateToprop = (state) => {
    return {
        blank_placeholder:state.blank_placeholder,
        description_sa: state.description_sa,
    }
}
const mapdispatchToprop = (dispatch) => {
    return {
        set_blank_placeholder: (val) => dispatch({ type: "blank_placeholder", value: val }),
        set_description_sa: (val) => dispatch({ type: "description_sa", value: val }),
    }
}
export default connect(maptstateToprop, mapdispatchToprop)(DescriptionSelector);