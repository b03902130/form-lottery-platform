import React, {Component} from 'react';
import {Link} from 'react-router-dom';
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

class FormPreview extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			has_drawn: this.props.value.has_drawn,
			winners: this.props.value.winners,
			exist: true,
      form_id: this.props.value.form_id
		};
	}

	handleDeleteRequest = (event) => {
		let form_id = this.props.value.form_id;
		Axios.post(window.BACKEND + '/api/forms/' + form_id + '/delete/')
			.then(json => {
				// alert("good");
				this.setState({
          exist: false,
				})
			})
			.catch(err => {
				alert('ggg...');
			});
	}

	handleDrawRequest = (event) => {
		let form_id = this.props.value.form_id;
		Axios.get(window.BACKEND + '/api/forms/' + form_id + '/due/', {})
			.then(json => {
				// alert("��𣂼��𡂝���");
				let data = json.data;

				this.setState({
					has_drawn: true,
          winners: data.winners,
				});

			})
			.catch(err => {
				alert('ggg,..')
			});
	}

	render() {
		let brief_description = (this.props.value.description.length > max_char_cnt) ? this.props.value.description.substring(0, max_char_cnt) + '...': this.props.value.description;
		let hyperlink = 'forms/' + this.props.value.form_id;
		if (!this.state.exist) {
			return (
				<div/>
			);
		}
		if (!this.state.has_drawn) {
			return (
				<Panel bsStyle="info">
					<Panel.Heading>
						<Panel.Title componentClass="h3"> <Link to={hyperlink}>{this.props.value.title}</Link> </Panel.Title>
					</Panel.Heading>
					<Panel.Body>
						<FormGroup>
							<Col xs={12} sm={4} md={4}>
								<ControlLabel> 說明 </ControlLabel>
							</Col>

							<Col xs={12} sm={6} md={6}>
								<ControlLabel> {brief_description} </ControlLabel>
							</Col>
						</FormGroup>
            {
              this.state.form_id && <Link to={'/forms/' + this.state.form_id + '/summary'}>統計</Link>
            }
						<Button bsStyle="danger" bsSize="small" onClick={this.handleDeleteRequest}>刪除</Button>
          </Panel.Body>
					<Button bsStyle="success" onClick={this.handleDrawRequest} block>抽獎</Button>
				</Panel>
			);
		} else {
			return (
				<Panel bsStyle="info">
					<Panel.Heading>
						<Panel.Title componentClass="h3"> <Link to={hyperlink}>{this.props.value.title}</Link> </Panel.Title>
					</Panel.Heading>
					<Panel.Body>
						<FormGroup>
							<Col xs={12} sm={4} md={4}>
								<ControlLabel> 說明 </ControlLabel>
							</Col>

							<Col xs={12} sm={6} md={6}>
								<ControlLabel> {brief_description} </ControlLabel>
							</Col>
						</FormGroup>

						<FormGroup>
							<Col xs={12} sm={4} md={4}>
								<ControlLabel> 中獎者 </ControlLabel>
							</Col>

							<Col xs={12} sm={6} md={6}>
                <ControlLabel> 
                    {
                      this.state.winners.map(winner => (
                        <span style={{display: 'inline-block', margin: '0 5px'}}>{winner}</span>
                      ))
                    }
                </ControlLabel>
							</Col>
						</FormGroup>
            {
              this.state.form_id && <Link to={'/forms/' + this.state.form_id + '/summary'}>統計</Link>
            }
						<Button bsStyle="danger" bsSize="small" onClick={this.handleDeleteRequest}>刪除</Button>
					</Panel.Body>
				</Panel>
			);
		}
	}
}

export const max_char_cnt = 10;
export default FormPreview;
