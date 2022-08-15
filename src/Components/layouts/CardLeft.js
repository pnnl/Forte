/* eslint-disable no-useless-constructor */
/* eslint-disable no-unused-vars */
import React, {Component} from 'react';
import { connect } from "react-redux";
import { Card, CardGroup} from 'react-bootstrap';
import Grid from '@mui/material/Grid';
import * as $ from "jquery";
import 'bootstrap/dist/css/bootstrap.min.css';
import NetLoad from '../charts/NetLoad';

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
    
    <Card style={{height: "94vh"}}>
      <Card.Header>
        <Grid container direction="row" spacing={1}>
        <Grid item xs={12} sm={12}>Net Load</Grid>
        </Grid>
      </Card.Header>
      <Card.Body>
          <NetLoad></NetLoad>
      </Card.Body>
      </Card>

    
  );
 } //return ends
}

const maptstateToprop = (state) => {
  return {
      blank_placeholder: state.blank_placeholder,
  }
}
const mapdispatchToprop = (dispatch) => {
  return {
      set_blank_placeholder: (val) => dispatch({ type: "blank_placeholder", value: val }),
  }
}

export default connect(maptstateToprop, mapdispatchToprop)(CardLeft);