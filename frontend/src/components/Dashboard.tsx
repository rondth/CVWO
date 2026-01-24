import React, { useState } from 'react';
import { Button, Card, CardContent, Container, TextField, Typography, Box, Stack, Chip } from '@mui/material';

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
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h3"
            sx={{ fontWeight: 800, color: '#1e293b', mb: 1, letterSpacing: '-0.02em' }}
          >
            Your Posts
          </Typography>
          <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 400 }}>
            Manage and edit your posts
          </Typography>
        </Box>

        {loading ? (
          <Typography sx={{ textAlign: 'center', color: '#64748b' }}>Loading posts...</Typography>
        ) : userPosts === null || userPosts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 400 }}>
              No posts yet. Create one in Posts!
            </Typography>
          </Box>
        ) : (
          <Stack spacing={3}>
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
                  {editingId === post.id ? (
                    <Stack spacing={2}>
                      <TextField
                        label="Title"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        fullWidth
                        disabled={updating}
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
                        value={editBody}
                        onChange={(e) => setEditBody(e.target.value)}
                        fullWidth
                        multiline
                        rows={4}
                        disabled={updating}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: '#e2e8f0',
                            },
                          },
                        }}
                      />
                      <TextField
                        label="Topic"
                        value={editTopic}
                        onChange={(e) => setEditTopic(e.target.value)}
                        fullWidth
                        disabled={updating}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: '#e2e8f0',
                            },
                          },
                        }}
                      />
                      <Stack direction="row" spacing={2}>
                        <Button
                          onClick={handleSave}
                          variant="contained"
                          disabled={updating}
                          sx={{
                            bgcolor: '#3b82f6',
                            '&:hover': { bgcolor: '#2563eb' },
                            fontWeight: 600
                          }}
                        >
                          {updating ? 'Saving...' : 'Save'}
                        </Button>
                        <Button
                          onClick={handleCancel}
                          variant="outlined"
                          disabled={updating}
                          sx={{
                            borderColor: '#e2e8f0',
                            color: '#475569',
                            '&:hover': {
                              borderColor: '#cbd5e1',
                              bgcolor: '#f1f5f9'
                            }
                          }}
                        >
                          Cancel
                        </Button>
                      </Stack>
                    </Stack>
                  ) : (
                    <Stack spacing={2}>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: 700, color: '#1e293b' }}
                      >
                        {post.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ color: '#475569', lineHeight: 1.7 }}
                      >
                        {post.body}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1 }}>
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
                        <Button
                          onClick={() => handleEdit(post)}
                          variant="outlined"
                          sx={{
                            borderColor: '#e2e8f0',
                            color: '#475569',
                            '&:hover': {
                              borderColor: '#3b82f6',
                              color: '#3b82f6',
                              bgcolor: '#eff6ff'
                            },
                            fontWeight: 600
                          }}
                        >
                          Edit
                        </Button>
                      </Box>
                    </Stack>
                  )}
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Container>
    </Box>
  );
}

export default Dashboard;