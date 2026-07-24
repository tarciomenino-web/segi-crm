import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export interface WebhookConfig {
  id: string;
  provider: 'meta' | 'whatsapp' | 'custom';
  isActive: boolean;
  webhookUrl: string;
  verifyToken: string;
  accessToken?: string;
  pageId?: string;
  leadFormId?: string;
  createdAt: string;
  updatedAt: string;
  lastWebhookReceived?: string;
  webhookCount: number;
}

export interface WebhookLog {
  id: string;
  configId: string;
  provider: string;
  status: 'success' | 'failed' | 'pending';
  payload: Record<string, unknown>;
  response: string;
  receivedAt: string;
  processedAt?: string;
  leadId?: string;
}

interface UseWebhookConfigReturn {
  config: WebhookConfig | null;
  logs: WebhookLog[];
  loading: boolean;
  error: string | null;
  createConfig: (provider: string, data: Partial<WebhookConfig>) => Promise<WebhookConfig>;
  updateConfig: (id: string, data: Partial<WebhookConfig>) => Promise<void>;
  deleteConfig: (id: string) => Promise<void>;
  generateVerifyToken: () => Promise<string>;
  testWebhook: () => Promise<void>;
  refetch: () => Promise<void>;
}

export function useWebhookConfig(): UseWebhookConfigReturn {
  const [config, setConfig] = useState<WebhookConfig | null>(null);
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      setError(null);

      const configData = await api.get<WebhookConfig>('/api/webhook/config/meta');
      setConfig(configData);

      const logsData = await api.get<WebhookLog[]>('/api/webhook/logs');
      setLogs(logsData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(message);
      console.error('Erro ao buscar configuração de webhook:', err);
    } finally {
      setLoading(false);
    }
  };

  const createConfig = async (provider: string, data: Partial<WebhookConfig>): Promise<WebhookConfig> => {
    try {
      const created = await api.post<WebhookConfig>('/api/webhook/config', {
        provider,
        ...data,
      });
      setConfig(created);
      return created;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao criar configuração';
      setError(message);
      throw err;
    }
  };

  const updateConfig = async (id: string, data: Partial<WebhookConfig>) => {
    try {
      const updated = await api.put<WebhookConfig>(`/api/webhook/config/${id}`, data);
      setConfig(updated);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar configuração';
      setError(message);
      throw err;
    }
  };

  const deleteConfig = async (id: string) => {
    try {
      await api.delete(`/api/webhook/config/${id}`);
      setConfig(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao deletar configuração';
      setError(message);
      throw err;
    }
  };

  const generateVerifyToken = async (): Promise<string> => {
    try {
      const { token } = await api.post<{ token: string }>('/api/webhook/generate-token', {});
      return token;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao gerar token';
      setError(message);
      throw err;
    }
  };

  const testWebhook = async () => {
    try {
      await api.post('/api/webhook/test', {});
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao testar webhook';
      setError(message);
      throw err;
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  return {
    config,
    logs,
    loading,
    error,
    createConfig,
    updateConfig,
    deleteConfig,
    generateVerifyToken,
    testWebhook,
    refetch: fetchConfig,
  };
}
