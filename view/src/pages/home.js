import React, { Component } from 'react';
import axios from 'axios';

import Profile from '../components/profile';
import Account from '../components/account';
import Srories from '../components/stories';
import Explore from '../components/explore';

import DeleteIcon from '@material-ui/icons/Delete';
import MenuIcon from '@material-ui/icons/Menu';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

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
import NotesIcon from '@material-ui/icons/Notes';
import Avatar from '@material-ui/core/avatar';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';



import { authMiddleWare } from '../util/auth'
// import { response } from 'express';

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
	toolbar: theme.mixins.toolbar
});

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
            imageLoading: false
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

    render() {
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
								onClick={this.loadStoryPage}>
								Home
							</Button>
							<Button 
								color="inherit"
								onClick={this.loadExplorePage}>
								Explore
							</Button>
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