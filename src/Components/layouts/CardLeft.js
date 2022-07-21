/* eslint-disable no-useless-constructor */
/* eslint-disable no-unused-vars */
import React, {Component} from 'react';
import { connect } from "react-redux";
import { Card, CardGroup} from 'react-bootstrap';
import Grid from '@mui/material/Grid';
import * as $ from "jquery";
import 'bootstrap/dist/css/bootstrap.min.css';

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
          
      </Card.Body>
      </Card>

    
  );
 } //return ends
}

const maptstateToprop = (state) => {
  return {
      url: state.url,
      attributes_of_interest: state.attributes_of_interest,
      attributes_of_interest_temp: state.attributes_of_interest_temp,
      tags_dict2:state.tags_dict2,
      datasets_with_url: state.datasets_with_url,
      isLoading: state.isLoading,
      isLoadingTags: state.isLoadingTags,
      keywords_datasets_tag: state.keywords_datasets_tag,
      clicked_tags: state.clicked_tags,
      cluster_data: state.cluster_data,
      cluster_data_filtered: state.cluster_data_filtered,
      plot_type: state.plot_type,
      vulnerable_checked: state.vulnerable_checked,
      vulnerable_checked_disabled: state.vulnerable_checked_disabled,
  }
}
const mapdispatchToprop = (dispatch) => {
  return {
      set_selected_datasets: (val) => dispatch({ type: "selected_datasets", value: val }),
      set_final_selected_datasets: (val) => dispatch({ type: "final_selected_datasets", value: val }),
      set_attributes_of_interest: (val) => dispatch({ type: "attributes_of_interest", value: val }),
      set_attributes_of_interest_temp: (val) => dispatch({ type: "attributes_of_interest_temp", value: val }),
      set_projection_data: (val) => dispatch({ type: "projection_data", value: val }),
      set_isLoading: (val) => dispatch({ type: "isLoading", value: val }),
      set_isLoadingTags: (val) => dispatch({ type: "isLoadingTags", value: val }),
      set_dataset_list: (val) => dispatch({ type: "dataset_list", value: val }),
      set_vulnerable_checked: (val) => dispatch({ type: "vulnerable_checked", value: val }),
      set_vulnerable_checked_disabled: (val) => dispatch({ type: "vulnerable_checked_disabled", value: val }),
  }
}

export default connect(maptstateToprop, mapdispatchToprop)(CardLeft);