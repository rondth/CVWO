import React, { useState } from 'react';
import { Button, Card, CardContent, Container, MenuItem, Select, TextField, Typography } from '@mui/material';

interface Post {
  id: number;
  title: string;
  body: string;
  topic: string;
}

interface PostsProps {
  isLoggedIn: boolean;
  userPosts: Post[];
  onAddPost: (post: Omit<Post, 'id'>) => void;
  loading?: boolean;
}

function Posts({ isLoggedIn, userPosts, onAddPost, loading = false }: PostsProps) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [topic, setTopic] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    const finalTopic = topic === 'others' ? customTopic : topic;
    if (title.trim() && body.trim() && finalTopic.trim()) {
      try {
        setSubmitting(true);
        await onAddPost({ title, body, topic: finalTopic });
        alert('Post submitted!');
        setTitle('');
        setBody('');
        setTopic('');
        setCustomTopic('');
      } catch (error) {
        console.error('Failed to submit post:', error);
        alert('Failed to submit post. Please try again.');
      } finally {
        setSubmitting(false);
      }
    } else {
      alert('Please fill all fields');
    }
  };

  if (!isLoggedIn) {
    return (
      <Container sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '80vh' }}>
        <Typography variant="h4">Please log in to create or view posts.</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '80vh', py: 2, gap: 4 }}>
      <Card sx={{ maxWidth: 600, p: 2, width: '100%' }}>
        <CardContent>
          <Typography variant="h3" component="div" gutterBottom>
            Create a New Post
          </Typography>
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={submitting}
          />

          <TextField
            label="Body"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            sx={{ mb: 2 }}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            disabled={submitting}
          />

          <Select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            displayEmpty
            fullWidth
            sx={{ mb: 2 }}
            disabled={submitting}
          >
            <MenuItem value="" disabled>Select Topic</MenuItem>
            <MenuItem value="general">General</MenuItem>
            <MenuItem value="technology">Tech</MenuItem>
            <MenuItem value="sports">Sports</MenuItem>
            <MenuItem value="others">Others</MenuItem>
          </Select>

          {topic === 'others' && (
            <TextField
              label="Specify Topic"
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              disabled={submitting}
            />
          )}

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={submitting}
            sx={{ bgcolor: '#60e860ff' }}
          >
            {submitting ? 'Submitting...' : 'Submit Post'}
          </Button>
        </CardContent>
      </Card>

      {/* Display user's posts */}
      {userPosts.length > 0 && (
        <>
          <Typography variant="h4" sx={{ mt: 4 }}>Your Posts</Typography>
          {userPosts.map((post) => (
            <Card key={post.id} sx={{ maxWidth: 600, width: '100%', mb: 2 }}>
              <CardContent>
                <Typography variant="h5">{post.title}</Typography>
                <Typography variant="body1">{post.body}</Typography>
                <Typography variant="body2" color="text.secondary">Topic: {post.topic}</Typography>
              </CardContent>
            </Card>
          ))}
        </>
      )}
    </Container>
  );
}

export default Posts;