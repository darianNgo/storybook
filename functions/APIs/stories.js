// stories.js

const { db } = require('../util/admin');

exports.getAllStories = (request, response) => {
	db
		.collection('stories')
		.orderBy('createdAt', 'desc')
		.get()
		.then((data) => {
			let stories = [];
			data.forEach((doc) => {
				stories.push({
                    storyId: doc.id,
                    userName: doc.data().username,
                    title: doc.data().title,
					body: doc.data().body,
					createdAt: doc.data().createdAt,
                    inspiredByStory: doc.data().inspiredByStory,
				});
			});
			return response.json(stories);
		})
		.catch((err) => {
			console.error(err);
			return response.status(500).json({ error: err.code});
		});
};

exports.getMyStories = (request, response) => {
	db
		.collection('stories')
        .where('username', '==', request.user.username)
		.orderBy('createdAt', 'desc')
		.get()
		.then((data) => {
			let stories = [];
			data.forEach((doc) => {
				stories.push({
                    storyId: doc.id,
                    title: doc.data().title,
                    userName: doc.data().username,
					body: doc.data().body,
					createdAt: doc.data().createdAt,
                    inspiredByStory: doc.data().inspiredByStory,
				});
			});
			return response.json(stories);
		})
		.catch((err) => {
			console.error(err);
			return response.status(500).json({ error: err.code});
		});
};

exports.getUserChosenStories = (request, response) => {
	db
		.collection('stories')
        .where('username', '==', request.params.userName)
		.orderBy('createdAt', 'desc')
		.get()
		.then((data) => {
			let stories = [];
			data.forEach((doc) => {
				stories.push({
                    storyId: doc.id,
                    title: doc.data().title,
                    userName: doc.data().username,
					body: doc.data().body,
					createdAt: doc.data().createdAt,
                    inspiredByStory: doc.data().inspiredByStory
                    //TODO: add linkage to a inspiredByStory, null if not provided
				});
			});
            console.log(response.json(stories))
			return response.json(stories);
		})
		.catch((err) => {
			console.error(err);
			return response.status(500).json({ error: err.code});
		});
};

exports.getOneStory = (request, response) => {
    const document = db.doc(`/stories/${request.params.storyId}`);
    document
        .get()
        .then((doc) => {
            let story = [];
            if (!doc.exists) {
                return response.status(404).json({ error: 'Story not found' })
            } else {
                story.push({
                    storyId: doc.id,
                    userName: doc.data().username,
                    title: doc.data().title,
					body: doc.data().body,
					createdAt: doc.data().createdAt,
                    inspiredByStory: doc.data().inspiredByStory,
                })
                return response.json(story);
            }
        })
        .catch((err) => {
            console.error(err);
            return response.status(500).json({ error: err.code });
        });
};

exports.postOneStory = (request, response) => {
	if (request.body.body.trim() === '') {
		return response.status(400).json({ body: 'Must not be empty' });
    }
    
    if(request.body.title.trim() === '') {
        return response.status(400).json({ title: 'Must not be empty' });
    }
    
    const newStoryItem = {
        username: request.user.username,
        title: request.body.title,
        body: request.body.body,
        createdAt: new Date().toISOString(),
        inspiredByStory: request.body.inspiredByStory,
    }
    db
        .collection('stories')
        .add(newStoryItem)
        .then((doc)=>{
            const responseStoryItem = newStoryItem;
            responseStoryItem.id = doc.id;
            return response.json(responseStoryItem);
        })
        .catch((err) => {
			response.status(500).json({ error: 'Something went wrong' });
			console.error(err);
		});
};

exports.deleteStory = (request, response) => {
    const document = db.doc(`/stories/${request.params.storyId}`);
    document
        .get()
        .then((doc) => {
            if (!doc.exists) {
                return response.status(404).json({ error: 'Story not found' })
            }
            if (doc.data().username !== request.user.username) {
                return response.status(403).json({error:"UnAuthorized"})
            }
            return document.delete();
        })
        .then(() => {
            response.json({ message: 'Delete successfull' });
        })
        .catch((err) => {
            console.error(err);
            return response.status(500).json({ error: err.code });
        });
};

exports.editStory = ( request, response ) => { 
    if(request.body.storyId || request.body.createdAt){
        response.status(403).json({message: 'Not allowed to edit'});
    }
    let document = db.collection('stories').doc(`${request.params.storyId}`);
    document.update(request.body)
    .then(()=> {
        response.json({message: 'Updated successfully'});
    })
    .catch((err) => {
        console.error(err);
        return response.status(500).json({ 
                error: err.code 
        });
    });
};