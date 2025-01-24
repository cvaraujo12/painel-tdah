'use client';

import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  Typography, 
  Button, 
  Switch, 
  Box,
  Stack,
  ButtonGroup
} from '@mui/material';
import { styled } from '@mui/material/styles';

interface AccessibilitySettings {
  fontSize: number;
  contrast: 'normal' | 'high';
  reducedMotion: boolean;
  soundFeedback: boolean;
}

export default function AccessibilityControls() {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    fontSize: 100, // porcentagem do tamanho base
    contrast: 'normal',
    reducedMotion: false,
    soundFeedback: false
  });

  useEffect(() => {
    // Carregar configurações salvas
    const savedSettings = localStorage.getItem('accessibilitySettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }

    // Aplicar configurações iniciais
    applySettings();
  }, []);

  useEffect(() => {
    // Salvar configurações quando alteradas
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
    applySettings();
  }, [settings]);

  const applySettings = () => {
    // Aplicar tamanho da fonte
    document.documentElement.style.fontSize = `${settings.fontSize}%`;

    // Aplicar contraste
    document.documentElement.classList.toggle('high-contrast', settings.contrast === 'high');

    // Aplicar redução de movimento
    document.documentElement.classList.toggle('reduced-motion', settings.reducedMotion);

    // Aplicar feedback sonoro
    document.documentElement.classList.toggle('sound-feedback', settings.soundFeedback);
  };

  const adjustFontSize = (delta: number) => {
    setSettings(prev => ({
      ...prev,
      fontSize: Math.max(80, Math.min(150, prev.fontSize + delta))
    }));
  };

  const toggleContrast = () => {
    setSettings(prev => ({
      ...prev,
      contrast: prev.contrast === 'normal' ? 'high' : 'normal'
    }));
  };

  const toggleReducedMotion = () => {
    setSettings(prev => ({
      ...prev,
      reducedMotion: !prev.reducedMotion
    }));
  };

  const toggleSoundFeedback = () => {
    setSettings(prev => ({
      ...prev,
      soundFeedback: !prev.soundFeedback
    }));
  };

  const playFeedback = () => {
    if (settings.soundFeedback) {
      const audio = new Audio('/sounds/click.mp3');
      audio.volume = 0.3;
      audio.play();
    }
  };

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 3, 
        height: '100%',
        borderRadius: 2
      }}
    >
      <Typography variant="h6" gutterBottom>
        Acessibilidade
      </Typography>
      
      <Stack spacing={3}>
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Tamanho da Fonte
          </Typography>
          <ButtonGroup size="small">
            <Button
              onClick={() => {
                adjustFontSize(-10);
                playFeedback();
              }}
              aria-label="Diminuir fonte"
            >
              A-
            </Button>
            <Button disabled>
              {settings.fontSize}%
            </Button>
            <Button
              onClick={() => {
                adjustFontSize(10);
                playFeedback();
              }}
              aria-label="Aumentar fonte"
            >
              A+
            </Button>
          </ButtonGroup>
        </Box>

        <Box>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Switch
              checked={settings.contrast === 'high'}
              onChange={() => {
                toggleContrast();
                playFeedback();
              }}
            />
            <Typography>Alto Contraste</Typography>
          </Stack>
        </Box>

        <Box>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Switch
              checked={settings.reducedMotion}
              onChange={() => {
                toggleReducedMotion();
                playFeedback();
              }}
            />
            <Typography>Reduzir Animações</Typography>
          </Stack>
        </Box>

        <Box>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Switch
              checked={settings.soundFeedback}
              onChange={toggleSoundFeedback}
            />
            <Typography>Feedback Sonoro</Typography>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
} 