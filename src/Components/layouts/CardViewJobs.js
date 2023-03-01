/* eslint-disable no-useless-constructor */
/* eslint-disable no-unused-vars */
import React, {Component} from 'react';
import { connect } from "react-redux";
import { Card, CardGroup} from 'react-bootstrap';
import Grid from '@mui/material/Grid';
import * as $ from "jquery";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from '@mui/material/Button';
import Sensitivity from '../charts/Sensitivity';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ShowJob from '../view_jobs/ShowJob';


export class  CardOne extends Component {
  //const classes = useStyles();
  constructor(props) {
    super(props);
    console.log();
    this.handleTabChange = this.handleTabChange.bind(this);
  
}
componentDidMount() {}
componentDidUpdate() {}
shouldComponentUpdate(nextProps, nextState){
    return true
}

handleTabChange(event, value){
  console.log(value);
  this.props.set_selected_job_name_sa(value);
}




render(){ 
//const { selected_list } = this.state;  

return (
    <div>
        <Box
      sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: "93vh" }}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={this.props.selected_job_name_sa}
        onChange={this.handleTabChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: 'divider' }}
      >
        {(this.props.created_jobs_name_sa).map(d=><Tab label={d} title={d} key={d} value={d}  />)}
        <Tab label="Sample Job 1" title="Item One" value={"sample1"}  />
        <Tab label="Sample Job 2" title="Item Two" value={"sample2"} />
        
      </Tabs>
      <ShowJob></ShowJob>
    </Box>
    
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
      mae_values: state.mae_values,
      created_jobs_name_sa: state.created_jobs_name_sa,
      selected_job_name_sa: state.selected_job_name_sa,
  }
}
const mapdispatchToprop = (dispatch) => {
  return {
      set_blank_placeholder: (val) => dispatch({ type: "blank_placeholder", value: val }),
      set_selected_job_name_sa: (val) => dispatch({ type: "selected_job_name_sa", value: val }),
  }
}

export default connect(maptstateToprop, mapdispatchToprop)(CardOne);