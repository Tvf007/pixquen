import { Transaction, AppConfig } from './types';

const TRANSACTIONS_KEY = 'maquininha_transactions';
const CONFIG_KEY = 'maquininha_config';

export function getTransactions(): Transaction[] {
  const data = localStorage.getItem(TRANSACTIONS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveTransaction(tx: Transaction): void {
  const transactions = getTransactions();
  const idx = transactions.findIndex(t => t.id === tx.id);
  if (idx >= 0) {
    transactions[idx] = tx;
  } else {
    transactions.unshift(tx);
  }
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
}

export function updateTransaction(id: string, updates: Partial<Transaction>): void {
  const transactions = getTransactions();
  const idx = transactions.findIndex(t => t.id === id);
  if (idx >= 0) {
    transactions[idx] = { ...transactions[idx], ...updates };
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  }
}

export function getConfig(): AppConfig {
  const data = localStorage.getItem(CONFIG_KEY);
  if (data) {
    return JSON.parse(data);
  }
  
  // Configuração inicial com API key
  const defaultConfig: AppConfig = {
    apiKey: 'bpx_J0BLBU3O1DMRIzAFiVqi5tzupEAPdqjmb2KBggAv',
    businessName: 'Minha Loja',
  };
  
  // Salvar configuração padrão
  localStorage.setItem(CONFIG_KEY, JSON.stringify(defaultConfig));
  return defaultConfig;
}

export function saveConfig(config: AppConfig): void {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

export function getTransactionsByDate(date: string): Transaction[] {
  return getTransactions().filter(t => t.createdAt.startsWith(date));
}

export function getTransactionsByMonth(year: number, month: number): Transaction[] {
  const prefix = `${year}-${String(month).padStart(2, '0')}`;
  return getTransactions().filter(t => t.createdAt.startsWith(prefix));
}

export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
