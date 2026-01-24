import React, { useState } from 'react';
import { Button, Card, CardContent, Container, MenuItem, Select, TextField, Typography, Box, Stack, Chip } from '@mui/material';

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
      <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', py: 6 }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography
              variant="h3"
              sx={{ fontWeight: 800, color: '#1e293b', mb: 2, letterSpacing: '-0.02em' }}
            >
              Please log in
            </Typography>
            <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 400 }}>
              You need to log in to create or view posts.
            </Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h3"
            sx={{ fontWeight: 800, color: '#1e293b', mb: 1, letterSpacing: '-0.02em' }}
          >
            Create a New Post
          </Typography>
          <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 400 }}>
            Share your thoughts with the community
          </Typography>
        </Box>

        <Card
          elevation={0}
          sx={{
            borderRadius: 4,
            border: '1px solid #e2e8f0',
            mb: 4
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Stack spacing={3}>
              <TextField
                label="Title"
                variant="outlined"
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={submitting}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#e2e8f0',
                    },
                  },
                }}
              />

              <TextField
                label="Body"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                disabled={submitting}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#e2e8f0',
                    },
                  },
                }}
              />

              <Select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                displayEmpty
                fullWidth
                disabled={submitting}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e2e8f0',
                  },
                }}
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
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  disabled={submitting}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#e2e8f0',
                      },
                    },
                  }}
                />
              )}

              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={submitting}
                sx={{
                  bgcolor: '#3b82f6',
                  '&:hover': { bgcolor: '#2563eb' },
                  fontWeight: 600,
                  py: 1.5
                }}
              >
                {submitting ? 'Submitting...' : 'Submit Post'}
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {userPosts !== null && userPosts.length > 0 && (
          <Stack spacing={3}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.1em' }}
            >
              Your Posts
            </Typography>
            {userPosts.map((post) => (
              <Card
                key={post.id}
                elevation={0}
                sx={{
                  borderRadius: 4,
                  border: '1px solid #e2e8f0',
                  transition: '0.3s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 16px -8px rgba(0,0,0,0.1)',
                    borderColor: '#3b82f6'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: '#1e293b', mb: 1.5 }}
                  >
                    {post.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: '#475569', lineHeight: 1.7, mb: 2 }}
                  >
                    {post.body}
                  </Typography>
                  <Chip
                    label={post.topic}
                    size="small"
                    sx={{
                      bgcolor: '#eff6ff',
                      color: '#1d4ed8',
                      fontWeight: 600,
                      borderRadius: '6px'
                    }}
                  />
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Container>
    </Box>
  );
}

export default Posts;