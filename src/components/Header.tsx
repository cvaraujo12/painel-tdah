'use client'

import React from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  useTheme,
} from '@mui/material'
import { useAuth } from '../hooks/useAuth'
import ThemeToggle from './ThemeToggle'
import MenuIcon from '@mui/icons-material/Menu'

interface HeaderProps {
  onMenuClick?: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user, signOut } = useAuth()
  const theme = useTheme()

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: theme.zIndex.drawer + 1,
        bgcolor: 'background.paper',
        color: 'text.primary',
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={onMenuClick}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Painel TDAH
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ThemeToggle />
          
          {user && (
            <>
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
              <Button color="inherit" onClick={signOut}>
                Sair
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
} 