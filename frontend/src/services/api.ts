import { NumberLiteralType } from "typescript";

const API_BASE_URL = 'http://localhost:8080/api';

export interface User {
  id: number;
  username: string;
  created_at: string;
}

export interface Post {
  id: number;
  title: string;
  body: string;
  topic: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface FeedPost{
  id : number;
  title: string;
  body: string;
  topic: string;
  username: string;
}

export interface Comments{
  id : number;
  body: string;
  topic: string;
  username: string;
}

// User API functions
export const loginUser = async (username: string): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username }),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    const error:any = new Error(errorMessage);
    error.status=response.status;
    throw error;
  }

  return response.json();
};

export const registerUser = async (username: string): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username }),
  });
  
  if (!response.ok) {
    const errorMessage = await response.text();
    const error:any=new Error(errorMessage);
    error.status=response.status;
    throw error;
  }

  return response.json();
};

// Post API functions
export const getComments = async(): Promise<Comments[]>=>{
  const response = await fetch (`${API_BASE_URL}/comments`)
  if (!response.ok){
    throw new Error ("Failed to load comments");
  }
  
  return response.json();
};

export const getAllPosts = async (): Promise<FeedPost[]> => {
  const response = await fetch(`${API_BASE_URL}/feed`);
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }
  return response.json();
};

export const getPosts = async (userId: number): Promise<Post[]> => {
  const response = await fetch(`${API_BASE_URL}/posts?user_id=${userId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }

  return response.json();
};

export const createPost = async (post: Omit<Post, 'id' | 'created_at' | 'updated_at'>): Promise<Post> => {
  const response = await fetch(`${API_BASE_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(post),
  });

  if (!response.ok) {
    throw new Error('Failed to create post');
  }

  return response.json();
};

export const updatePost = async (id: number, userId: number, post: Partial<Pick<Post, 'title' | 'body' | 'topic'>>): Promise<Post> => {
  const response = await fetch(`${API_BASE_URL}/posts/${id}?user_id=${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(post),
  });

  if (!response.ok) {
    throw new Error('Failed to update post');
  }

  return response.json();
};

export const deletePost = async (id: number, userId: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/posts/${id}?user_id=${userId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete post');
  }
};