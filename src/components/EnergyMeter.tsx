'use client';

import { useState } from 'react';
import { Box, Typography, Slider, Paper } from '@mui/material';
import BatteryFullIcon from '@mui/icons-material/BatteryFull';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';

const EnergyMeter = () => {
  const [energy, setEnergy] = useState<number>(70);

  const handleEnergyChange = (event: Event, newValue: number | number[]) => {
    setEnergy(newValue as number);
  };

  const getEnergyColor = (level: number) => {
    if (level >= 70) return '#4caf50';
    if (level >= 40) return '#ff9800';
    return '#f44336';
  };

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Nível de Energia
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        {energy >= 50 ? (
          <BatteryFullIcon sx={{ color: getEnergyColor(energy), mr: 1 }} />
        ) : (
          <BatteryChargingFullIcon sx={{ color: getEnergyColor(energy), mr: 1 }} />
        )}
        <Typography variant="body1">
          {energy}%
        </Typography>
      </Box>

      <Slider
        value={energy}
        onChange={handleEnergyChange}
        aria-label="Nível de Energia"
        valueLabelDisplay="auto"
        sx={{
          color: getEnergyColor(energy),
          '& .MuiSlider-thumb': {
            '&:hover, &.Mui-focusVisible': {
              boxShadow: `0px 0px 0px 8px ${getEnergyColor(energy)}20`,
            },
          },
        }}
      />

      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        {energy >= 70 ? 'Energia Alta - Ótimo momento para tarefas complexas!' :
         energy >= 40 ? 'Energia Moderada - Foque em tarefas de média complexidade.' :
         'Energia Baixa - Priorize tarefas simples e descanse.'}
      </Typography>
    </Paper>
  );
};

export default EnergyMeter; 