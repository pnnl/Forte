/* eslint-disable no-useless-constructor */
/* eslint-disable no-unused-vars */
import React, {Component} from 'react';
import { connect } from "react-redux";
import { Card, CardGroup} from 'react-bootstrap';
import Grid from '@mui/material/Grid';
import * as $ from "jquery";
import * as d3 from "d3";
import 'bootstrap/dist/css/bootstrap.min.css';
import NetLoad from '../charts/NetLoad';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

export class  CardLeft extends Component {
  //const classes = useStyles();
  constructor(props) {
    super(props);
    console.log();
    this.handleFreezeAxis = this.handleFreezeAxis.bind(this);
    this.handleReplay = this.handleReplay.bind(this);
  
}
componentDidMount() {}
componentDidUpdate() {}
shouldComponentUpdate(nextProps, nextState){
    return true
}
sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

handleFreezeAxis(event){
  if(event.target.checked){
    this.props.set_freezed_axis(this.props.current_net_load_y_axis);
  }
  else{
    this.props.set_freezed_axis([]);
  }
}
handleReplay(){
  var net_load_df_old = [...this.props.net_load_df_old];
  var conf_95_df_old = [...this.props.conf_95_df_old];
  var net_load_df = [...this.props.net_load_df];
  var conf_95_df = [...this.props.conf_95_df];

  var upper_limit = d3.max(net_load_df, (d) => { return d.net_load; });
  var lower_limit = d3.min(net_load_df, (d) => { return d.net_load; });
  // Creating fake entries based on the higher and lower limit of net_load_df
  var fake_higher = {"net_load": upper_limit, "net_load_type": "predicted", "timeline": "2020-01-03 00:00:00", "years": 5000001, "mark":"fake data"}
  var fake_lower = {"net_load": lower_limit, "net_load_type": "predicted", "timeline": "2020-01-03 00:00:00", "years": 5000001, "mark":"fake data"}
  // var net_load_df_old = [...this.props.net_load_df];
  // var conf_95_df_old = [...this.props.conf_95_df];
  // var updated_net_load_df = net_load_df.map(el =>{el["net_load"] = 1.5*el["net_load"]; return el;})
  // var updated_conf_95_df = conf_95_df.map(el =>{el["higher_limit"] = 1.5*el["higher_limit"]; el["lower_limit"] = 1.5*el["lower_limit"]; return el;})
  var filtered_net_load_df_old = net_load_df_old.filter(el => el["net_load_type"] === "predicted")
  var filtered_conf_95_df_old = [];
  var filtered_net_load_df = net_load_df.filter(el => el["net_load_type"] === "predicted")
  var filtered_conf_95_df = [];

  //Inserting fake entries
  filtered_net_load_df_old.splice(2,0, fake_higher);
  filtered_net_load_df_old.splice(3,0, fake_lower);
  filtered_net_load_df.splice(2,0, fake_higher);
  filtered_net_load_df.splice(3,0, fake_lower);

  this.props.set_net_load_df(filtered_net_load_df_old); //Disable this line for update with all details
  this.props.set_conf_95_df(filtered_conf_95_df_old); //Disable this line for update with all details

  // this.props.set_net_load_df(net_load_df_old); //Enable this line for update with all details
  // this.props.set_conf_95_df(conf_95_df_old); //Enable this line for update with all details
  
  this.sleep(3000).then(()=>{
    this.props.set_animation_duration(7000)
    this.props.set_net_load_df(filtered_net_load_df); //Disable this line for update with all details
    this.props.set_conf_95_df(filtered_conf_95_df); //Disable this line for update with all details
    // this.props.set_net_load_df(net_load_df); //Enable this line for update with all details
    // this.props.set_conf_95_df(conf_95_df); //Enable this line for update with all details
    console.log("Replay complete");
    this.sleep(8000).then(()=>{
      this.props.set_animation_duration(50);
      this.props.set_net_load_df(net_load_df); //Disable this line for update with all details
      this.props.set_conf_95_df(conf_95_df); //Disable this line for update with all details

      this.sleep(5000).then(()=>{
        this.props.set_animation_duration(2500);
      })
    })
  })
  console.log(net_load_df, conf_95_df);
}





render(){ 
//const { selected_list } = this.state;  
return (
    <div>
    {(!this.props.enable_seasons_choice)?
      <Card style={{height: "90vh"}}>
      <Card.Header>
        <Grid container direction="row" spacing={0}>
        <Grid item xs={7} sm={7}>Net Load (kW) <i className={"fa fa-info-circle netload_performance_icon"} aria-hidden="true"></i></Grid>
        {/* <Grid item xs={0} sm={0}>{(true)?<span style={{opacity:0}}><Button size="small"  color="secondary"  disabled={true}  style={{ backgroundColor: "#efefef", opacity: 1, borderRadius: 0, color: "black",  marginTop: -2, textTransform: 'none' }}
         >Update</Button></span>:null}</Grid> */}
         <Grid item xs={2} sm={2}>
            <Button 
              size="small"  
              color="secondary"  
              disabled={false}  
              onClick={this.handleReplay}
              style={{ backgroundColor: "#efefef", opacity: 1, borderRadius: 0, color: "black",  marginTop: -2, textTransform: 'none' }}
          >Replay</Button>
         </Grid>
        <Grid item xs={3} sm={3}>
          {/* <FormGroup> */}
            <FormControlLabel style={{marginTop:-6 }} control={<Checkbox size="small" onChange={this.handleFreezeAxis} />} label="Freeze Y-axis" />
        {/* </FormGroup> */}
        </Grid>
        </Grid>
      </Card.Header>
      <Card.Body style={{opacity:(this.props.isLoadingUpdate)?0.4:1}}>
          {((this.props.net_load_df).length >0)?<NetLoad my_type={"no_season"}></NetLoad>:null}
      </Card.Body>
      </Card>
      :
      <div>
      <Card style={{height: "45vh"}}>
      <Card.Header>
        <Grid container direction="row" spacing={1}>
        <Grid item xs={11} sm={11}>Net Load for Summer (kW)</Grid>
        <Grid item xs={1} sm={1}>{(true)?<span style={{opacity:0}}><Button size="small"  color="secondary"  disabled={true}  style={{ backgroundColor: "#efefef", opacity: 1, borderRadius: 0, color: "black",  marginTop: -2, textTransform: 'none' }}
         >Update</Button></span>:null}</Grid>
        </Grid>
      </Card.Header>
      <Card.Body style={{opacity:(this.props.isLoadingUpdate)?0.4:1}}>
          {((this.props.net_load_df).length >0)?<NetLoad my_type={"season1"}></NetLoad>:null}
      </Card.Body>
      </Card>

      <Card style={{height: "45vh"}}>
      <Card.Header>
        <Grid container direction="row" spacing={1}>
        <Grid item xs={11} sm={11}>Net Load for Winter (kW)</Grid>
        <Grid item xs={1} sm={1}>{(true)?<span style={{opacity:0}}><Button size="small"  color="secondary"  disabled={true}  style={{ backgroundColor: "#efefef", opacity: 1, borderRadius: 0, color: "black",  marginTop: -2, textTransform: 'none' }}
         >Update</Button></span>:null}</Grid>
        </Grid>
      </Card.Header>
      <Card.Body style={{opacity:(this.props.isLoadingUpdate)?0.4:1}}>
          {((this.props.net_load_df).length >0)?<NetLoad my_type={"season2"}></NetLoad>:null}
      </Card.Body>
      </Card>
      </div>
      
    }  
    </div>
    
  );
 } //return ends
}

const maptstateToprop = (state) => {
  return {
      blank_placeholder: state.blank_placeholder,
      isLoadingUpdate: state.isLoadingUpdate,
      net_load_df: state.net_load_df,
      conf_95_df: state.conf_95_df,
      net_load_df_old: state.net_load_df_old,
      conf_95_df_old: state.conf_95_df_old,
      enable_seasons_choice: state.enable_seasons_choice,
      current_net_load_y_axis: state.current_net_load_y_axis,
  }
}
const mapdispatchToprop = (dispatch) => {
  return {
      set_blank_placeholder: (val) => dispatch({ type: "blank_placeholder", value: val }),
      set_freezed_axis: (val) => dispatch({ type: "freezed_axis", value: val }),
      set_net_load_df: (val) => dispatch({ type: "net_load_df", value: val}),
      set_conf_95_df: (val) => dispatch({ type: "conf_95_df", value: val}),
      set_animation_duration: (val) => dispatch({ type: "animation_duration", value: val }),
  }
}

export default connect(maptstateToprop, mapdispatchToprop)(CardLeft);