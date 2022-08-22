/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
import React, { Component } from 'react';
import { connect } from "react-redux";
import * as $ from "jquery";
import * as d3 from "d3";
import _ from 'lodash';



class MetricsChart extends Component {
    constructor(props) {
        super(props)
        console.log();
    }
    componentDidMount() {
        //this.setState({ temp: 0 });
        this.create_line_chart(this.props.the_data, this.props.the_metric);
    }
    componentDidUpdate(prevProps, prevState) {
        this.create_line_chart(this.props.the_data, this.props.the_metric);
    }

    roundToNearest15(date = new Date()) {
        const minutes = 15;
        const ms = 1000 * 60 * minutes;
      
        return new Date(Math.floor(date.getTime() / ms) * ms);
      }

    create_line_chart(the_data, the_metric){
        var animation_duration = 2000;
        var the_id = "#metricChartDiv_"+the_metric;   
        const margin = {top: 10, right: 30, bottom: 30, left: 60},
        width = $(the_id).width() - margin.left - margin.right,
        height = $(the_id).height() - margin.top - margin.bottom;

        //the_data = the_data.filter((d) => d.temperature !== 99999); // removing NaN

        /** svg1 just sets the width and height of the svg */
        //$(".netLoadChart").empty();
        const svg1 = d3.select(".metricChart_"+the_metric)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        /** This adds a g to control the margin of the svg */
        var svg = d3.select(".metricChart_"+the_metric).selectAll(".initial_g_metric_"+the_metric).data([0]).join("g")
        .attr("class", "initial_g_metric_"+the_metric)    
        .attr("transform",`translate(${margin.left},${margin.top})`);


        /** Grouping the data: in order to draw one line per group */
        const sumstat2 = d3.group(the_data, d => d.dummy) // group function allows to group the calculation per level of a factor

        /** Adding and calling X axis --> it is a date format */
        var starting_date = the_data[0]["timeline"]
        var ending_date = the_data[the_data.length -1]["timeline"]
        //console.log(starting_date, ending_date)
        const x = d3.scaleTime()
        //.domain(d3.extent(net_load_df, function(d) { return d.years; }))
        .domain([new Date(starting_date), new Date(ending_date)])
        .range([ 0, width ]); // can add .nice() to force the last tick
        svg.selectAll(".g_X_metric_"+the_metric).data([0]).join("g")
        .attr("class", "g_X_metric_"+the_metric)  
        .attr("transform", `translate(0, ${height})`)
        .transition()
        .duration(animation_duration)
        .call(d3.axisBottom(x)); //removed the ticks

        /** Adding and calling Y axis */ 
        //var limit = 1.1*(Math.max(Math.abs(d3.min(the_data, function(d) { return temperature; })), Math.abs(d3.max(net_load_df, function(d) { return d.net_load; }))))
        var upper_limit = 1.1*d3.max(the_data,(d) => d[the_metric]);
        var lower_limit = 0.9*d3.min(the_data,(d) => d[the_metric]);
        const y = d3.scaleLinear()
        .domain([lower_limit,upper_limit])
        .range([ height, 0 ]);
        svg.selectAll(".g_Y_metric_"+the_metric).data([0]).join("g")
        .attr("class", "g_Y_metric_"+the_metric)
        .transition()
        .duration(animation_duration)
        .call(d3.axisLeft(y));

        /** Color palette */ 
        const color = d3.scaleOrdinal()
        //.range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])
        .range(["#377eb8"])


        /** Drawing the lines */ 
        // svg.append("linearGradient")
        //     .attr("id", colorId.id)
        //     .attr("gradientUnits", "userSpaceOnUse")
        //     .attr("x1", 0)
        //     .attr("x2", width)
        //     .selectAll("stop")
        //     .data(data)
        //     .join("stop")
        //     .attr("offset", d => x(d.date) / width)
        //     .attr("stop-color", d => color(d.condition));

        if(the_metric !== "temperature"){svg.selectAll(".lineCharts_metric_"+the_metric)
        .data(sumstat2)
        .join("path")
            .attr("class", "lineCharts_metric_"+the_metric)
            .attr("fill", "none")
            .attr("stroke", function(d){return color(d[0]) })
            .attr("stroke-width", 1.5)
            .transition()
            .duration(animation_duration)
            .attr("d", function(d){
            return d3.line()
                .curve(d3.curveStep)
                .x(function(d) { return x(new Date(d.timeline)); })
                .y(function(d) { return y(d[the_metric]); })
                (d[1])
            })
            console.log(sumstat2)
        }

        else {
            // Set the gradient
                svg.selectAll(".linearGradient_"+the_metric)
                .data([0])
                .join("linearGradient")
                .attr("class", "linearGradient_"+the_metric)
                //.append("linearGradient")
                .attr("id", "line-gradient")
                .attr("gradientUnits", "userSpaceOnUse")
                .attr("x1", 0)
                .attr("x2", width)
                .selectAll("stop")
                .data(the_data)
                .join("stop")
                .attr("offset", function(d) { return x(new Date(d.timeline))/width; })
                .attr("stop-color", function(d) { return (d.wasNan)?"red":"#377eb8"; });

            svg.selectAll(".lineCharts_metric_"+the_metric)
            .data(sumstat2)
            .join("path")
            .attr("class", "lineCharts_metric_"+the_metric)
            .attr("fill", "none")
            .attr("stroke", function(d){return "url(#line-gradient)" })
            .attr("stroke-width", 1.5)
            .on("mousemove", (event)=>{console.log(this.roundToNearest15(x.invert(d3.pointer(event)[0])))})
            .transition()
            .duration(animation_duration)
            .attr("d", function(d){
            return d3.line()
                .curve(d3.curveStep)
                .x(function(d) { return x(new Date(d.timeline)); })
                .y(function(d) { return y(d[the_metric]); })
                (d[1])
            })
            
            }   
        


    }
    render() {
        // css design is in App.css

        return <div>
        <div id={"metricChartDiv_"+this.props.the_metric} style={{height:"25vh"}}>
        <svg className={"metricChart_"+this.props.the_metric}></svg>
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
export default connect(maptstateToprop, mapdispatchToprop)(MetricsChart);