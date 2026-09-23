# 🧾 Maquininha PIX - App Completo

Aplicativo web estilo maquininha de cartão para gerar cobranças PIX via API BuyPix.

## ✨ Funcionalidades

- 💰 **Maquininha digital** com teclado numérico otimizado para mobile
- 📱 **Layout responsivo** - ocupa toda a tela sem scroll
- 🔗 **QR Code PIX** gerado automaticamente via API BuyPix
- 📤 **Compartilhamento via WhatsApp** com instruções completas
- 📊 **Relatórios diários e mensais** com resumos financeiros
- 🧾 **Comprovantes de pagamento** compartilháveis
- 🛡️ **Segurança completa** (rate limiting, validação, logs de auditoria)
- 💵 **Valor mínimo de R$ 50,00** (travado)
- 📲 **PWA** - instalável no celular como app nativo
- 🌐 **100% em português** - sem referências a outros idiomas

## 🚀 Status

✅ **API BuyPix configurada** - Modo operacional  
✅ **Layout mobile otimizado** - Sem scroll na tela principal  
✅ **PWA implementado** - Instalável no celular  
✅ **Segurança ativada** - Todas as proteções  
✅ **Valor mínimo R$ 50** - Validado e travado  
✅ **Relatórios funcionais** - Diário e mensal  
✅ **Comprovantes acessíveis** - Via histórico  

## 📲 Instalação (PWA)

### iPhone (Safari)
1. Acesse o site no Safari
2. Toque em **Compartilhar** → **"Adicionar à Tela de Início"**
3. Confirme em **"Adicionar"**

### Android (Chrome)
1. Acesse o site no Chrome
2. Toque nos **três pontos** → **"Adicionar à tela inicial"**
3. Confirme em **"Instalar"**

## 🔑 API Key

Sua API Key já está configurada automaticamente:
```
bpx_J0BLBU3O1DMRIzAFiVqi5tzupEAPdqjmb2KBggAv
```

A chave está salva no localStorage do navegador e pode ser alterada nas configurações.

## 🛡️ Segurança

- ✅ Valor mínimo: R$ 50,00 (não pode ser reduzido)
- ✅ Rate limiting: Limite de transações por hora
- ✅ Logs de auditoria: Todas as ações registradas
- ✅ Validação de inputs: Proteção contra XSS
- ✅ Sessão segura: Timeout configurável
- ✅ Máscara de dados: API Key protegida
- ✅ Idempotência: Previne duplicidade
- ✅ Webhook HMAC: Verificação de assinaturas

## 📊 Como Usar

### Criar Cobrança
1. Digite o valor (mínimo R$ 50,00)
2. Clique em "COBRAR"
3. O QR Code PIX será gerado

### Compartilhar
1. Clique em "Compartilhar no WhatsApp"
2. A mensagem incluirá instruções completas
3. O cliente recebe o link e pode pagar

### Verificar Pagamento
- O app detecta automaticamente quando o pagamento é feito
- Tela de confirmação aparece automaticamente

### Acessar Comprovantes
1. Vá em "Histórico" (ícone 🕐)
2. Clique em qualquer transação paga
3. Visualize o comprovante completo
4. Compartilhe via WhatsApp ou copie

### Relatórios
1. Vá em "Relatórios" (ícone 📊)
2. Escolha "Diário" ou "Mensal"
3. Selecione a data/mês
4. Veja o resumo financeiro
5. Compartilhe o relatório

## 🚀 Deploy

### GitHub Pages

```bash
git add .
git commit -m "App completo: PWA, mobile, segurança"
git push
```

1. Aguarde o GitHub Actions completar
2. Configure Pages: Settings → Pages → GitHub Actions
3. Acesse: `https://SEU-USUARIO.github.io/REPOSITORIO/`
4. Instale no celular (veja instruções acima)

## 🛠️ Tecnologias

- React 18
- TypeScript
- Tailwind CSS
- Vite
- PWA (Service Worker + Manifest)
- API BuyPix

## 📄 Documentação

- **INSTALACAO-PWA.md** - Guia completo de instalação PWA
- **SEGURANCA.md** - Detalhes de segurança
- **DEPLOY.md** - Guia de deploy
- **TROUBLESHOOTING.md** - Solução de problemas

## 🔗 API BuyPix

- Documentação: https://docs.buypix.me
- Endpoints utilizados:
  - `POST /deposits` - Criar cobrança PIX
  - `GET /deposits/{id}` - Consultar status
  - `GET /account` - Informações da conta

## 📞 Suporte

- Logs de auditoria: Configurações → 📜 Logs
- Teste de conexão: Configurações → 🔌 Testar
- Documentação: https://docs.buypix.me

---

**Desenvolvido com ❤️ para facilitar cobranças PIX**
