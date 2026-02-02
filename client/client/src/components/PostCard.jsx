import React, { useState, useContext } from 'react';
import { Card, CardHeader, CardMedia, CardContent, CardActions, Avatar, IconButton, Typography, TextField, Button, Box, Collapse } from '@mui/material';
import { Favorite, FavoriteBorder, Comment } from '@mui/icons-material';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const PostCard = ({ post, refreshPosts }) => {
  const { user, token } = useContext(AuthContext);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);

  const isLiked = post.likes.includes(user.id);

  const handleLike = async () => {
    try {
      await axios.put(`/api/posts/${post._id}/like`, {}, {
        headers: { 'x-auth-token': token }
      });
      refreshPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      await axios.post(`/api/posts/${post._id}/comment`, { text: commentText }, {
        headers: { 'x-auth-token': token }
      });
      setCommentText('');
      refreshPosts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        avatar={<Avatar sx={{ bgcolor: 'primary.main' }}>{post.user.username[0].toUpperCase()}</Avatar>}
        title={post.user.username}
        subheader={new Date(post.createdAt).toLocaleDateString()}
      />
      {post.image && (
        <CardMedia
          component="img"
          height="300"
          image={post.image}
          alt="Post image"
        />
      )}
      <CardContent>
        <Typography variant="body1">{post.text}</Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton onClick={handleLike}>
          {isLiked ? <Favorite color="error" /> : <FavoriteBorder />}
        </IconButton>
        <Typography variant="body2" sx={{ mr: 2 }}>{post.likes.length}</Typography>
        
        <IconButton onClick={() => setShowComments(!showComments)}>
          <Comment />
        </IconButton>
        <Typography variant="body2">{post.comments.length}</Typography>
      </CardActions>

      <Collapse in={showComments} timeout="auto" unmountOnExit>
        <Box sx={{ p: 2, bgcolor: '#f9f9f9' }}>
          {post.comments.map((comment, index) => (
            <Box key={index} sx={{ mb: 1, p: 1, borderBottom: '1px solid #ddd' }}>
              <Typography variant="subtitle2" component="span" sx={{ fontWeight: 'bold' }}>
                {comment.username}: 
              </Typography>
              <Typography variant="body2" component="span" sx={{ ml: 1 }}>
                {comment.text}
              </Typography>
            </Box>
          ))}
          <form onSubmit={handleComment} style={{ display: 'flex', marginTop: '10px' }}>
            <TextField 
              size="small" 
              fullWidth 
              placeholder="Write a comment..." 
              value={commentText} 
              onChange={(e) => setCommentText(e.target.value)} 
            />
            <Button type="submit" variant="contained" sx={{ ml: 1 }}>Post</Button>
          </form>
        </Box>
      </Collapse>
    </Card>
  );
};

export default PostCard;