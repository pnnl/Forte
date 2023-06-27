/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
import React, { Component } from 'react';
import { connect } from "react-redux";
import * as $ from "jquery";
import * as d3 from "d3";
import _ from 'lodash';
//import { area } from 'd3';

var tooltip;


class NetLoad extends Component {
    constructor(props) {
        super(props)
        console.log();
    }
    componentDidMount() {
        var chart_type = this.props.my_type;
        var my_net_load_df = [];
        var my_conf_95_df = [];
        if(chart_type === "no_season"){my_net_load_df = this.props.net_load_df; my_conf_95_df = this.props.conf_95_df;}
        else{
            var my_net_load_df_temp = [...this.props.net_load_df];
            var my_conf_95_df_temp = [...this.props.conf_95_df];
            if(chart_type === "season1"){
                my_net_load_df = my_net_load_df_temp.filter(el =>{var month = parseInt((el.timeline).substring(5,7)); return (month>=4  && month<=9)});
                my_conf_95_df = my_conf_95_df_temp.filter(el =>{var month = parseInt((el.timeline).substring(5,7)); return (month>=4  && month<=9)})
            }
            else{
                my_net_load_df = my_net_load_df_temp.filter(el =>{var month = parseInt((el.timeline).substring(5,7)); return (month<4  || month>9)});
                my_conf_95_df = my_conf_95_df_temp.filter(el =>{var month = parseInt((el.timeline).substring(5,7)); return (month<4  || month>9)})
            }
        }
        this.create_line_chart(my_net_load_df, my_conf_95_df, this.props.my_type, this.props.animation_duration);
    }
    componentDidUpdate(prevProps, prevState) {
        var chart_type = this.props.my_type;
        var my_net_load_df = [];
        var my_conf_95_df = [];
        if(chart_type === "no_season"){my_net_load_df = this.props.net_load_df; my_conf_95_df = this.props.conf_95_df;}
        else{
            var my_net_load_df_temp = [...this.props.net_load_df];
            var my_conf_95_df_temp = [...this.props.conf_95_df];
            if(chart_type === "season1"){
                my_net_load_df = my_net_load_df_temp.filter(el =>{var month = parseInt((el.timeline).substring(5,7)); return (month>=4  && month<=9)});
                my_conf_95_df = my_conf_95_df_temp.filter(el =>{var month = parseInt((el.timeline).substring(5,7)); return (month>=4  && month<=9)})
            }
            else{
                my_net_load_df = my_net_load_df_temp.filter(el =>{var month = parseInt((el.timeline).substring(5,7)); return (month<4  || month>9)});
                my_conf_95_df = my_conf_95_df_temp.filter(el =>{var month = parseInt((el.timeline).substring(5,7)); return (month<4  || month>9)})
            }
        }
        this.create_line_chart(my_net_load_df, my_conf_95_df, this.props.my_type, this.props.animation_duration);
    }

    convert_to_Array_of_Arrays(input){
        var output = input.map(function(obj) {
            return [obj.timeline, obj.lower_limit, obj.higher_limit]
          }); 
        return output;  
    }
    convert_to_Array_of_Arrays2(input){
        var output = input.map(function(obj, i) {
            if(i<input.length){return [[obj.net_load, obj.net_load_type, obj.timeline, obj.years],[(obj.net_load)*1.1, obj.net_load_type, obj.timeline, obj.years]]}
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

    create_line_chart(net_load_df, conf_95_df, my_type, animation_duration=2500){
        var self = this;
        //var animation_duration = 2500;//2000;
        var the_id = "#netLoadChartDiv_"+my_type;   
        const margin = {top: 10, right: 30, bottom: 30, left: 60},
        width = $(the_id).width() - margin.left - margin.right,
        height = $(the_id).height() - margin.top - margin.bottom;
        //console.log(width, height); 

        /** svg1 just sets the width and height of the svg */
        //$(".netLoadChart").empty();
        const svg1 = d3.select(".netLoadChart_"+my_type)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        /** This adds a g to control the margin of the svg */
        var svg = d3.select(".netLoadChart_"+my_type).selectAll(".initial_g").data([0]).join("g")
        .attr("class", "initial_g")    
        .attr("transform",`translate(${margin.left},${margin.top})`);


        /** Grouping the data: in order to draw one line per group */
        var test = net_load_df.filter(el => ["actual", "predicted"].includes(el.net_load_type) && el["years"]<5000001)
        var test2 = net_load_df.filter(el => !["actual", "predicted"].includes(el.net_load_type))
        var test3 = d3.group(test2, d => d.years)
        //test = net_load_df
        console.log(test3)
        const sumstat2 = d3.group(test, d => d.net_load_type) // group function allows to group the calculation per level of a factor

        /** Adding and calling X axis --> it is a date format */
        var starting_date = net_load_df[0]["timeline"]
        var ending_date = net_load_df[net_load_df.length -1]["timeline"]
        //console.log(starting_date, ending_date)
        const x = d3.scaleTime()
        //.domain(d3.extent(net_load_df, function(d) { return d.years; }))
        .domain([new Date(starting_date), new Date(ending_date)])
        .range([ 0, width ]); // can add .nice() to force the last tick
        svg.selectAll(".g_X").data([0]).join("g")
        .attr("class", "g_X")  
        .attr("transform", `translate(0, ${height})`)
        .transition()
        .duration(animation_duration)
        .call(d3.axisBottom(x).tickSize(-height).tickSizeOuter(0)); //removed the ticks

        /** Adding and calling Y axis */ 
        //var limit = 1.1*(Math.max(Math.abs(d3.min(net_load_df, function(d) { return d.net_load; })), Math.abs(d3.max(net_load_df, function(d) { return d.net_load; }))))
        var upper_limit = d3.max(net_load_df, (d) => { return d.net_load; });
        upper_limit = (upper_limit>0)?(upper_limit*1.25):(upper_limit*0.75); // increasing upper limit ; [1.1, 0.9]
        var lower_limit = d3.min(net_load_df, (d) => { return d.net_load; });
        lower_limit = (lower_limit>0)?(lower_limit*0.75):(lower_limit*1.25); // decreasing lower limit
        this.props.set_current_net_load_y_axis([lower_limit,upper_limit]); // updating the current y axis every time
        var y_domain = ((this.props.freezed_axis).length === 0)?[lower_limit,upper_limit]:this.props.freezed_axis;
        const y = d3.scaleLinear()
        //.domain([-limit,limit])
        .domain(y_domain)
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
        .range(["#377eb8", "#F39C12", "rgb(240, 240, 240)", "rgb(243, 156, 18, 0.3)"])// "#FF0000", "#00FF00", , "#9897A9"])

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
        .style("fill", function(d){ if(d === "95% confidence"){return "rgb(190,190,190)"} else if(d === "prediction_old"){return "rgb(253, 127, 111)"} else{return color(d)}})
        .text(function(d){ return d})
        .attr("font-size", "0.9em")
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")

        var conf_95_df_formatted = this.convert_to_Array_of_Arrays(conf_95_df);
        //console.log(conf_95_df_formatted);
        var area = d3.area()
        .curve(d3.curveStep)
        .x(function(d) { return x(new Date(d[0])); })
        .y0(function(d) { return y(d[1]); })
        .y1(function(d) { return y(d[2]); });
        /** Drawing the confidence interval */ 
        svg.selectAll(".area_chart_confidence")
        .data([conf_95_df_formatted])
        .join("path")
            .attr("class", "area_chart_confidence")
            .attr("fill", "rgb(240, 240, 240)")
            .attr("stroke", null)
            .attr("stroke-width", 1.5)
            .transition()
            .duration(animation_duration)
            .attr("d", (el) => {return area(el)}) 
            // function(d){
            // return d3.area()
            //     //.curve(d3.curveStep)
            //     .x(function(d) { return x(new Date(d[0])); })
            //     .y0(function(d) { return y(d[1]); })
            //     .y1(function(d) { return y(d[2]); })
            //     (d[1])
            // })

        var line = d3.line()
            .curve(d3.curveStep)
            .x(function(d) { return x(new Date(d.timeline)); })
            .y(function(d) { return y(d.net_load); }); 
        var line2 = d3.line()
            .curve(d3.curveStep)
            .x(function(d) { return x(new Date(d[0][2])); })
            .y(function(d) { return y(d[0][0]); })
                 
        // var converted_predicted = this.convert_to_Array_of_Arrays2(sumstat2.get("predicted"))
        // console.log(converted_predicted);   

        /** Drawing the lines */ 
        svg.selectAll(".lineCharts_actual")
        .data((sumstat2.get("actual"))?[sumstat2.get("actual")]:[])
        .join("path")
            .attr("class", "lineCharts_actual")
            .attr("fill", "none")
            .attr("stroke", function(d){ return color("actual") })
            .attr("stroke-width", 1.5)
            .transition()
            .duration(animation_duration)
            .attr("d", (el) => {return line(el)} )

        svg.selectAll(".lineCharts_predicted")
            .data([sumstat2.get("predicted")])
            //.data(converted_predicted)
            .join("path")
                .attr("class", "lineCharts_predicted")
                .attr("fill", "none")
                .attr("stroke", function(d){ return color("predicted") })
                .attr("stroke-width", 1.5)
                .transition()
                .duration(animation_duration)
                .delay((d,i) =>{console.log(i);return 1000*i})
                .ease(d3.easeLinear)
                .attr("d", (el) => {return line(el)} )    
        // svg.selectAll(".lineCharts")
        // .data(sumstat2)
        // .join("path")
        //     .attr("class", "lineCharts")
        //     .attr("fill", "none")
        //     .attr("stroke", function(d){ return color(d[0]) })
        //     .attr("stroke-width", 1.5)
        //     .transition()
        //     .duration(animation_duration)
        //     .attr("d", function(d){
        //     return d3.line()
        //         .curve(d3.curveStep)
        //         .x(function(d) { return x(new Date(d.timeline)); })
        //         .y(function(d) { return y(d.net_load); })
        //         (d[1])
        //     })

            // info icon about performance metrics
            d3.selectAll(".netload_performance_icon").on("mouseover", function (event) {
                tooltip.transition()
                  .duration(200)
                  .style("opacity", .9);
                if(self.props.url_version === "1.3"){
                    //tooltip.html("MAE: "+String(self.props.mae)+" kW <br> MAPE: "+String(self.props.mape)+"%")
                    tooltip.html("MAE: "+String(self.props.mae)+" kW"+"<br> Mode APE: "+String(self.props.mode_ape)+"%"+"<br> Median APE: "+String(self.props.median_ape)+"%"+"<br> Mean APE: "+String(self.props.mean_ape)+"%")
                            .style("left", (event.pageX + 5) + "px")
                            .style("top", (event.pageY - 10) + "px");
                }
                else{
                    tooltip.html("MAE: "+String(self.props.mae)+" kW"+"<br> Mode APE: "+String(self.props.mode_ape)+"%"+"<br> Median APE: "+String(self.props.median_ape)+"%"+"<br> Mean APE: "+String(self.props.mean_ape)+"%")
                            .style("left", (event.pageX + 5) + "px")
                            .style("top", (event.pageY - 10) + "px");
                }
                
              })
                .on("mouseout", function (d) {
                  tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
                })


    }
    render() {
        // css design is in App.css

        tooltip = d3.select("body").selectAll(".tooltip_performance_metrics").data([0]).join('div')
            .attr("class", "tooltip_performance_metrics")
            .style("opacity", 0);

        return <div>
        <div id={"netLoadChartDiv_"+this.props.my_type} style={{height:(this.props.my_type === "no_season")?"81vh":"36vh"}}> 
        {/* Card Left height -9 */}
        <svg className={"netLoadChart_"+this.props.my_type} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseExit}></svg>
        </div>
      </div>
       
    }
  
};
const maptstateToprop = (state) => {
    return {
        blank_placeholder:state.blank_placeholder,
        net_load_df: state.net_load_df,
        conf_95_df: state.conf_95_df,
        url_version: state.url_version,
        mae: state.mae,
        mape: state.mape,
        mean_ape: state.mean_ape,
        median_ape: state.median_ape,
        mode_ape: state.mode_ape,
        freezed_axis: state.freezed_axis,
        animation_duration: state.animation_duration,
    }
}
const mapdispatchToprop = (dispatch) => {
    return {
        set_blank_placeholder: (val) => dispatch({ type: "blank_placeholder", value: val }),
        set_current_net_load_y_axis: (val) => dispatch({ type: "current_net_load_y_axis", value: val }),
        
    }
}
export default connect(maptstateToprop, mapdispatchToprop)(NetLoad);