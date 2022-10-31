/* eslint-disable no-useless-constructor */
/* eslint-disable no-unused-vars */
import React, {Component} from 'react';
import { connect } from "react-redux";
import { Card, CardGroup} from 'react-bootstrap';
import Grid from '@mui/material/Grid';
import * as $ from "jquery";
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
  
}
componentDidMount() {}
componentDidUpdate() {}
shouldComponentUpdate(nextProps, nextState){
    return true
}

handleFreezeAxis(event){
  if(event.target.checked){
    this.props.set_freezed_axis(this.props.current_net_load_y_axis);
  }
  else{
    this.props.set_freezed_axis([]);
  }
}





render(){ 
//const { selected_list } = this.state;  
return (
    <div>
    {(!this.props.enable_seasons_choice)?
      <Card style={{height: "90vh"}}>
      <Card.Header>
        <Grid container direction="row" spacing={1}>
        <Grid item xs={9} sm={9}>Net Load (kW) <i className={"fa fa-info-circle netload_performance_icon"} aria-hidden="true"></i></Grid>
        <Grid item xs={1} sm={1}>{(true)?<span style={{opacity:0}}><Button size="small"  color="secondary"  disabled={true}  style={{ backgroundColor: "#efefef", opacity: 1, borderRadius: 0, color: "black",  marginTop: -2, textTransform: 'none' }}
         >Update</Button></span>:null}</Grid>
        <Grid item xs={2} sm={2}>
          <FormGroup>
            <FormControlLabel control={<Checkbox size="small" onChange={this.handleFreezeAxis} />} label="Freeze Y-axis" />
        </FormGroup>
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
      enable_seasons_choice: state.enable_seasons_choice,
      current_net_load_y_axis: state.current_net_load_y_axis,
  }
}
const mapdispatchToprop = (dispatch) => {
  return {
      set_blank_placeholder: (val) => dispatch({ type: "blank_placeholder", value: val }),
      set_freezed_axis: (val) => dispatch({ type: "freezed_axis", value: val }),
  }
}

export default connect(maptstateToprop, mapdispatchToprop)(CardLeft);