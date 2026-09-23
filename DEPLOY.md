# 🚀 Deploy Rápido - GitHub Pages

## ✅ Correções Aplicadas

1. **Base path configurado**: `base: './'` no vite.config.js
2. **Caminhos relativos**: Assets agora usam `./assets/...` em vez de `/assets/...`
3. **Loading state**: Mensagem de carregamento enquanto o React inicializa
4. **Error Boundary**: Captura e exibe erros de renderização

## 📝 Passo a Passo para Deploy

### 1. Commit e Push das Alterações

```bash
git add .
git commit -m "Corrigir tela preta - configurar base path relativo"
git push
```

### 2. Verificar GitHub Actions

1. Vá em **Actions** no seu repositório
2. Aguarde o workflow completar (deve ter ✅ verde)
3. Se falhar, clique para ver os logs

### 3. Configurar GitHub Pages

1. Vá em **Settings** → **Pages**
2. Em **Source**, selecione:
   - **Source**: GitHub Actions
3. Salve as configurações

### 4. Acessar o Site

Acesse: `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`

**Exemplo**: Se seu usuário é `joao` e o repositório é `maquininha-pix`:
- URL: `https://joao.github.io/maquininha-pix/`

### 5. Limpar Cache do Navegador

**IMPORTANTE**: Após o deploy, limpe o cache:

- **Chrome/Edge**: `Ctrl + Shift + R` ou `Ctrl + F5`
- **Firefox**: `Ctrl + Shift + R`
- **Safari**: `Cmd + Shift + R`
- **Mobile**: Feche e abra o navegador

Ou use uma aba anônima/privada para testar.

## 🔍 Verificações

### Se ainda estiver com tela preta:

1. **Verifique o console do navegador** (F12):
   - Abra DevTools
   - Vá na aba **Console**
   - Veja se há erros em vermelho
   - Tire um screenshot e me envie

2. **Verifique a aba Network** (F12):
   - Abra DevTools
   - Vá na aba **Network**
   - Recarregue a página
   - Veja se os arquivos `index-*.js` e `index-*.css` estão carregando (status 200)

3. **Teste em modo anônimo**:
   - Abra uma janela anônima
   - Acesse o URL do GitHub Pages
   - Veja se funciona

4. **Verifique se o deploy completou**:
   - Vá em **Actions**
   - O workflow deve ter ✅ verde
   - Clique nele e veja os logs

## 📋 Checklist

- [ ] `vite.config.js` tem `base: './'`
- [ ] Commit e push feitos
- [ ] GitHub Actions completou com sucesso (✅)
- [ ] GitHub Pages configurado (Settings → Pages → GitHub Actions)
- [ ] Cache do navegador limpo (Ctrl + Shift + R)
- [ ] Acessando URL correta: `https://USUARIO.github.io/REPOSITORIO/`

## 🆘 Problemas Comuns

### Tela preta com mensagem "Carregando..."
- O React não está carregando
- Verifique o console (F12) para ver erros
- Provavelmente é erro de JavaScript

### Tela preta sem mensagem nenhuma
- Os assets não estão carregando
- Verifique a aba Network (F12)
- Veja se os arquivos JS e CSS estão com status 200

### Erro 404 nos assets
- O `base` não está configurado corretamente
- Verifique se `vite.config.js` tem `base: './'`
- Faça novo commit e push

### Funciona localmente mas não no GitHub Pages
- É problema de `base path`
- Use `base: './'` (relativo) em vez de `base: '/nome/'` (absoluto)

## 💡 Dica Importante

Se nada funcionar, me envie:
1. Screenshot da tela
2. Screenshot do console do navegador (F12 → Console)
3. Screenshot da aba Network (F12 → Network)
4. URL do seu GitHub Pages

Com essas informações posso identificar o problema exato!
