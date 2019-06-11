import React, {Component} from 'react';
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup';
import Plot from 'react-plotly.js';

import Axios from 'axios';
Axios.defaults.withCredentials = true;

class Summary extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    Axios.get(`${window.BACKEND}/api/forms/${this.props.match.params.FormId}/summary`)
      .then(response => {
        let form = response.data.form
        let answers = response.data.answers
        console.log(form)
        console.log(answers)
        this.setState({form, answers})
      })
      .catch(err => {
        alert('ERROR in Summary.js')
      })
  }

  range = n => Array.from(Array(n).keys())

  render() {
    var data = [{
      values: [150, 26, 55],
      labels: ['Residential', 'Non-Residential', 'Utility'],
      type: 'pie'
    }];
    var layout = {
      height: 400,
      width: 500
    };
    return (
      this.state.form ?
      <div>
        <h1>{this.state.form.title}</h1>
        <h3>{this.state.form.description}</h3>
          {
            this.range(this.state.form.questions.length).map(index => 
              <Card style={{ width: '18rem' }}>
                <Card.Header>Featured</Card.Header>
                <ListGroup variant="flush">
                  <ListGroup.Item>Cras justo odio</ListGroup.Item>
                  <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
                  <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
                </ListGroup>
              </Card>
            )
          }
            </div>
      :
      <p>Loading...</p>
    );
  }
}

export default Summary;

