'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  LinearProgress,
  TextField,
  Typography,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { useSync } from '../hooks/useSync';
import { Goal, GoalInput, SubTask, SubTaskInput, Priority, GoalType, GoalStatus } from '../types/database';

type LocalSubTask = {
  title: string;
  completed: boolean;
};

type LocalGoal = {
  title: string;
  description: string | null;
  target_date: string;
  progress: number;
  type: GoalType;
  status: GoalStatus;
  priority: Priority;
  tags: string[];
};

export default function DailyGoals() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [newGoal, setNewGoal] = useState<LocalGoal>({
    title: '',
    description: null,
    target_date: new Date().toISOString().split('T')[0],
    progress: 0,
    type: 'diária',
    status: 'pendente',
    priority: 'média',
    tags: [],
  });
  const [newTag, setNewTag] = useState('');
  const [newSubTask, setNewSubTask] = useState('');
  const [subTasks, setSubTasks] = useState<LocalSubTask[]>([]);

  const { data: goals = [], add: addGoal, update: updateGoal, remove: removeGoal } = useSync<Goal>('goals');
  const { data: dbSubTasks = [], add: addSubTask, update: updateSubTask, remove: removeSubTask } = useSync<SubTask>('subtasks');

  const handleOpenDialog = (goal?: Goal) => {
    if (goal) {
      setEditingGoal(goal);
      setNewGoal({
        title: goal.title,
        description: goal.description,
        target_date: goal.target_date,
        progress: goal.progress,
        type: goal.type,
        status: goal.status,
        priority: goal.priority,
        tags: goal.tags,
      });
      const goalSubTasks = dbSubTasks.filter(st => st.goal_id === goal.id);
      setSubTasks(goalSubTasks.map(st => ({ title: st.title, completed: st.completed })));
    } else {
      setEditingGoal(null);
      setNewGoal({
        title: '',
        description: null,
        target_date: new Date().toISOString().split('T')[0],
        progress: 0,
        type: 'diária',
        status: 'pendente',
        priority: 'média',
        tags: [],
      });
      setSubTasks([]);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingGoal(null);
    setNewGoal({
      title: '',
      description: null,
      target_date: new Date().toISOString().split('T')[0],
      progress: 0,
      type: 'diária',
      status: 'pendente',
      priority: 'média',
      tags: [],
    });
    setSubTasks([]);
  };

  const handleAddTag = () => {
    if (newTag && !newGoal.tags.includes(newTag)) {
      setNewGoal(prev => ({
        ...prev,
        tags: [...prev.tags, newTag],
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewGoal(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleAddSubTask = () => {
    if (newSubTask) {
      setSubTasks(prev => [...prev, { title: newSubTask, completed: false }]);
      setNewSubTask('');
    }
  };

  const handleToggleSubTask = (index: number) => {
    setSubTasks(prev => prev.map((st, i) => 
      i === index ? { ...st, completed: !st.completed } : st
    ));
  };

  const handleRemoveSubTask = (index: number) => {
    setSubTasks(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveGoal = async () => {
    if (editingGoal) {
      await updateGoal(editingGoal.id, newGoal);
      
      const goalSubTasks = dbSubTasks.filter(st => st.goal_id === editingGoal.id);
      
      for (const st of goalSubTasks) {
        if (!subTasks.find(newSt => newSt.title === st.title)) {
          await removeSubTask(st.id);
        }
      }
      
      for (const st of subTasks) {
        const existingST = goalSubTasks.find(dbST => dbST.title === st.title);
        if (existingST) {
          await updateSubTask(existingST.id, { completed: st.completed });
        } else {
          await addSubTask({
            goal_id: editingGoal.id,
            title: st.title,
            completed: st.completed,
          });
        }
      }
    } else {
      const savedGoal = await addGoal(newGoal);
      
      if (savedGoal && savedGoal.id) {
        for (const st of subTasks) {
          await addSubTask({
            goal_id: savedGoal.id,
            title: st.title,
            completed: st.completed,
          });
        }
      }
    }
    handleCloseDialog();
  };

  const handleDeleteGoal = async (goalId: number) => {
    const goalSubTasks = dbSubTasks.filter(st => st.goal_id === goalId);
    for (const st of goalSubTasks) {
      await removeSubTask(st.id);
    }
    await removeGoal(goalId);
  };

  const calculateProgress = (goal: Goal): number => {
    const goalSubTasks = dbSubTasks.filter(st => st.goal_id === goal.id);
    if (goalSubTasks.length === 0) return goal.progress;
    
    const completed = goalSubTasks.filter(st => st.completed).length;
    return Math.round((completed / goalSubTasks.length) * 100);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Metas</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nova Meta
        </Button>
      </Box>

      {goals.map(goal => (
        <Card key={goal.id} sx={{ mb: 2 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box flex={1}>
                <Typography variant="h6">{goal.title}</Typography>
                {goal.description && (
                  <Typography color="textSecondary" paragraph>
                    {goal.description}
                  </Typography>
                )}
                <Box display="flex" gap={1} mb={1}>
                  <Chip label={`Tipo: ${goal.type}`} size="small" />
                  <Chip label={`Status: ${goal.status}`} size="small" />
                  <Chip label={`Prioridade: ${goal.priority}`} size="small" />
                </Box>
                {goal.tags.length > 0 && (
                  <Box display="flex" gap={1} mb={1}>
                    {goal.tags.map(tag => (
                      <Chip key={tag} label={tag} size="small" variant="outlined" />
                    ))}
                  </Box>
                )}
                <Box sx={{ width: '100%', mr: 1 }}>
                  <LinearProgress variant="determinate" value={calculateProgress(goal)} />
                  <Typography variant="body2" color="textSecondary">
                    Progresso: {calculateProgress(goal)}%
                  </Typography>
                </Box>
              </Box>
              <Box>
                <IconButton onClick={() => handleOpenDialog(goal)} size="small">
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDeleteGoal(goal.id)} size="small">
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingGoal ? 'Editar Meta' : 'Nova Meta'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Título"
            fullWidth
            value={newGoal.title}
            onChange={e => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
          />
          <TextField
            margin="dense"
            label="Descrição"
            fullWidth
            multiline
            rows={3}
            value={newGoal.description || ''}
            onChange={e => setNewGoal(prev => ({ ...prev, description: e.target.value || null }))}
          />
          <TextField
            margin="dense"
            label="Data Alvo"
            type="date"
            fullWidth
            value={newGoal.target_date}
            onChange={e => setNewGoal(prev => ({ ...prev, target_date: e.target.value }))}
            InputLabelProps={{ shrink: true }}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Tipo</InputLabel>
            <Select
              value={newGoal.type}
              onChange={e => setNewGoal(prev => ({ ...prev, type: e.target.value as GoalType }))}
            >
              <MenuItem value="diária">Diária</MenuItem>
              <MenuItem value="semanal">Semanal</MenuItem>
              <MenuItem value="mensal">Mensal</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              value={newGoal.status}
              onChange={e => setNewGoal(prev => ({ ...prev, status: e.target.value as GoalStatus }))}
            >
              <MenuItem value="pendente">Pendente</MenuItem>
              <MenuItem value="em_progresso">Em Progresso</MenuItem>
              <MenuItem value="concluída">Concluída</MenuItem>
              <MenuItem value="atrasada">Atrasada</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Prioridade</InputLabel>
            <Select
              value={newGoal.priority}
              onChange={e => setNewGoal(prev => ({ ...prev, priority: e.target.value as Priority }))}
            >
              <MenuItem value="baixa">Baixa</MenuItem>
              <MenuItem value="média">Média</MenuItem>
              <MenuItem value="alta">Alta</MenuItem>
            </Select>
          </FormControl>

          <Box mt={2}>
            <Typography variant="subtitle2">Tags</Typography>
            <Box display="flex" gap={1}>
              <TextField
                size="small"
                value={newTag}
                onChange={e => setNewTag(e.target.value)}
                placeholder="Nova tag"
              />
              <Button onClick={handleAddTag} variant="outlined" size="small">
                Adicionar
              </Button>
            </Box>
            <Box display="flex" gap={1} mt={1}>
              {newGoal.tags.map(tag => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => handleRemoveTag(tag)}
                  size="small"
                />
              ))}
            </Box>
          </Box>

          <Box mt={2}>
            <Typography variant="subtitle2">Subtarefas</Typography>
            <Box display="flex" gap={1}>
              <TextField
                size="small"
                value={newSubTask}
                onChange={e => setNewSubTask(e.target.value)}
                placeholder="Nova subtarefa"
              />
              <Button onClick={handleAddSubTask} variant="outlined" size="small">
                Adicionar
              </Button>
            </Box>
            <List>
              {subTasks.map((st, index) => (
                <ListItem key={index}>
                  <ListItemText primary={st.title} />
                  <ListItemSecondaryAction>
                    <Checkbox
                      edge="end"
                      checked={st.completed}
                      onChange={() => handleToggleSubTask(index)}
                    />
                    <IconButton edge="end" onClick={() => handleRemoveSubTask(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSaveGoal} variant="contained" color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 