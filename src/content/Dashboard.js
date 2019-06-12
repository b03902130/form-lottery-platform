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

import FormPreview from './FormPreview';

Axios.defaults.withCredentials = true;

class Dashboard extends React.Component {
  constructor(props) {
	super(props);
	this.state = {
		preview_list: [],
	};
  }

  componentDidMount() {
	Axios.get(window.BACKEND + '/api/forms/my/', {})
		.then(json => {
			let data = json.data
			console.log(data);

			let preview_list = [];

			for (let item of data.form) {
				preview_list.push({'form_id': item._id, 'title': item.title, "description": item.description, "has_drawn": item.isDue, "winners": item.winners})
			}

			console.log(preview_list)

			this.setState({
				preview_list: preview_list,
			});
		})
		.catch(err => {
			alert('尷尬...')
		});
  }

  render() {
	let items = [];
	for (let entry of this.state.preview_list) {
		items.push(
			<FormPreview value={entry}>
			</FormPreview>
		);
  }

	return (
		<Grid>
			<PageHeader> 我的問卷 </PageHeader>
				{items}
		</Grid>
	);
  }
}

export default Dashboard;
