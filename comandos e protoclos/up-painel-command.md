# Comando: /up --painel
📊 Sistema de Análise e Relatório do Projeto

## Descrição
Comando para análise completa do projeto, fornecendo relatório detalhado de status, métricas e próximos passos.

## Sintaxe
```bash
/up --painel [opções]
/up --painel --focus [área]
```

## Opções
- `--focus [área]`: Análise detalhada de área específica
  - `tech`: Stack técnico
  - `tdah`: Protocolos TDAH
  - `progress`: Métricas de progresso
  - `health`: Saúde do projeto

## Funcionamento
1. **Análise Estrutural**
   - Varredura de diretórios
   - Verificação de arquivos
   - Análise de configurações

2. **Coleta de Métricas**
   - Progresso do projeto
   - Velocidade de desenvolvimento
   - Qualidade do código
   - Status de documentação

3. **Validação TDAH**
   - Conformidade com protocolos
   - Adaptações implementadas
   - Necessidades pendentes

4. **Geração de Relatório**
   - Status atual
   - Pontos de atenção
   - Próximos passos
   - Recomendações

## Formato do Relatório
```markdown
📊 RELATÓRIO DE STATUS - PAINEL TDAH
═══════════════════════════════════════
📅 Data: [timestamp]
📌 Status Global: [status]

🔄 SITUAÇÃO ATUAL
[detalhes do status]

🎯 PRÓXIMOS PASSOS CRÍTICOS
[lista de ações]

📈 MÉTRICAS CHAVE
[métricas principais]

🚦 SAÚDE DO PROJETO
[indicadores de saúde]

⏰ MARCOS CRÍTICOS
[prazos e marcos]

📋 RECOMENDAÇÕES
[recomendações principais]
```

## Integração
- Atualiza `.plan` e `.progress`
- Integra com protocolos TDAH
- Mantém histórico de execuções

## Exemplos
```bash
# Análise completa
/up --painel

# Foco em área específica
/up --painel --focus tech
/up --painel --focus tdah
```

## Notas
- Execução a cada milestone
- Mantém histórico de relatórios
- Base para decisões técnicas 