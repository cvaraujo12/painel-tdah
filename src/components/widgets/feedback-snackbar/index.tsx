'use client';

import React from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';

interface FeedbackSnackbarProps {
  open: boolean;
  message: string;
  severity: AlertColor;
  onClose: () => void;
}

export default function FeedbackSnackbar({
  open,
  message,
  severity,
  onClose
}: FeedbackSnackbarProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
} 