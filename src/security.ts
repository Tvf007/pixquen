/**
 * Módulo de Segurança da Maquininha PIX
 * 
 * Implementa:
 * - Validação e sanitização de inputs
 * - Proteção contra XSS
 * - Máscara de dados sensíveis
 * - Rate limiting client-side
 * - Verificação de integridade
 * - Logs de auditoria
 * - Timeout de sessão
 * - Proteção contra replay attacks
 * - Validação de webhook signatures
 */

// ============================================
// TIPOS
// ============================================

export interface AuditLog {
  timestamp: string;
  action: string;
  details?: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  ip?: string;
  userAgent?: string;
}

export interface SecurityConfig {
  sessionTimeout: number; // minutos
  maxTransactionsPerHour: number;
  maxAmountPerTransaction: number;
  minAmountPerTransaction: number;
  requireConfirmation: boolean;
  enableAuditLog: boolean;
  maskSensitiveData: boolean;
  enableRateLimit: boolean;
  webhookSecret?: string;
}

// ============================================
// CONFIGURAÇÃO PADRÃO
// ============================================

const DEFAULT_SECURITY_CONFIG: SecurityConfig = {
  sessionTimeout: 30,
  maxTransactionsPerHour: 50,
  maxAmountPerTransaction: 50000,
  minAmountPerTransaction: 1,
  requireConfirmation: true,
  enableAuditLog: true,
  maskSensitiveData: true,
  enableRateLimit: true,
};

const SECURITY_CONFIG_KEY = 'maquininha_security_config';
const AUDIT_LOG_KEY = 'maquininha_audit_log';
const SESSION_KEY = 'maquininha_session';
const RATE_LIMIT_KEY = 'maquininha_rate_limit';
const NONCE_KEY = 'maquininha_nonce';

// ============================================
// CONFIGURAÇÃO DE SEGURANÇA
// ============================================

export function getSecurityConfig(): SecurityConfig {
  const data = localStorage.getItem(SECURITY_CONFIG_KEY);
  return data ? { ...DEFAULT_SECURITY_CONFIG, ...JSON.parse(data) } : DEFAULT_SECURITY_CONFIG;
}

export function saveSecurityConfig(config: Partial<SecurityConfig>): void {
  const current = getSecurityConfig();
  localStorage.setItem(SECURITY_CONFIG_KEY, JSON.stringify({ ...current, ...config }));
  logAudit('security_config_updated', 'Configurações de segurança atualizadas', 'info');
}

// ============================================
// SANITIZAÇÃO DE INPUTS
// ============================================

/**
 * Sanitiza string para prevenir XSS
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[<>]/g, '') // Remove tags HTML
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .replace(/data:/gi, '') // Remove data: protocol
    .trim();
}

/**
 * Sanitiza e valida valor monetário
 */
export function sanitizeAmount(input: string | number): number | null {
  const num = typeof input === 'string' ? parseFloat(input.replace(',', '.')) : input;
  if (isNaN(num) || !isFinite(num)) return null;
  
  const config = getSecurityConfig();
  if (num < config.minAmountPerTransaction || num > config.maxAmountPerTransaction) return null;
  
  // Arredonda para 2 casas decimais
  return Math.round(num * 100) / 100;
}

/**
 * Valida CPF/CNPJ
 */
export function validateDocument(document: string): boolean {
  const clean = document.replace(/\D/g, '');
  return clean.length === 11 || clean.length === 14;
}

/**
 * Valida URL de webhook
 */
export function validateWebhookUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

/**
 * Valida API Key (formato básico)
 */
export function validateApiKey(key: string): boolean {
  return /^bpx_(live|test)_[a-zA-Z0-9_]{16,}$/.test(key);
}

// ============================================
// MÁSCARA DE DADOS SENSÍVEIS
// ============================================

/**
 * MASCARA API Key para exibição segura
 */
export function maskApiKey(key: string): string {
  if (!key || key.length < 12) return '••••••••';
  const prefix = key.substring(0, 8);
  const suffix = key.substring(key.length - 4);
  return `${prefix}${'•'.repeat(Math.max(key.length - 12, 8))}${suffix}`;
}

/**
 * MASCARA CPF/CNPJ
 */
export function maskDocument(doc: string): string {
  const clean = doc.replace(/\D/g, '');
  if (clean.length === 11) {
    return `***.${clean.substring(3, 6)}.***-**`;
  }
  if (clean.length === 14) {
    return `**.${clean.substring(3, 6)}.${clean.substring(6, 9)}.****/**`;
  }
  return '••••••••';
}

/**
 * MASCARA webhook secret
 */
export function maskSecret(secret: string): string {
  if (!secret || secret.length < 8) return '••••••••';
  return secret.substring(0, 6) + '•'.repeat(Math.max(secret.length - 10, 8)) + secret.substring(secret.length - 4);
}

// ============================================
// RATE LIMITING
// ============================================

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

/**
 * Verifica se a ação está dentro do rate limit
 */
export function checkRateLimit(action: string = 'transaction'): boolean {
  const config = getSecurityConfig();
  if (!config.enableRateLimit) return true;

  const key = `${RATE_LIMIT_KEY}_${action}`;
  const data = localStorage.getItem(key);
  const now = Date.now();

  let entry: RateLimitEntry = { count: 0, resetAt: now + 3600000 }; // 1 hora

  if (data) {
    entry = JSON.parse(data);
    if (now > entry.resetAt) {
      entry = { count: 0, resetAt: now + 3600000 };
    }
  }

  if (entry.count >= config.maxTransactionsPerHour) {
    logAudit('rate_limit_exceeded', `Limite de ${config.maxTransactionsPerHour} transações/hora excedido`, 'warning');
    return false;
  }

  entry.count++;
  localStorage.setItem(key, JSON.stringify(entry));
  return true;
}

/**
 * Retorna tempo restante até reset do rate limit
 */
export function getRateLimitResetTime(action: string = 'transaction'): number {
  const key = `${RATE_LIMIT_KEY}_${action}`;
  const data = localStorage.getItem(key);
  if (!data) return 0;
  
  const entry: RateLimitEntry = JSON.parse(data);
  return Math.max(0, entry.resetAt - Date.now());
}

// ============================================
// SESSÃO E TIMEOUT
// ============================================

/**
 * Inicia/renova sessão
 */
export function startSession(): void {
  const config = getSecurityConfig();
  const session = {
    startedAt: Date.now(),
    expiresAt: Date.now() + config.sessionTimeout * 60 * 1000,
    token: generateNonce(),
  };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  logAudit('session_started', 'Nova sessão iniciada', 'info');
}

/**
 * Verifica se a sessão é válida
 */
export function isSessionValid(): boolean {
  const data = sessionStorage.getItem(SESSION_KEY);
  if (!data) return false;

  const session = JSON.parse(data);
  if (Date.now() > session.expiresAt) {
    sessionStorage.removeItem(SESSION_KEY);
    logAudit('session_expired', 'Sessão expirada por timeout', 'warning');
    return false;
  }
  return true;
}

/**
 * Encerra sessão
 */
export function endSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
  logAudit('session_ended', 'Sessão encerrada', 'info');
}

/**
 * Renova sessão
 */
export function renewSession(): void {
  if (isSessionValid()) {
    startSession();
  }
}

// ============================================
// NONCE / PROTEÇÃO CONTRA REPLAY
// ============================================

/**
 * Gera nonce único para prevenir replay attacks
 */
export function generateNonce(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Gera idempotency key segura
 */
export function generateIdempotencyKey(): string {
  // UUID v4 usando crypto API
  return crypto.randomUUID();
}

/**
 * Verifica se nonce já foi usado (proteção contra replay)
 */
export function checkNonce(nonce: string): boolean {
  const usedNonces = JSON.parse(localStorage.getItem(NONCE_KEY) || '[]');
  
  // Limpar nonces antigos (mais de 24h)
  const now = Date.now();
  const validNonces = usedNonces.filter((n: { nonce: string; timestamp: number }) => 
    now - n.timestamp < 86400000
  );

  const isDuplicate = validNonces.some((n: { nonce: string }) => n.nonce === nonce);
  
  if (!isDuplicate) {
    validNonces.push({ nonce, timestamp: now });
    localStorage.setItem(NONCE_KEY, JSON.stringify(validNonces));
  }

  return !isDuplicate;
}

// ============================================
// LOGS DE AUDITORIA
// ============================================

/**
 * Registra evento no log de auditoria
 */
export function logAudit(action: string, details?: string, severity: AuditLog['severity'] = 'info'): void {
  const config = getSecurityConfig();
  if (!config.enableAuditLog) return;

  const log: AuditLog = {
    timestamp: new Date().toISOString(),
    action,
    details,
    severity,
    userAgent: navigator.userAgent.substring(0, 100),
  };

  const logs = getAuditLogs();
  logs.unshift(log);

  // Manter apenas os últimos 500 logs
  if (logs.length > 500) logs.length = 500;

  localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(logs));
}

/**
 * Retorna logs de auditoria
 */
export function getAuditLogs(limit: number = 100): AuditLog[] {
  const data = localStorage.getItem(AUDIT_LOG_KEY);
  if (!data) return [];
  return JSON.parse(data).slice(0, limit);
}

/**
 * Limpa logs de auditoria
 */
export function clearAuditLogs(): void {
  localStorage.removeItem(AUDIT_LOG_KEY);
}

// ============================================
// VERIFICAÇÃO DE WEBHOOK (HMAC-SHA256)
// ============================================

/**
 * Verifica assinatura HMAC-SHA256 de webhook
 */
export async function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const messageData = encoder.encode(payload);

    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const sig = await crypto.subtle.sign('HMAC', key, messageData);
    const hashArray = Array.from(new Uint8Array(sig));
    const expected = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Comparação segura (timing-safe)
    return timingSafeEqual(expected, signature.toLowerCase());
  } catch {
    logAudit('webhook_verification_error', 'Erro ao verificar webhook', 'error');
    return false;
  }
}

/**
 * Comparação timing-safe para prevenir timing attacks
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

// ============================================
// VALIDAÇÃO DE INTEGRIDADE
// ============================================

/**
 * Gera hash de integridade dos dados
 */
export async function generateIntegrityHash(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verifica integridade dos dados
 */
export async function verifyIntegrity(data: string, expectedHash: string): Promise<boolean> {
  const hash = await generateIntegrityHash(data);
  return timingSafeEqual(hash, expectedHash);
}

// ============================================
// PROTEÇÃO CONTRA CLICKJACKING
// ============================================

/**
 * Verifica se está em iframe (possível clickjacking)
 */
export function isFramed(): boolean {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

/**
 * Adiciona headers de segurança via meta tags
 */
export function applySecurityHeaders(): void {
  // Prevenir clickjacking
  if (!isFramed()) {
    const meta = document.createElement('meta');
    meta.httpEquiv = 'X-Frame-Options';
    meta.content = 'DENY';
    document.head.appendChild(meta);
  }

  // CSP básica
  const csp = document.createElement('meta');
  csp.httpEquiv = 'Content-Security-Policy';
  csp.content = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; img-src 'self' data: https:; connect-src 'self' https://buypix.me https://wa.me;";
  document.head.appendChild(csp);
}

// ============================================
// LIMPEZA DE DADOS
// ============================================

/**
 * Limpa dados sensíveis do localStorage
 */
export function clearSensitiveData(): void {
  const keysToKeep = [SECURITY_CONFIG_KEY, AUDIT_LOG_KEY];
  const allKeys = Object.keys(localStorage);
  
  allKeys.forEach(key => {
    if (!keysToKeep.includes(key) && key.startsWith('maquininha_')) {
      if (key.includes('config') || key.includes('key') || key.includes('secret')) {
        localStorage.removeItem(key);
      }
    }
  });
  
  logAudit('sensitive_data_cleared', 'Dados sensíveis removidos', 'warning');
}

/**
 * Limpa tudo (factory reset)
 */
export function factoryReset(): void {
  const keys = Object.keys(localStorage).filter(k => k.startsWith('maquininha_'));
  keys.forEach(k => localStorage.removeItem(k));
  sessionStorage.clear();
}

// ============================================
// MENSAGENS SEGURAS PARA COMPARTILHAMENTO
// ============================================

export interface ShareMessage {
  whatsapp: string;
  generic: string;
  link: string;
}

/**
 * Gera mensagem segura para compartilhamento no WhatsApp
 */
export function generateShareMessage(
  amount: number,
  link: string,
  businessName: string
): ShareMessage {
  const formattedAmount = amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  
  // Sanitiza o nome do estabelecimento
  const safeName = sanitizeString(businessName) || 'Nosso Estabelecimento';

  const whatsapp = 
`🧾 *COBRANÇA PIX* — ${safeName}
━━━━━━━━━━━━━━━━━━━━

💰 Valor: *${formattedAmount}*

📲 *Como pagar:*
1️⃣ Clique no link abaixo
2️⃣ Na página que abrir, você verá o *QR Code* e a opção *Pix Copia e Cola*
3️⃣ Abra o app do seu banco e escaneie o QR Code ou cole o código Pix
4️⃣ Após o pagamento, *envie o comprovante* por aqui

🔗 Link de pagamento:
${link}

━━━━━━━━━━━━━━━━━━━━
⚡ Pagamento instantâneo via PIX
✅ Confirmação automática
🔒 Ambiente seguro

_Obrigado pela preferência!_`;

  const generic = 
`COBRANÇA PIX — ${safeName}

Valor: ${formattedAmount}

Como pagar:
1. Acesse o link: ${link}
2. Escaneie o QR Code ou use o Pix Copia e Cola
3. Após o pagamento, envie o comprovante

Pagamento instantâneo via PIX — Confirmação automática.`;

  return { whatsapp, generic, link };
}

/**
 * Gera mensagem de comprovante para compartilhamento
 */
export function generateReceiptMessage(
  amount: number,
  date: string,
  transactionId: string,
  businessName: string,
  feeAmount?: number,
  netAmount?: number
): string {
  const formattedAmount = amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const safeName = sanitizeString(businessName) || 'Nosso Estabelecimento';
  const formattedDate = new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  let msg = 
`✅ *COMPROVANTE DE PAGAMENTO*
━━━━━━━━━━━━━━━━━━━━

🏪 *${safeName}*

💰 Valor: *${formattedAmount}*
📅 Data: ${formattedDate}
📋 ID: ${transactionId.substring(0, 12)}...
✅ Status: *Pago via PIX*`;

  if (feeAmount !== undefined && feeAmount > 0) {
    const formattedFee = feeAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    msg += `\n📉 Taxa: ${formattedFee}`;
  }
  if (netAmount !== undefined) {
    const formattedNet = netAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    msg += `\n💵 Líquido: *${formattedNet}*`;
  }

  msg += `

━━━━━━━━━━━━━━━━━━━━
🔒 Pagamento seguro via PIX
_Comprovante gerado pela Maquininha PIX_`;

  return msg;
}
