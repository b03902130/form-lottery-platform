import React, {Component} from 'react';

import Axios from 'axios';
Axios.defaults.withCredentials = true;

class Dashboard extends Component {
  render() {
    return (
      <div>
        <h1>Dashboard</h1>
      </div>
    );
  }
}

export default Dashboard;
