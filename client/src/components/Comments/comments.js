import React, { useState } from 'react';
import { TextField, Grid, Avatar, Button, CardActions } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { deleteComment, likeComment, updateComment } from '../../actions/posts';
import AddIcon from '@material-ui/icons/Add';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

import useStyles from './styles'

export default function Comments({ comment }) {

  const { post, comments } = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const classes = useStyles();
  const [commentData, setCommentData] = useState({ text: '' });
  const [currentId, setCurrentId] = useState(0);
  const user = JSON.parse(localStorage.getItem('profile'));

  console.log(comments);

  const Likes = () => {
    if (comment.likes) {
      if (comment.likes.length > 0) {
        return comment.likes.find((like) => like === (user?.result?.googleId || user?.result?._id))
          ? (
            <>&nbsp;{comment.likes.length > 2 ? `You and ${comment.likes.length - 1} others` : `${comment.likes.length} like${comment.likes.length > 1 ? 's' : ''}`}</>
          ) : (
            <>&nbsp;{comment.likes.length} {comments.likes.length === 1 ? 'Like' : 'Likes'}</>
          );
      }
    }

    return <>&nbsp;Like</>;
  };

  return (
    <Grid container wrap="nowrap" spacing={2}>
      <Grid item>
        <Avatar className={classes.purple} alt={comment.postedBy.name} >
          {comment.postedBy.name.charAt(0)}
        </Avatar>
      </Grid>
      <Grid justifyContent="left" item xs zeroMinWidth>
        <h4 style={{ margin: 0, textAlign: "left" }}>{comment.postedBy.name}</h4>
        {currentId !== comment._id
          ? (
            <p style={{ textAlign: "left" }}>
              {comment.text}
            </p>
          )
          : (
            <TextField
              name="title"
              variant="outlined"
              fullWidth
              defaultValue={comment.text}
              onChange={(e) => setCommentData({ ...commentData, text: e.target.value })}
              InputProps={{ endAdornment: <AddIcon onClick={() => { dispatch(updateComment(post._id, comment._id, commentData)); setCurrentId(0) }} style={{ margin: '20px', cursor: 'pointer' }} /> }}
            />
          )
        }
        {(user?.result?.googleId === comment?.postedBy?._id || user?.result?._id === comment?.postedBy?._id) && (
          <CardActions fontSize='small' style={{width: "100%"}}>
            <Button size="small" color="primary" disabled={!user?.result} onClick={() => dispatch(likeComment(post._id, comment._id))} style={{float: 'left'}}>
              <Likes />
            </Button>
            <Button size='small' color='primary' disabled={!user?.result}>
              Reply
            </Button>
            <Button size="small" color="secondary" onClick={() => dispatch(deleteComment(post._id, comment._id))}>
              Delete
            </Button>
            <p style={{ textAlign: "left", color: "gray" }}>
              {moment(comment.createdAt).fromNow()}
            </p>
          </CardActions>
        )}
      </Grid>
      {(user?.result?.googleId === comment?.postedBy?._id || user?.result?._id === comment?.postedBy?._id) && (
        <Grid justifyContent="right" item zeroMinWidth >
          <Button style={{ color: 'black' }} size="small" onClick={() => !currentId ? setCurrentId(comment._id) : setCurrentId(0)}>
            <MoreHorizIcon fontSize="default" />
          </Button>
        </Grid>
      )}
    </Grid>
  );
}
