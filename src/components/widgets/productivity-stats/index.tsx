'use client';

import React, { useEffect, useState } from 'react';
import { Paper, Typography, Box, CircularProgress, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

interface DailyStats {
  date: string;
  energy: number;
  tasksCompleted: number;
  goalsCompleted: number;
  pomodoroSessions: number;
}

const StyledBar = styled(Box)(({ theme }) => ({
  width: '12px',
  borderRadius: theme.shape.borderRadius,
  transition: 'height 0.3s ease',
  '&:hover': {
    opacity: 0.8,
  }
}));

export default function ProductivityStats() {
  const [weekStats, setWeekStats] = useState<DailyStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    // Carregar estatísticas da última semana
    const stats: DailyStats[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      // Carregar dados do localStorage
      const dayStats: DailyStats = {
        date: dateStr,
        energy: getAverageEnergy(dateStr),
        tasksCompleted: getCompletedTasks(dateStr),
        goalsCompleted: getCompletedGoals(dateStr),
        pomodoroSessions: getPomodoroSessions(dateStr)
      };

      stats.push(dayStats);
    }

    setWeekStats(stats);
    setLoading(false);
  };

  const getAverageEnergy = (date: string): number => {
    const energyHistory = JSON.parse(localStorage.getItem('energyHistory') || '{}');
    return energyHistory[date]?.average || 0;
  };

  const getCompletedTasks = (date: string): number => {
    const taskHistory = JSON.parse(localStorage.getItem('taskHistory') || '{}');
    return taskHistory[date]?.completed || 0;
  };

  const getCompletedGoals = (date: string): number => {
    const goalHistory = JSON.parse(localStorage.getItem('goalHistory') || '{}');
    return goalHistory[date]?.completed || 0;
  };

  const getPomodoroSessions = (date: string): number => {
    const pomodoroHistory = JSON.parse(localStorage.getItem('pomodoroHistory') || '{}');
    return pomodoroHistory[date]?.completed || 0;
  };

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      weekday: 'short'
    });
  };

  if (loading) {
    return (
      <Paper sx={{ p: 3, height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Paper>
    );
  }

  const maxTasks = Math.max(...weekStats.map(s => s.tasksCompleted));
  const maxGoals = Math.max(...weekStats.map(s => s.goalsCompleted));
  const maxPomodoros = Math.max(...weekStats.map(s => s.pomodoroSessions));

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Estatísticas de Produtividade
      </Typography>
      
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, mb: 3 }}>
        {weekStats.map(stat => (
          <Box key={stat.date} sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {formatDate(stat.date)}
            </Typography>
            
            <Stack direction="row" spacing={1} sx={{ height: 150, alignItems: 'flex-end', justifyContent: 'center' }}>
              <StyledBar
                sx={{
                  height: `${stat.energy}%`,
                  bgcolor: 'primary.main',
                }}
                title={`Energia: ${stat.energy}%`}
              />
              <StyledBar
                sx={{
                  height: `${(stat.tasksCompleted / maxTasks) * 100}%`,
                  bgcolor: 'secondary.main',
                }}
                title={`Tarefas: ${stat.tasksCompleted}`}
              />
              <StyledBar
                sx={{
                  height: `${(stat.goalsCompleted / maxGoals) * 100}%`,
                  bgcolor: 'success.main',
                }}
                title={`Metas: ${stat.goalsCompleted}`}
              />
              <StyledBar
                sx={{
                  height: `${(stat.pomodoroSessions / maxPomodoros) * 100}%`,
                  bgcolor: 'warning.main',
                }}
                title={`Pomodoros: ${stat.pomodoroSessions}`}
              />
            </Stack>
          </Box>
        ))}
      </Box>

      <Stack direction="row" spacing={3} justifyContent="center">
        {[
          { label: 'Energia', color: 'primary.main' },
          { label: 'Tarefas', color: 'secondary.main' },
          { label: 'Metas', color: 'success.main' },
          { label: 'Pomodoros', color: 'warning.main' },
        ].map(item => (
          <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 16, height: 16, bgcolor: item.color, borderRadius: 1 }} />
            <Typography variant="body2">{item.label}</Typography>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
} 