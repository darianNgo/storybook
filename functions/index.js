//index.js

const functions = require('firebase-functions');
const app = require('express')();
const auth = require('./util/auth');


const {
    getAllStories,
    getMyStories,
    getOneStory,
    postOneStory,
    deleteStory,
    editStory
} = require('./APIs/stories')

const {
    loginUser,
    signUpUser,
    uploadProfilePhoto,
    getUserDetail,
    updateUserDetails
} = require('./APIs/users')


// stories.js
app.get('/stories', getAllStories);
app.get('/stories/user', auth, getMyStories);
app.get('/story/:storyId', auth, getOneStory);
app.post('/story', auth, postOneStory);
app.delete('/story/:storyId', auth, deleteStory);
app.put('/story/:storyId', auth, editStory);

// /stories/all
// /stories/:user

// users.js
app.post('/login', loginUser);
app.post('/signup', signUpUser);
app.post('/user/image', auth, uploadProfilePhoto);
app.get('/user', auth, getUserDetail);
app.post('/user', auth, updateUserDetails);



exports.api = functions.https.onRequest(app);
