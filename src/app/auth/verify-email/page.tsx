'use client'

import React from 'react'
import { Box, Container, Typography, Paper } from '@mui/material'

export default function VerifyEmailPage() {
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%', textAlign: 'center' }}>
          <Typography component="h1" variant="h5" gutterBottom>
            Verifique seu Email
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Um link de verificação foi enviado para seu email.
            Por favor, verifique sua caixa de entrada e spam.
          </Typography>
        </Paper>
      </Box>
    </Container>
  )
} 