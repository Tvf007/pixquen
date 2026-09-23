# 🔧 Diagnóstico - App Travando na Tela de Carregamento

## ⚠️ Problema Identificado

O aplicativo está travando na tela inicial e não está carregando o React. Isso indica um erro JavaScript em runtime.

## 🔍 Como Diagnosticar

### Passo 1: Abrir o Console do Navegador

1. **No computador:**
   - Pressione `F12` ou `Ctrl+Shift+I` (Windows/Linux)
   - Ou `Cmd+Option+I` (Mac)
   - Clique na aba **Console**

2. **No celular:**
   - **Chrome Android:** 
     - Digite `chrome://inspect` na barra de endereços
     - Conecte o celular via USB
     - Inspecione a página
   - **Safari iPhone:**
     - Ajustes → Safari → Avançado → Ativar "Inspetor Web"
     - Conecte o iPhone via USB
     - No Mac: Safari → Desenvolver → [Seu iPhone] → [Página]

### Passo 2: Verificar Erros no Console

Procure por mensagens em **vermelho**. Os erros mais comuns são:

#### Erro 1: "Cannot find module"
```
Cannot find module './components/Maquininha'
```
**Solução:** Verificar se todos os arquivos estão no GitHub

#### Erro 2: "TypeError: Cannot read property"
```
TypeError: Cannot read property 'map' of undefined
```
**Solução:** Verificar se há dados undefined nos componentes

#### Erro 3: "SyntaxError"
```
SyntaxError: Unexpected token
```
**Solução:** Verificar se há erro de sintaxe no código

#### Erro 4: "CORS error"
```
Access to fetch at 'https://buypix.me/api/v1/deposits' has been blocked by CORS policy
```
**Solução:** A API BuyPix pode estar bloqueando requisições do navegador

### Passo 3: Verificar a Aba Network

1. Clique na aba **Network** (Rede)
2. Recarregue a página (`Ctrl+Shift+R` ou `Cmd+Shift+R`)
3. Verifique se os arquivos estão carregando:
   - `index-*.js` deve ter status **200**
   - `index-*.css` deve ter status **200**

Se algum arquivo estiver com status **404** ou **500**, há problema no deploy.

### Passo 4: Testar em Modo Anônimo

1. Abra uma janela anônima/privada
2. Acesse o URL do GitHub Pages
3. Veja se funciona

Se funcionar em modo anônimo, o problema é cache. Limpe o cache:
- `Ctrl+Shift+Delete` → Limpar dados de navegação

## 🛠️ Soluções Possíveis

### Solução 1: Verificar se o GitHub Actions Completou

1. Vá em **Actions** no GitHub
2. Verifique se o workflow tem ✅ verde
3. Se falhou, clique para ver os logs
4. Corrija o erro e faça push novamente

### Solução 2: Limpar Cache do GitHub Pages

```bash
# Adicionar um arquivo de cache busting
echo "cache-bust-$(date +%s)" > public/version.txt
git add public/version.txt
git commit -m "Cache bust"
git push
```

### Solução 3: Desativar Service Worker

Se o Service Worker estiver causando problemas:

1. Abra o DevTools (F12)
2. Vá em **Application** → **Service Workers**
3. Clique em **Unregister**
4. Recarregue a página

### Solução 4: Verificar se o Base Path está Correto

No `vite.config.js`:
```javascript
base: './', // Deve ser relativo
```

Se estiver com caminho absoluto (`/nome-repo/`), pode causar problema.

### Solução 5: Testar Localmente

Antes de fazer deploy, teste localmente:

```bash
npm run build
npm run preview
```

Acesse: `http://localhost:4173/`

Se funcionar localmente mas não no GitHub Pages, o problema é o deploy.

## 📋 Checklist de Debug

- [ ] Abrir console do navegador (F12)
- [ ] Verificar erros em vermelho
- [ ] Verificar aba Network (arquivos com status 200)
- [ ] Testar em modo anônimo
- [ ] Limpar cache do navegador
- [ ] Verificar se GitHub Actions completou com sucesso
- [ ] Verificar se o base path está correto no vite.config.js
- [ ] Testar localmente com `npm run preview`

## 🆘 Enviar Informações para Debug

Se o problema persistir, me envie:

1. **Screenshot do Console** (F12 → Console)
   - Mostre todos os erros em vermelho
   
2. **Screenshot do Network** (F12 → Network)
   - Mostre os arquivos JS e CSS com seus status
   
3. **URL do GitHub Pages**
   - Exemplo: `https://usuario.github.io/repo/`
   
4. **Navegador e versão**
   - Exemplo: Chrome 120, Safari 17, etc.

5. **Dispositivo**
   - Exemplo: iPhone 13, Samsung S21, etc.

Com essas informações posso identificar o problema exato!

## 🔧 Código de Debug Adicionado

Adicionei no `main.tsx`:

```javascript
// Capturar erros globais
window.addEventListener('error', (event) => {
  console.error('Erro global:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Promise rejeitada:', event.reason);
});
```

Isso vai mostrar erros no console que antes estavam escondidos.

## 🎯 Próximos Passos

1. **Abra o console do navegador** (F12)
2. **Recarregue a página** (Ctrl+Shift+R)
3. **Copie os erros em vermelho**
4. **Me envie os erros**

Com os erros do console, posso corrigir o problema exato!

---

**Dica:** Se a tela estiver completamente preta sem nenhuma mensagem, provavelmente o JavaScript não está carregando. Verifique a aba Network para ver se os arquivos JS estão com status 200.
