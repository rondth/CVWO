import React, {useState} from 'react';
import {Button, Card, CardContent, Container, TextField, Typography } from '@mui/material';

interface Post {
  id: number;
  title: string;
  body: string;
  topic: string;
}

interface DashboardProps {
  userPosts: Post[];
  onUpdatePost: (id: number, updatedPost: Partial<Post>) => void;
  loading?: boolean;
}

function Dashboard({ userPosts, onUpdatePost, loading = false }: DashboardProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');
  const [editTopic, setEditTopic] = useState('');
  const [updating, setUpdating] = useState(false);

  const handleEdit = (post: Post) => {
    setEditingId(post.id);
    setEditTitle(post.title);
    setEditBody(post.body);
    setEditTopic(post.topic);
  };

  const handleSave = async () => {
    if (editingId !== null) {
      try {
        setUpdating(true);
        await onUpdatePost(editingId, { title: editTitle, body: editBody, topic: editTopic });
        setEditingId(null);
      } catch (error) {
        console.error('Failed to update post:', error);
        alert('Failed to update post. Please try again.');
      } finally {
        setUpdating(false);
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  return (
    <Container sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '80vh' }}>
      <Typography variant="h4" gutterBottom>Your Posts</Typography>
      {loading ? (
        <Typography>Loading posts...</Typography>
      ) : userPosts.length === 0 ? (
        <Typography>No posts yet. Create one in Posts!</Typography>
      ) : (
        userPosts.map((post) => (
          <Card key={post.id} sx={{ maxWidth: 600, width: '100%', mb: 2, p: 2 }}>
            <CardContent>
              {editingId === post.id ? (
                <>
                  <TextField
                    label="Title"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                    disabled={updating}
                  />
                  <TextField
                    label="Body"
                    value={editBody}
                    onChange={(e) => setEditBody(e.target.value)}
                    fullWidth
                    multiline
                    rows={4}
                    sx={{ mb: 2 }}
                    disabled={updating}
                  />
                  <TextField
                    label="Topic"
                    value={editTopic}
                    onChange={(e) => setEditTopic(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                    disabled={updating}
                  />
                  <Button onClick={handleSave} variant="contained" sx={{ mr: 1 }} disabled={updating}>
                    {updating ? 'Saving...' : 'Save'}
                  </Button>
                  <Button onClick={handleCancel} variant="outlined" disabled={updating}>Cancel</Button>
                </>
              ) : (
                <>
                  <Typography variant="h5">{post.title}</Typography>
                  <Typography variant="body1">{post.body}</Typography>
                  <Typography variant="body2" color="text.secondary">Topic: {post.topic}</Typography>
                  <Button onClick={() => handleEdit(post)}  variant="outlined" color = "secondary" sx={{ mt: 1 }}>Edit</Button>
                </>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </Container>
  );
}

export default Dashboard;