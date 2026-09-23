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

// Modo demonstração - simula a API quando não há chave configurada
export function createDemoDeposit(amount: number): DepositResponse {
  const id = 'demo_' + Date.now().toString(36);
  return {
    success: true,
    message: 'Depósito criado (modo demonstração)',
    data: {
      id,
      amount,
      fee_percent: 2.0,
      fee_amount: amount * 0.02,
      net_amount: amount * 0.98,
      status: 'pending',
      pix_qr_code: `00020126580014br.gov.bcb.pix0136${id}5204000053039865802BR5925${getConfig().businessName || 'MINHA LOJA'}6009SAO PAULO62070503***6304ABCD`,
      pix_qr_code_base64: '',
      expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    },
  };
}

export function simulatePayment(): DepositStatusResponse {
  return {
    success: true,
    data: {
      id: 'demo',
      amount: 0,
      status: 'depix_sent',
      confirmed_at: new Date().toISOString(),
    },
  };
}
