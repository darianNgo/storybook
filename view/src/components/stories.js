import React, { Component } from 'react'

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import CardContent from '@material-ui/core/CardContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';

import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { authMiddleWare } from '../util/auth';

const styles = ((theme) => ({
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    toolbar: theme.mixins.toolbar,
    title: {
		marginLeft: theme.spacing(2),
		flex: 1
	},
	avatar: {
		height: 100,
		width: 100,
		flexShrink: 0,
		flexGrow: 0,
		marginTop: 20
	},
	submitButton: {
		display: 'block',
		color: 'white',
		textAlign: 'center',
		position: 'absolute',
		top: 14,
		right: 10
	},
	floatingButton: {
		position: 'fixed',
		bottom: 0,
		right: 0
	},
	form: {
		width: '98%',
		marginLeft: 13,
		marginTop: theme.spacing(12)
	},
	toolbar: theme.mixins.toolbar,
	root: {
		minWidth: 470
	},
	bullet: {
		display: 'inline-block',
		margin: '0 2px',
		transform: 'scale(0.8)'
	},
	pos: {
		marginBottom: 12
	},
	uiProgess: {
		position: 'fixed',
		zIndex: '1000',
		height: '31px',
		width: '31px',
		left: '50%',
		top: '35%'
	},
	dialogeStyle: {
		maxWidth: '50%'
	},
	viewRoot: {
		margin: 0,
		padding: theme.spacing(2)
	},
	closeButton: {
		position: 'absolute',
		right: theme.spacing(1),
		top: theme.spacing(1),
		color: theme.palette.grey[500]
	}
    })
    
);

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

class stories extends Component {
	constructor(props) {
		super(props);

		this.state = {
			username: '',
			stories: '',
			title: '',
			body: '',
            inspiredByStory: {},
			storyId: '',
			errors: [],
			open: false,
			uiLoading: true,
			buttonType: '',
			viewOpen: false,
            isEditable: true,
			isMounting: false,
		};

		this.deleteStoryHandler = this.deleteStoryHandler.bind(this);
		this.handleEditClickOpen = this.handleEditClickOpen.bind(this);
		this.handleViewOpen = this.handleViewOpen.bind(this);
	}

	handleChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value
		});
	};

	componentWillMount = () => {

		if (this.props.stories === 'explore') {
			this.getExploreStories()
		}

		if (this.props.stories === 'user') {
			this.getUserStories()
		}

		if (this.props.stories === 'userChosen') {
			this.getUserChosenStories()
		}
	};

	getUserStories = () => {
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

	getExploreStories = () => {
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

	getUserChosenStories = () => {
		authMiddleWare(this.props.history);
		const authToken = localStorage.getItem('AuthToken');
		axios.defaults.headers.common = { Authorization: `${authToken}` };
		axios
			.get(`/stories/${this.props.userChosen}`)
			.then((response) => {
					this.setState({
						stories: response.data,
						uiLoading: false
					});
					console.log('loadUserChosenStories')
			})
			.catch((err) => {
				console.log(err);
			});

	};

	deleteStoryHandler(data) {
		authMiddleWare(this.props.history);
		const authToken = localStorage.getItem('AuthToken');
		axios.defaults.headers.common = { Authorization: `${authToken}` };
		let storyId = data.story.storyId;
		axios
			.delete(`story/${storyId}`)
			.then(() => {
				window.location.reload();
			})
			.catch((err) => {
				console.log(err);
			});
	}

	handleEditClickOpen(data) {
        // TODO: Add inspiredBy state here, it should link to that title
		this.setState({
			title: data.story.title,
			body: data.story.body,
			storyId: data.story.storyId,
			buttonType: 'Edit',
			open: true
		});
	}

	handleViewOpen(data) {
        console.log(data.story)
		this.setState({
			title: data.story.title,
			body: data.story.body,
            inspiredByStory: data.story.inspiredByStory,
			viewOpen: true
		});

		if (data.story.inspiredByStory !== {}) {
			this.setState({
				inspiredByStory: data.story.inspiredByStory,
			});
		}
	}

	// this function checks if the story is editable and if it is then the buttons
	// edit and delete are availble
    checkAccessForEditable = (story, editable) => {
        if (editable === true || story.userName === this.props.username) {
            return (
                <div>
                <Button size="small" color="primary" onClick={() => this.handleEditClickOpen({ story })}>
                Edit
                </Button>
                 <Button size="small" color="primary" onClick={() => this.deleteStoryHandler({ story })}>
                Delete
             </Button> 
                </div>

            );
        }
    }

	// this function checks if the story is editable and if it is not then the button
	// inspired are availble
    checkAccessForInspiredBy = (story, editable) => {
        if (editable === false && story.userName !== this.props.username) {
            return (
                <div id='inspiredByWrapper'>
                    <Button size='small'color='primary' onClick={() => this.handleClickOpenInspiredBy({ story })}>
                        Inspired
                    </Button>
                </div>
            );
        }
    }

    handleClickOpenInspiredBy = (story) => {
        this.setState({
            inspiredByStory: story.story,
        });
        this.setState({
            storyId: '',
            title: '',
            body: '',
            buttonType: '',
            open: true,
        });
    };

	// this opens the story that inpired the currently opened story
	handleInspiredByStory = () => {
		this.setState({
			title: this.state.inspiredByStory.title,
			body: this.state.inspiredByStory.body,
			inspiredByStory: this.state.inspiredByStory.inspiredByStory
		})
	}

	// this function renders a button to go into inspired story
	// if current story displayed was inspired by another
	renderButtonForInspiredBy = () => {

		if (this.state.inspiredByStory !== undefined && this.state.inspiredByStory.title !== undefined) {
			let inspiredByStoryTitle = 'Inspired by: ' + this.state.inspiredByStory.title
			console.log(this.state.inspiredByStory.title)
			return (
				<Button
					fullWidth
					id="storyDetails"
					name="body"
					color='primary'
					multiline
					readonly
					rows={1}
					rowsMax={25}
					onClick={this.handleInspiredByStory}
					InputProps={{
						disableUnderline: true
					}}
				>
				{inspiredByStoryTitle}
				</Button>
			)
		} else {
			console.log('there is no inspired by button')
		}
	}

	// handles the click on the username displayed on story
	handleClickProfile = (username) => {
		// TODO: make ability to go into the profile
	}


	render() {
		const DialogTitle = withStyles(styles)((props) => {
			const { children, classes, onClose, ...other } = props;
			return (
				<MuiDialogTitle disableTypography className={classes.root} {...other}>
					<Typography variant="h6">{children}</Typography>
					{onClose ? (
						<IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
							<CloseIcon />
						</IconButton>
					) : null}
				</MuiDialogTitle>
			);
		});

		const DialogContent = withStyles((theme) => ({
			viewRoot: {
				padding: theme.spacing(2)
			}
		}))(MuiDialogContent);

		dayjs.extend(relativeTime);
		const { classes } = this.props;
		const { open, errors, viewOpen } = this.state;

		const handleClickOpen = () => {
            console.log('open')
			this.setState({
				storyId: '',
				title: '',
				body: '',
				buttonType: '',
				open: true
			});
		};

		const handleSubmit = (event) => {
			authMiddleWare(this.props.history);
			event.preventDefault();
            console.log("INSPIRED BY: " + this.state.inspiredByStory)
			const userStory = {
				title: this.state.title,
				body: this.state.body,
                inspiredByStory: this.state.inspiredByStory
			};
			let options = {};
			if (this.state.buttonType === 'Edit') {
				options = {
					url: `/story/${this.state.storyId}`,
					method: 'put',
					data: userStory
				};
			} else {
				options = {
					url: '/story',
					method: 'post',
					data: userStory
				};
			}
			const authToken = localStorage.getItem('AuthToken');
			axios.defaults.headers.common = { Authorization: `${authToken}` };
			axios(options)
				.then(() => {
                    console.log('NOT GOOD')
					this.setState({ open: false });
					window.location.reload();
				})
				.catch((error) => {
					this.setState({ open: true, errors: error.response.data });
					console.log(error);
				});
		};

		const handleViewClose = () => {
			this.setState({ viewOpen: false});
		};

		const handleClose = (event) => {
            console.log('NOT GOOD')
			this.setState({ open: false});
		};


		if (this.state.uiLoading === true) {
			return (
				<main className={classes.content}>
					<div className={classes.toolbar} />
					{this.state.uiLoading && <CircularProgress size={150} className={classes.uiProgess} />}
				</main>
			);
		} else {
			// let mounted = true
			// if (mounted) {
				return (
					<main className={classes.content}>
						<div className={classes.toolbar} />

						<IconButton
							className={classes.floatingButton}
							color="primary"
							aria-label="Add Story"
							onClick={handleClickOpen}
						>
							<AddCircleIcon style={{ fontSize: 60 }} />
						</IconButton>
						<Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
							<AppBar className={classes.appBar}>
								<Toolbar>
									<IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
										<CloseIcon />
									</IconButton>
									<Typography variant="h6" className={classes.title}>
										{this.state.buttonType === 'Edit' ? 'Edit Story' : 'Create a new Story'}
									</Typography>
									<Button
										autoFocus
										color="inherit"
										onClick={handleSubmit}
										className={classes.submitButton}
									>
										{this.state.buttonType === 'Edit' ? 'Save' : 'Submit'}
									</Button>
								</Toolbar>
							</AppBar>

							<form className={classes.form} noValidate>
								<Grid container spacing={2} >
									<Grid item xs={12}>
										<TextField
											variant="outlined"
											required
											fullWidth
											id="storyTitle"
											label="Story Title"
											name="title"
											autoComplete="storyTitle"
											helperText={errors.title}
											value={this.state.title}
											error={errors.title ? true : false}
											onChange={this.handleChange}
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											variant="outlined"
											required
											fullWidth
											id="storyDetails"
											label="Story Details"
											name="body"
											autoComplete="storyDetails"
											multiline
											rows={25}
											rowsMax={25}
											helperText={errors.body}
											error={errors.body ? true : false}
											onChange={this.handleChange}
											value={this.state.body}
										/>
									</Grid>
									<Grid item xs={12}>
										<Typography variant='h5'>
											Try strategic storytelling to help others who may be experiencing something similar
											to what you have experienced by asking yourself:
										</Typography>
										<Typography>
											 - What was the problem or personal illness in this story?
										</Typography>
										<Typography>
											 - What were you feeling at that momment?
										</Typography>
										<Typography>
											 - What were the challenges you faced during your recovery journey and how did you overcome them?
										</Typography>
										<Typography>
											 - What is your narrative of this story after overcoming these challenges?
										</Typography>
										<Typography>
											 - If someone is currently facing these issues, what would they want to hear in order to inspire, inform, educate, or help problem-solve in their recovery journey? 
										</Typography>
									</Grid>
								</Grid>
							</form>
						</Dialog>
						<Grid container spacing={2}>
							{this.state.stories.map((story) => (
								<Grid item xs={12} sm={6}>
									<Card className={classes.root} variant="outlined">
										<CardContent>
											<Typography variant="h5" component="h2">
												{story.title}
											</Typography>
											<Button
											color='primary'
											style={{textTransform: 'none'}}
											onClick={this.handleClickProfile}
											>
												{story.userName}
											</Button>
											<Typography className={classes.pos} color="textSecondary">
												{dayjs(story.createdAt).fromNow()}
											</Typography>
											<Typography variant="body2" component="p">
												{`${story.body.substring(0, 65)}`}
											</Typography>
										</CardContent>
										<CardActions>
											<Button size="small" color="primary" onClick={() => this.handleViewOpen({ story })}>
												{' '}
												View{' '}
											</Button>
											{this.checkAccessForEditable(story, this.props.isEditable)}
											{this.checkAccessForInspiredBy(story, this.props.isEditable)}
										</CardActions>
									</Card>
								</Grid>
							))}
						</Grid>

						<Dialog
							onClose={handleViewClose}
							aria-labelledby="customized-dialog-title"
							open={viewOpen}
							fullWidth
							classes={{ paperFullWidth: classes.dialogeStyle }}
						>
							<DialogTitle id="customized-dialog-title" onClose={handleViewClose}>
								{this.state.title}
							</DialogTitle>
							<DialogContent dividers>
								<TextField
									fullWidth
									id="storyDetails"
									name="body"
									multiline
									readonly
									rows={1}
									rowsMax={25}
									value={this.state.body}
									InputProps={{
										disableUnderline: true
									}}
								/>
								{this.renderButtonForInspiredBy()}
							</DialogContent>
						</Dialog>
					</main>
				);
			// }
			// return () => mounted = false;
		}
	}
}

export default (withStyles(styles)(stories));