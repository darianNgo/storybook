import React, { Component } from 'react'
import Stories from './stories'

import withStyles from '@material-ui/core/styles/withStyles';
import Slide from '@material-ui/core/Slide';

import axios from 'axios';
import { authMiddleWare } from '../util/auth';

const styles = ((theme) => ({
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    	},
    })
);


class exploreStories extends Component {
	constructor(props) {
		super(props);

		this.state = {
			stories: '',
		};

		this.handleViewOpen = this.handleViewOpen.bind(this);
	}

	handleChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value
		});
	};

	componentWillMount = () => {
		authMiddleWare(this.props.history);
		const authToken = localStorage.getItem('AuthToken');
		axios.defaults.headers.common = { Authorization: `${authToken}` };
		axios
			.get('/stories')
			.then((response) => {
				this.setState({
					stories: response.data,
					uiLoading: false
				});
			})
			.catch((err) => {
				console.log(err);
			});
	};

	handleViewOpen(data) {
		this.setState({
			title: data.story.title,
			userName: data.story.username,
			body: data.story.body,
			viewOpen: true
		});
	}

	render() {
		return (
			<Stories
				stories={this.state.stories}
				isEditable={false}
				>
			</Stories>
		);
	}
}

export default (withStyles(styles)(exploreStories));