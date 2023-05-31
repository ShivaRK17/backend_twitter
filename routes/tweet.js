const express = require('express')
const fetchUser = require('../middleware/fetchUser')
const router = express.Router()
const Tweet = require('../models/tweetSchema')
const User = require('../models/userSchema')
const mongoose = require('mongoose')

router.post('/createTweet',fetchUser,async (req,res)=>{
    try {
        const userId = req.user._id;
        const {tweet} = req.body
        const userName = await User.findOne({_id:userId})
        // console.log(userName.name);
        const newTweet = new Tweet({tweet,author:userId,authorName:userName.name})
        await newTweet.save()
        res.send(newTweet)
    } catch (err) {
        console.log(err);
    }
})

router.get('/getTweets',async (req,res)=>{
    try {
        const tweets = await Tweet.find().sort({date:-1})
        res.json(tweets)
    } catch (err) {
        console.log(err);
    }
})

router.get('/getTweet',fetchUser,async (req,res)=>{
    try {
        const userId = req.user._id;
        const tweets = await Tweet.find({author:userId})
        res.json(tweets)
    } catch (err) {
        console.log(err);
    }
})

router.get('/getTweet/:id',async (req,res)=>{
    try {
        const id = req.params.id
        // console.log(id);
        if (!mongoose.Types.ObjectId.isValid(id)) {
            // Handle invalid ObjectID format
            return res.status(400).json({ error: 'Invalid ObjectID format' });
        }
        const objId= new mongoose.Types.ObjectId(id)
        // console.log(objId);
        const tweets = await Tweet.find({author:objId})
        res.json(tweets)
    } catch (err) {
        console.log(err);
    }
})


router.patch('/updateTweet/:id',fetchUser,async (req,res)=>{
    try {
        const userId = req.user._id;
        const tweetId = req.params.id;
        const tweet = await Tweet.findOne({_id:tweetId})
        if(tweet.author!=userId){
            res.status(422).json({"Error":"Unauthorized"})
        }
        else{
            const data = req.body
            const updTweet = await Tweet.findByIdAndUpdate(tweetId,data)
            await updTweet.save()
            res.json(updTweet)
        }
    } catch (err) {
        console.log(err);
    }
})

router.delete('/deleteTweet/:id',fetchUser,async (req,res)=>{
    try {
        const userId = req.user._id;
        const tweetId = req.params.id;
        const tweet = await Tweet.findOne({_id:tweetId})
        if(tweet.author!=userId){
            res.status(422).json({"Error":"Unauthorized"})
        }
        else{
            const updTweet = await Tweet.findByIdAndDelete(tweetId)
            // await updTweet.save()
            res.json({"Success":"Deleted Successfully"})
        }
    } catch (err) {
        console.log(err);
    }
})

router.post('/likeTweet/:id',fetchUser,async (req,res)=>{
    try {
        const userId = req.user._id;
        const tweetId = req.params.id;
        const tweet = await Tweet.findOne({_id:tweetId})
        if(tweet.likeCount.includes(userId)){
            res.send({'Message':'Already Liked'})
        }
        else{
            tweet.likeCount.push(userId);
            await tweet.save()
            res.json({'success':"Liked!"})
        }
    } catch (err) {
        console.log(err);
    }
})

router.post('/unlikeTweet/:id',fetchUser,async (req,res)=>{
    try {
        const userId = req.user._id;
        const tweetId = req.params.id;
        const tweet = await Tweet.findOne({_id:tweetId})
        if(!tweet.likeCount.includes(userId)){
            res.send({'Message':'Did not Like'})
        }
        else{
            // console.log(tweet.likeCount);
            tweet.likeCount = tweet.likeCount.filter((e)=>e!=userId)
            await tweet.save()
            // console.log(tweet.likeCount);
            res.json({'success':"UnLiked!"})
        }
    } catch (err) {
        console.log(err);
    }
})

module.exports = router