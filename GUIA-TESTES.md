# 🧪 Guia de Testes Completo

## Objetivo

Este guia serve para validar todas as funcionalidades do aplicativo Maquininha PIX após as correções de bugs.

---

## 📱 Testes Mobile (Prioridade Alta)

### Teste 1: Abrir o App no Mobile

**Passos:**
1. Limpar cache do navegador no celular
2. Acessar o URL do GitHub Pages
3. Aguardar carregamento completo

**Resultado Esperado:**
- ✅ App abre sem tela preta
- ✅ Layout aparece corretamente
- ✅ Teclado numérico visível
- ✅ Botões responsivos ao toque

**Se falhar:**
- Verificar console (F12) para erros
- Testar em modo anônimo
- Enviar screenshot

---

### Teste 2: Layout Responsivo

**Passos:**
1. Rotacionar o celular (retrato → paisagem)
2. Verificar se o layout se adapta
3. Verificar se não há scroll horizontal

**Resultado Esperado:**
- ✅ Layout se adapta à orientação
- ✅ Não há scroll horizontal
- ✅ Elementos não ficam cortados
- ✅ Botões permanecem acessíveis

---

### Teste 3: Touch e Interação

**Passos:**
1. Tocar nos botões do teclado numérico
2. Verificar se há feedback visual
3. Testar botões de navegação

**Resultado Esperado:**
- ✅ Botões respondem ao toque
- ✅ Não há delay excessivo
- ✅ Feedback visual ao tocar
- ✅ Navegação funciona corretamente

---

## 💰 Testes de Funcionalidade

### Teste 4: Criar Cobrança (Valor Válido)

**Passos:**
1. Digitar valor: 50.00
2. Verificar mensagem "✓ Valor válido"
3. Clicar em "COBRAR R$ 50,00"

**Resultado Esperado:**
- ✅ Mensagem "Valor válido" aparece
- ✅ Botão COBRAR está habilitado
- ✅ Transição para tela de pagamento
- ✅ Loading "Gerando cobrança..." aparece

---

### Teste 5: Criar Cobrança (Valor Inválido)

**Passos:**
1. Digitar valor: 30.00
2. Verificar mensagem de erro
3. Tentar clicar em COBRAR

**Resultado Esperado:**
- ✅ Mensagem "⚠️ Mínimo: R$ 50,00" aparece
- ✅ Botão COBRAR mostra "MÍNIMO R$ 50,00"
- ✅ Botão está desabilitado
- ✅ Ao clicar, alerta é mostrado

---

### Teste 6: Tela de Pagamento

**Passos:**
1. Criar cobrança de R$ 100,00
2. Aguardar carregamento do QR Code
3. Verificar elementos na tela

**Resultado Esperado:**
- ✅ Valor "R$ 100,00" visível
- ✅ QR Code aparece (ou placeholder)
- ✅ Status "Aguardando pagamento..." visível
- ✅ Código PIX Copia e Cola visível
- ✅ Todos os botões de compartilhamento visíveis

---

### Teste 7: Botão Abrir Link (NOVO)

**Passos:**
1. Na tela de pagamento, localizar botão "🌐 Abrir link de pagamento"
2. Clicar no botão
3. Verificar se nova aba é aberta

**Resultado Esperado:**
- ✅ Botão "🌐 Abrir link de pagamento" visível
- ✅ Ao clicar, nova aba é aberta
- ✅ Link de pagamento é carregado
- ✅ QR Code aparece na nova aba

---

### Teste 8: Compartilhar via WhatsApp

**Passos:**
1. Na tela de pagamento, clicar em "Compartilhar no WhatsApp"
2. Verificar se WhatsApp abre
3. Verificar mensagem gerada

**Resultado Esperado:**
- ✅ WhatsApp abre (ou prompt de compartilhamento)
- ✅ Mensagem contém:
  - Valor da cobrança
  - Instruções completas
  - Link de pagamento
  - Formatação adequada

---

### Teste 9: Copiar Link

**Passos:**
1. Clicar em "🔗 Copiar link de pagamento"
2. Verificar mensagem de confirmação
3. Colar em um editor de texto

**Resultado Esperado:**
- ✅ Mensagem "✅ Link copiado!" aparece
- ✅ Link é copiado para clipboard
- ✅ Link pode ser colado em outro app

---

### Teste 10: Histórico de Transações

**Passos:**
1. Voltar para tela principal
2. Clicar no ícone de relógio (Histórico)
3. Verificar lista de transações

**Resultado Esperado:**
- ✅ Tela de histórico abre
- ✅ Transações anteriores listadas
- ✅ Resumo financeiro visível
- ✅ Filtros funcionam (Todos, Pagos, Pendentes)

---

### Teste 11: Relatórios

**Passos:**
1. Voltar para tela principal
2. Clicar no ícone de gráfico (Relatórios)
3. Testar relatório diário
4. Testar relatório mensal

**Resultado Esperado:**
- ✅ Tela de relatórios abre
- ✅ Relatório diário mostra transações do dia
- ✅ Relatório mensal mostra transações do mês
- ✅ Cards de resumo visíveis (Recebido, Líquido, Taxas)
- ✅ Botão de compartilhar funciona

---

### Teste 12: Comprovante

**Passos:**
1. No histórico, clicar em uma transação paga
2. Verificar comprovante
3. Testar compartilhamento

**Resultado Esperado:**
- ✅ Comprovante abre com visual profissional
- ✅ Todos os dados visíveis (valor, data, ID, status)
- ✅ Botão "Enviar via WhatsApp" funciona
- ✅ Botão "Copiar Comprovante" funciona

---

### Teste 13: Configurações

**Passos:**
1. Voltar para tela principal
2. Clicar no ícone de engrenagem (Configurações)
3. Verificar API Key
4. Testar conexão

**Resultado Esperado:**
- ✅ Tela de configurações abre
- ✅ API Key visível (mascarada)
- ✅ Botão "Ver/Ocultar" funciona
- ✅ Botão "Testar conexão" funciona
- ✅ Seção de segurança visível
- ✅ Logs de auditoria visíveis

---

## 🔒 Testes de Segurança

### Teste 14: Valor Mínimo

**Passos:**
1. Tentar criar cobrança com valor < R$ 50
2. Verificar validação

**Resultado Esperado:**
- ✅ Não permite criar cobrança
- ✅ Alerta é mostrado
- ✅ Botão permanece desabilitado

---

### Teste 15: Rate Limiting

**Passos:**
1. Criar múltiplas cobranças rapidamente (mais de 50 em 1 hora)
2. Verificar se limite é aplicado

**Resultado Esperado:**
- ✅ Após 50 transações, erro é mostrado
- ✅ Mensagem clara sobre limite
- ✅ Log de auditoria é registrado

---

### Teste 16: Logs de Auditoria

**Passos:**
1. Realizar algumas ações (criar cobrança, compartilhar, etc.)
2. Ir em Configurações → Logs de Auditoria
3. Verificar se ações foram registradas

**Resultado Esperado:**
- ✅ Logs aparecem na lista
- ✅ Timestamp correto
- ✅ Ação descrita corretamente
- ✅ Severidade indicada (info, warning, error)

---

## 🌐 Testes de API

### Teste 17: Integração com BuyPix

**Pré-requisitos:**
- API Key configurada e válida

**Passos:**
1. Criar cobrança de R$ 100,00
2. Verificar se QR Code é gerado
3. Verificar se código PIX é retornado

**Resultado Esperado:**
- ✅ API responde com sucesso
- ✅ QR Code é gerado
- ✅ Código PIX é retornado
- ✅ Log de auditoria registrado

---

### Teste 18: Polling de Pagamento

**Passos:**
1. Criar cobrança
2. Pagar via PIX (em ambiente de teste)
3. Aguardar detecção automática

**Resultado Esperado:**
- ✅ Pagamento é detectado automaticamente
- ✅ Tela muda para "Pagamento Confirmado!"
- ✅ Transação é atualizada no histórico
- ✅ Log de auditoria registrado

---

## 🎨 Testes de UI/UX

### Teste 19: Cores e Contraste

**Passos:**
1. Verificar todas as telas
2. Checar contraste de textos
3. Verificar consistência de cores

**Resultado Esperado:**
- ✅ Textos legíveis em todas as telas
- ✅ Cores consistentes
- ✅ Botões com bom contraste
- ✅ Status visuais claros (verde=pago, amarelo=pendente, vermelho=erro)

---

### Teste 20: Animações e Transições

**Passos:**
1. Navegar entre telas
2. Verificar transições
3. Testar animações de loading

**Resultado Esperado:**
- ✅ Transições suaves entre telas
- ✅ Loading spinner animado
- ✅ Animação de confirmação de pagamento
- ✅ Sem travamentos ou delays

---

## 📊 Checklist Final

### Funcionalidades Críticas
- [ ] App abre no mobile
- [ ] Layout responsivo funciona
- [ ] Criar cobrança funciona
- [ ] QR Code é gerado
- [ ] Botão "Abrir link" funciona
- [ ] Compartilhar WhatsApp funciona
- [ ] Histórico mostra transações
- [ ] Relatórios funcionam
- [ ] Comprovantes acessíveis
- [ ] Configurações funcionam

### Validações
- [ ] Valor mínimo R$ 50 validado
- [ ] Rate limiting funciona
- [ ] Logs de auditoria registrados
- [ ] API BuyPix integrada
- [ ] Polling de pagamento funciona

### Compatibilidade
- [ ] Funciona no Chrome Mobile
- [ ] Funciona no Safari iOS
- [ ] Funciona no Samsung Internet
- [ ] Touch funciona corretamente
- [ ] Layout se adapta a diferentes telas

---

## 🐛 Reportar Problemas

Se algum teste falhar:

1. **Anotar:**
   - Qual teste falhou
   - Dispositivo usado
   - Navegador e versão
   - Passos para reproduzir

2. **Capturar:**
   - Screenshot da tela
   - Screenshot do console (F12)
   - URL do GitHub Pages

3. **Enviar:**
   - Descrição detalhada do problema
   - Todas as informações coletadas

---

## ✅ Aprovação

**Data do teste:** _______________

**Testador:** _______________

**Dispositivo:** _______________

**Navegador:** _______________

**Resultado:**
- [ ] Todos os testes passaram ✅
- [ ] Alguns testes falharam ⚠️
- [ ] Múltiplos testes falharam ❌

**Observações:**
_________________________________
_________________________________
_________________________________

---

**Versão testada:** 2.1.0  
**Data:** 2026-02-25  
**Status:** Aguardando validação
