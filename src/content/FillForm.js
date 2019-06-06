import React, { Component } from 'react';
import {
  FormGroup,
  FormControl,
  ControlLabel,
  PageHeader,
  Panel,
  FormLabel,
  Button,
  Alert,
  Form,
  Grid,
  Row,
  Col,
  Tabs,
  Tab,
} from 'react-bootstrap';

import Axios from 'axios';
Axios.defaults.withCredentials = true;


class FillForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isGoing: true,
      numberOfGuests: 2,
      formTitle: "Sample Title",
      formDescription: "Sample Form Description",
      listAnswers: [],
      listQuestions: [{ 'question_text': '1+1=?', 'question_type': 'text' }, { 'question_text': '2+2=? A: 4 B:5 C:6 D:7', 'question_type': 'select' }],
    };
    
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleInputChangeForm = this.handleInputChangeForm.bind(this);
    //this.addQuestion = this.addQuestion.bind(this);
    this.handelSubmit = this.handleSubmit.bind(this);
    //this.delQuestion = this.delQuestion.bind(this);
  }

  componentDidMount() {
    Axios.get(window.BACKEND + '/api/forms/' + this.props.match.params.FormId)
      .then(json => {
        json = json.data
        //parse data
        let listQuestions = json.questions
        let listAnswers = [];
        for (const [index, value] of listQuestions.entries()){
          listAnswers.push([{'question_id': 'Q_'+index, 'answer': ''}]);
        }
        this.setState({
          listAnswers: listAnswers,
          listQuestions: listQuestions,
          formTitle: json.title,
          formDescription: json.description,
        });
      })
      .catch(err => {
        alert('尷尬...')
      })
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  handleInputChangeForm = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    const idx = parseInt(name.split("_")[1]);
    //alert(idx);
    this.setState({
      [name]: value
    });
    const listAnswers = this.state.listAnswers.slice();
    listAnswers[idx]['answer'] = value;
    this.setState({ listAnswers: listAnswers });

  }

  handleSubmit = (event) => {
    const FormId = this.props.match.params.FormId;
    let listAnswers = this.state.listAnswers;
    let listAnswers_organize = listAnswers.map(answerObj => answerObj.answer)
    Axios.post(window.BACKEND + '/api/forms/' + FormId, { answers: listAnswers_organize })
      .then(json => {
        alert("成功填寫表單");
        this.props.history.push('/home')
      })
      .catch(err => {
        alert('尷尬...')
      })
  }

  summary = (event) => {
    let fullUrl = `${window.BACKEND}/api/forms/${this.props.match.params.FormId}/summary`
    Axios.get(fullUrl)
      .then(json => {
        console.log(json.data)
      })
      .catch(err => {
        alert('Something wrong')
      })
  }

  render() {
    const elements = ['one', 'two', 'three'];
    const items = []

    for (const [index, value] of this.state.listQuestions.entries()) {
      const q_name = "Q_" + index;
      if (value['question_type'] === "select") {
        items.push(
          <div>
            <Panel>
              <Panel.Heading><Panel.Title componentClass="h3">第{index + 1}題</Panel.Title></Panel.Heading>
              <Panel.Body>{value['question_text']}</Panel.Body>
              <Panel.Footer>
              <FormControl componentClass="select" 
                name={q_name} 
                //value={this.state.listAnswers[index]['answer']} 
                onChange={this.handleInputChangeForm}>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </FormControl>
              </Panel.Footer>
            </Panel>
          </div>
        );
      } else if (value['question_type'] === "text") {
        items.push(

          <div>
            <Panel>
              <Panel.Heading><Panel.Title componentClass="h3">第{index + 1}題</Panel.Title></Panel.Heading>
              <Panel.Body>{value['question_text']}</Panel.Body>
              <Panel.Footer>
              <FormControl name={q_name}
                type="text"
                //value={this.state.listAnswers[index]['answer']}
                onChange={this.handleInputChangeForm} />
              </Panel.Footer>
            </Panel>
          </div>
        );
      }
    }

    return (
      <div>
      <button type="button" onClick={this.summary}>summary</button>
      <Grid>
        <Row>
          <Col xs={12} md={12}>
            <PageHeader>
              {this.state.formTitle} <small></small>
            </PageHeader>
            <Panel>
              <Panel.Body>{this.state.formDescription}</Panel.Body>
            </Panel>
              {items}
              <Button type="submit" value="submit" onClick={this.handleSubmit}>我填完了!</Button>
          </Col>
        </Row>
      </Grid>
      </div>
    );
  }
}



export default FillForm;
