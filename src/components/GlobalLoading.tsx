'use client';

import React from 'react';
import {
  Backdrop,
  CircularProgress,
  Typography,
  Box,
  useTheme
} from '@mui/material';
import { useLoading } from '../hooks/useLoading';

export default function GlobalLoading() {
  const { isLoading, message } = useLoading();
  const theme = useTheme();

  if (!isLoading) return null;

  return (
    <Backdrop
      open={isLoading}
      sx={{
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
        backdropFilter: 'blur(4px)',
        backgroundColor: 'rgba(0, 0, 0, 0.7)'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2
        }}
      >
        <CircularProgress color="inherit" size={48} />
        {message && (
          <Typography
            variant="h6"
            component="div"
            sx={{
              color: 'white',
              textAlign: 'center',
              maxWidth: '80vw',
              wordBreak: 'break-word'
            }}
          >
            {message}
          </Typography>
        )}
      </Box>
    </Backdrop>
  );
} 