'use client';

import React, { useState, useEffect } from 'react';

interface Widget {
  id: string;
  title: string;
  visible: boolean;
  order: number;
}

const DEFAULT_WIDGETS: Widget[] = [
  { id: 'tasks', title: 'Tarefas Prioritárias', visible: true, order: 0 },
  { id: 'pomodoro', title: 'Timer Pomodoro', visible: true, order: 1 },
  { id: 'notes', title: 'Notas Rápidas', visible: true, order: 2 },
  { id: 'energy', title: 'Nível de Energia', visible: true, order: 3 },
  { id: 'goals', title: 'Metas do Dia', visible: true, order: 4 },
  { id: 'stats', title: 'Estatísticas de Produtividade', visible: true, order: 5 },
  { id: 'calendar', title: 'Calendário', visible: true, order: 6 }
];

export default function WidgetManager() {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const savedWidgets = localStorage.getItem('widgetSettings');
    if (savedWidgets) {
      setWidgets(JSON.parse(savedWidgets));
    } else {
      setWidgets(DEFAULT_WIDGETS);
    }
  }, []);

  useEffect(() => {
    if (widgets.length > 0) {
      localStorage.setItem('widgetSettings', JSON.stringify(widgets));
    }
  }, [widgets]);

  const toggleWidget = (id: string) => {
    setWidgets(prev => prev.map(widget => 
      widget.id === id ? { ...widget, visible: !widget.visible } : widget
    ));
  };

  const moveWidget = (id: string, direction: 'up' | 'down') => {
    const index = widgets.findIndex(w => w.id === id);
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === widgets.length - 1)
    ) {
      return;
    }

    const newWidgets = [...widgets];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newWidgets[targetIndex];
    newWidgets[targetIndex] = newWidgets[index];
    newWidgets[index] = temp;

    // Atualizar a ordem
    newWidgets.forEach((widget, i) => {
      widget.order = i;
    });

    setWidgets(newWidgets);
  };

  return (
    <div className="widget-manager">
      <div className="widget-manager-header">
        <h3>Personalizar Widgets</h3>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="edit-toggle"
        >
          {isEditing ? 'Salvar' : 'Editar'}
        </button>
      </div>

      {isEditing && (
        <div className="widget-list">
          {widgets.map(widget => (
            <div key={widget.id} className="widget-item">
              <label>
                <input
                  type="checkbox"
                  checked={widget.visible}
                  onChange={() => toggleWidget(widget.id)}
                />
                {widget.title}
              </label>
              <div className="widget-controls">
                <button
                  onClick={() => moveWidget(widget.id, 'up')}
                  disabled={widget.order === 0}
                  title="Mover para cima"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveWidget(widget.id, 'down')}
                  disabled={widget.order === widgets.length - 1}
                  title="Mover para baixo"
                >
                  ↓
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 