# 🧾 Maquininha PIX

Aplicativo web estilo maquininha de cartão para gerar cobranças PIX via API BuyPix.

## ✨ Funcionalidades

- 💰 **Maquininha digital** com teclado numérico
- 📱 **QR Code PIX** gerado automaticamente
- 🔗 **Links de pagamento** compartilháveis
- 📤 **Compartilhamento via WhatsApp** com instruções completas
- 📊 **Relatórios diários e mensais**
- 🧾 **Comprovantes de pagamento** compartilháveis
- 🛡️ **Segurança completa** (rate limiting, validação, logs de auditoria)
- 💵 **Valor mínimo de R$ 50,00**

## 🚀 Deploy no GitHub Pages

### Passo 1: Configurar o Vite para GitHub Pages

Crie ou edite o arquivo `vite.config.js` na raiz do projeto:

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/NOME-DO-SEU-REPOSITORIO/', // ⚠️ IMPORTANTE: Substitua pelo nome do seu repositório
  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
    hmr: {
      port: 3000,
    },
  },
});
```

**Exemplo:** Se seu repositório se chama `maquininha-pix`, use:
```javascript
base: '/maquininha-pix/',
```

### Passo 2: Build do Projeto

```bash
npm run build
```

### Passo 3: Deploy

#### Opção A: GitHub Actions (Recomendado)

Crie o arquivo `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm install
        
      - name: Build
        run: npm run build
        
      - name: Setup Pages
        uses: actions/configure-pages@v3
        
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: './dist'
          
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
```

#### Opção B: Deploy Manual

1. Faça o build: `npm run build`
2. Copie o conteúdo da pasta `dist/` para a branch `gh-pages`
3. Push para o GitHub

### Passo 4: Configurar GitHub Pages

1. Vá em **Settings** → **Pages**
2. Em **Source**, selecione:
   - **Branch:** `gh-pages` (se usou deploy manual)
   - Ou **GitHub Actions** (se usou o workflow)
3. Salve as configurações
4. Aguarde alguns minutos
5. Acesse: `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`

## 🔧 Configuração Inicial

1. **Configure a API Key:**
   - Acesse as Configurações (ícone ⚙️)
   - Insira sua API Key da BuyPix (formato: `bpx_live_xxxxxxxxxxxxxxxx`)
   - Clique em "Testar conexão" para verificar
   - Salve as configurações

2. **Obter API Key:**
   - Acesse: https://buypix.me/app/api-keys
   - Gere uma nova chave
   - Copie e cole no aplicativo

## 📱 Como Usar

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

## 🔒 Segurança

O aplicativo implementa múltiplas camadas de segurança:

- ✅ **Valor mínimo:** R$ 50,00 (configurável)
- ✅ **Rate limiting:** Limite de transações por hora
- ✅ **Validação de inputs:** Sanitização contra XSS
- ✅ **Logs de auditoria:** Rastreamento de todas as ações
- ✅ **Máscara de dados:** API Key e documentos protegidos
- ✅ **Sessão segura:** Timeout configurável
- ✅ **Proteção anti-replay:** Nonce único por transação

## 🛠️ Tecnologias

- React 18
- TypeScript
- Tailwind CSS
- Vite
- API BuyPix

## 📄 Documentação da API

- Documentação completa: https://docs.buypix.me
- Endpoints utilizados:
  - `POST /deposits` - Criar cobrança PIX
  - `GET /deposits/{id}` - Consultar status
  - `GET /account` - Informações da conta

## 🐛 Problemas Comuns

### Tela branca no GitHub Pages
**Solução:** Configure o `base` no `vite.config.js` com o nome do repositório

### Assets não carregam
**Solução:** Verifique se o `base` está correto no vite.config.js

### API não funciona
**Solução:** 
1. Verifique se a API Key está correta
2. Clique em "Testar conexão" nas configurações
3. Verifique se a chave tem permissões adequadas

## 📞 Suporte

- Documentação BuyPix: https://docs.buypix.me
- Logs de auditoria: Configurações → 📜 Logs

## 📝 Licença

Este projeto é de uso pessoal/educacional.

---

**Desenvolvido com ❤️ para facilitar cobranças PIX**
