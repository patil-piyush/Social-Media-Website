const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const User = require('../models/user');

//create a post
router.post('/', async (req, res) => {
    const newPost = await new Post(req.body);
    try {
        const savedPost = newPost.save();
        res.status(200).json("Post posted successfully!", savedPost);
    } catch (err) {
        res.status(500).json("couldn't create post!", err);
    }
});

//update a post
router.put('/:id', async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (post) {
        if (post.userId === req.body.userId) {
            try {
                const updatedPost = await Post.findByIdAndUpdate(req.params.id, { $set: req.body })
                res.status(200).json("Post updated successfully!", updatedPost);
            } catch (err) {
                res.status(500).json("couldn't update post!", err);
            }
        }
        else {
            res.status(403).json("You can update only your post!");
        }
    }
    else {
        res.status(403).json("Post doesn't exist!");
    }
});

//delete a post
router.delete('/:id', async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (post) {
        if (post.userId === req.body.userId) {
            try {
                await Post.findByIdAndDelete(req.params.id)
                res.status(200).json("Post deleted successfully!");
            } catch (err) {
                res.status(500).json("couldn't delete post!", err);
            }
        }
        else {
            res.status(403).json("You can delete only your post!");
        }
    }
    else {
        res.status(403).json("Post doesn't exist!");
    }
});


//like, dislike a post
router.put('/:id/like', async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (post) {
        try {
            if (!post.likes.includes(req.body.userId)) {
                await post.updateOne({ $push: { likes: req.body.userId } });
                res.status(200).json("Post has been liked");
            }
            else {
                await post.updateOne({ $pull: { likes: req.body.userId } });
                res.status(200).json("Post has been disliked");
            }
        } catch (err) {
            res.status(500).json("something went wrong!", err);
        }
    }
    else {
        res.status(403).json("Post doesn't exist!");
    }
});

//get a post
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post) {
            res.status(200).json(post);
        }
        else {
            res.status(403).json("Post doesn't exist!");
        }
    } catch (err) {
        res.status(500).json("something went wrong", err);
    }
});


//get timeline posts
router.get('/timeline/all', async (req, res) => {
    try {
        const currUser = await  User.findById(req.body.userId);
        const userPost = await Post.find({userId: currUser._id});
        const friendPost = await Promise.all(
            currUser.followings.map((friendId) => {
                return Post.find({userId: friendId});
            })
        );
        res.json(userPost.concat(...friendPost));
    } catch (err) {
        res.status(500).json("something went wrong", err);
    }
});

module.exports = router;