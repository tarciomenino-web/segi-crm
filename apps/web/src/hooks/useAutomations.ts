import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export type TriggerType = 'lead_created' | 'lead_scored' | 'opportunity_created' | 'appointment_completed' | 'days_without_contact';
export type ActionType = 'assign_to_sdr' | 'send_email' | 'send_whatsapp' | 'create_appointment' | 'update_score' | 'notify_sdr' | 'move_to_stage';

export interface Automation {
  id: string;
  name: string;
  description: string;
  trigger: TriggerType;
  triggerConfig: Record<string, unknown>;
  actions: AutomationAction[];
  enabled: boolean;
  executedCount: number;
  lastExecuted: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AutomationAction {
  id: string;
  type: ActionType;
  config: Record<string, unknown>;
  order: number;
}

export interface AutomationLog {
  id: string;
  automationId: string;
  triggerId: string; // lead id or opportunity id
  triggerType: string;
  actions: { type: string; status: 'success' | 'failed'; message: string }[];
  executedAt: string;
  duration: number; // ms
}

interface UseAutomationsReturn {
  automations: Automation[];
  logs: AutomationLog[];
  loading: boolean;
  error: string | null;
  createAutomation: (automation: Partial<Automation>) => Promise<Automation>;
  updateAutomation: (id: string, automation: Partial<Automation>) => Promise<void>;
  deleteAutomation: (id: string) => Promise<void>;
  toggleAutomation: (id: string, enabled: boolean) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useAutomations(): UseAutomationsReturn {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [logs, setLogs] = useState<AutomationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAutomations = async () => {
    try {
      setLoading(true);
      setError(null);

      const [automationsData, logsData] = await Promise.all([
        api.get<Automation[]>('/api/automations'),
        api.get<AutomationLog[]>('/api/automations/logs'),
      ]);

      setAutomations(automationsData);
      setLogs(logsData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(message);
      console.error('Erro ao buscar automações:', err);
    } finally {
      setLoading(false);
    }
  };

  const createAutomation = async (automation: Partial<Automation>): Promise<Automation> => {
    try {
      const created = await api.post<Automation>('/api/automations', automation);
      setAutomations((prev) => [...prev, created]);
      return created;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao criar automação';
      setError(message);
      throw err;
    }
  };

  const updateAutomation = async (id: string, automation: Partial<Automation>) => {
    try {
      const updated = await api.put<Automation>(`/api/automations/${id}`, automation);
      setAutomations((prev) => prev.map((a) => (a.id === id ? updated : a)));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar automação';
      setError(message);
      throw err;
    }
  };

  const deleteAutomation = async (id: string) => {
    try {
      await api.delete(`/api/automations/${id}`);
      setAutomations((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao deletar automação';
      setError(message);
      throw err;
    }
  };

  const toggleAutomation = async (id: string, enabled: boolean) => {
    try {
      const updated = await api.patch<Automation>(`/api/automations/${id}`, { enabled });
      setAutomations((prev) => prev.map((a) => (a.id === id ? updated : a)));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar automação';
      setError(message);
      throw err;
    }
  };

  useEffect(() => {
    fetchAutomations();
  }, []);

  return {
    automations,
    logs,
    loading,
    error,
    createAutomation,
    updateAutomation,
    deleteAutomation,
    toggleAutomation,
    refetch: fetchAutomations,
  };
}
