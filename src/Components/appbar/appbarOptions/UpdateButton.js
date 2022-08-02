/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
import React, { Component } from 'react';
import { connect } from "react-redux";
import * as $ from "jquery";
import * as d3 from "d3";
import _ from 'lodash';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';



class UpdateButton extends Component {
    constructor(props) {
        super(props)
        this.state = { temp: 1 }
    }
    componentDidMount() {
        //this.setState({ temp: 0 });
    }
    componentDidUpdate(prevProps, prevState) {
    }
    
    handleButtonClick=()=>{
        this.props.set_isLoadingUpdate(true); 
        if(this.props.start_date_temp< this.props.end_date_temp){
            this.props.set_start_date(this.props.start_date_temp);
            this.props.set_end_date(this.props.end_date_temp);
        }
        else{
           alert("Please select an end date later than the start date") 
        }
        this.props.set_isLoadingUpdate(false);
        
    } 
    render() {
        // css design is in App.css

        return (
           <div>
            &nbsp;&nbsp;
                <Button 
                variant="secondary"
                style={{backgroundColor: (this.props.color_buttons)["general"], color:"black", marginTop:"10%"}}
                disabled={this.props.isLoadingUpdate}
                onClick={!this.props.isLoadingUpdate ?this.handleButtonClick : null}
                >{this.props.isLoadingUpdate ? 'Loading…' : 'Update'}</Button>
          
          </div>
          );
       
    }
  
};
const maptstateToprop = (state) => {
    return {
        blank_placeholder:state.blank_placeholder,
        color_buttons: state.color_buttons,
        isLoadingUpdate: state.isLoadingUpdate,
        start_date: state.start_date,
        end_date: state.end_date,
        start_date_temp: state.start_date_temp,
        end_date_temp: state.end_date_temp,
    }
}
const mapdispatchToprop = (dispatch) => {
    return {
        set_blank_placeholder: (val) => dispatch({ type: "blank_placeholder", value: val }),
        set_isLoadingUpdate: (val) => dispatch({ type: "isLoadingUpdate", value: val }),
        set_start_date: (val) => dispatch({ type: "start_date", value: val }),
        set_end_date: (val) => dispatch({ type: "end_date", value: val }),
    }
}
export default connect(maptstateToprop, mapdispatchToprop)(UpdateButton);