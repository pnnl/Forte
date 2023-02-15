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



class MonthSelector extends Component {
    constructor(props) {
        super(props)
        console.log();
        this.handleChangeMonth = this.handleChangeMonth.bind(this);
    }
    componentDidMount() {
        //this.setState({ temp: 0 });
    }
    componentDidUpdate(prevProps, prevState) {
    }
    handleChangeMonth(event){
        this.props.set_months_sa(event.target.value)
        console.log(event.target.value)
    }
   
    render() {
        // css design is in App.css
        var months_array = [ "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December" ];
        return <div>
        <Grid container>
            <Grid item xs={2} style={{fontWeight:800, fontSize:"1.5em"}}>Months:</Grid>
            <Grid item xs={10} style={{fontSize:"1.5em"}}>
                <Grid container spacing={0}>
                    <FormControl sx={{width:300}}>
                            <InputLabel id="select_label_months">Months</InputLabel>
                            <Select
                                labelId="select_label_months"
                                id="select_months"
                                multiple
                                value={this.props.months_sa}
                                label="Months"
                                onChange={this.handleChangeMonth}
                            >
                                <MenuItem value={[]} disabled>None</MenuItem>
                                {months_array.map((d)=>{
                                    return <MenuItem value={d} key={d}>{d}</MenuItem>
                                })}
                                
                            </Select>
                    </FormControl>
                    
                </Grid>
            
            </Grid>
        </Grid>
      </div>
       
    }
  
};
const maptstateToprop = (state) => {
    return {
        blank_placeholder:state.blank_placeholder,
        months_sa: state.months_sa,
    }
}
const mapdispatchToprop = (dispatch) => {
    return {
        set_blank_placeholder: (val) => dispatch({ type: "blank_placeholder", value: val }),
        set_months_sa: (val) => dispatch({ type: "months_sa", value: val }),
    }
}
export default connect(maptstateToprop, mapdispatchToprop)(MonthSelector);