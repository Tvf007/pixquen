# 🛡️ Maquininha PIX - Segurança e Funcionalidades

## ✅ Melhorias Implementadas

### 📱 Mensagens do WhatsApp Melhoradas

As mensagens compartilhadas agora incluem **instruções claras** para o cliente:

#### Mensagem de Cobrança:
```
🧾 COBRANÇA PIX — [Nome da Loja]
━━━━━━━━━━━━━━━━━━━━

💰 Valor: R$ 100,00

📲 Como pagar:
1️⃣ Clique no link abaixo
2️⃣ Na página que abrir, você verá o QR Code e a opção Pix Copia e Cola
3️⃣ Abra o app do seu banco e escaneie o QR Code ou cole o código Pix
4️⃣ Após o pagamento, envie o comprovante por aqui

🔗 Link de pagamento:
https://seu-link.com/pay/abc123

━━━━━━━━━━━━━━━━━━━━
⚡ Pagamento instantâneo via PIX
✅ Confirmação automática
🔒 Ambiente seguro

Obrigado pela preferência!
```

#### Mensagem de Comprovante:
```
✅ COMPROVANTE DE PAGAMENTO
━━━━━━━━━━━━━━━━━━━━

🏪 Nome da Loja

💰 Valor: R$ 100,00
📅 Data: 20/02/2026 14:30
📋 ID: abc123def456...
✅ Status: Pago via PIX
📉 Taxa: R$ 2,00
💵 Líquido: R$ 98,00

━━━━━━━━━━━━━━━━━━━━
🔒 Pagamento seguro via PIX
Comprovante gerado pela Maquininha PIX
```

---

## 🔐 Sistema de Segurança Completo

### 1. **Proteção de Dados Sensíveis**

#### Máscara de API Key
- Exibição segura: `bpx_live••••••••••••••••abcd`
- Botão para mostrar/ocultar chave
- Validação de formato antes de salvar

#### Máscara de Documentos
- CPF: `***.456.***-**`
- CNPJ: `**.123.456.****/**`

#### Máscara de Webhook Secret
- Exibição: `whsec_••••••••••••••abcd`

---

### 2. **Validação e Sanitização de Inputs**

#### Sanitização contra XSS
```typescript
sanitizeString(input) // Remove tags HTML, javascript:, event handlers
```

#### Validação de Valores Monetários
```typescript
sanitizeAmount(input) // Valida min/max, arredonda para 2 casas decimais
```

#### Validação de Documentos
```typescript
validateDocument(cpfOuCnpj) // Verifica 11 ou 14 dígitos
```

#### Validação de URLs
```typescript
validateWebhookUrl(url) // Verifica protocolo HTTPS/HTTP
```

#### Validação de API Key
```typescript
validateApiKey(key) // Formato: bpx_(live|test)_[a-zA-Z0-9_]{16,}
```

---

### 3. **Rate Limiting Client-Side**

#### Proteção contra abuso
- Limite padrão: **50 transações por hora**
- Configuração ajustável nas configurações
- Mensagem clara quando limite é excedido
- Contador por tipo de ação

```typescript
checkRateLimit('transaction') // Retorna false se limite excedido
getRateLimitResetTime() // Tempo restante até reset
```

---

### 4. **Sessão e Timeout**

#### Gerenciamento de sessão
- Timeout configurável (padrão: 30 minutos)
- Renovação automática a cada 5 minutos
- Validação de sessão em operações sensíveis
- Logs de início/fim/expiração de sessão

```typescript
startSession() // Inicia nova sessão
isSessionValid() // Verifica se sessão é válida
renewSession() // Renova sessão ativa
endSession() // Encerra sessão
```

---

### 5. **Proteção contra Replay Attacks**

#### Nonce único por transação
```typescript
generateNonce() // Gera nonce criptográfico de 32 bytes
generateIdempotencyKey() // UUID v4 para idempotência
checkNonce(nonce) // Verifica se nonce já foi usado
```

- Nonces válidos por 24 horas
- Limpeza automática de nonces antigos
- Prevenção de duplicidade de transações

---

### 6. **Logs de Auditoria**

#### Rastreamento completo de ações
- Todas as ações críticas são logadas
- Severidade: info, warning, error, critical
- Timestamp, user agent, detalhes
- Visualização nas configurações
- Limite de 500 logs (mais antigos removidos)

**Ações logadas:**
- ✅ Configurações salvas
- ✅ API Key validada/testada
- ✅ Cobrança criada
- ✅ Pagamento confirmado
- ✅ Links compartilhados
- ✅ Comprovantes enviados
- ✅ Rate limit excedido
- ✅ Sessão iniciada/expirada
- ✅ Erros de segurança

---

### 7. **Verificação de Webhook (HMAC-SHA256)**

#### Validação de integridade
```typescript
verifyWebhookSignature(payload, signature, secret)
```

- Assinatura HMAC-SHA256
- Comparação timing-safe (previne timing attacks)
- Logs de erro na verificação

---

### 8. **Proteção contra Clickjacking**

#### Headers de segurança
```typescript
applySecurityHeaders()
```

- X-Frame-Options: DENY
- Content-Security-Policy
- Detecção de iframe
- Log de tentativas de framing

---

### 9. **Integridade de Dados**

#### Hash SHA-256
```typescript
generateIntegrityHash(data)
verifyIntegrity(data, expectedHash)
```

- Verificação de integridade de dados críticos
- Prevenção de manipulação

---

### 10. **Limpeza de Dados**

#### Factory reset
```typescript
clearSensitiveData() // Remove dados sensíveis
factoryReset() // Limpa tudo
```

---

## 📊 Configurações de Segurança

Nas **Configurações**, seção **🛡️ Segurança**, você pode ajustar:

| Configuração | Padrão | Descrição |
|--------------|--------|-----------|
| Timeout de sessão | 30 min | Tempo de inatividade antes de expirar |
| Máx. transações/hora | 50 | Limite de cobranças por hora |
| Valor máximo/transação | R$ 50.000 | Limite por cobrança |
| Logs de auditoria | ✅ Ativado | Rastrear todas as ações |
| Rate limiting | ✅ Ativado | Proteger contra abuso |
| Mascarar dados | ✅ Ativado | Ocultar informações sensíveis |

---

## 🔍 Visualização de Logs

Na seção **📜 Logs de Auditoria**, você pode:
- Ver todas as ações registradas
- Filtrar por severidade (cores)
- Ver timestamp e detalhes
- Limpar logs quando necessário

**Indicadores de severidade:**
- 🟢 Verde: Info (ações normais)
- 🟡 Amarelo: Warning (atenção)
- 🔴 Vermelho: Error/Critical (problemas)

---

## 🚀 Boas Práticas de Segurança

### Para Desenvolvedores:

1. **Nunca exponha a API Key no frontend**
   - Use variáveis de ambiente em produção
   - Implemente proxy/backend para chamadas à API

2. **Sempre valide inputs no backend**
   - Validação client-side é apenas UX
   - Backend deve revalidar tudo

3. **Use HTTPS em produção**
   - Nunca use HTTP
   - Certificados válidos

4. **Implemente webhooks seguros**
   - Verifique assinatura HMAC-SHA256
   - Use secrets fortes (whsec_xxx)

5. **Monitore logs de auditoria**
   - Revise regularmente
   - Configure alertas para ações críticas

### Para Usuários:

1. **Mantenha sua API Key secreta**
   - Não compartilhe
   - Use o botão "Ocultar" ao mostrar tela

2. **Configure webhook URL segura**
   - Use HTTPS
   - Verifique assinatura nos webhooks

3. **Revise logs regularmente**
   - Verifique ações suspeitas
   - Limpe logs antigos periodicamente

4. **Ajuste limites de segurança**
   - Defina valor máximo adequado ao seu negócio
   - Configure rate limit apropriado

---

## 📱 Funcionalidades do Aplicativo

### 🎰 Maquininha (Tela Principal)
- Teclado numérico estilo máquina de cartão
- Display grande do valor
- Botão COBRAR com validação

### 💳 Pagamento
- Gera QR Code PIX via API BuyPix
- Código "Pix Copia e Cola"
- **Mensagens melhoradas** com instruções
- Compartilhamento WhatsApp com guia completo
- Polling automático para detectar pagamento
- Confirmação visual quando pago

### 📋 Histórico
- Lista todas as cobranças
- Filtros: Todos, Pagos, Pendentes
- Resumo do total recebido
- Acesso rápido a comprovantes

### 📊 Relatórios
- **Relatório Diário**: transações de um dia
- **Relatório Mensal**: agrupado por dia
- Cards de resumo (Recebido, Líquido, Taxas)
- **Compartilhamento** de relatório via WhatsApp

### 🧾 Comprovante
- Comprovante visual profissional
- **Mensagens formatadas** para WhatsApp
- Compartilhamento com um clique
- Cópia para área de transferência

### ⚙️ Configurações
- Nome do estabelecimento
- API Key (com máscara e validação)
- URL do Webhook
- **Seção de Segurança** completa
- **Logs de Auditoria** visuais
- Teste de conexão

---

## 🔗 Integração com API BuyPix

### Endpoints Utilizados:

1. **POST /deposits** - Criar cobrança PIX
   - Idempotency key segura
   - Validação de amount
   - Logs de auditoria

2. **GET /deposits/{id}** - Consultar status
   - Polling automático (3s)
   - Detecção de pagamento

3. **GET /account** - Testar conexão
   - Validação de API Key
   - Obtém nome da conta

### Segurança nas Chamadas:
- ✅ Idempotency keys criptográficas
- ✅ Validação de inputs
- ✅ Logs de todas as chamadas
- ✅ Tratamento de erros
- ✅ Rate limiting

---

## 🎯 Próximos Passos (Sugestões)

### Melhorias Futuras:
- [ ] Backend proxy para API calls (produção)
- [ ] Autenticação de usuário (login)
- [ ] Criptografia de dados em repouso
- [ ] Backup automático de transações
- [ ] Exportação de relatórios (PDF/Excel)
- [ ] Notificações push
- [ ] Multi-usuário com permissões
- [ ] Integração com sistemas de contabilidade

### Segurança Avançada:
- [ ] 2FA para operações críticas
- [ ] IP whitelist para API
- [ ] Certificados client-side
- [ ] Auditoria externa
- [ ] Penetration testing

---

## 📞 Suporte

Para dúvidas sobre segurança ou funcionalidades:
- Documentação da API: https://docs.buypix.me
- Logs de auditoria: Configurações → 📜 Logs
- Teste de conexão: Configurações → 🔌 Testar

---

**Última atualização:** 2026-02-25  
**Versão:** 2.0.0 (com segurança completa)
