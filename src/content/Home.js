import React, {Component} from 'react';
import {BrowserRouter, Switch, Route, Link, NavLink} from 'react-router-dom';
import {Button, group,Grid,Row,Col, PageHeader} from 'react-bootstrap'; 

import FormCreate from '../content/FormCreate';
import FillForm from '../content/FillForm';

import Axios from 'axios';
Axios.defaults.withCredentials = true;

class Unfilled extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const items = []
    for (const [index, value] of this.props.FormList.entries()){
      var route = '/forms/'+ value['id']
      items.push(
        <ul class="list-group"> 
          <li class="list-group-item">
            <Link to= {route}> <h3>{value['title']}</h3> </Link>
          </li>
      </ul>
       )
    }
    
    return (  
      <div class="panel panel-primary ">
        <div class="panel-heading">
          <h3 class="panel-title">
              未填
          </h3>
        </div>
          <div class="panel-body">
             {items}
          </div>
      </div>
    );
  }
}

class Filled extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const items = []
    for (const [index, value] of this.props.FormList.entries()){
      items.push(
        <ul class="list-group"> 
          <h3 class="list-group-item">
            {value['title']}
          </h3>
        </ul>
       )
    }
    
    return (  
      <div class="panel panel-success ">
        <div class="panel-heading">
          <h3 class="panel-title">
              已填
          </h3>
        </div>
          <div class="panel-body">
             {items}
          </div>
      </div>
    );
  }
}

class Due extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const items = []
    for (const [index, value] of this.props.FormList.entries()){
      items.push(
        <ul class="list-group-item"> 
          <h3 style={{height: "1em", fontWeight: "900"}} class="list-group-title">
            {value['title']}
          </h3>
        </ul>
      )
      items.push(
        <li class="list-group-item">
          { value['winners'].map(winner => <span style={{display: 'inline-block', margin: '0 20px', fontSize: '18px'}}>{winner}</span>) }
        </li>
      )
    }
    
    return (  
      <div class="panel panel-warning ">
        <div class="panel-heading">
          <h3 class="panel-title">
              已開獎
          </h3>
        </div>
        <div class="panel-body">
           {items}
        </div>
      </div>
    );
  }
}

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dueList : [],
      filledList : [],
      unfilledList : []
    };
  }
  
  componentDidMount() {
    Axios.get(`${window.BACKEND}/api/forms`)
      .then(response => {
        this.setState({
          dueList: response.data.due,
          filledList: response.data.filled,
          unfilledList: response.data.unfilled
        });
      }).catch(err => {
        alert('Something wrong in Home.js')
      })
  }
  
  render() {
    return (
     <Grid>
        <Row>
          <Col><PageHeader>問卷填答系統</PageHeader></Col>
        </Row>
        <Row>
          <Col><Unfilled FormList={this.state.unfilledList}/></Col>
          <Col><Filled FormList={this.state.filledList}/></Col>
          <Col><Due FormList={this.state.dueList}/></Col>
        </Row>
        <Row>
        <Col>
        <Link to='/forms/new'>
          <button type="button" class="btn btn-primary btn-block">
            <h3> 創建問卷 </h3>
          </button>
        </Link>
        </Col>
        </Row>
      </Grid>
    );
  }
}

export default Home;
