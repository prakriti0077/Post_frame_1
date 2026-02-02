import React, { useContext, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { AddBox } from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import CreatePostModal from './CreatePostModal';

const Navbar = ({ refreshFeed }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>
            SocialFeed
          </Typography>
          
          {user ? (
            <Box display="flex" alignItems="center">
               {/* Create Post Button */}
              <Button 
                variant="contained" 
                color="secondary" 
                startIcon={<AddBox />} 
                onClick={() => setOpenModal(true)}
                sx={{ mr: 2, backgroundColor: 'white', color: 'primary.main', '&:hover': { backgroundColor: '#f5f5f5' } }}
              >
                Create Post
              </Button>

              <Typography variant="subtitle1" component="span" sx={{ mr: 2 }}>
                {user.username}
              </Typography>
              <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </Box>
          ) : (
            <Box>
              <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
              <Button color="inherit" onClick={() => navigate('/signup')}>Signup</Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* The Modal */}
      <CreatePostModal 
        open={openModal} 
        handleClose={() => setOpenModal(false)} 
        refreshPosts={refreshFeed} 
      />
    </>
  );
};

export default Navbar;