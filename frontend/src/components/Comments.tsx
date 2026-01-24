import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, Container, MenuItem, Select, TextField, Typography } from '@mui/material';
import { useFetcher, useParams } from 'react-router-dom';

interface Comments {
  id: number;
  body: string;
  topic: string;
  username:string;
}

// interface comments {
//   comments: Comments[];
// }

function Comment(){
  const {postID} = useParams<{postID : string}>();
  const [comments, setComments] = useState<Comments[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(()=>{
    const fetchComments = async () => {
      try {
        console.log("Fetching comments for Post ID", postID);

        const response = await fetch(`http://localhost:3000/posts/${postID}/comments`)

        if (response.ok){
          const data = await response.json();
          setComments(data);
        }
        else {
          console.error("Failed to fetch comments")
        }
      }
      catch (error){
        console.error("Error connecting to the backend", error);
      }
      finally{
        setLoading(false);
      }
    };

    if (postID){
      fetchComments();
    }
  }, [postID]);

  return (
    <Container sx={{mt:4, display:'flex', flexDirection:'column', alignItems:'center', minHeight:'80vh', py:2, gap:4}}>
      {comments.length !== null && comments.length > 0 && (
        <>
          <Typography variant="h4" sx={{ mt: 4 }}>Comments</Typography>
          {comments.map((comments) => (
            <Card key={comments.id} sx={{ maxWidth: 600, width: '100%', mb: 2 }}>
              <CardContent>
                <Typography variant ="body1"> {comments.username}</Typography>
                <Typography variant="body1">{comments.body}</Typography>
                {/* <Typography variant="body2" color="text.secondary">Topic: {comments.topic}</Typography> */}
              </CardContent>
            </Card>
          ))}
        </>
      )}
    </Container>
  )
}
export default Comment;