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
        //this.create_line_chart(this.props.net_load_df);
    }
    componentDidUpdate(prevProps, prevState) {
        this.create_line_chart(this.props.net_load_df);
    }

    create_line_chart(net_load_df){
        var animation_duration = 1000;
        var the_id = "#netLoadChartDiv";   
        const margin = {top: 10, right: 30, bottom: 30, left: 60},
        width = $(the_id).width() - margin.left - margin.right,
        height = $(the_id).height() - margin.top - margin.bottom;
        console.log(width, height); 

        /** svg1 just sets the width and height of the svg */
        //$(".netLoadChart").empty();
        const svg1 = d3.select(".netLoadChart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        /** This adds a g to control the margin of the svg */
        var svg = d3.select(".netLoadChart").selectAll(".initial_g").data([0]).join("g")
        .attr("class", "initial_g")    
        .attr("transform",`translate(${margin.left},${margin.top})`);


        /** Grouping the data: in order to draw one line per group */
        const sumstat2 = d3.group(net_load_df, d => d.net_load_type) // group function allows to group the calculation per level of a factor

        /** Adding and calling X axis --> it is a date format */
        const x = d3.scaleLinear()
        .domain(d3.extent(net_load_df, function(d) { return d.years; }))
        .range([ 0, width ]);
        svg.selectAll(".g_X").data([0]).join("g")
        .attr("class", "g_X")  
        .attr("transform", `translate(0, ${height})`)
        .transition()
        .duration(animation_duration)
        .call(d3.axisBottom(x).ticks(5));

        /** Adding and calling Y axis */ 
        var limit = 1.1*(Math.max(Math.abs(d3.min(net_load_df, function(d) { return d.net_load; })), Math.abs(d3.max(net_load_df, function(d) { return d.net_load; }))))
        const y = d3.scaleLinear()
        .domain([-limit,limit])
        .range([ height, 0 ]);
        svg.selectAll(".g_Y").data([0]).join("g")
        .attr("class", "g_Y")
        .transition()
        .duration(animation_duration)
        .call(d3.axisLeft(y));

        /** Color palette */ 
        var keys = ["actual", "predicted"]
        const color = d3.scaleOrdinal()
        //.range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])
        .range(["#377eb8", "#F39C12", "#999999"])

        /** Adding one dot in the legend for each name */
        svg.selectAll(".legendDots")
        .data(keys)
        .join("rect")
        .attr("class", "legendDots")
        .transition()
        .duration(animation_duration)
        .attr("x", 0.85*width) // must of 0.04 lesser than Text
        .attr("y", function(d,i){ return 0 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("width", 0.022*width)
        .attr("height", 2)
        //.attr("r", 7)
        .style("fill", function(d){ return color(d)})

        /** Adding one dot in the legend for each name */ 
        svg.selectAll(".legendText")
        .data(keys)
        .join("text")
        .attr("class", "legendText")
        .transition()
        .duration(animation_duration)
        .attr("x", 0.89*width)
        .attr("y", function(d,i){ return 0 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function(d){ return color(d)})
        .text(function(d){ return d})
        .attr("font-size", "0.9em")
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")

        /** Drawing the lines */ 
        svg.selectAll(".lineCharts")
        .data(sumstat2)
        .join("path")
            .attr("class", "lineCharts")
            .attr("fill", "none")
            .attr("stroke", function(d){ return color(d[0]) })
            .attr("stroke-width", 1.5)
            .transition()
            .duration(animation_duration)
            .attr("d", function(d){
            return d3.line()
                .x(function(d) { return x(d.years); })
                .y(function(d) { return y(d.net_load); })
                (d[1])
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
        net_load_df: state.net_load_df,
    }
}
const mapdispatchToprop = (dispatch) => {
    return {
        set_blank_placeholder: (val) => dispatch({ type: "blank_placeholder", value: val }),
    }
}
export default connect(maptstateToprop, mapdispatchToprop)(NetLoad);