'use client';

import React from 'react';
import { Box, Container } from '@mui/material';
import { useResponsive } from '../hooks/useResponsive';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
}

export default function ResponsiveLayout({ children }: ResponsiveLayoutProps) {
  const { getContainerWidth, getSpacing } = useResponsive();

  return (
    <Container
      maxWidth={getContainerWidth()}
      sx={{
        py: getSpacing(),
        px: { xs: 1, sm: 2, md: 3 },
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: getSpacing()
        }}
      >
        {children}
      </Box>
    </Container>
  );
} 