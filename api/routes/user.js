const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

router.get('/', (req, res) => {
    res.send("hey its me");
})

//update user
router.put('/:id', async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            if (req.body.password) {
                req.body.password = await bcrypt.hash(req.body.password, 10);
            }

            const user = await User.findByIdAndUpdate(
                req.params.id,
                { $set: req.body },
                { new: true }
            );

            return res.status(200).json("Account Updated Successfully!");
        } catch (err) {
            return res.status(500).json("Something Went Wrong!", err);
        }
    } else {
        return res.status(401).json("You can update only your profile!");
    }
});


//delete user
router.delete('/:id', async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            const user = await User.findByIdAndDelete(req.params.id);

            if (user.deletedCount === 0) {
                return res.status(404).json("User not found!");
            }

            return res.status(200).json("Account Deleted Successfully!");
        } catch (err) {
            console.error("Error during deletion:", err);
            return res.status(500).json("Something Went Wrong!");
        }
    } else {
        return res.status(401).json("You can delete only your profile!");
    }
});


//get user
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) res.status(401).json("User not found!");
        const { password, updatedAt, ...other } = user._doc;
        res.status(200).json(other);
    } catch (err) {
        res.status(500).json("something went wrong", err);
    }
});


//follow user
router.put('/:id/follow', async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currUser = await User.findById(req.body.userId);
            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({ $push: { followers: req.body.userId } });
                await currUser.updateOne({ $push: { followings: req.params.id } });
                res.status(200).json(" You are now following this user!");
            }
            else {
                res.status(403).json("You already follow this user!");
            }
        } catch (err) {
            res.status(500).json("something went wrong", err);
        }
    }
    else {
        res.status(403).json("you can't follow yourself!");
    }
})



//unfollow user
router.put('/:id/unfollow', async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currUser = await User.findById(req.body.userId);
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({ $pull: { followers: req.body.userId } });
                await currUser.updateOne({ $pull: { followings: req.params.id } });
                res.status(200).json(" You have unfollowed this user!");
            }
            else {
                res.status(403).json("You already unfollowed this user!");
            }
        } catch (err) {
            res.status(500).json("something went wrong", err);
        }
    }
    else {
        res.status(403).json("you can't unfollow yourself!");
    }
})



module.exports = router