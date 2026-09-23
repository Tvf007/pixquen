# 🚨 Guia de Troubleshooting - GitHub Pages

## Problema: Tela Branca ou "Integração com API BuyPix"

Se ao fazer deploy no GitHub Pages você vê uma tela branca ou conteúdo antigo, siga estes passos:

### ✅ Solução 1: Configurar base path (MAIS COMUM)

O problema mais comum é que o Vite gera caminhos absolutos (`/assets/...`) que não funcionam no GitHub Pages.

**Passo a passo:**

1. Abra o arquivo `vite.config.js` na raiz do projeto

2. Adicione a propriedade `base` com o nome do seu repositório:

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/maquininha-pix/', // ⚠️ IMPORTANTE: Use o nome do SEU repositório
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

**Exemplos:**
- Repositório `maquininha-pix` → `base: '/maquininha-pix/'`
- Repositório `meu-app` → `base: '/meu-app/'`
- Repositório `pix-payment` → `base: '/pix-payment/'`

3. Faça commit e push:
```bash
git add vite.config.js
git commit -m "Configurar base path para GitHub Pages"
git push
```

4. Aguarde o GitHub Actions fazer o deploy (2-3 minutos)

5. Acesse: `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`

---

### ✅ Solução 2: Limpar Cache do Navegador

Se você já configurou o `base` mas ainda vê a versão antiga:

1. **Hard refresh:**
   - Windows/Linux: `Ctrl + Shift + R` ou `Ctrl + F5`
   - Mac: `Cmd + Shift + R`

2. **Limpar cache completamente:**
   - Abra DevTools (F12)
   - Clique com botão direito no botão de recarregar
   - Selecione "Esvaziar cache e recarregar rigidamente"

3. **Modo anônimo:**
   - Abra uma janela anônima/privada
   - Acesse o URL do GitHub Pages

---

### ✅ Solução 3: Verificar GitHub Actions

1. Vá em **Actions** no seu repositório
2. Verifique se o workflow está rodando
3. Se falhou, clique para ver os logs
4. Corrija o erro e faça push novamente

---

### ✅ Solução 4: Verificar Configurações do GitHub Pages

1. Vá em **Settings** → **Pages**
2. Verifique as configurações:
   - **Source:** GitHub Actions
   - **Branch:** gh-pages (se usou deploy manual)
3. Se necessário, desative e reative o GitHub Pages

---

### ✅ Solução 5: Deploy Manual (Alternativa)

Se o GitHub Actions não funcionar, faça deploy manual:

```bash
# 1. Build o projeto
npm run build

# 2. Crie a branch gh-pages
git checkout -b gh-pages

# 3. Remova todos os arquivos exceto dist/
git rm -rf .

# 4. Copie o conteúdo de dist/
cp -r dist/* .

# 5. Commit e push
git add .
git commit -m "Deploy manual"
git push origin gh-pages
```

Depois configure em Settings → Pages:
- Source: Deploy from a branch
- Branch: gh-pages / root

---

## 🔍 Verificar se está Funcionando

### Teste Local

Antes de fazer deploy, teste localmente:

```bash
npm run build
npm run preview
```

Acesse: `http://localhost:4173/` (ou a porta mostrada)

Se funcionar localmente mas não no GitHub Pages, o problema é o `base path`.

### Verificar Console do Navegador

1. Abra o site no GitHub Pages
2. Pressione F12 para abrir DevTools
3. Vá na aba **Console**
4. Veja se há erros em vermelho
5. Erros comuns:
   - `Failed to load resource: 404` → Problema com base path
   - `Uncaught SyntaxError` → Problema com JavaScript
   - `CSP error` → Problema com Content Security Policy

---

## 📋 Checklist de Deploy

- [ ] Configurar `base` no `vite.config.js` com nome do repositório
- [ ] Fazer commit e push das mudanças
- [ ] Verificar se o GitHub Actions rodou com sucesso
- [ ] Aguardar 2-3 minutos para o deploy
- [ ] Limpar cache do navegador (Ctrl+Shift+R)
- [ ] Acessar o URL correto: `https://USUARIO.github.io/REPOSITORIO/`
- [ ] Verificar console do navegador (F12) se houver problemas

---

## 🆘 Ainda não funciona?

### Verificações Finais

1. **Nome do repositório está correto no base?**
   ```javascript
   base: '/nome-exato-do-repositorio/'
   ```

2. **O workflow do GitHub Actions completou com sucesso?**
   - Verifique em Actions → último workflow → deve ter check verde ✓

3. **O GitHub Pages está ativo?**
   - Settings → Pages → deve mostrar "Your site is live at..."

4. **Está acessando o URL correto?**
   - Formato: `https://USUARIO.github.io/REPOSITORIO/`
   - Não esqueça a barra no final

5. **Tentou em modo anônimo?**
   - Elimina problemas de cache

### Comandos Úteis

```bash
# Ver status do git
git status

# Ver último commit
git log -1

# Forçar push (cuidado!)
git push -f origin main

# Ver branches
git branch -a

# Limpar e reinstalar
rm -rf node_modules dist
npm install
npm run build
```

---

## 💡 Dicas Importantes

1. **Sempre teste localmente antes de fazer deploy**
   ```bash
   npm run build
   npm run preview
   ```

2. **Use o nome exato do repositório no base**
   - Case sensitive (maiúsculas/minúsculas importam)
   - Sem espaços ou caracteres especiais

3. **Aguarde o deploy completar**
   - GitHub Actions leva 2-3 minutos
   - GitHub Pages pode levar mais alguns minutos para atualizar

4. **Mantenha o vite.config.js atualizado**
   - Sempre que mudar o nome do repositório, atualize o base

5. **Use HTTPS**
   - GitHub Pages sempre usa HTTPS
   - Não misture HTTP e HTTPS

---

## 📞 Suporte

Se nada funcionar:

1. Verifique os logs do GitHub Actions
2. Abra o console do navegador (F12) e veja os erros
3. Tente em outro navegador
4. Tente em modo anônimo
5. Verifique se o repositório é público (GitHub Pages gratuito só funciona com repos públicos)

---

**Última atualização:** 2026-02-25
