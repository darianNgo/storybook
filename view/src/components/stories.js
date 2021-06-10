// import React, { Component } from 'react'

// import withStyles from '@material-ui/core/styles/withStyles';
// import Typography from '@material-ui/core/Typography';
// import Button from '@material-ui/core/Button';
// import Dialog from '@material-ui/core/Dialog';
// import AddCircleIcon from '@material-ui/icons/AddCircle';
// import AppBar from '@material-ui/core/AppBar';
// import Toolbar from '@material-ui/core/Toolbar';
// import IconButton from '@material-ui/core/IconButton';
// import CloseIcon from '@material-ui/icons/Close';
// import Slide from '@material-ui/core/Slide';
// import TextField from '@material-ui/core/TextField';
// import Grid from '@material-ui/core/Grid';
// import Card from '@material-ui/core/Card';
// import CardActions from '@material-ui/core/CardActions';
// import CircularProgress from '@material-ui/core/CircularProgress';
// import CardContent from '@material-ui/core/CardContent';
// import MuiDialogTitle from '@material-ui/core/DialogTitle';
// import MuiDialogContent from '@material-ui/core/DialogContent';

// import axios from 'axios';
// import dayjs from 'dayjs';
// import relativeTime from 'dayjs/plugin/relativeTime';
// import { authMiddleWare } from '../util/auth';

// const styles = ((theme) => ({
//     content: {
//         flexGrow: 1,
//         padding: theme.spacing(3),
//     },
//     toolbar: theme.mixins.toolbar,
//     title: {
// 		marginLeft: theme.spacing(2),
// 		flex: 1
// 	},
// 	submitButton: {
// 		display: 'block',
// 		color: 'white',
// 		textAlign: 'center',
// 		position: 'absolute',
// 		top: 14,
// 		right: 10
// 	},
// 	floatingButton: {
// 		position: 'fixed',
// 		bottom: 0,
// 		right: 0
// 	},
// 	form: {
// 		width: '98%',
// 		marginLeft: 13,
// 		marginTop: theme.spacing(3)
// 	},
// 	toolbar: theme.mixins.toolbar,
// 	root: {
// 		minWidth: 470
// 	},
// 	bullet: {
// 		display: 'inline-block',
// 		margin: '0 2px',
// 		transform: 'scale(0.8)'
// 	},
// 	pos: {
// 		marginBottom: 12
// 	},
// 	uiProgess: {
// 		position: 'fixed',
// 		zIndex: '1000',
// 		height: '31px',
// 		width: '31px',
// 		left: '50%',
// 		top: '35%'
// 	},
// 	dialogeStyle: {
// 		maxWidth: '50%'
// 	},
// 	viewRoot: {
// 		margin: 0,
// 		padding: theme.spacing(2)
// 	},
// 	closeButton: {
// 		position: 'absolute',
// 		right: theme.spacing(1),
// 		top: theme.spacing(1),
// 		color: theme.palette.grey[500]
// 	}
//     })
    
// );

// const Transition = React.forwardRef(function Transition(props, ref) {
// 	return <Slide direction="up" ref={ref} {...props} />;
// });

// class stories extends Component {
// 	constructor(props) {
// 		super(props);

// 		this.state = {
// 			stories: '',
// 			title: '',
// 			body: '',
// 			storyId: '',
// 			errors: [],
// 			open: false,
// 			uiLoading: true,
// 			buttonType: '',
// 			viewOpen: false
// 		};

// 		this.deleteStoryHandler = this.deleteStoryHandler.bind(this);
// 		this.handleEditClickOpen = this.handleEditClickOpen.bind(this);
// 		this.handleViewOpen = this.handleViewOpen.bind(this);
// 	}

// 	handleChange = (event) => {
// 		this.setState({
// 			[event.target.name]: event.target.value
// 		});
// 	};

// 	componentWillMount = () => {
// 		authMiddleWare(this.props.history);
// 		const authToken = localStorage.getItem('AuthToken');
// 		axios.defaults.headers.common = { Authorization: `${authToken}` };
// 		axios
// 			.get('/stories')
// 			.then((response) => {
// 				this.setState({
// 					stories: response.data,
// 					uiLoading: false
// 				});
// 			})
// 			.catch((err) => {
// 				console.log(err);
// 			});
// 	};

// 	deleteStoryHandler(data) {
// 		authMiddleWare(this.props.history);
// 		const authToken = localStorage.getItem('AuthToken');
// 		axios.defaults.headers.common = { Authorization: `${authToken}` };
// 		let storyId = data.story.storyId;
// 		axios
// 			.delete(`story/${storyId}`)
// 			.then(() => {
// 				window.location.reload();
// 			})
// 			.catch((err) => {
// 				console.log(err);
// 			});
// 	}

// 	handleEditClickOpen(data) {
// 		this.setState({
// 			title: data.story.title,
// 			body: data.story.body,
// 			storyId: data.story.storyId,
// 			buttonType: 'Edit',
// 			open: true
// 		});
// 	}

// 	handleViewOpen(data) {
// 		this.setState({
// 			title: data.story.title,
// 			body: data.story.body,
// 			viewOpen: true
// 		});
// 	}

// 	render() {
// 		const DialogTitle = withStyles(styles)((props) => {
// 			const { children, classes, onClose, ...other } = props;
// 			return (
// 				<MuiDialogTitle disableTypography className={classes.root} {...other}>
// 					<Typography variant="h6">{children}</Typography>
// 					{onClose ? (
// 						<IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
// 							<CloseIcon />
// 						</IconButton>
// 					) : null}
// 				</MuiDialogTitle>
// 			);
// 		});

// 		const DialogContent = withStyles((theme) => ({
// 			viewRoot: {
// 				padding: theme.spacing(2)
// 			}
// 		}))(MuiDialogContent);

// 		dayjs.extend(relativeTime);
// 		const { classes } = this.props;
// 		const { open, errors, viewOpen } = this.state;

// 		const handleClickOpen = () => {
// 			this.setState({
// 				storyId: '',
// 				title: '',
// 				body: '',
// 				buttonType: '',
// 				open: true
// 			});
// 		};

// 		const handleSubmit = (event) => {
// 			authMiddleWare(this.props.history);
// 			event.preventDefault();
// 			const userStory = {
// 				title: this.state.title,
// 				body: this.state.body
// 			};
// 			let options = {};
// 			if (this.state.buttonType === 'Edit') {
// 				options = {
// 					url: `/story/${this.state.storyId}`,
// 					method: 'put',
// 					data: userStory
// 				};
// 			} else {
// 				options = {
// 					url: '/story',
// 					method: 'post',
// 					data: userStory
// 				};
// 			}
// 			const authToken = localStorage.getItem('AuthToken');
// 			axios.defaults.headers.common = { Authorization: `${authToken}` };
// 			axios(options)
// 				.then(() => {
// 					this.setState({ open: false });
// 					window.location.reload();
// 				})
// 				.catch((error) => {
// 					this.setState({ open: true, errors: error.response.data });
// 					console.log(error);
// 				});
// 		};

// 		const handleViewClose = () => {
// 			this.setState({ viewOpen: false });
// 		};

// 		const handleClose = (event) => {
// 			this.setState({ open: false });
// 		};

// 		if (this.state.uiLoading === true) {
// 			return (
// 				<main className={classes.content}>
// 					<div className={classes.toolbar} />
// 					{this.state.uiLoading && <CircularProgress size={150} className={classes.uiProgess} />}
// 				</main>
// 			);
// 		} else {
// 			return (
// 				<main className={classes.content}>
// 					<div className={classes.toolbar} />

// 					<IconButton
// 						className={classes.floatingButton}
// 						color="primary"
// 						aria-label="Add Story"
// 						onClick={handleClickOpen}
// 					>
// 						<AddCircleIcon style={{ fontSize: 60 }} />
// 					</IconButton>
// 					<Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
// 						<AppBar className={classes.appBar}>
// 							<Toolbar>
// 								<IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
// 									<CloseIcon />
// 								</IconButton>
// 								<Typography variant="h6" className={classes.title}>
// 									{this.state.buttonType === 'Edit' ? 'Edit Story' : 'Create a new Story'}
// 								</Typography>
// 								<Button
// 									autoFocus
// 									color="inherit"
// 									onClick={handleSubmit}
// 									className={classes.submitButton}
// 								>
// 									{this.state.buttonType === 'Edit' ? 'Save' : 'Submit'}
// 								</Button>
// 							</Toolbar>
// 						</AppBar>

// 						<form className={classes.form} noValidate>
// 							<Grid container spacing={2}>
// 								<Grid item xs={12}>
// 									<TextField
// 										variant="outlined"
// 										required
// 										fullWidth
// 										id="storyTitle"
// 										label="Story Title"
// 										name="title"
// 										autoComplete="storyTitle"
// 										helperText={errors.title}
// 										value={this.state.title}
// 										error={errors.title ? true : false}
// 										onChange={this.handleChange}
// 									/>
// 								</Grid>
// 								<Grid item xs={12}>
// 									<TextField
// 										variant="outlined"
// 										required
// 										fullWidth
// 										id="storyDetails"
// 										label="Story Details"
// 										name="body"
// 										autoComplete="storyDetails"
// 										multiline
// 										rows={25}
// 										rowsMax={25}
// 										helperText={errors.body}
// 										error={errors.body ? true : false}
// 										onChange={this.handleChange}
// 										value={this.state.body}
// 									/>
// 								</Grid>
// 							</Grid>
// 						</form>
// 					</Dialog>

// 					<Grid container spacing={2}>
// 						{this.state.stories.map((story) => (
// 							<Grid item xs={12} sm={6}>
// 								<Card className={classes.root} variant="outlined">
// 									<CardContent>
// 										<Typography variant="h5" component="h2">
// 											{story.title}
// 										</Typography>
// 										<Typography className={classes.pos} color="textSecondary">
// 											{dayjs(story.createdAt).fromNow()}
// 										</Typography>
// 										<Typography variant="body2" component="p">
// 											{`${story.body.substring(0, 65)}`}
// 										</Typography>
// 									</CardContent>
// 									<CardActions>
// 										<Button size="small" color="primary" onClick={() => this.handleViewOpen({ story })}>
// 											{' '}
// 											View{' '}
// 										</Button>
// 										<Button size="small" color="primary" onClick={() => this.handleEditClickOpen({ story })}>
// 											Edit
// 										</Button>
// 										<Button size="small" color="primary" onClick={() => this.deleteStoryHandler({ story })}>
// 											Delete
// 										</Button>
// 									</CardActions>
// 								</Card>
// 							</Grid>
// 						))}
// 					</Grid>

// 					<Dialog
// 						onClose={handleViewClose}
// 						aria-labelledby="customized-dialog-title"
// 						open={viewOpen}
// 						fullWidth
// 						classes={{ paperFullWidth: classes.dialogeStyle }}
// 					>
// 						<DialogTitle id="customized-dialog-title" onClose={handleViewClose}>
// 							{this.state.title}
// 						</DialogTitle>
// 						<DialogContent dividers>
// 							<TextField
// 								fullWidth
// 								id="storyDetails"
// 								name="body"
// 								multiline
// 								readonly
// 								rows={1}
// 								rowsMax={25}
// 								value={this.state.body}
// 								InputProps={{
// 									disableUnderline: true
// 								}}
// 							/>
// 						</DialogContent>
// 					</Dialog>
// 				</main>
// 			);
// 		}
// 	}
// }

// export default (withStyles(styles)(stories));

import React, { Component } from 'react'

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';

const styles = ((theme) => ({
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    toolbar: theme.mixins.toolbar,
    })
);

class stories extends Component {
    render() {
        const { classes } = this.props;
        return (
            <main className={classes.content}>
            <div className={classes.toolbar} />
            <Typography paragraph>
                Hello I am stories
            </Typography>
            </main>
        )
    }
}

export default (withStyles(styles)(stories));