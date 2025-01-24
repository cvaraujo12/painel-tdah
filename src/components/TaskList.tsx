'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  IconButton,
  Typography,
  CircularProgress,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  Stack,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { useOptimizedSync } from '@/hooks/useOptimizedSync';
import { Task, TaskInput, TaskUpdate, Priority } from '@/types/Task';
import { ptBR } from 'date-fns/locale';
import { useAuth } from '@/hooks/useAuth';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useTaskState, TaskFilters } from '@/hooks/useTaskState';

interface TaskItemProps {
  task: Task;
  onToggle: (task: Task) => void;
  onDelete: (id: number) => void;
  onEdit: (task: Task) => void;
}

const TaskItem = React.memo(({ task, onToggle, onDelete, onEdit }: TaskItemProps) => {
  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'alta':
        return 'error';
      case 'média':
        return 'warning';
      case 'baixa':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <ListItem
      sx={{
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'stretch', sm: 'center' },
        py: { xs: 2, sm: 1 },
        px: { xs: 1, sm: 2 }
      }}
      secondaryAction={
        <Box sx={{
          display: 'flex',
          width: { xs: '100%', sm: 'auto' },
          mt: { xs: 1, sm: 0 },
          justifyContent: { xs: 'flex-end', sm: 'flex-end' }
        }}>
          <IconButton edge="end" onClick={() => onEdit(task)} sx={{ mr: 1 }}>
            <EditIcon />
          </IconButton>
          <IconButton edge="end" onClick={() => onDelete(task.id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      }
    >
      <ListItemIcon>
        <Checkbox
          edge="start"
          checked={task.completed}
          onChange={() => onToggle(task)}
        />
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography
            sx={{
              textDecoration: task.completed ? 'line-through' : 'none',
              color: task.completed ? 'text.secondary' : 'text.primary',
              fontSize: { xs: '1rem', sm: '1.1rem' }
            }}
          >
            {task.title}
          </Typography>
        }
        secondary={
          <Box sx={{
            mt: 1,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 0.5
          }}>
            <Chip
              label={task.priority}
              color={getPriorityColor(task.priority)}
              size="small"
            />
            {task.tags?.map((tag: string) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
              />
            ))}
            {task.due_date && (
              <Typography
                variant="caption"
                display="block"
                sx={{ mt: 0.5, width: '100%' }}
              >
                Prazo: {new Date(task.due_date).toLocaleDateString('pt-BR')}
              </Typography>
            )}
          </Box>
        }
      />
    </ListItem>
  );
});

export default function TaskList() {
  const { user } = useAuth();
  const { 
    data: tasks, 
    loading, 
    error, 
    add, 
    update, 
    remove 
  } = useOptimizedSync<Task>('tasks', {
    cacheTime: 5 * 60 * 1000, // 5 minutos
    sortBy: 'priority',
    sortDirection: 'asc'
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState<TaskInput>({
    title: '',
    description: null,
    priority: 'média',
    tags: [],
    category: '',
    completed: false,
    due_date: null,
  });
  const [newTag, setNewTag] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [filters, setFilters] = useState<TaskFilters>({});
  const { sortedTasks, taskStats } = useTaskState(tasks, filters);

  const handleOpenDialog = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      setNewTask({
        title: task.title,
        description: task.description,
        priority: task.priority,
        tags: task.tags,
        category: task.category,
        completed: task.completed,
        due_date: task.due_date,
      });
    } else {
      setEditingTask(null);
      setNewTask({
        title: '',
        description: null,
        priority: 'média',
        tags: [],
        category: '',
        completed: false,
        due_date: null,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTask(null);
    setNewTask({
      title: '',
      description: null,
      priority: 'média',
      tags: [],
      category: '',
      completed: false,
      due_date: null,
    });
    setNewTag('');
  };

  const handleAddTag = () => {
    if (newTag && !newTask.tags.includes(newTag)) {
      setNewTask({
        ...newTask,
        tags: [...newTask.tags, newTag],
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewTask({
      ...newTask,
      tags: newTask.tags.filter(tag => tag !== tagToRemove),
    });
  };

  const handleSaveTask = async () => {
    try {
      if (editingTask) {
        await update(editingTask.id, newTask);
      } else {
        await add(newTask);
      }
      handleCloseDialog();
    } catch (err) {
      console.error('Erro ao salvar tarefa:', err);
    }
  };

  const handleToggle = useCallback(async (task: Task) => {
    await update(task.id, { completed: !task.completed });
  }, [update]);

  const handleDelete = useCallback(async (id: number) => {
    await remove(id);
  }, [remove]);

  const handleEdit = useCallback((task: Task) => {
    handleOpenDialog(task);
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error">
          {error instanceof Error ? error.message : 'Erro ao carregar tarefas'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      p: { xs: 1, sm: 2 },
      maxWidth: '100%',
      overflowX: 'hidden'
    }}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2,
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 2, sm: 0 }
      }}>
        <Box>
          <Typography variant="h6">Tarefas</Typography>
          <Typography variant="body2" color="text.secondary">
            {taskStats.completed} de {taskStats.total} concluídas
            {taskStats.overdue > 0 && ` • ${taskStats.overdue} atrasadas`}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          fullWidth={isMobile}
        >
          Nova Tarefa
        </Button>
      </Box>

      <List>
        {sortedTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </List>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle sx={{
          fontSize: {
            xs: '1.2rem',
            sm: '1.5rem'
          }
        }}>
          {editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Título"
              fullWidth
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
            <TextField
              label="Descrição"
              fullWidth
              multiline
              rows={3}
              value={newTask.description || ''}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value || null })}
            />
            <FormControl fullWidth>
              <InputLabel>Prioridade</InputLabel>
              <Select
                value={newTask.priority}
                label="Prioridade"
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Priority })}
              >
                <MenuItem value="baixa">Baixa</MenuItem>
                <MenuItem value="média">Média</MenuItem>
                <MenuItem value="alta">Alta</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Categoria"
              fullWidth
              value={newTask.category}
              onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
            />
            <TextField
              label="Data de Entrega"
              type="date"
              fullWidth
              value={newTask.due_date ? new Date(newTask.due_date).toISOString().split('T')[0] : ''}
              onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value ? new Date(e.target.value).toISOString() : null })}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <Box>
              <TextField
                label="Nova Tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                sx={{ mr: 1 }}
              />
              <Button onClick={handleAddTag}>Adicionar Tag</Button>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {newTask.tags?.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => handleRemoveTag(tag)}
                />
              ))}
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{
          p: 2,
          flexDirection: {
            xs: 'column',
            sm: 'row'
          },
          '& > button': {
            width: {
              xs: '100%',
              sm: 'auto'
            },
            mb: {
              xs: 1,
              sm: 0
            }
          }
        }}>
          <Button onClick={handleCloseDialog} fullWidth={isMobile}>
            Cancelar
          </Button>
          <Button
            onClick={handleSaveTask}
            variant="contained"
            fullWidth={isMobile}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 