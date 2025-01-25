# Comando: /up
📝 Sistema de Atualização Incremental

## Descrição
Comando para atualização incremental dos arquivos de tracking (.plan e .progress), preservando todo o histórico e estrutura existente enquanto adiciona novas informações da sessão atual.

## Princípios
1. **Preservação**
   - Mantém toda estrutura existente
   - Preserva histórico completo
   - Não remove informações anteriores

2. **Incrementalidade**
   - Adiciona apenas novas informações
   - Marca atualizações da sessão (⭐)
   - Mantém contexto temporal

3. **Contextualização**
   - Integra novos elementos ao todo
   - Mantém coerência do projeto
   - Respeita hierarquia existente

## Sintaxe
```bash
/up
```

## Funcionamento
1. **Leitura**
   - Analisa arquivos existentes
   - Identifica estrutura atual
   - Mapeia pontos de atualização

2. **Atualização**
   - Preserva estrutura base
   - Adiciona novas informações
   - Marca com ⭐ as atualizações da sessão

3. **Integração**
   - Mantém coerência do documento
   - Atualiza métricas quando necessário
   - Preserva histórico completo

## Arquivos Afetados
### .plan
- Mantém objetivos e roadmap
- Adiciona novas tasks
- Atualiza status
- Marca novidades com ⭐

### .progress
- Preserva estrutura de análise
- Adiciona novas métricas
- Atualiza status atual
- Marca atualizações com ⭐

## Exemplos
```markdown
# Antes
### Feature X
- Task 1
- Task 2

# Depois
### Feature X
- Task 1
- Task 2
- Nova Task ⭐
```

## Notas
- Usar sempre que houver atualizações
- Marcar claramente novos itens
- Manter histórico completo
- Respeitar estrutura existente 