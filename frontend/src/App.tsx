import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Link, Route } from 'react-router-dom';
import { AppBar, Button, Card, CardContent, Container, MenuItem, Select, TextField, Toolbar, Typography, CardActionArea } from '@mui/material';
import Home from './components/Home';
import Posts from './components/Posts';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Comments from './components/Comments'
import { User, Post, FeedPost, getPosts, createPost, updatePost, getAllPosts } from './services/api';


function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState<FeedPost[]>([]);
  
  useEffect(() => {
    loadAllPosts();
  }, []);
  
  useEffect(() => {
    if (currentUser) {
      loadPosts();
    } else {
      setUserPosts([]);
    }
  }, [currentUser]);
  
  const ClickAble = async () => {
    const handleClick=()=>{
      
    }
  }
  
  const loadAllPosts = async () =>{
    try {
      setLoading(true);
      const posts = await getAllPosts();
      setAllPosts(posts);
    } catch (error) {
      console.error('Failed to load posts:', error);
      alert('Failed to load posts');
    } finally {
      setLoading(false);
    }
  }
  
  const loadPosts = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const posts = await getPosts(currentUser.id);
      setUserPosts(posts);
    } catch (error) {
      console.error('Failed to load posts:', error);
      alert('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleAddPost = async (postData: Omit<Post, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!currentUser) return;

    try {
      const newPost = await createPost({ ...postData, user_id: currentUser.id });
      setUserPosts(prev => [newPost, ...Array.isArray(prev) ? prev : []]);
      alert('Post created successfully');
    } catch (error) {
      console.error('Failed to create post:', error);
      alert('Failed to create post');
    }
  };

  const handleUpdatePost = async (id: number, updatedPost: Partial<Post>) => {
    if (!currentUser) return;
    
    try {
      const updated = await updatePost(id, currentUser.id, updatedPost);
      setUserPosts(prev => prev.map(post => post.id === id ? updated : post));
    } catch (error) {
      console.error('Failed to update post:', error);
      alert('Failed to update post');
    }
  };

  return (
    <Router>
      {/*navbar menu*/}
      <AppBar position="static" color="secondary">
        <Toolbar>
          <Typography variant="h6" component="div" sx = {{flexGrow:1}}>
            Gossip with Go
          </Typography>
          <Button color="inherit" component={Link} to ="/">Home</Button>
          <Button color="inherit" component={Link} to ="/posts">Posts</Button>
          {currentUser ? (
            <>
              <Button color="inherit" component={Link} to ="/dashboard">Dashboard</Button>
              <Button color="inherit" onClick={handleLogout}>Logout ({currentUser.username})</Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">Login</Button>
              <Button color="inherit" component={Link} to="/register">Register</Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Routes>
        <Route path="/" element={
          <Home 
            allPosts={allPosts}
          />
          } />
        <Route path="/posts" element={
          <Posts
            isLoggedIn={!!currentUser}
            userPosts={userPosts}
            onAddPost={handleAddPost}
            loading={loading}
          />
        } />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register onLogin={handleLogin} />} />
        <Route path="/dashboard" element={
          <Dashboard
            userPosts={userPosts}
            onUpdatePost={handleUpdatePost}
            loading={loading}
          />
        } />
      </Routes>

    </Router>
  );
}

export default App;
