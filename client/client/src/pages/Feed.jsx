import React, { useState, useEffect, useContext } from 'react';
import { Container, Typography } from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import { useNavigate } from 'react-router-dom';

const Feed = ({ refreshTrigger }) => {
  const [posts, setPosts] = useState([]);
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate('/login');
    if (user) fetchPosts();
  }, [user, loading, navigate, refreshTrigger]); // Add refreshTrigger here

  const fetchPosts = async () => {
    try {
      const res = await axios.get('/api/posts');
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <Typography sx={{mt: 4, textAlign: 'center'}}>Loading...</Typography>;

  return (
    <Container maxWidth="sm" sx={{ mt: 4, pb: 4 }}>
      {posts.length === 0 ? (
          <Typography align="center" color="textSecondary" sx={{ mt: 5 }}>
            No posts yet. Click "Create Post" to start!
          </Typography>
      ) : (
          posts.map(post => (
            <PostCard key={post._id} post={post} refreshPosts={fetchPosts} />
          ))
      )}
    </Container>
  );
};

export default Feed;