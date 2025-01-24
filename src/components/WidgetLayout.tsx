'use client';

import React from 'react';
import { Box, Grid, Paper } from '@mui/material';
import TaskList from './TaskList';
import PomodoroTimer from './PomodoroTimer';
import QuickNotes from './QuickNotes';
import EnergyMeter from './EnergyMeter';
import DailyGoals from './DailyGoals';

const widgets = [
  { id: 'tasks', component: TaskList, size: { xs: 12, md: 6 } },
  { id: 'pomodoro', component: PomodoroTimer, size: { xs: 12, md: 6 } },
  { id: 'notes', component: QuickNotes, size: { xs: 12, md: 6 } },
  { id: 'energy', component: EnergyMeter, size: { xs: 12, md: 3 } },
  { id: 'goals', component: DailyGoals, size: { xs: 12, md: 6 } },
];

export default function WidgetLayout() {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        {widgets.map(({ id, component: Component, size }) => (
          <Grid key={id} item {...size}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'background.paper',
                borderRadius: 2,
              }}
            >
              <Component />
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
} 