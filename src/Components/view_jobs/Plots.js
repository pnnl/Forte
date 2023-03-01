/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
import React, { Component } from 'react';
import { connect } from "react-redux";
import * as $ from "jquery";
import * as d3 from "d3";
import _ from 'lodash';
//import fs from "fs";
//import * as fs from 'node:fs';
//import * as fs from 'node:fs/promises';
import { promises as fs } from "fs";
import mycsv1 from '../../outputs/sensitivity_analysis/temperature/uniform_noise/february/mae_positive.csv'
import mycsv2 from '../../outputs/sensitivity_analysis/temperature/uniform_noise/february/mae_positive_all.csv'






class Plots extends Component {
    constructor(props) {
        super(props)
        console.log();
    }
    componentDidMount() {
        //this.setState({ temp: 0 });
    }
    componentDidUpdate(prevProps, prevState) {
        this.plot_output(this.props.selected_job_name_sa, this.props.url)
    }

    plot_output(selected_job_name_sa, url){
        // set the dimensions and margins of the graph
        var margin = {top: 10, right: 30, bottom: 30, left: 60},
        width = 760 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        const svg = d3.select("#my_dataviz_svg")
        //.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
        

        

        //Read the data
d3.csv(url+"/reports/mae_positive.csv").then(

// Now I can use this dataset:
function(data) {
  //console.log(data1);

  // Add X axis --> it is a date format
  const x = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return +d.Noise_Percentage; })])
    .range([ 0, width ]);
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));

  // Add Y axis
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return +d.Mean_MAE; })])
    .range([ height, 0 ]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Add the line
  svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
      .x(function(d) { return x(d.Noise_Percentage) })
      .y(function(d) { return y(d.Mean_MAE) })
      )

    d3.csv(mycsv2).then(
        function(data2){
            svg.append('g')
                .selectAll("dot")
                .data(data2)
                .enter()
                .append("circle")
                .attr("cx", function (d) { return x(d.Noise_Percentage); } )
                .attr("cy", function (d) { return y(d.MAE); } )
                .attr("r", 2.5)
                .style("opacity", 0.6)
                .style("fill", "#69b3a2")
        }

    )  
})

    }
    render() {
        // css design is in App.css

        return <div>
        <div id="my_dataviz">
            <svg id="my_dataviz_svg"></svg>
        </div>
      </div>
       
    }
  
};
const maptstateToprop = (state) => {
    return {
        blank_placeholder:state.blank_placeholder,
        selected_job_name_sa: state.selected_job_name_sa,
        url: state.url,
    }
}
const mapdispatchToprop = (dispatch) => {
    return {
        set_blank_placeholder: (val) => dispatch({ type: "blank_placeholder", value: val }),
    }
}
export default connect(maptstateToprop, mapdispatchToprop)(Plots);