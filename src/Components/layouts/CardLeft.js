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

export class  CardLeft extends Component {
  //const classes = useStyles();
  constructor(props) {
    super(props);
    console.log();
  
}
componentDidMount() {}
componentDidUpdate() {}
shouldComponentUpdate(nextProps, nextState){
    return true
}





render(){ 
//const { selected_list } = this.state;  
return (
    <div>
    {(!this.props.enable_seasons_choice)?
      <Card style={{height: "94vh"}}>
      <Card.Header>
        <Grid container direction="row" spacing={1}>
        <Grid item xs={11} sm={11}>Net Load (kW)</Grid>
        <Grid item xs={1} sm={1}>{(true)?<span style={{opacity:0}}><Button size="small"  color="secondary"  disabled={true}  style={{ backgroundColor: "#efefef", opacity: 1, borderRadius: 0, color: "black",  marginTop: -2, textTransform: 'none' }}
         >Update</Button></span>:null}</Grid>
        </Grid>
      </Card.Header>
      <Card.Body style={{opacity:(this.props.isLoadingUpdate)?0.4:1}}>
          {((this.props.net_load_df).length >0)?<NetLoad></NetLoad>:null}
      </Card.Body>
      </Card>
      :
      <div>
      <Card style={{height: "47vh"}}>
      <Card.Header>
        <Grid container direction="row" spacing={1}>
        <Grid item xs={11} sm={11}>Net Load(kW)</Grid>
        <Grid item xs={1} sm={1}>{(true)?<span style={{opacity:0}}><Button size="small"  color="secondary"  disabled={true}  style={{ backgroundColor: "#efefef", opacity: 1, borderRadius: 0, color: "black",  marginTop: -2, textTransform: 'none' }}
         >Update</Button></span>:null}</Grid>
        </Grid>
      </Card.Header>
      <Card.Body style={{opacity:(this.props.isLoadingUpdate)?0.4:1}}>
          {((this.props.net_load_df).length >0)?<NetLoad></NetLoad>:null}
      </Card.Body>
      </Card>

      <Card style={{height: "47vh"}}>
      <Card.Header>
        <Grid container direction="row" spacing={1}>
        <Grid item xs={11} sm={11}>Net Load (kW)</Grid>
        <Grid item xs={1} sm={1}>{(true)?<span style={{opacity:0}}><Button size="small"  color="secondary"  disabled={true}  style={{ backgroundColor: "#efefef", opacity: 1, borderRadius: 0, color: "black",  marginTop: -2, textTransform: 'none' }}
         >Update</Button></span>:null}</Grid>
        </Grid>
      </Card.Header>
      <Card.Body style={{opacity:(this.props.isLoadingUpdate)?0.4:1}}>
          {((this.props.net_load_df).length >0)?<NetLoad></NetLoad>:null}
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
  }
}
const mapdispatchToprop = (dispatch) => {
  return {
      set_blank_placeholder: (val) => dispatch({ type: "blank_placeholder", value: val }),
  }
}

export default connect(maptstateToprop, mapdispatchToprop)(CardLeft);