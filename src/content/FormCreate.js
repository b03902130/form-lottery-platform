import React, { Component } from 'react';
import {
  FormGroup,
  FormControl,
  ControlLabel,
  FormLabel,
  Button,
  Alert,
  Form,
  Grid,
  Row,
  Col,
  Tabs,
  Tab,
  Panel,
  PageHeader
} from 'react-bootstrap';

import Axios from 'axios';
Axios.defaults.withCredentials = true;


class CreateForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isGoing: true,
      numberOfGuests: 2,
      formTitle: "Example Form Title",
      formDescription: "Example Form Description",
      numQuestions: 1,
      listQuestions: [],
      newQuestion: "Example Question",
      newQuestionType: "text"
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.addQuestion = this.addQuestion.bind(this);
    this.handelSubmit = this.handleSubmit.bind(this);
    this.delQuestion = this.delQuestion.bind(this);
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit = (event) => {
    const title = this.state.formTitle;
    const description = this.state.formDescription;
    const listQuestions = this.state.listQuestions;
    Axios.post(window.BACKEND + '/api/forms/', { title: title, description: description, questions: listQuestions })
      .then(json => {
        alert("成功新增表單");
        this.props.history.push('/dashboard')
      })
      .catch(err => {
        alert("尷尬...");
      })
  }

  addQuestion = (event) => {
    const target = event.target;
    //const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    const listQuestions = this.state.listQuestions.slice();
    //alert(this.state.newQuestion, this.state.newQuestionType);
    listQuestions.push({ 'question_text': this.state.newQuestion, 'question_type': this.state.newQuestionType });
    this.setState({ listQuestions: listQuestions });
  }

  delQuestion = (event) => {
    const target = event.target;
    //const value = target.type === 'checkbox' ? target.checked : target.value;
    const q_name = target.value;
    const idx = parseInt(q_name.split("_")[1])
    alert('刪除問題: ' + idx);
    const listQuestions = this.state.listQuestions.slice();
    listQuestions.splice(idx, 1);
    this.setState({ listQuestions: listQuestions });

  }

  render() {
    //const elements = ['one', 'two', 'three'];
    const items = []
    for (const [index, value] of this.state.listQuestions.entries()) {
      const q_name = "Q_" + index;
      if (value['question_type'] === "select") {
        items.push(
          <div>
            <Panel>
              <Panel.Heading><Panel.Title componentClass="h3">第{index + 1}題</Panel.Title> <Button type="button" bsStyle="danger" value={q_name} className="new" onClick={this.delQuestion}>X 刪除這題</Button></Panel.Heading>
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
              <Panel.Heading><Panel.Title componentClass="h3">第{index + 1}題</Panel.Title>  <Button type="button" bsStyle="danger" value={q_name} className="new" onClick={this.delQuestion}>X 刪除這題</Button></Panel.Heading>
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

      <Grid>
        <Row>
          <Col xs={12} md={12}>
            <PageHeader>
              新增問卷<small></small>
            </PageHeader>
            <Panel bsStyle="info">
              <Panel.Heading>
                <Panel.Title componentClass="h3">問卷設定</Panel.Title>
              </Panel.Heading>
              <Panel.Body>
                
                  <FormGroup controlId="">
                    <Col xs={12} md={4}>
                      <ControlLabel>問卷標題</ControlLabel>
                    </Col>
                    <Col xs={12} md={6}>
                      <FormControl name="formTitle"
                        type="text"
                        value={this.state.formTitle}
                        onChange={this.handleInputChange} />
                    </Col>
                  </FormGroup>
                  <FormGroup controlId="">
                    <Col xs={12} md={4}>
                      <ControlLabel>問卷說明</ControlLabel>
                    </Col>
                    <Col xs={12} md={6}>
                      <FormControl name="formDescription"
                        type="text"
                        value={this.state.formDescription}
                        onChange={this.handleInputChange} />
                    </Col>
                  </FormGroup>
                  </Panel.Body>
              </Panel>
              {items}
              <Panel bsStyle="warning">
              <Panel.Heading>
                <Panel.Title componentClass="h3">+新問題</Panel.Title>
              </Panel.Heading>
              <Panel.Body>
                  <FormGroup controlId="">
                    <Col xs={12} md={4}>
                      <ControlLabel>敘述</ControlLabel>
                    </Col>
                    <Col xs={12} md={6}>
                      <FormControl name="newQuestion"
                        componentClass="textarea"
                        value={this.state.newQuestion}
                        onChange={this.handleInputChange} />
                    </Col>
                  </FormGroup>
                  <FormGroup controlId="">
                    <Col xs={12} md={4}>
                      <ControlLabel>題型</ControlLabel>
                    </Col>
                    <Col xs={12} md={6}>
                      <FormControl componentClass="select" name="newQuestionType" value={this.state.newQuestionType} onChange={this.handleInputChange}>
                        <option value="text">簡答題</option>
                        <option value="select">單選題</option>
                      </FormControl>
                    </Col>
                  </FormGroup>
                  <Button type="button" className="new" onClick={this.addQuestion}>新增問題</Button>
                  
                </Panel.Body>
            </Panel>
            <Button type="submit" value="submit" onClick={this.handleSubmit}>完成~新增問卷!</Button>
          </Col>
          
        </Row>
      </Grid>



      // <form method="post" onSubmit={this.handleSubmit} >
      //   {/* <label>
      //       Is going:
      //       <input
      //         name="isGoing"
      //         type="checkbox"
      //         checked={this.state.isGoing}
      //         onChange={this.handleInputChange} />
      //     </label>
      //     <br />
      //     <label>
      //       Number of guests:
      //       <input
      //         name="numberOfGuests"
      //         type="number"
      //         value={this.state.numberOfGuests}
      //         onChange={this.handleInputChange} />
      //     </label> */}
      //   <label>
      //     New Question:
      //           <input
      //       name="formTitle"
      //       type="text"
      //       value={this.state.formTitle}
      //       onChange={this.handleInputChange} />
      //   </label>

      //   <label>
      //     New Question:
      //       <input
      //       name="formDescription"
      //       type="text"
      //       value={this.state.formDescription}
      //       onChange={this.handleInputChange} />
      //   </label>

      //   <label>
      //     New Question:
      //       <input
      //       name="newQuestion"
      //       type="text"
      //       value={this.state.newQuestion}
      //       onChange={this.handleInputChange} />
      //   </label>
      //   <label>
      //     Question Type:
      //         <select name="newQuestionType" value={this.state.newQuestionType} onChange={this.handleInputChange}>
      //       <option value="text">簡答題</option>
      //       <option value="select">單選題</option>
      //     </select>
      //   </label>
      //   <button type="button" className="new" onClick={this.addQuestion}>
      //     新增問題
      //     </button>

      //   {items}
      //   <button type="submit" value="submit">
      //     新增問卷
      //     </button>
      // </form>
    );
  }
}



export default CreateForm;
