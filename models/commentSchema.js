const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    tweet:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    comment:{
        type:String,
        requried:true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    authorName:{
        type:String,
        requried:true
    },
    authorImage:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true,
        default:Date.now
    }
})

const Comment = new mongoose.model('Comment',commentSchema)
module.exports = Comment