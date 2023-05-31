const mongoose = require('mongoose')

const tweetSchema = new mongoose.Schema({
    tweet:{
        type:String,
        required:true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    authorName:{
        type:String
    },
    date:{
        type:Date,
        required:true,
        default:Date.now
    },
    likeCount:[mongoose.Schema.Types.ObjectId]
})

const Tweet = new mongoose.model('Tweet',tweetSchema)
module.exports = Tweet