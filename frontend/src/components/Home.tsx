import React from 'react';
import { Card, CardContent, Container, Typography } from '@mui/material';

function Home(){
  return (
    <Container sx={{mt:4, display:'flex', flexDirection:'column', alignItems:'center', minHeight:'80vh', py:2, gap:4}}>
      <Typography variant="h3">Welcome Home! </Typography>
      <Typography variant="h4">Pick your discussion topic </Typography>
        
        {/* main card container */}
        <Card sx ={{maxWidth:600, p:2, width:'100%'}}>
          <CardContent>
            <Typography variant="h3" component="div" gutterBottom>
              Title 1
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Lorem impsum
            </Typography>
          </CardContent>
        </Card>

        <Card sx ={{maxWidth:600, p:2, width:'100%'}}>
          <CardContent>
            <Typography variant="h3" component="div" gutterBottom>
              Title 2
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Lorem impsum
            </Typography>
          </CardContent>
        </Card>

        <Card sx ={{maxWidth:600, p:2, width:'100%'}}>
          <CardContent>
            <Typography variant="h3" component="div" gutterBottom>
              Title 3
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Lorem impsum
            </Typography>
          </CardContent>
        
        </Card>
    </Container>
  )
}
export default Home;