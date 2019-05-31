import React, {Component} from 'react';

import Axios from 'axios';
Axios.defaults.withCredentials = true;

class Home extends Component {
  render() {
    return (
      <div>
        <h1>Homepage</h1>
        <a href='http://linux1.csie.ntu.edu.tw:8080/api/account/logout'>logout</a>
      </div>
    );
  }
}

export default Home;
