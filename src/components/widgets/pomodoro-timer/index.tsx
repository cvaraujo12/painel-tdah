'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Paper, 
  Typography, 
  Button, 
  IconButton, 
  Slider,
  Box,
  Stack,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { 
  PlayArrow, 
  Pause, 
  Refresh,
  VolumeUp,
  WaterDrop,
  Waves,
  Forest,
  VolumeDown 
} from '@mui/icons-material';

interface TimerState {
  minutes: number;
  seconds: number;
  isRunning: boolean;
  mode: 'focus' | 'break' | 'microbreak';
}

const AMBIENT_SOUNDS = {
  rain: '/sounds/rain.mp3',
  waves: '/sounds/waves.mp3',
  forest: '/sounds/forest.mp3',
  whitenoise: '/sounds/whitenoise.mp3'
};

export default function PomodoroTimer() {
  const [timer, setTimer] = useState<TimerState>({
    minutes: 25,
    seconds: 0,
    isRunning: false,
    mode: 'focus'
  });
  const [selectedSound, setSelectedSound] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [showMicroBreak, setShowMicroBreak] = useState(false);
  const [volume, setVolume] = useState(0.3);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timer.isRunning) {
      interval = setInterval(() => {
        if (timer.seconds === 0) {
          if (timer.minutes === 0) {
            handleTimerComplete();
          } else {
            setTimer(prev => ({
              ...prev,
              minutes: prev.minutes - 1,
              seconds: 59
            }));
          }
        } else {
          setTimer(prev => ({
            ...prev,
            seconds: prev.seconds - 1
          }));
        }

        if (timer.mode === 'focus' && timer.minutes % 5 === 0 && timer.seconds === 0) {
          triggerMicroBreak();
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    if (selectedSound) {
      audioRef.current = new Audio(AMBIENT_SOUNDS[selectedSound as keyof typeof AMBIENT_SOUNDS]);
      audioRef.current.loop = true;
      audioRef.current.volume = volume;
      audioRef.current.play();
    } else if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [selectedSound, volume]);

  const handleTimerComplete = () => {
    const notification = new Notification('Timer Completo!', {
      body: timer.mode === 'focus' 
        ? 'Hora de fazer uma pausa!' 
        : 'Hora de voltar ao foco!',
    });

    if (timer.mode === 'focus') {
      setTimer({
        minutes: 5,
        seconds: 0,
        isRunning: false,
        mode: 'break'
      });
    } else {
      setTimer({
        minutes: 25,
        seconds: 0,
        isRunning: false,
        mode: 'focus'
      });
    }

    const today = new Date().toISOString().split('T')[0];
    const history = JSON.parse(localStorage.getItem('pomodoroHistory') || '{}');
    const todayStats = history[today] || { completed: 0 };
    todayStats.completed += 1;
    history[today] = todayStats;
    localStorage.setItem('pomodoroHistory', JSON.stringify(history));
  };

  const triggerMicroBreak = () => {
    setShowMicroBreak(true);
    setTimer(prev => ({
      ...prev,
      isRunning: false
    }));

    setTimeout(() => {
      setShowMicroBreak(false);
      setTimer(prev => ({
        ...prev,
        isRunning: true
      }));
    }, 30000);
  };

  const toggleTimer = () => {
    setTimer(prev => ({
      ...prev,
      isRunning: !prev.isRunning
    }));

    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const resetTimer = () => {
    setTimer({
      minutes: timer.mode === 'focus' ? 25 : 5,
      seconds: 0,
      isRunning: false,
      mode: timer.mode
    });
  };

  const toggleSound = (sound: string) => {
    setSelectedSound(prev => prev === sound ? null : sound);
  };

  const handleVolumeChange = (_: Event, newValue: number | number[]) => {
    const volumeValue = Array.isArray(newValue) ? newValue[0] : newValue;
    setVolume(volumeValue);
    if (audioRef.current) {
      audioRef.current.volume = volumeValue;
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%', minHeight: '400px' }}>
      {showMicroBreak ? (
        <Stack spacing={2}>
          <Typography variant="h5" gutterBottom>
            Micro-Pausa! (30s)
          </Typography>
          <Typography>Faça alguns alongamentos simples:</Typography>
          <List>
            <ListItem>
              <ListItemText primary="Rotação dos ombros" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Alongar o pescoço" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Piscar os olhos lentamente" />
            </ListItem>
          </List>
        </Stack>
      ) : (
        <Stack spacing={3} alignItems="center">
          <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
            {String(timer.minutes).padStart(2, '0')}:
            {String(timer.seconds).padStart(2, '0')}
          </Typography>

          <Typography variant="h6" color="text.secondary">
            Modo: {timer.mode === 'focus' ? 'Foco' : 'Pausa'}
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={timer.isRunning ? <Pause /> : <PlayArrow />}
              onClick={toggleTimer}
            >
              {timer.isRunning ? 'Pausar' : 'Iniciar'}
            </Button>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={resetTimer}
            >
              Reiniciar
            </Button>
          </Box>

          <Box sx={{ width: '100%', mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Sons Ambiente
            </Typography>
            <Stack direction="row" spacing={1} justifyContent="center">
              {Object.entries(AMBIENT_SOUNDS).map(([key, _]) => (
                <IconButton
                  key={key}
                  onClick={() => toggleSound(key)}
                  color={selectedSound === key ? 'primary' : 'default'}
                  sx={{ p: 2 }}
                >
                  {key === 'rain' ? <WaterDrop /> : 
                   key === 'waves' ? <Waves /> : 
                   key === 'forest' ? <Forest /> : 
                   <VolumeDown />}
                </IconButton>
              ))}
            </Stack>
            {selectedSound && (
              <Box sx={{ px: 2, mt: 2 }}>
                <Stack spacing={2} direction="row" alignItems="center">
                  <VolumeDown />
                  <Slider
                    value={volume}
                    onChange={handleVolumeChange}
                    min={0}
                    max={1}
                    step={0.1}
                    aria-label="Volume"
                  />
                  <VolumeUp />
                </Stack>
              </Box>
            )}
          </Box>
        </Stack>
      )}
    </Paper>
  );
} 