import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  Snackbar,
  Alert,
  CircularProgress,
  CardMedia,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { BlogPost, BlogPostFormData } from '../../../types/HomePage';
import { blogPostService } from '../../../services/homePageService';

const BlogPostsManagement: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState<BlogPostFormData>({
    title: '',
    content: '',
    image: null,
    published_date: new Date().toISOString().split('T')[0],
    slug: '',
    is_published: true,
    order: 0,
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const data = await blogPostService.getAll();
      setPosts(data);
    } catch (error) {
      showNotification('Failed to load posts', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message: string, severity: 'success' | 'error' = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const handleOpenDialog = (post?: BlogPost) => {
    if (post) {
      setEditingPost(post);
      setFormData({
        title: post.title,
        content: post.content || '',
        image: null,
        published_date: post.published_date,
        slug: post.slug,
        is_published: post.is_published,
        order: post.order,
      });
      setPreview(post.image ? `/storage/${post.image}` : null);
    } else {
      setEditingPost(null);
      setFormData({
        title: '',
        content: '',
        image: null,
        published_date: new Date().toISOString().split('T')[0],
        slug: '',
        is_published: true,
        order: posts.length,
      });
      setPreview(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPost(null);
    setPreview(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, image: file }));
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }));
  };

  const handleSubmit = async () => {
    try {
      if (editingPost) {
        await blogPostService.update(editingPost.id!, formData);
        showNotification('Post updated successfully');
      } else {
        await blogPostService.create(formData);
        showNotification('Post created successfully');
      }
      handleCloseDialog();
      loadPosts();
    } catch (error) {
      showNotification('Failed to save post', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await blogPostService.delete(id);
        showNotification('Post deleted successfully');
        loadPosts();
      } catch (error) {
        showNotification('Failed to delete post', 'error');
      }
    }
  };

  if (loading && posts.length === 0) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Blog Posts Management</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
          Add Post
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Published Date</TableCell>
              <TableCell>Published</TableCell>
              <TableCell>Order</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>
                  <Box sx={{ width: 100, height: 60 }}>
                    <CardMedia
                      component="img"
                      image={post.image ? `/storage/${post.image}` : '/assets/house1.jpg'}
                      alt={post.title}
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Box>
                </TableCell>
                <TableCell>{post.title}</TableCell>
                <TableCell>{post.published_date}</TableCell>
                <TableCell>{post.is_published ? 'Yes' : 'No'}</TableCell>
                <TableCell>{post.order}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(post)}><EditIcon /></IconButton>
                  <IconButton onClick={() => handleDelete(post.id!)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editingPost ? 'Edit Post' : 'Add Post'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Title"
              fullWidth
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
            />
            <TextField
              label="Slug"
              fullWidth
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
            />
            <TextField
              label="Content"
              fullWidth
              multiline
              rows={4}
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            />
            <TextField
              label="Published Date"
              type="date"
              fullWidth
              value={formData.published_date}
              onChange={(e) => setFormData(prev => ({ ...prev, published_date: e.target.value }))}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Order"
              type="number"
              fullWidth
              value={formData.order}
              onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_published}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_published: e.target.checked }))}
                />
              }
              label="Published"
            />
            <Button variant="outlined" component="label">
              Upload Image
              <input type="file" hidden accept="image/*" onChange={handleFileChange} />
            </Button>
            {preview && (
              <Box sx={{ mt: 2 }}>
                <CardMedia
                  component="img"
                  image={preview}
                  alt="Preview"
                  sx={{ maxHeight: 200, objectFit: 'cover' }}
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={notification.severity}>{notification.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default BlogPostsManagement;


