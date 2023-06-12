const express = require('express')
const fetchUser = require('../middleware/fetchUser')
const router = express.Router()
const Tweet = require('../models/tweetSchema')
const User = require('../models/userSchema')
const mongoose = require('mongoose')
const Comment = require('../models/commentSchema')

router.get('/getComments',async(req,res)=>{
    try{
        const allComm = await Comment.find().sort({date:-1})
        res.json(allComm);
    }catch(err){
        console.log(err);
    }
})

router.post('/createComment/:id',fetchUser,async (req,res)=>{
    try {
        const userId = req.user._id;
        const currUser = await User.findOne({_id:userId});
        const TweetId = req.params.id;
        const {comment} = req.body
        const newComment = new Comment({comment,author:userId,authorName:currUser.username,authorImage:currUser.imageUrl,tweet:TweetId})
        await newComment.save()
        const currTweet = await Tweet.findOne({_id:TweetId})
        currTweet.comments.push(newComment._id)
        await currTweet.save()
        res.send(newComment)
    } catch (err) {
        console.log(err);
    }
})

module.exports = router