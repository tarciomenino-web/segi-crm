import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export type JourneyStageType = 'email' | 'whatsapp' | 'sms' | 'appointment' | 'score_update' | 'wait';

export interface JourneyStage {
  id: string;
  order: number;
  type: JourneyStageType;
  name: string;
  config: Record<string, unknown>;
  delay?: number; // em minutos
  delayUnit?: 'minutes' | 'hours' | 'days';
}

export interface Journey {
  id: string;
  name: string;
  description: string;
  trigger: 'lead_created' | 'score_reached' | 'custom';
  triggerConfig: Record<string, unknown>;
  stages: JourneyStage[];
  isActive: boolean;
  enrolledLeads: number;
  completedLeads: number;
  avgConversion: number;
  createdAt: string;
  updatedAt: string;
}

export interface JourneyEnrollment {
  id: string;
  journeyId: string;
  leadId: string;
  leadName: string;
  currentStage: number;
  status: 'active' | 'completed' | 'abandoned';
  enrolledAt: string;
  completedAt?: string;
  stageProgress: {
    stageId: string;
    status: 'pending' | 'completed' | 'failed';
    completedAt?: string;
  }[];
}

interface UseJourneysReturn {
  journeys: Journey[];
  enrollments: JourneyEnrollment[];
  loading: boolean;
  error: string | null;
  createJourney: (journey: Partial<Journey>) => Promise<Journey>;
  updateJourney: (id: string, journey: Partial<Journey>) => Promise<void>;
  deleteJourney: (id: string) => Promise<void>;
  toggleJourney: (id: string, isActive: boolean) => Promise<void>;
  enrollLead: (journeyId: string, leadId: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useJourneys(): UseJourneysReturn {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [enrollments, setEnrollments] = useState<JourneyEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [journeysData, enrollmentsData] = await Promise.all([
        api.get<Journey[]>('/api/journeys'),
        api.get<JourneyEnrollment[]>('/api/journeys/enrollments'),
      ]);

      setJourneys(journeysData);
      setEnrollments(enrollmentsData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(message);
      console.error('Erro ao buscar jornadas:', err);
    } finally {
      setLoading(false);
    }
  };

  const createJourney = async (journey: Partial<Journey>): Promise<Journey> => {
    try {
      const created = await api.post<Journey>('/api/journeys', journey);
      setJourneys((prev) => [...prev, created]);
      return created;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao criar jornada';
      setError(message);
      throw err;
    }
  };

  const updateJourney = async (id: string, journey: Partial<Journey>) => {
    try {
      const updated = await api.put<Journey>(`/api/journeys/${id}`, journey);
      setJourneys((prev) => prev.map((j) => (j.id === id ? updated : j)));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar jornada';
      setError(message);
      throw err;
    }
  };

  const deleteJourney = async (id: string) => {
    try {
      await api.delete(`/api/journeys/${id}`);
      setJourneys((prev) => prev.filter((j) => j.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao deletar jornada';
      setError(message);
      throw err;
    }
  };

  const toggleJourney = async (id: string, isActive: boolean) => {
    try {
      const updated = await api.patch<Journey>(`/api/journeys/${id}`, { isActive });
      setJourneys((prev) => prev.map((j) => (j.id === id ? updated : j)));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar jornada';
      setError(message);
      throw err;
    }
  };

  const enrollLead = async (journeyId: string, leadId: string) => {
    try {
      const enrollment = await api.post<JourneyEnrollment>('/api/journeys/enroll', {
        journeyId,
        leadId,
      });
      setEnrollments((prev) => [...prev, enrollment]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao inscrever lead';
      setError(message);
      throw err;
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    journeys,
    enrollments,
    loading,
    error,
    createJourney,
    updateJourney,
    deleteJourney,
    toggleJourney,
    enrollLead,
    refetch: fetchData,
  };
}
