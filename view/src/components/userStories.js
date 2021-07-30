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

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

class stories extends Component {
	constructor(props) {
		super(props);

		this.state = {
			stories: '',
		};

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
			.get('/stories/user')
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


	render() {
		return <Stories stories={this.state.stories} isEditable={true}></Stories>
	}
}

export default (withStyles(styles)(stories));
