import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export interface WhatsAppConfig {
  id: string;
  provider: 'uazapi';
  isActive: boolean;
  apiKey: string;
  phoneNumber: string;
  businessName: string;
  createdAt: string;
  updatedAt: string;
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  content: string;
  variables: string[];
  description: string;
  category: 'greeting' | 'follow_up' | 'reminder' | 'feedback' | 'custom';
  active: boolean;
}

export interface WhatsAppMessage {
  id: string;
  leadId: string;
  leadName: string;
  leadPhone: string;
  templateId?: string;
  content: string;
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  error?: string;
  sentAt?: string;
  deliveredAt?: string;
  createdAt: string;
}

interface UseWhatsAppReturn {
  config: WhatsAppConfig | null;
  templates: WhatsAppTemplate[];
  messages: WhatsAppMessage[];
  loading: boolean;
  error: string | null;
  updateConfig: (data: Partial<WhatsAppConfig>) => Promise<void>;
  sendMessage: (leadId: string, message: string, templateId?: string) => Promise<void>;
  sendTemplate: (leadId: string, templateId: string, variables: Record<string, string>) => Promise<void>;
  createTemplate: (template: Partial<WhatsAppTemplate>) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  testConnection: () => Promise<void>;
  refetch: () => Promise<void>;
}

export function useWhatsApp(): UseWhatsAppReturn {
  const [config, setConfig] = useState<WhatsAppConfig | null>(null);
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [configData, templatesData, messagesData] = await Promise.all([
        api.get<WhatsAppConfig>('/api/whatsapp/config').catch(() => null),
        api.get<WhatsAppTemplate[]>('/api/whatsapp/templates'),
        api.get<WhatsAppMessage[]>('/api/whatsapp/messages'),
      ]);

      setConfig(configData);
      setTemplates(templatesData);
      setMessages(messagesData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(message);
      console.error('Erro ao buscar dados de WhatsApp:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async (data: Partial<WhatsAppConfig>) => {
    try {
      const updated = await api.post<WhatsAppConfig>('/api/whatsapp/config', data);
      setConfig(updated);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar configuração';
      setError(message);
      throw err;
    }
  };

  const sendMessage = async (leadId: string, message: string, templateId?: string) => {
    try {
      const sent = await api.post<WhatsAppMessage>('/api/whatsapp/send', {
        leadId,
        message,
        templateId,
      });

      setMessages((prev) => [sent, ...prev]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao enviar mensagem';
      setError(message);
      throw err;
    }
  };

  const sendTemplate = async (
    leadId: string,
    templateId: string,
    variables: Record<string, string>
  ) => {
    try {
      const sent = await api.post<WhatsAppMessage>('/api/whatsapp/send-template', {
        leadId,
        templateId,
        variables,
      });

      setMessages((prev) => [sent, ...prev]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao enviar template';
      setError(message);
      throw err;
    }
  };

  const createTemplate = async (template: Partial<WhatsAppTemplate>) => {
    try {
      const created = await api.post<WhatsAppTemplate>('/api/whatsapp/templates', template);
      setTemplates((prev) => [...prev, created]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao criar template';
      setError(message);
      throw err;
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      await api.delete(`/api/whatsapp/templates/${id}`);
      setTemplates((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao deletar template';
      setError(message);
      throw err;
    }
  };

  const testConnection = async () => {
    try {
      await api.post('/api/whatsapp/test', {});
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao testar conexão';
      setError(message);
      throw err;
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    config,
    templates,
    messages,
    loading,
    error,
    updateConfig,
    sendMessage,
    sendTemplate,
    createTemplate,
    deleteTemplate,
    testConnection,
    refetch: fetchData,
  };
}
