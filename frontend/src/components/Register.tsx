import React, { useState } from 'react';
import { Button, Container, TextField, Typography } from '@mui/material';
import { registerUser, User } from '../services/api';

interface RegisterProps {
  onLogin: (user: User) => void;
}

function Register({ onLogin }: RegisterProps) {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username.trim()) {
      alert('Please enter a username');
      return;
    }

    try {
      setLoading(true);
      const user = await registerUser(username.trim());
      onLogin(user);
      alert(`Registered and logged in as ${user.username}`);
    } catch (error: any) {
      if (error.status === 409) {
        console.error('Registration failed:', error);
        alert('Username already exists. Please choose a different username.');
      } else if (error.status===500){
        console.error('Registration failed:', error);
        alert('Registration failed. Please try again.');
      }
    }finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '80vh', py: 2, gap: 4 }}>
      <Typography variant="h4">Create Account</Typography>
      <Typography variant="h6">Enter your username to register</Typography>
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
        onClick={handleRegister}
        disabled={loading}
        sx={{ bgcolor: "#60e860ff" }}
      >
        {loading ? 'Registering...' : 'Register'}
      </Button>
    </Container>
  );
}

export default Register;

