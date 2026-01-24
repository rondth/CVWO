import React from 'react';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Typography,
  Chip,
  Avatar,
  Stack
} from '@mui/material';
import { Link } from 'react-router-dom';

interface Post {
  id: number;
  title: string;
  body: string;
  topic: string;
  username: string;
}

interface HomeProps {
  allPosts: Post[];
}

function Home({ allPosts }: HomeProps) {
  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="md">
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h3"
            sx={{ fontWeight: 800, color: '#1e293b', mb: 1, letterSpacing: '-0.02em' }}
          >
            Welcome Home
          </Typography>
          <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 400 }}>
            Join the conversation and explore trending topics
          </Typography>
        </Box>

        {allPosts !== null && allPosts.length > 0 && (
          <Stack spacing={3}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.1em' }}
            >
              Latest Discussions
            </Typography>

            {allPosts.map((post) => (
              <Card
                key={post.id}
                elevation={0}
                sx={{
                  borderRadius: 4,
                  border: '1px solid #e2e8f0',
                  transition: '0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px -10px rgba(0,0,0,0.1)',
                    borderColor: '#3b82f6'
                  }
                }}
              >
                <CardActionArea component={Link} to={`/comments/${post.id}`} sx={{ p: 1 }}>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                      <Avatar sx={{ bgcolor: '#3b82f6', width: 32, height: 32, fontSize: '0.875rem' }}>
                        {post.username.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#475569' }}>
                        {post.username}
                      </Typography>
                    </Stack>

                    <Typography
                      variant="h5"
                      gutterBottom
                      sx={{ fontWeight: 700, color: '#1e293b' }}
                    >
                      {post.title}
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{
                        color: '#475569',
                        mb: 3,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {post.body}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                      <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 500 }}>
                        Comments →
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Stack>
        )}
      </Container>
    </Box>
  );
}

export default Home;