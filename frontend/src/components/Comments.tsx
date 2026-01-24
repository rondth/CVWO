import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, Container, TextField, Typography, Stack, Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import { User } from '../services/api';

interface Comment {
  id: number;
  body: string;
  topic: string;
  username: string;
}

interface CommentsProps {
  currentUser: User | null;
}

function Comments({ currentUser }: CommentsProps) {
  const { postID } = useParams<{ postID: string }>();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = async () => {
    if (!postID) return;
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/posts/${postID}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      } else {
        console.error('Failed to fetch comments');
      }
    } catch (error) {
      console.error('Error connecting to the backend', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postID]);

  const handleAddComment = async () => {
    if (!postID) return;
    if (!currentUser) {
      alert('You must be logged in to comment');
      return;
    }
    if (!newComment.trim()) {
      alert('Please enter a comment');
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch(`http://localhost:8080/api/posts/${postID}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: currentUser.username,
          body: newComment.trim(),
          topic: 'general',
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('Failed to add comment:', text);
        alert('Failed to add comment');
        return;
      }

      setNewComment('');
      await fetchComments();
    } catch (error) {
      console.error('Error adding comment', error);
      alert('Error adding comment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h3"
            sx={{ fontWeight: 800, color: '#1e293b', mb: 1, letterSpacing: '-0.02em' }}
          >
            Comments
          </Typography>
          <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 400 }}>
            Join the discussion on this post
          </Typography>
        </Box>

        {/* Add Comment form */}
        <Card
          elevation={0}
          sx={{
            borderRadius: 4,
            border: '1px solid #e2e8f0',
            mb: 4,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Stack spacing={3}>
              <TextField
                label="Add a comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                fullWidth
                multiline
                rows={3}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#e2e8f0',
                    },
                  },
                }}
              />
              <Button
                variant="contained"
                onClick={handleAddComment}
                disabled={submitting || !postID || !currentUser}
                sx={{
                  bgcolor: '#3b82f6',
                  '&:hover': { bgcolor: '#2563eb' },
                  fontWeight: 600,
                  py: 1.5,
                  alignSelf: 'flex-start',
                }}
              >
                {submitting ? 'Adding…' : 'Add Comment'}
              </Button>
              {!currentUser && (
                <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                  Log in to add a comment.
                </Typography>
              )}
            </Stack>
          </CardContent>
        </Card>

        {/* Comments list */}
        {loading ? (
          <Typography sx={{ textAlign: 'center', color: '#64748b' }}>
            Loading comments...
          </Typography>
        ) : comments.length > 0 ? (
          <Stack spacing={3}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                color: '#334155',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              Recent Comments
            </Typography>
            {comments.map((comment) => (
              <Card
                key={comment.id}
                elevation={0}
                sx={{
                  borderRadius: 4,
                  border: '1px solid #e2e8f0',
                  transition: '0.3s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 16px -8px rgba(0,0,0,0.1)',
                    borderColor: '#3b82f6',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, color: '#475569', mb: 1 }}
                  >
                    {comment.username}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: '#475569', lineHeight: 1.7 }}
                  >
                    {comment.body}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Stack>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 400 }}>
              No comments yet. Be the first to comment!
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default Comments;