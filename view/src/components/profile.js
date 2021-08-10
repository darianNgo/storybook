import Stories from './stories'
import axios from "axios";
import React, { Component } from 'react';
import { authMiddleWare } from "../util/auth";

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import Avatar from '@material-ui/core/avatar';
import CircularProgress from '@material-ui/core/CircularProgress';


const styles = (theme) => ({
    avatar: {
		height: 150,
		width: 150,
		flexShrink: 0,
		flexGrow: 0,
		marginTop: theme.spacing(12)
	},
});


class profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            profilePicture: '',
            uiLoading: true,
            // userChosen: '',
            // userChosenProfilePicture: '',
        };
    }

	componentWillMount = () => {
        let displayedUser = this.props.isUserProfile ? '/user' : `/user/${this.props.userChosen}`
        console.log("getUserInfo endpoint: " + displayedUser)
		authMiddleWare(this.props.history);
		const authToken = localStorage.getItem('AuthToken');
		axios.defaults.headers.common = { Authorization: `${authToken}` };
		axios
			.get(displayedUser)
			.then((response) => {
				console.log(response.data);
				this.setState({
                    username: response.data.userCredentials.username,
                    profilePicture: response.data.userCredentials.imageUrl,
                    uiLoading: false
				});
			})
			.catch((error) => {
				if (error.response.status === 403) {
					this.props.history.push('/login');
				}
				console.log(error);
				this.setState({ errorMsg: 'Error in retrieving the data' });
			});
	};

    // this makes the api call to get the current users username and profile picture
    // getUserInfo = () => {
    //     let displayedUser = this.props.isUserProfile ? '/user' : `/user/${this.props.userChosen}`
    //     console.log("getUserInfo endpoint: " + displayedUser)
	// 	authMiddleWare(this.props.history);
	// 	const authToken = localStorage.getItem('AuthToken');
	// 	axios.defaults.headers.common = { Authorization: `${authToken}` };
	// 	axios
	// 		.get(displayedUser)
	// 		.then((response) => {
	// 			console.log(response.data);
	// 			this.setState({
    //                 username: response.data.userCredentials.username,
    //                 profilePicture: response.data.userCredentials.imageUrl,
    //                 uiLoading: false
	// 			});
	// 		})
	// 		.catch((error) => {
	// 			if (error.response.status === 403) {
	// 				this.props.history.push('/login');
	// 			}
	// 			console.log(error);
	// 			this.setState({ errorMsg: 'Error in retrieving the data' });
	// 		});
	// };

    // this makes the api call to get the info of a chosen user
    // getUserChosenInfo = () => {
	// 	console.log("getUserChosenInfo")
	// 	authMiddleWare(this.props.history);
    //     const authToken = localStorage.getItem('AuthToken');
    //     axios.defaults.headers.common = {Authorization: `${authToken}`};
    //     axios
    //         .get(`user/${this.props.userChosen}`)
    //         .then((response) => {
    //             console.log(response.data);
    //             this.setState({
    //                 username: response.data.userCredentials.username,
    //                 profilePicture: response.data.userCredentials.imageUrl,
    //                 uiLoading: false
    //             });   
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //             this.setState({ errorMsg: 'Error in retrieving the data'});
    //         });
	// }

    handleGetStories = () => {
        if (this.props.isUserProfile) {
            return <Stories stories='user' isEditable={true}></Stories>
        } else {
            return <Stories stories='userChosen' isEditable={false} userChosen={this.props.userChosen}></Stories>
        }
    };

    // handleGetProfilePicture = () => {
    //     if (this.props.isUserProfile) {
    //         return this.state.profilePicture
    //     } else {
    //         return this.state.userChosenProfilePicture
    //     }
    // };

    render() {
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
                                <Avatar src={this.state.profilePicture} className={classes.avatar} />
                            </Grid>
                            <Grid
                                item
                                container
                                className={classes.centerColumn}
                                display="flex"
                                justify="center"
                                >
                                <Typography variant='h4'>{this.state.username}</Typography>
                            </Grid>
                            {this.handleGetStories()}
                            {/* <Stories stories='user' isEditable={true}></Stories> */}
                        </Grid>
            );
        }
    }
}

export default withStyles(styles)(profile);