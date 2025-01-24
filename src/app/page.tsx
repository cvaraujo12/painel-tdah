'use client';

import React, { useState } from 'react'
import { Box, Toolbar } from '@mui/material'
import AuthLayout from '@/components/AuthLayout'
import Header from '@/components/Header'
import WidgetLayout from '@/components/WidgetLayout'

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <AuthLayout>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Header onMenuClick={() => setMenuOpen(!menuOpen)} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: 'background.default',
            minHeight: '100vh',
          }}
        >
          <Toolbar /> {/* Espaçamento para o AppBar fixo */}
          <WidgetLayout />
        </Box>
      </Box>
    </AuthLayout>
  )
} 