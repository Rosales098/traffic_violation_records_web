import React from 'react';
import { Typography, Card, CardContent } from '@mui/material';

function CardContainer({ title = '', subtitle = '', elevation = 0, children }) {
  return (
    <Card sx={{ boxShadow: elevation }}>
      <CardContent>
        <Typography sx={{ fontSize: 15, marginBottom: -0 }} color="#000" gutterBottom>
          {title}
        </Typography>
        <Typography sx={{ fontSize: 12 }} color="text.secondary" gutterBottom>
          {subtitle}
        </Typography>
        {children}
      </CardContent>
    </Card>
  );
}
export default CardContainer;
