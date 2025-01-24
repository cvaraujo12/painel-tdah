'use client';

import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  Typography, 
  Button, 
  TextField, 
  Checkbox,
  FormControlLabel,
  IconButton,
  List,
  ListItem,
  Box,
  FormGroup
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay: boolean;
}

export default function CalendarWidget() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    allDay: false
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const savedEvents = localStorage.getItem('localCalendarEvents');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  }, []);

  const saveEvents = (updatedEvents: CalendarEvent[]) => {
    localStorage.setItem('localCalendarEvents', JSON.stringify(updatedEvents));
    setEvents(updatedEvents);
  };

  const addEvent = (e: React.FormEvent) => {
    e.preventDefault();
    
    const event: CalendarEvent = {
      id: Date.now().toString(),
      title: newEvent.title,
      start: newEvent.allDay ? newEvent.date : `${newEvent.date}T${newEvent.time}`,
      end: newEvent.allDay ? newEvent.date : `${newEvent.date}T${newEvent.time}`,
      allDay: newEvent.allDay
    };

    const updatedEvents = [...events, event].sort((a, b) => 
      new Date(a.start).getTime() - new Date(b.start).getTime()
    );

    saveEvents(updatedEvents);
    setNewEvent({ title: '', date: '', time: '', allDay: false });
    setShowForm(false);
  };

  const removeEvent = (id: string) => {
    const updatedEvents = events.filter(event => event.id !== id);
    saveEvents(updatedEvents);
  };

  const formatEventDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return `Hoje ${date.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })}`;
    }
    
    if (date.toDateString() === tomorrow.toDateString()) {
      return `Amanhã ${date.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })}`;
    }

    return date.toLocaleDateString('pt-BR', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Próximos Eventos</Typography>
        <IconButton 
          onClick={() => setShowForm(!showForm)}
          color="primary"
          size="small"
        >
          {showForm ? <CloseIcon /> : <AddIcon />}
        </IconButton>
      </Box>

      {showForm && (
        <Box component="form" onSubmit={addEvent} sx={{ mb: 3 }}>
          <FormGroup sx={{ gap: 2 }}>
            <TextField
              fullWidth
              label="Título do evento"
              value={newEvent.title}
              onChange={e => setNewEvent({...newEvent, title: e.target.value})}
              required
            />
            <TextField
              fullWidth
              type="date"
              label="Data"
              InputLabelProps={{ shrink: true }}
              value={newEvent.date}
              onChange={e => setNewEvent({...newEvent, date: e.target.value})}
              required
            />
            {!newEvent.allDay && (
              <TextField
                fullWidth
                type="time"
                label="Hora"
                InputLabelProps={{ shrink: true }}
                value={newEvent.time}
                onChange={e => setNewEvent({...newEvent, time: e.target.value})}
                required
              />
            )}
            <FormControlLabel
              control={
                <Checkbox
                  checked={newEvent.allDay}
                  onChange={e => setNewEvent({...newEvent, allDay: e.target.checked})}
                />
              }
              label="Dia todo"
            />
            <Button variant="contained" type="submit" fullWidth>
              Adicionar
            </Button>
          </FormGroup>
        </Box>
      )}

      {events.length === 0 ? (
        <Typography color="textSecondary" align="center">
          Nenhum evento agendado
        </Typography>
      ) : (
        <List sx={{ width: '100%', p: 0 }}>
          {events.map(event => (
            <ListItem
              key={event.id}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                borderBottom: '1px solid',
                borderColor: 'divider',
                py: 1
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <Typography variant="body2" color="textSecondary">
                  {formatEventDate(event.start)}
                  {event.allDay && (
                    <Typography component="span" sx={{ ml: 1 }} color="primary">
                      Dia todo
                    </Typography>
                  )}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => removeEvent(event.id)}
                  color="error"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
              <Typography>{event.title}</Typography>
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
} 