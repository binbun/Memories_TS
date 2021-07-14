import mongoose from 'mongoose';
const {ObjectId} = mongoose.Schema.Types

const commentSchema = mongoose.Schema({
    text: String,
    postedBy: {type: ObjectId, ref: "User"},
    likes: {
        type: [String],
        default: [],
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
})

const postSchema = mongoose.Schema({
    title: String,
    message: String,
    name: String,
    creator: String,
    tags: [String],
    selectedFile: String,
    likes: {
        type: [String],
        default: [],
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
    comments: [commentSchema],
})

var PostMessage = mongoose.model("PostMessage", postSchema);

export default PostMessage;