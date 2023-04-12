/* eslint-disable no-unused-vars */
import React, {useState} from 'react';
//import { fade, makeStyles, useTheme } from '@material-ui/core/styles';
import  makeStyles  from '@mui/styles/makeStyles';
import { connect } from "react-redux";
// import * as jsonCall from "../../Algorithms/JSONCall";
//import Button from 'react-bootstrap/Button';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
// import Portals from './Portals';
import Grid from '@mui/material/Grid';
import _ from 'lodash';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FormControlLabel, Radio } from '@mui/material';
//import styles from '../../../App.css'
//import styles from './foo.OptionsSelection.css'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ModelsSelectionOptions from './ModelsSelectionOptions';
import VariablesSelectionOptions from './VariablesSelectionOptions';



const useStyles = makeStyles((theme) => ({
  portalpop:{
    boxShadow:"none",
    borderRadius:"0 0 10px 10px",
    //top:"48px!important",
    border:"1px solid grey",
    borderTop:"none",
    padding:"20px",
    //maxWidth:"95vw !important",
    width: "100vw !important",
    height:'28vh !important',
    backgroundColor:"#F2F2F2 !important",
  },
}));

export function  OptionsSelection(props) {
  // use props to get the variables from reducer
  const classes = useStyles();
  const [anchorEl_pop, setAnchorEl_pop] = React.useState(null);
  const handlePopoverClick = (event) => {
    setAnchorEl_pop(event.currentTarget);
  };
  const handlePopoverClose = () => {
    setAnchorEl_pop(null);
  };
  const open = Boolean(anchorEl_pop);
  const id = open ? 'simple-popover' : undefined;
  
return (
    <div>
  <Button style={{ backgroundColor: (props.color_buttons)["general"], opacity: 1, borderRadius: 3, color: "black", border:0, marginLeft: 1, marginRight:8, marginTop:8 }}
            onClick={handlePopoverClick}
          >Select Options</Button>

        <Popover 
        classes={{paper:classes.portalpop}}
        // style={{boxShadow:"none", maxWidth:"100vw",maxHeight:"15vh", borderRadius:"0 0 10px 10px", border:"1px solid grey", padding:"20px", backgroundColor:"#F2F2F2", marginTop:"6vh"}}
        id={id} open={open} anchorEl={anchorEl_pop} onClose={handlePopoverClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center',}} transformOrigin={{vertical: 'top', horizontal: 'center',}}>
            <Grid container>
                <Grid item xs={3}><ModelsSelectionOptions></ModelsSelectionOptions></Grid>
                <Grid item xs={9}><VariablesSelectionOptions></VariablesSelectionOptions></Grid>
            </Grid>
        </Popover>
  </div>
    
  );
 
}

const maptstateToprop = (state) => {
  return {
      url: state.url,      
      color_buttons: state.color_buttons,
  }
}
const mapdispatchToprop = (dispatch) => {
  return {
      set_attributes_of_interest_temp: (val) => dispatch({ type: "attributes_of_interest_temp", value: val }),
      
  }
}

export default connect(maptstateToprop, mapdispatchToprop)(OptionsSelection);