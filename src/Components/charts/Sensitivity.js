/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
import React, { Component } from 'react';
import { connect } from "react-redux";
import * as $ from "jquery";
import * as d3 from "d3";
import _ from 'lodash';
//import { area } from 'd3';

var tooltip;


class Sensitivity extends Component {
    constructor(props) {
        super(props)
        console.log();
    }
    componentDidMount() {
        var mae_values = this.props.mae_values;
        var mape_values = this.props.mape_values;
        mae_values = mae_values.sort(function(a, b) { return a[0] - b[0]; });
        mape_values = mape_values.sort(function(a, b) { return a[0] - b[0]; });
        //console.log(mae_values);
        var chart_type = this.props.my_type;
        var my_net_load_df = [];
        var my_conf_95_df = [];
        if(chart_type === "no_season"){my_net_load_df = this.props.net_load_df; my_conf_95_df = this.props.conf_95_df;}
        this.create_line_chart(mae_values, mape_values, this.props.my_type, this.props.type);
    }
    componentDidUpdate(prevProps, prevState) {
        var mae_values = this.props.mae_values;
        var mape_values = this.props.mape_values;
        mae_values = mae_values.sort(function(a, b) { return a[0] - b[0]; });
        mape_values = mape_values.sort(function(a, b) { return a[0] - b[0]; });
        //console.log(mae_values);
        var chart_type = this.props.my_type;
        var my_net_load_df = [];
        var my_conf_95_df = [];
        if(chart_type === "no_season"){my_net_load_df = this.props.net_load_df; my_conf_95_df = this.props.conf_95_df;}
        
        this.create_line_chart(mae_values, mape_values, this.props.my_type, this.props.type);
    }

    convert_to_Array_of_Arrays(input){
        var output = input.map(function(obj) {
            return [obj.timeline, obj.lower_limit, obj.higher_limit]
          }); 
        return output;  
    } 
    /** This function increases the opacity of the gridlines when hovered */
    handleMouseEnter(event){
        var my_svg = d3.select(event.target)
        my_svg.selectAll(".tick line").style("stroke-opacity", 0.35)
    }
    /** This function decreases the opacity of the gridlines when not hovered */
    handleMouseExit(event){
        var my_svg = d3.select(event.target)
        my_svg.selectAll(".tick line").style("stroke-opacity", 0.2)
    }

    create_line_chart(mae_values, mape_values,  my_type, type){
        var self = this;
        var animation_duration = 2500;//2000;
        var the_id = "#netLoadChartDiv_"+my_type+"_"+type;   
        const margin = {top: 10, right: 30, bottom: 30, left: 60},
        width = $(the_id).width() - margin.left - margin.right,
        height = $(the_id).height() - margin.top - margin.bottom;
        //console.log(width, height); 

        /** svg1 just sets the width and height of the svg */
        //$(".netLoadChart").empty();
        const svg1 = d3.select(".netLoadChart_"+my_type+"_"+type)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        /** This adds a g to control the margin of the svg */
        var svg = d3.select(".netLoadChart_"+my_type+"_"+type).selectAll(".initial_g").data([0]).join("g")
        .attr("class", "initial_g")    
        .attr("transform",`translate(${margin.left},${margin.top})`);


        /** Grouping the data: in order to draw one line per group */
        var my_values = (type === "MAE")?mae_values:mape_values;
        const sumstat2 = d3.group(my_values, d => 1) // group function allows to group the calculation per level of a factor

        /** Adding and calling X axis --> it is a date format */
        //console.log(starting_date, ending_date)
        const x = d3.scaleLinear()
        //.domain(d3.extent(net_load_df, function(d) { return d.years; }))
        .domain([0.1,3])
        .range([ 0, width ]); // can add .nice() to force the last tick
        svg.selectAll(".g_X").data([0]).join("g")
        .attr("class", "g_X")  
        .attr("transform", `translate(0, ${height})`)
        .transition()
        .duration(animation_duration)
        .call(d3.axisBottom(x).tickSize(-height).tickSizeOuter(0)); //removed the ticks

        /** Adding and calling Y axis */ 
        //var limit = 1.1*(Math.max(Math.abs(d3.min(net_load_df, function(d) { return d.net_load; })), Math.abs(d3.max(net_load_df, function(d) { return d.net_load; }))))
        var upper_limit = d3.max(my_values, (d) => { return d[1]; });
        upper_limit = (upper_limit>0)?(upper_limit*1.2):(upper_limit*0.8); // increasing upper limit
        var lower_limit = d3.min(my_values, (d) => { return d[1]; });
        lower_limit = (lower_limit>0)?(lower_limit*0.8):(lower_limit*1.2); // decreasing lower limit
        const y = d3.scaleLinear()
        //.domain([-limit,limit])
        .domain([lower_limit,upper_limit])
        .range([ height, 0 ]);
        svg.selectAll(".g_Y").data([0]).join("g")
        .attr("class", "g_Y")
        .transition()
        .duration(animation_duration)
        .call(d3.axisLeft(y).tickSize(-width).tickSizeOuter(0));

        /** Color palette */ 
        var keys = ["actual", "predicted", "95% confidence"]
        const color = d3.scaleOrdinal()
        //.range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])
        .range(["#377eb8", "#F39C12", "rgb(240, 240, 240)"])// "#FF0000", "#00FF00"])

        /** Adding one dot in the legend for each name */
        // svg.selectAll(".legendDots")
        // .data(keys)
        // .join("rect")
        // .attr("class", "legendDots")
        // .transition()
        // .duration(animation_duration)
        // .attr("x", 0.85*width) // must of 0.04 lesser than Text
        // .attr("y", function(d,i){ return 0 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
        // .attr("width", 0.022*width)
        // .attr("height", 2)
        // //.attr("r", 7)
        // .style("fill", function(d){ return color(d)})

        /** Adding one dot in the legend for each name */ 
        // svg.selectAll(".legendText")
        // .data(keys)
        // .join("text")
        // .attr("class", "legendText")
        // .transition()
        // .duration(animation_duration)
        // .attr("x", 0.89*width)
        // .attr("y", function(d,i){ return 0 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
        // .style("fill", function(d){ if(d === "95% confidence"){return "rgb(190,190,190)"} else{return color(d)}})
        // .text(function(d){ return d})
        // .attr("font-size", "0.9em")
        // .attr("text-anchor", "left")
        // .style("alignment-baseline", "middle")



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
                .curve(d3.curveStep)
                .x(function(d) { return x(d[0]); })
                .y(function(d) { return y(d[1]); })
                (d[1])
            })



    }
    render() {
        // css design is in App.css

        tooltip = d3.select("body").selectAll(".tooltip_performance_metrics").data([0]).join('div')
            .attr("class", "tooltip_performance_metrics")
            .style("opacity", 0);

        return <div>
        <div id={"netLoadChartDiv_"+this.props.my_type+"_"+this.props.type} style={{height:(this.props.my_type === "no_season")?"81vh":"36vh"}}> 
        {/* Card Left height -9 */}
        <svg className={"netLoadChart_"+this.props.my_type+"_"+this.props.type} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseExit}></svg>
        </div>
      </div>
       
    }
  
};
const maptstateToprop = (state) => {
    return {
        blank_placeholder:state.blank_placeholder,
        net_load_df: state.net_load_df,
        conf_95_df: state.conf_95_df,
        mae: state.mae,
        mape: state.mape,
        mae_values: state.mae_values,
        mape_values: state.mape_values
    }
}
const mapdispatchToprop = (dispatch) => {
    return {
        set_blank_placeholder: (val) => dispatch({ type: "blank_placeholder", value: val }),
    }
}
export default connect(maptstateToprop, mapdispatchToprop)(Sensitivity);