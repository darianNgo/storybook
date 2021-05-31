//index.js

const functions = require('firebase-functions');
const app = require('express')();
const auth = require('./util/auth');

const {
    getAllStories,
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
app.get('/stories', auth, getAllStories);
app.get('/story/:storyId', auth, getOneStory);
app.post('/story', auth, postOneStory);
app.delete('/story/:storyId', auth, deleteStory);
app.put('/story/:storyId', auth, editStory);

// users.js
app.post('/login', loginUser);
app.post('/signup', signUpUser);
app.post('/user/image', auth, uploadProfilePhoto);
app.get('/user', auth, getUserDetail);
app.post('/user', auth, updateUserDetails);



exports.api = functions.https.onRequest(app);
