import React, { useState } from 'react';
import { Button, Container, TextField, Typography } from '@mui/material';
import { loginUser, User } from '../services/api';

interface LoginProps {
  onLogin: (user: User) => void;
}

function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username.trim()) {
      alert('Please enter a username');
      return;
    }

    try {
      setLoading(true);
      const user = await loginUser(username.trim());
      onLogin(user);
      alert(`Logged in as ${user.username}`);
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '80vh', py: 2, gap: 4 }}>
      <Typography variant="h4">Welcome Back!</Typography>
      <Typography variant="h6">Write your username to login</Typography>
      <TextField
        label="Username"
        variant="outlined"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        sx={{ mb: 2, width: 300 }}
        disabled={loading}
      />
      <Button
        variant="contained"
        onClick={handleLogin}
        disabled={loading}
        sx={{ bgcolor: "#60e860ff" }}
      >
        {loading ? 'Logging in...' : 'Login'}
      </Button>
    </Container>
  );
}

export default Login;