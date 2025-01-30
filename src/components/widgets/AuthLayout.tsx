'use client'

import React from 'react'
import { Box, CircularProgress, Container } from '@mui/material'
import { useAuth } from '../hooks/useAuth'

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const { loading } = useAuth()

  if (loading) {
    return (
      <Container>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  return <>{children}</>
} 