import { getConfig } from './store';
import { generateIdempotencyKey, logAudit, sanitizeAmount } from './security';

const BASE_URL = 'https://buypix.me/api/v1';

interface CreateDepositParams {
  amount: number;
  payerDocument?: string;
  payerName?: string;
  webhookUrl?: string;
  payerIp?: string;
}

interface DepositResponse {
  success: boolean;
  message?: string;
  data?: {
    id: string;
    amount: number;
    fee_percent: number;
    fee_amount: number;
    net_amount: number;
    status: string;
    pix_qr_code: string;
    pix_qr_code_base64: string;
    expires_at: string;
  };
}

interface DepositStatusResponse {
  success: boolean;
  data?: {
    id: string;
    amount: number;
    status: string;
    confirmed_at?: string;
    fee_amount?: number;
    net_amount?: number;
  };
}

export async function createDeposit(params: CreateDepositParams): Promise<DepositResponse> {
  const config = getConfig();
  
  if (!config.apiKey) {
    throw new Error('API Key não configurada. Vá em Configurações.');
  }

  // Validar amount
  const safeAmount = sanitizeAmount(params.amount);
  if (safeAmount === null) {
    throw new Error('Valor inválido. Verifique o valor da cobrança.');
  }

  // Gerar idempotency key segura
  const idempotencyKey = generateIdempotencyKey();

  logAudit('api_call', `POST /deposits - Amount: R$ ${safeAmount}`, 'info');

  const response = await fetch(`${BASE_URL}/deposits`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
      'X-Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify({
      amount: safeAmount,
      payer_document: params.payerDocument || '00000000000',
      payer_name: params.payerName || 'Cliente',
      webhook_url: params.webhookUrl || config.webhookUrl,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erro ao criar depósito');
  }

  return response.json();
}

export async function getDepositStatus(depositId: string): Promise<DepositStatusResponse> {
  const config = getConfig();
  
  if (!config.apiKey) {
    throw new Error('API Key não configurada');
  }

  const response = await fetch(`${BASE_URL}/deposits/${depositId}`, {
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
    },
  });

  if (!response.ok) {
    throw new Error('Erro ao consultar depósito');
  }

  return response.json();
}

export async function getAccountInfo() {
  const config = getConfig();
  
  if (!config.apiKey) {
    throw new Error('API Key não configurada');
  }

  const response = await fetch(`${BASE_URL}/account`, {
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
    },
  });

  if (!response.ok) {
    throw new Error('Erro ao consultar conta');
  }

  return response.json();
}

// Fim do arquivo
