#!/bin/bash

# Criar diretório base para widgets se não existir
mkdir -p src/components/widgets

# Função para converter PascalCase para kebab-case
function to_kebab_case() {
    echo "$1" | sed -r 's/([a-z0-9])([A-Z])/\1-\2/g' | tr '[:upper:]' '[:lower:]'
}

# Lista de widgets para reorganizar
WIDGETS=(
    "TaskList"
    "ThemeToggle"
    "AccessibilityControls"
    "CalendarWidget"
    "DailyGoals"
    "EnergyMeter"
    "ErrorBoundary"
    "FeedbackSnackbar"
    "GlobalLoading"
    "Header"
    "PomodoroTimer"
    "ProductivityStats"
    "QuickNotes"
    "ResponsiveLayout"
    "SyncTest"
    "WidgetLayout"
    "WidgetManager"
)

# Criar estrutura para cada widget
for widget in "${WIDGETS[@]}"; do
    # Converter nome para kebab-case
    widget_kebab=$(to_kebab_case "$widget")
    
    # Criar diretório do widget
    mkdir -p "src/components/widgets/$widget_kebab"
    
    # Mover arquivo principal se existir
    if [ -f "src/components/widgets/$widget.tsx" ]; then
        mv "src/components/widgets/$widget.tsx" "src/components/widgets/$widget_kebab/index.tsx"
    fi
    
    # Criar arquivos base
    touch "src/components/widgets/$widget_kebab/types.ts"
    touch "src/components/widgets/$widget_kebab/components.tsx"
    touch "src/components/widgets/$widget_kebab/hooks.ts"
    touch "src/components/widgets/$widget_kebab/utils.ts"
done

echo "Reorganização dos widgets concluída!" 