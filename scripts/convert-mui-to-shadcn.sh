#!/bin/bash

echo "Convertendo componentes Material-UI para Shadcn UI..."

# Instalar componentes Shadcn necessários
COMPONENTS=(
  "button"
  "checkbox"
  "dialog"
  "input"
  "label"
  "select"
  "card"
  "progress"
  "chip"
)

for component in "${COMPONENTS[@]}"; do
  echo "Instalando componente $component..."
  npx shadcn-ui@latest add $component
done

# Remover dependências MUI
echo "Removendo dependências Material-UI..."
npm uninstall @mui/material @emotion/react @emotion/styled @mui/icons-material @mui/x-date-pickers

# Criar diretório de templates
mkdir -p scripts/templates

# Criar template para conversão de componentes
cat > scripts/templates/shadcn-component.txt << 'EOL'
"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

// Componente base
export function Component() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Título</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Conteúdo */}
      </CardContent>
    </Card>
  )
}
EOL

echo "Configuração dos componentes Shadcn UI concluída!" 