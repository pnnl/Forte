/* eslint-disable no-unused-vars */
import React, {Component} from 'react';
import { connect } from "react-redux";
import { Navbar, Nav, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import TimeSelection from './appbarOptions/TimeSelection';
import UpdateButton from './appbarOptions/UpdateButton';
import SolarPenetrationOption from './appbarOptions/SolarPenetrationOption';
import SeasonSelector from './appbarOptions/SeasonSelector';



export class  SearchAppBar extends Component {
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
var break_character = <div><br /></div>
return (

<Navbar bg="light" variant="light" sticky="top" expand="lg">
  <Container style={{margin:0}}>
    <Navbar.Brand ><b>kPF-AE-LSTM</b></Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav  className="me-auto">
        {/* <Nav.Item style={{opacity:(this.props.isLoadingUpdate)?0.4:1}}><GranularitySelectionInitial location={"appbar"}></GranularitySelectionInitial></Nav.Item> */}
        <Nav.Item><TimeSelection></TimeSelection></Nav.Item>
        <Nav.Item style={{opacity:(this.props.isLoadingUpdate)?0.4:1}}>
        <SolarPenetrationOption></SolarPenetrationOption>
        </Nav.Item>
        {(this.props.enable_seasons_flag)?<Nav.Item style={{opacity:(this.props.isLoadingUpdate)?0.4:1}}>
        <SeasonSelector></SeasonSelector>
        </Nav.Item>:null}
        <Nav.Item style={{opacity:(this.props.isLoadingUpdate)?1:1}}>
        <UpdateButton></UpdateButton>
        </Nav.Item>
       
      </Nav>
    </Navbar.Collapse>
  </Container>
</Navbar>
    
  );
 } //return ends
}

const maptstateToprop = (state) => {
  return {
    blank_placeholder: state.blank_placeholder,
    enable_seasons_flag: state.enable_seasons_flag,
    
  }
}
const mapdispatchToprop = (dispatch) => {
  return {
      set_blank_placeholder: (val) => dispatch({ type: "blank_placeholder", value: val }),
    
  }
}

export default connect(maptstateToprop, mapdispatchToprop)(SearchAppBar);

/* export default function SearchAppBar() {
  //const classes = useStyles();
  return (
    

<Navbar bg="light" variant="light" sticky="top" expand="lg">
  <Container style={{margin:0}}>
    <Navbar.Brand ><b>PRIVEE</b></Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav  className="me-auto">
        <Nav.Item>
        Individual Dataset
        </Nav.Item>
        <Nav.Item>
        Aggregated Dataset
        </Nav.Item>
        <Nav.Item>
        <Nav.Link href="" >Aggregated Datasets</Nav.Link>
        </Nav.Item>
        
      </Nav>
    </Navbar.Collapse>
  </Container>
</Navbar>
    
  );
} */