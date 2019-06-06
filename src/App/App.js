import React, { Component } from 'react';
import {BrowserRouter, Switch, Route, Link} from 'react-router-dom';

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
import Home from '../content/Home';
import Dashboard from '../content/Dashboard'; 
import FormCreate from '../content/FormCreate';

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
    Axios.get(window.BACKEND + '/api/account/verify')
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
    Axios.get(window.BACKEND + '/api/account/logout')
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
    let logoutlink = `${window.BACKEND}/api/account/logout`
    return (
      <div className="App">
        <BrowserRouter> {this.state.loggedIn ?
            <div>
              <Link to='/'>Home</Link>
              <Link to='/dashboard'>Dashboard</Link>
              <a href={logoutlink}>logout</a>
              <Switch>
                <Route exact path='/' component={Home} />
                <Route exact path='/dashboard' component={Dashboard} />
                <Route exact path='/forms/new' component={FormCreate} />
              </Switch>
            </div>
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
                <Col xs={12} md={8}>
                  <div className="popularForms">
                    <p>form 1</p>
                    <p>form 2</p>
                    <p>form 3</p>
                    <p>form 4</p>
                  </div>
                </Col>
              </Row>
              </Grid>}
            </BrowserRouter>
          </div>
    );
  }
}

export default App;
