import express from 'express';
import mongoose from 'mongoose';

import PostMessage from '../models/postMessage.js';
import User from '../models/user.js';

const router = express.Router();

export const getPosts = async (req, res) => {
    const { page } = req.query;

    try {
        const LIMIT = 8;
        const startIndex = (Number(page) - 1) * LIMIT;
        const total = await PostMessage.countDocuments({});

        const posts = await PostMessage.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);

        res.status(200).json({ posts: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getPost = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await PostMessage.findById(id).populate('comments.postedBy', '_id name');
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getPostsBySearch = async (req, res) => {
    const { searchQuery, tags } = req.query;

    try {
        const title = new RegExp(searchQuery, "i");

        const posts = await PostMessage.find({ $or: [{ title }, { tags: { $in: tags.split(',') } }] });

        res.json({ posts: posts });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createPost = async (req, res) => {
    const post = req.body;

    const newPostMessage = new PostMessage({ ...post, creator: req.userId, createdAt: new Date().toISOString() });

    try {
        await newPostMessage.save();

        res.status(201).json(newPostMessage);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, message, creator, selectedFile, tags } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    const updatedPost = { creator, title, message, tags, selectedFile, _id: id };

    await PostMessage.findByIdAndUpdate(id, updatedPost, { new: true });

    res.json(updatedPost);
}

export const deletePost = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    await PostMessage.findByIdAndRemove(id);

    res.json({ message: "Post deleted successfully." });
}

export const likePost = async (req, res) => {
    const { id } = req.params;

    if (!req.userId) return res.json('Authenticated')

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    const post = await PostMessage.findById(id);

    const index = post.likes.findIndex((id) => id === String(req.userId));

    if (index === -1) {
        post.likes.push(req.userId);
    } else {
        post.likes = post.likes.filter((id) => id !== String(req.userId))
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

    res.json(updatedPost);
}

export const createComment = async (req, res) => {
    const { id } = req.params;

    const comment = {
        text: req.body.text,
        postedBy: req.userId,
        createdAt: new Date().toISOString()
    }

    await PostMessage.findByIdAndUpdate(id, {
        $push: { comments: comment }
    }, {
        new: true
    })
    .populate('comments.postedBy', '_id name')
    .exec((err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        } else {
            res.json(result)
        }
    })
};

export const deleteComment = async (req, res) => {
    const { id, commentId } = req.params;
  
    const post = await PostMessage.findById(id);
    const user = await User.findById(req.userId);

  
    if (!post) {
      return res.status(404).send({
        message: `Post with ID: ${id} does not exist in database.`,
      });
    }
  
    if (!user) {
      return res
        .status(404)
        .send({ message: 'User does not exist in database.' });
    }
  
    const targetComment = post.comments.find(
      (c) => c._id.toString() === String(commentId)
    );
  
    if (!targetComment) {
      return res.status(404).send({
        message: `Comment with ID: '${commentId}'  does not exist in database.`,
      });
    }
  
    if (targetComment.postedBy._id.toString() !== user._id.toString()) {
      return res.status(401).send({ message: 'Access is denied.' });
    }
  
    post.comments = post.comments.filter((c) => c._id.toString() !== String(commentId));
  
    await post.save();
    res.status(204).end();
  };

  export const updateComment = async (req, res) => {
    const { id, commentId } = req.params;
    const { text } = req.body;
  
    const post = await PostMessage.findById(id).populate("comments.postedBy", "_id name");
    const user = await User.findById(req.userId);
  
    if (!post) {
      return res.status(404).send({
        message: `Post with ID: ${id} does not exist in database.`,
      });
    }
  
    if (!user) {
      return res
        .status(404)
        .send({ message: 'User does not exist in database.' });
    }

    const targetComment = post.comments.find(
      (c) => c._id.toString() === String(commentId)
    );
  
    if (!targetComment) {
      return res.status(404).send({
        message: `Comment with ID: '${commentId}'  does not exist in database.`,
      });
    }
  
    if (targetComment.postedBy._id.toString() !== user._id.toString()) {
      return res.status(401).send({ message: 'Access is denied.' });
    }
  
    targetComment.text = text;
    targetComment.createdAt = Date.now();
  
    post.comments = post.comments.map((c) =>
      c._id.toString() !== String(commentId) ? c : targetComment
    );
  
    await post.save();
    res.json(targetComment);
    // res.status(202).end();
  };

  export const likeComment = async (req, res) => {
    const { id, commentId } = req.params;

    const post = await PostMessage.findById(id).populate("comments.postedBy", "_id name");
    const user = await User.findById(req.userId);
  
    if (!post) {
      return res.status(404).send({
        message: `Post with ID: ${id} does not exist in database.`,
      });
    }
  
    if (!user) {
      return res
        .status(404)
        .send({ message: 'User does not exist in database.' });
    }

    const targetComment = post.comments.find(
      (c) => c._id.toString() === String(commentId)
    );
  
    if (!targetComment) {
      return res.status(404).send({
        message: `Comment with ID: '${commentId}'  does not exist in database.`,
      });
    }
  
    if (targetComment.postedBy._id.toString() !== user._id.toString()) {
      return res.status(401).send({ message: 'Access is denied.' });
    }

    const index = targetComment.likes.findIndex((id) => id === String(req.userId));

    if (index === -1) {
      targetComment.likes.push(req.userId);
    } else {
      targetComment.likes = targetComment.likes.filter((id) => id !== String(req.userId))
    }

    post.comments = post.comments.map((c) =>
      c._id.toString() !== String(commentId) ? c : targetComment
    );

    post.save();

    res.json(targetComment);
}

export default router;