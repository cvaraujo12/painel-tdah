'use client';

import { useState, useEffect } from 'react';
import { Box, Button, Typography, Alert } from '@mui/material';
import { createBrowserClient } from '@supabase/ssr';

export const SyncTest = () => {
  const [status, setStatus] = useState('Aguardando...');
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const testSync = async () => {
    try {
      const testData = {
        id: Date.now(),
        title: `Teste de sincronização ${new Date().toLocaleTimeString()}`,
        completed: false
      };

      const { data, error } = await supabase
        .from('tasks')
        .insert(testData)
        .select();

      if (error) throw error;

      setStatus('Teste enviado com sucesso!');
      setLastUpdate(new Date().toLocaleTimeString());
    } catch (error: any) {
      setStatus(`Erro: ${error.message}`);
    }
  };

  useEffect(() => {
    const subscription = supabase
      .channel('tasks')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'tasks' },
        (payload) => {
          setStatus(`Mudança detectada! ${new Date().toLocaleTimeString()}`);
          setLastUpdate(new Date().toLocaleTimeString());
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 1, my: 2 }}>
      <Typography variant="h6" gutterBottom>
        Teste de Sincronização
      </Typography>
      
      <Button 
        variant="contained" 
        onClick={testSync}
        sx={{ mb: 2 }}
      >
        Enviar Teste
      </Button>

      <Alert severity="info" sx={{ mb: 1 }}>
        Status: {status}
      </Alert>

      {lastUpdate && (
        <Typography variant="body2" color="text.secondary">
          Última atualização: {lastUpdate}
        </Typography>
      )}
    </Box>
  );
}; 