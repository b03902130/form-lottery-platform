import React, { Component } from 'react';
import './App.css';
import { 
  Grid, 
  Row,
  Col,
  Tabs,
  Tab,
} from 'react-bootstrap'; 
import SignUp from '../signup/signup';
import LogIn from '../login/login';
import RESTAPIUrl from '../config/config';
import Axios from 'axios';
Axios.defaults.withCredentials = true;


class App extends Component { 
  constructor( props, context) {
    super(props, context);

    this.stateChanger = this.stateChanger.bind(this);
    this.logOutClicked = this.logOutClicked.bind(this);

    this.state = {
      loggedIn: false,
      logOutButtonStatus: 'warning',
      logOutLoadingMessage: 'Log Out',
      logOutLoading: false,
    }
  }

  stateChanger(newState) {
    this.setState(newState);
  }

  componentDidMount() {
    // Verify session
    Axios.get( RESTAPIUrl + '/api/account/verify')
      .then(json => {
        json = json.data
        if (json.success) {
          this.setState({
            logOutLoading: false,
            loggedIn: true,
          });
        } else {
          this.setState({
            logOutLoading: false,
          });
        }
      });
  } 

  logOutClicked() {
    this.setState({
      logOutLoading: true,
      logOutLoadingMessage: 'Logging Out...',
      logOutButtonStatus: 'info',
    });
    // Verify session
    Axios.get(RESTAPIUrl + '/api/account/logout')
      .then(json => {
        json = json.data
        if (json.success) {
          this.setState({
            logOutLoading: false,
            loggedIn: false,
          });
        } else {
          this.setState({
            logOutLoading: false,
          });
        }
      });
  }  


  render() {
    return (
      <div className="App">
          {this.state.loggedIn ? 
            <h1>You are logged in</h1>
            :
            <Grid>
              <Row>
                <Col xs={12} md={4}>
                    <div className = "loginBoxContainer">
                      <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
                        <Tab eventKey={1} title="Login" className="tabContent">
                          <LogIn stateChanger = {this.stateChanger}/>
                        </Tab>
                        <Tab eventKey={2} title="Sign Up" className="tabContent">
                          <SignUp />
                        </Tab>
                      </Tabs>
                      </div>
                </Col>
                <Col md={8}>
                    <p>form 1</p>
                    <p>form 2</p>
                    <p>form 3</p>
                    <p>form 4</p>
                </Col>
              </Row>
            </Grid>
          }
      </div>
    );
  }
}

export default App;
