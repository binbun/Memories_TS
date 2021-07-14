import React, { useEffect, useState } from 'react';
import { Typography, Paper, CircularProgress, Divider, TextField } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useParams, useHistory } from 'react-router-dom';
import { createComment, getPost, getPostsBySearch } from '../../actions/posts';
import AddIcon from '@material-ui/icons/Add';

import useStyles from './styles'
import Comments from '../Comments/comments';

const PostDetails = () => {
  const { post, posts, isLoading, comments } = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const classes = useStyles();
  const { id } = useParams();
  const history = useHistory();
  const [commentData, setCommentData] = useState({ text: '' });
  const user = JSON.parse(localStorage.getItem('profile'));

  useEffect(() => {
    dispatch(getPost(id));
  }, [id, dispatch])

  useEffect(() => {
    if (post) {
      dispatch(getPostsBySearch({ search: 'none', tags: post?.tags.join(',') }));
    }
  }, [post, dispatch])

  if (!post) return null;

  if (isLoading) {
    return (
      <Paper elevation={6} className={classes.loadingPaper}>
        <CircularProgress size='7em' />
      </Paper>
    )
  }

  const recommendedPosts = posts.filter((_id) => _id !== post._id);

  const openPost = (_id) => {
    history.push(`/posts/${_id}`)
  }

  const handleCommentSubmit = () => {
    dispatch(createComment(post._id, commentData));
  }

  return (
    <Paper style={{ padding: '20px', borderRadius: '15px' }} elevation={6}>
      <div className={classes.card}>
        <div className={classes.section}>
          <Typography variant="h3" component="h2">{post.title}</Typography>
          <Typography gutterBottom variant="h6" color="textSecondary" component="h2">{post.tags.map((tag) => `#${tag} `)}</Typography>
          <Typography gutterBottom variant="body1" component="p">{post.message}</Typography>
          <Typography variant="h6">Created by: {post.name}</Typography>
          <Typography variant="body1">{moment(post.createdAt).fromNow()}</Typography>
          <Divider style={{ margin: '20px 0' }} />
          <Typography variant="body1"><strong>{user ? 'Write something' : 'Login to tell others how you fell'}</strong></Typography>
          {user && (<TextField
            name="title"
            variant="outlined"
            fullWidth
            onChange={(e) => setCommentData({ ...commentData, text: e.target.value })}
            InputProps={{ endAdornment: <AddIcon onClick={handleCommentSubmit} style={{ margin: '20px', cursor: 'pointer' }} /> }}
          />)}
          <Divider style={{ margin: '20px 0' }} />
          {!!comments.length && (comments?.map((comment) => (
            <Comments comment={comment} style={{width: '100%'}}/>
          )))}
          <Divider style={{ margin: '20px 0' }} />
        </div>
        <div className={classes.imageSection}>
          <img className={classes.media} src={post.selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'} alt={post.title} />
        </div>
      </div>
      {!!recommendedPosts.length && (
        <div className={classes.section}>
          <Typography gutterBottom variant='h5'>You might also like:</Typography>
          <Divider />
          <div className={classes.recommendedPosts}>
            {recommendedPosts.map(({ title, message, name, likes, selectedFile, _id }) => (
              <div style={{ margin: '20px', cursor: 'pointer' }} onClick={() => openPost(_id)} key={_id}>
                {title}
              </div>
            ))}
          </div>
        </div>
      )}
    </Paper>
  );
}

export default PostDetails
