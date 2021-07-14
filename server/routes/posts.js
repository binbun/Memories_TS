import express from 'express';

import { getPosts, getPostsBySearch, createPost, updatePost, likePost, deletePost, getPost, createComment, deleteComment, updateComment, likeComment } from '../controllers/posts.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', getPosts);
router.get('/search', getPostsBySearch);
router.get('/:id', getPost);
router.post('/', auth, createPost);
router.patch('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);
router.patch('/:id/likePost', auth, likePost);

router.put('/:id/comment', auth, createComment);
router.delete('/:id/comment/:commentId', auth, deleteComment);
router.patch('/:id/comment/:commentId', auth, updateComment);
router.patch('/:id/comment/:commentId/likeComment', auth, likeComment);

export default router;