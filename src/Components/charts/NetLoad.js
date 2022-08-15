/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
import React, { Component } from 'react';
import { connect } from "react-redux";
import * as $ from "jquery";
import * as d3 from "d3";
import _ from 'lodash';



class NetLoad extends Component {
    constructor(props) {
        super(props)
        console.log();
    }
    componentDidMount() {
        //this.setState({ temp: 0 });
        this.create_line_chart();
    }
    componentDidUpdate(prevProps, prevState) {
    }

    create_line_chart(){
        var the_id = "#netLoadChartDiv";    
        const margin = {top: 10, right: 30, bottom: 30, left: 60},
        width = $(the_id).width() - margin.left - margin.right,
        height = $(the_id).height() - margin.top - margin.bottom;

        /** svg1 just sets the width and height of the svg */
        const svg1 = d3.select(".netLoadChart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        /** This adds a g to control the margin of the svg */
        var svg = d3.select(".netLoadChart").selectAll(".initial_g").data([0]).join("g")
        .attr("class", "initial_g")    
        .attr("transform",`translate(${margin.left},${margin.top})`);

//Read the data
d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/5_OneCatSevNumOrdered.csv").then( function(data) {

// group the data: I want to draw one line per group
const sumstat = d3.group(data, d => d.name); // nest function allows to group the calculation per level of a factor

        /** Adding and calling X axis --> it is a date format */
        const x = d3.scaleLinear()
        .domain(d3.extent(data, function(d) { return d.year; }))
        .range([ 0, width ]);
        svg.selectAll(".g_X").data([0]).join("g")
        .attr("class", "g_X")  
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).ticks(5));

        /** Adding and calling Y axis */ 
        const y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return +d.n; })])
        .range([ height, 0 ]);
        svg.selectAll(".g_Y").data([0]).join("g")
        .attr("class", "g_Y")
        .call(d3.axisLeft(y));

        /** Color palette */ 
        const color = d3.scaleOrdinal()
        .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])

        /** Drawing the lines */ 
        svg.selectAll(".line")
        .data(sumstat)
        .join("path")
            .attr("fill", "none")
            .attr("stroke", function(d){ return color(d[0]) })
            .attr("stroke-width", 1.5)
            .attr("d", function(d){
            return d3.line()
                .x(function(d) { return x(d.year); })
                .y(function(d) { return y(+d.n); })
                (d[1])
            })

})

    }
    render() {
        // css design is in App.css

        return <div>
        <div id="netLoadChartDiv" style={{height:"85vh"}}>
        <svg className={"netLoadChart"}></svg>
        </div>
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
export default connect(maptstateToprop, mapdispatchToprop)(NetLoad);