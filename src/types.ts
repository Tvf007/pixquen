export interface Transaction {
  id: string;
  depositId: string;
  amount: number;
  status: 'pending' | 'depix_sent' | 'completed' | 'expired' | 'canceled' | 'error' | 'under_review' | 'refunded';
  payerName?: string;
  payerDocument?: string;
  pixQrCode?: string;
  pixQrCodeBase64?: string;
  createdAt: string;
  completedAt?: string;
  expiresAt?: string;
  feeAmount?: number;
  netAmount?: number;
}

export interface AppConfig {
  apiKey: string;
  businessName: string;
  webhookUrl?: string;
}

export type Page = 'maquininha' | 'pagamento' | 'historico' | 'relatorios' | 'comprovante' | 'configuracoes';
