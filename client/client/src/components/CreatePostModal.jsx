import React, { useState, useContext } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, Button, IconButton, Box, Typography 
} from '@mui/material';
import { Close, CloudUpload } from '@mui/icons-material';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const CreatePostModal = ({ open, handleClose, refreshPosts }) => {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const { token } = useContext(AuthContext);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('text', text);
    if (file) {
      formData.append('image', file);
    }

    try {
      await axios.post('/api/posts', formData, {
        headers: { 
          'x-auth-token': token,
          'Content-Type': 'multipart/form-data' // Crucial for files
        }
      });
      // Reset and Close
      setText('');
      setFile(null);
      setPreview('');
      refreshPosts(); // Refresh feed
      handleClose();
    } catch (err) {
      console.error(err);
      alert('Error creating post');
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Create Post
        <IconButton
          onClick={handleClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        <TextField
          autoFocus
          margin="dense"
          label="What's on your mind?"
          fullWidth
          multiline
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="raised-button-file"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="raised-button-file">
            <Button variant="outlined" component="span" startIcon={<CloudUpload />}>
              Upload Image
            </Button>
          </label>
        </Box>

        {preview && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <img src={preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: 8 }} />
          </Box>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!text && !file}>
          Post
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreatePostModal;