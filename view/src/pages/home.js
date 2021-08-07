import React, { Component } from 'react';
import axios from 'axios';

import Profile from '../components/profile';
import Account from '../components/account';
import Explore from '../components/explore';
import Stories from '../components/stories';


import MenuIcon from '@material-ui/icons/Menu';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SearchIcon from '@material-ui/icons/Search';

import Avatar from '@material-ui/core/avatar';
import Menu from '@material-ui/core/Menu';
import Fade from '@material-ui/core/Fade';
import { alpha } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem'
import { TextField } from '@material-ui/core';

import Grid from '@material-ui/core/Grid';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Button from'@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import withStyles from '@material-ui/core/styles/withStyles';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import { authMiddleWare } from '../util/auth'
// import { response } from 'express';

const FAKE_USER_LIST = [
    'papiTheToyPoodle'
    // 'piapia',
    // 'leoTheCrazyCat',
    // 'miaThePitBull',
	// 'MrWiskerz',
]


const drawerWidth = 240;

const styles = (theme) => ({
	root: {
		display: 'flex'
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0
	},
	drawerPaper: {
		width: drawerWidth
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3)
	},
	usernameStyle: {
		marginTop: theme.spacing(10)
	},
	avatar: {
		height: 150,
		width: 150,
		flexShrink: 0,
		flexGrow: 0,
		marginTop: theme.spacing(12)
	},
	uiProgess: {
		position: 'fixed',
		zIndex: '1000',
		height: '31px',
		width: '31px',
		left: '50%',
		top: '35%'
	},
	searchBar: {
		height: 30,
	},
	margin: {
		margin: theme.spacing(1)
	},
	inputText: {
		color: 'white',
		textAlign: 'center',
	},
	search: {
		position: 'relative',
		borderRadius: theme.shape.borderRadius,
		backgroundColor: alpha(theme.palette.common.white, 0.15),
		'&:hover': {
		  backgroundColor: alpha(theme.palette.common.white, 0.25),
		},
		marginLeft: 0,
		width: '100%',
		[theme.breakpoints.up('sm')]: {
		  marginLeft: theme.spacing(1),
		  width: 'auto',
		},
	  },
	  searchIcon: {
		padding: theme.spacing(0, 2),
		height: '100%',
		position: 'absolute',
		pointerEvents: 'none',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	  },
	  inputRoot: {
		color: 'inherit',
	  },
	  inputInput: {
		padding: theme.spacing(1, 1, 1, 0),
		// vertical padding + font size from searchIcon
		paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
		transition: theme.transitions.create('width'),
		width: '100%',
		[theme.breakpoints.up('sm')]: {
		  width: '12ch',
		  '&:focus': {
			width: '20ch',
		  },
		},
	  },
});

const StyledMenu = withStyles({
	paper: {
	  border: '1px solid #d3d4d5',
	},
  })((props) => (
	<Menu
	  elevation={0}
	  getContentAnchorEl={null}
	  anchorOrigin={{
		vertical: 'bottom',
		horizontal: 'center',
	  }}
	  transformOrigin={{
		vertical: 'top',
		horizontal: 'center',
	  }}
	  {...props}
	/>
  ));

  const StyledMenuItem = withStyles((theme) => ({
	root: {
	  '&:focus': {
		backgroundColor: theme.palette.primary.main,
		'& .MuiListItemIcon-root, & .MuiListItemText-primary': {
		  color: theme.palette.common.white,
		},
	  },
	},
}))(MenuItem);

class home extends Component {
    state = {
        render: 0,
		drawer: false,
    };

	openDrawer = (event) => {
		this.setState({drawer: true})
	};

	closeDrawer = (event) => {
		this.setState({drawer: false})
	};

    loadAccountPage = (event) => {
        this.setState({render: 1})
		this.closeDrawer()
    };

    loadStoryPage = (event) => {
        this.setState({render: 0})
		this.closeDrawer()
    };

	loadExplorePage = (event) => {
		this.setState({render: 2})
	};

	loadUserChosenProfilePage = (event) => {
		this.setState({render: 3})
	};

    logoutHandler = (event) => {
        localStorage.removeItem('AuthToken');
        this.props.history.push('/login');
    };



	renderSwitch(page) {
		switch(page) {
			case 0:
				return <Profile/>;
			case 1:
				return <Account/>
			case 2:
				return <Explore />
			case 3:
				return this.renderUserChosenProfile()
			default: 
				return <Profile />
		}
	}  

	// homeHandler = (event) => {
	// 	this.props.hisory.push('/')
	// };

    constructor(props) {
        super(props);

        this.state = {
            firstName: '',
            lastName: '',
            profilePicture: '',
            uiLoading: true,
            imageLoading: false,
			userInput: '',
            userOptions: FAKE_USER_LIST,
            userMenuVisable: false,
			viewingUserChosenProfile: false,
            userChosen: '',
			userChosenProfilePicture: '',
			userChosenStories: '',
			userInputError: '',
        };
    }

    componentWillMount = () => {
        authMiddleWare(this.props.history);
        const authToken = localStorage.getItem('AuthToken');
        axios.defaults.headers.common = {Authorization: `${authToken}`};
        axios
            .get('/user')
            .then((response) => {
                console.log(response.data);
                this.setState({
                    firstName: response.data.userCredentials.firstName,
                    lastName: response.data.userCredentials.lastName,
                    email: response.data.userCredentials.email,
                    phoneNumber: response.data.userCredentials.phoneNumber,
                    country: response.data.userCredentials.country,
                    username: response.data.userCredentials.username,
                    uiLoading: false,
                    profilePicture: response.data.userCredentials.imageUrl,
                });   
            })
            .catch((error) => {
                if (error.response.status === 403) {
                    this.props.history.push('/login')
                }
                console.log(error);
                this.setState({ errorMsg: 'Error in retrieving the data'});
            });
    };

	componentDidUpdate = (prevProps, prevInput) => {
		console.log(prevInput.userInput)
		console.log(this.state.userInput)

		if (prevInput.userInput !== this.state.userInput && this.state.userInput !== '') {
			authMiddleWare(this.props.history);
			const authToken = localStorage.getItem('AuthToken');
			axios.defaults.headers.common = {Authorization: `${authToken}`};
			axios
				.get(`/user/userNames/${this.state.userInput}`)
				.then((response) => {
					let userOptions = [];
					for (var u in response.data) {
						userOptions.push(response.data[u].userName);
					}
					this.setState({ userOptions });
				})
				.catch((error) => {
					console.log(error.response);
					let userOptions = [];
					for (var u in FAKE_USER_LIST) {
						userOptions.push(FAKE_USER_LIST[u]);
					}
					this.setState({ userOptions });
				});
		}

		if (this.state.userChosen !== '' && prevInput.userInput !== this.state.userInput) {
			console.log(this.state.userChosen)
			this.loadUserChosenInfo()
			this.loadUserChosenStories()
			this.loadUserChosenProfilePage()
		}
	}

	loadUserChosenInfo = () => {
		console.log("loadUserChosenInfo")
		console.log(this.state.userChosenProfilePicture)
		authMiddleWare(this.props.history);
        const authToken = localStorage.getItem('AuthToken');
        axios.defaults.headers.common = {Authorization: `${authToken}`};
        axios
            .get(`user/${this.state.userChosen}`)
            .then((response) => {
                console.log(response.data);
                this.setState({
					userChosenProfilePicture: response.data.userCredentials.imageUrl,
                });   
            })
            .catch((error) => {
                console.log(error);
                this.setState({ errorMsg: 'Error in retrieving the data'});
            });
			 console.log(this.state.userChosenProfilePicture)
	}


	loadUserChosenStories = () => {
		authMiddleWare(this.props.history);
		const authToken = localStorage.getItem('AuthToken');
		axios.defaults.headers.common = { Authorization: `${authToken}` };
		axios
			.get(`/stories/${this.state.userChosen}`)
			.then((response) => {
				this.setState({
					userChosenStories: response.data,
				});
				console.log('loadUserChosenStories')
				console.log(response.data)
			})
			.catch((err) => {
				console.log(err);
			});
	}


	searchSorter = (username) => {
		console.log(username.substring(0, this.state.userInput.length))

		if ((username.substring(0, this.state.userInput.length) === this.state.userInput) && (this.state.userInput !== '')) {
			return (
				<MenuItem
				value={username}
				key={username}
				color="primary"
				onClick={(event) => {
					this.setState((state) => {
						return {
							userMenuVisable: state.userChosen.length > 0 ? false : this.state.userMenuVisable,
							userInput: state.userChosen.length > 0 ? '' : this.state.userInput,
							userInputError: ''
						}
					});
					this.setState((state) => {
						return {
							userChosen: username
						}
					});
				}}
				>
				{username}
				</MenuItem>
			)
		}
	}

	getUserOptions = () => {
		console.log('getUserOptions')
		if (this.state.userOptions.length === 0) {
			console.log('no user found')
			return (
				<MenuItem
				color='primary'
				disabled
				>
				no user found
				</MenuItem>
			)
		}
		return (
			this.state.userOptions.map(u => {
				// const chosen = this.state.userChosen.includes(u);
				return this.searchSorter(u)
			})
		)
	}

	renderUserChosenProfile = () => {
		const { classes, ...rest } = this.props;
        if (this.state.uiLoading === true) {
            return (
                <main className={classes.content}>
					<div className={classes.toolbar} />
					{this.state.uiLoading && <CircularProgress size={150} className={classes.uiProgess} />}
                </main>
            );
        } else {
            return (
                <Grid spacing={2}>
                            <Grid
                                item
                                container
                                className={classes.centerColumn}
                                display="flex"
                                justify="center"
                                >
                                <Avatar src={this.state.userChosenProfilePicture} className={classes.avatar} />
                            </Grid>
                            <Grid
                                item
                                container
                                className={classes.centerColumn}
                                display="flex"
                                justify="center"
                                >
                                <Typography variant='h4'>{this.state.userChosen}</Typography>
                            </Grid>
							{/* make stories able to take a parameter and then use it here with userchosen's stories */}
                                <Stories stories={this.state.userChosenStories} isEditable={false}></Stories> 
                        </Grid>
            );
        }
	}

    render() {
		const disableUserInput = this.state.userChosen.lenth > 0;
		const { classes } = this.props;		
		if (this.state.uiLoading === true) {
			return (
				<div className={classes.root}>
					{this.state.uiLoading && <CircularProgress size={150} className={classes.uiProgess} />}
				</div>
			);
		} else {
			return (
				<div className={classes.root}>
					<CssBaseline />
					<AppBar position="fixed" className={classes.appBar}>
						<Toolbar variant="regular">
							<IconButton
							    color="inherit"
								aria-label="open drawer"
								onClick={this.openDrawer}>
									<MenuIcon />
							</IconButton>
							<Typography variant="h6" noWrap>
								StoryBook
							</Typography>
							<Button 
								color="inherit"
								onClick={this.loadExplorePage}>
								Explore
							</Button>
							<div id='search-wrapper'>
								{/* <div className={classes.searchIcon}>
								<SearchIcon />
								</div> */}
								<TextField
									placeholder="Search…"
									type='text'
									error={Boolean(this.state.userInputError)}
									value={this.state.userInput}
									disabled={disableUserInput}
									onChange={(event) => {
										this.setState({
											userInput: event.target.value,
											userInputError: ""
										})
									}}
									onClick={(event) => { !disableUserInput && this.setState({ userMenuVisible: true }) }}
									classes={{
										root: 'user-filter-root',
										input: 'user-filter-input',
									}}
									inputProps={{ 
										classname: disableUserInput ? 'disabledUserInput' : ''
									 }}
								/>
								{this.state.userMenuVisible &&
									<div id= 'user-menu'>
										{this.getUserOptions()}
									</div>
								}
							</div>
						</Toolbar>
					</AppBar>
					<Drawer
						className={classes.drawer}
						variant="temporary"
						anchor="left"
						open={this.state.drawer}
						SlideProps
						classes={{
							paper: classes.drawerPaper
						}}
					>
						<div className={classes.toolbar} />
						<IconButton
							color="inherit"
							onClick={this.closeDrawer}
							edge="start"
						>
							<ArrowBackIcon />
						</IconButton>
						<Divider />
						<center>
							<p>
								{' '}
								<Typography variant='h5'>{this.state.firstName} {this.state.lastName}</Typography>
							</p>
						</center>
						<Divider />
						<List>
							<ListItem button key="Profile" onClick={this.loadStoryPage}>
								<ListItemIcon>
									{' '}
									<MenuBookIcon />{' '}
								</ListItemIcon>
								<ListItemText primary="My Story" />
							</ListItem>

							<ListItem button key="Account" onClick={this.loadAccountPage}>
								<ListItemIcon>
									{' '}
									<AccountBoxIcon />{' '}
								</ListItemIcon>
								<ListItemText primary="Account" />
							</ListItem>

							<ListItem button key="Logout" onClick={this.logoutHandler}>
								<ListItemIcon>
									{' '}
									<ExitToAppIcon />{' '}
								</ListItemIcon>
								<ListItemText primary="Logout" />
							</ListItem>
						</List>
					</Drawer>
							<div>{this.renderSwitch(this.state.render)}</div>
				</div>
			);
		}
	}
}

export default withStyles(styles)(home);