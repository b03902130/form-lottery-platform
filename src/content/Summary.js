import React, {Component} from 'react';
import Plot from 'react-plotly.js';
import {Panel, ListGroup, ListGroupItem} from 'react-bootstrap'

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
    return (
      this.state.form ?
      <div style={{width: "80%", padding: "30px", margin: "auto"}}>
        <h1>{this.state.form.title}</h1>
        <h3>{this.state.form.description}</h3>
          {
            this.range(this.state.form.questions.length).map(index => {
              var question = this.state.form.questions[index]
              if (question.question_type !== "text") {
                const mapping = {'A': 0, 'B': 1, 'C': 2, 'D': 3}
                let values = [0, 0, 0, 0]
                for (let answer of this.state.answers) {
                  values[mapping[answer.answers[index]]] += 1
                }
                var data = [{
                  values: values,
                  labels: ['A', 'B', 'C', 'D'],
                  type: 'pie'
                }];
                var layout = {
                  height: 400,
                  width: 500
                };
              }
              return (
                <div key={'panel' + index}>
                  <Panel>
                    <Panel.Heading>{question.question_text}</Panel.Heading>
                      {
                        question.question_type === "text" ? 
                          <ListGroup>
                              {
                                this.state.answers.map(answer =>
                                  <ListGroupItem>{answer.answers[index]}</ListGroupItem>
                                )
                              }
                          </ListGroup>
                        :
                          <Plot data={data} layout={layout} />
                      }
                    <Panel.Body>Some more panel content here.</Panel.Body>
                  </Panel>
                </div>
              )
            })
          }
      </div>    
      :
      <p>Loading...</p>
    );
  }
}

export default Summary;

