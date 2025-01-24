'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  Typography,
  Chip,
  Stack,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSync } from '../hooks/useSync';

interface Note {
  id: number;
  title: string;
  content: string;
  tags: string[];
  category: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

type NoteInput = {
  title: string;
  content: string;
  tags: string[];
  category: string;
};

type NoteData = NoteInput & {
  created_at: string;
  updated_at: string;
  user_id: string;
};

export default function QuickNotes() {
  const { data: notes, loading, error, add, update, remove } = useSync<Note>('notes');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [newNote, setNewNote] = useState<NoteInput>({
    title: '',
    content: '',
    tags: [],
    category: '',
  });
  const [newTag, setNewTag] = useState('');

  const handleOpenDialog = (note?: Note) => {
    if (note) {
      setEditingNote(note);
      setNewNote({
        title: note.title,
        content: note.content,
        tags: note.tags,
        category: note.category,
      });
    } else {
      setEditingNote(null);
      setNewNote({
        title: '',
        content: '',
        tags: [],
        category: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingNote(null);
    setNewNote({
      title: '',
      content: '',
      tags: [],
      category: '',
    });
  };

  const handleAddTag = () => {
    if (newTag && !newNote.tags?.includes(newTag)) {
      setNewNote({
        ...newNote,
        tags: [...(newNote.tags || []), newTag],
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewNote({
      ...newNote,
      tags: newNote.tags?.filter(tag => tag !== tagToRemove) || [],
    });
  };

  const handleSaveNote = async () => {
    try {
      const noteData: NoteData = {
        ...newNote,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: 'current_user_id', // Isso deve vir do contexto de autenticação
      };

      if (editingNote) {
        await update(editingNote.id, noteData);
      } else {
        await add(noteData);
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Erro ao salvar nota:', error);
    }
  };

  const handleDelete = async (id: number) => {
    await remove(id);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Notas Rápidas</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nova Nota
        </Button>
      </Box>

      <Stack spacing={2}>
        {notes.map((note) => (
          <Card key={note.id}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="h6" gutterBottom>
                  {note.title}
                </Typography>
                <Box>
                  <IconButton onClick={() => handleOpenDialog(note)} size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(note.id)} size="small">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
              <Typography variant="body1" paragraph>
                {note.content}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {note.category && (
                  <Chip
                    label={note.category}
                    color="primary"
                    size="small"
                  />
                )}
                {note.tags?.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingNote ? 'Editar Nota' : 'Nova Nota'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Título"
              fullWidth
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            />
            <TextField
              label="Conteúdo"
              fullWidth
              multiline
              rows={4}
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
            />
            <TextField
              label="Categoria"
              fullWidth
              value={newNote.category}
              onChange={(e) => setNewNote({ ...newNote, category: e.target.value })}
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
              {newNote.tags?.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => handleRemoveTag(tag)}
                />
              ))}
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSaveNote} variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
} 