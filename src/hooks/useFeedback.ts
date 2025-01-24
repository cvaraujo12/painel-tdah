import { useState, useCallback } from 'react';
import { AlertColor } from '@mui/material';

interface FeedbackState {
  open: boolean;
  message: string;
  severity: AlertColor;
}

export function useFeedback() {
  const [feedback, setFeedback] = useState<FeedbackState>({
    open: false,
    message: '',
    severity: 'info'
  });

  const showFeedback = useCallback((message: string, severity: AlertColor = 'info') => {
    setFeedback({
      open: true,
      message,
      severity
    });
  }, []);

  const hideFeedback = useCallback(() => {
    setFeedback(prev => ({
      ...prev,
      open: false
    }));
  }, []);

  const showSuccess = useCallback((message: string) => {
    showFeedback(message, 'success');
  }, [showFeedback]);

  const showError = useCallback((message: string) => {
    showFeedback(message, 'error');
  }, [showFeedback]);

  const showInfo = useCallback((message: string) => {
    showFeedback(message, 'info');
  }, [showFeedback]);

  const showWarning = useCallback((message: string) => {
    showFeedback(message, 'warning');
  }, [showFeedback]);

  return {
    feedback,
    showFeedback,
    hideFeedback,
    showSuccess,
    showError,
    showInfo,
    showWarning
  };
} 