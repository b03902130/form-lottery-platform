import React, {Component} from 'react';

import Axios from 'axios';
Axios.defaults.withCredentials = true;

class Home extends Component {
  render() {
    return (
      <div>
        <h1>Homepage</h1>
      </div>
    );
  }
}

export default Home;
