/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
import React, { Component } from 'react';
import { connect } from "react-redux";
import * as $ from "jquery";
import * as d3 from "d3";
import _ from 'lodash';



class InitialComponent extends Component {
    constructor(props) {
        super(props)
        comsole.log();
    }
    componentDidMount() {
        //this.setState({ temp: 0 });
    }
    componentDidUpdate(prevProps, prevState) {
    }
    render() {
        // css design is in App.css

        return <div>
        "Hello"
      </div>
       
    }
  
};
const maptstateToprop = (state) => {
    return {
        blank_placeholder:state.blank_placeholder,
    }
}
const mapdispatchToprop = (dispatch) => {
    return {
        set_blank_placeholder: (val) => dispatch({ type: "blank_placeholder", value: val }),
    }
}
export default connect(maptstateToprop, mapdispatchToprop)(InitialComponent);