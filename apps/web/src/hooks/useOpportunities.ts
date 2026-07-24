import { useState, useEffect } from 'react';

interface Opportunity {
  id: string;
  title: string;
  leadName: string;
  email: string;
  phone: string;
  stage: 'lead' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed';
  value: number;
  temperature: 'hot' | 'warm' | 'cold';
  probability: number;
  daysInStage: number;
  lastActivity: string;
}

interface UseOpportunitiesReturn {
  opportunities: Opportunity[];
  loading: boolean;
  error: string | null;
  moveToStage: (opportunityId: string, stage: string) => Promise<void>;
  refetch: () => Promise<void>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export function useOpportunities(): UseOpportunitiesReturn {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Token não encontrado');
      }

      const response = await fetch(`${API_URL}/api/opportunities`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('accessToken');
          throw new Error('Sessão expirada');
        }
        throw new Error('Erro ao carregar oportunidades');
      }

      const data = await response.json();
      setOpportunities(data.data || data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(message);
      console.error('Erro ao buscar oportunidades:', err);
    } finally {
      setLoading(false);
    }
  };

  const moveToStage = async (opportunityId: string, stage: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Token não encontrado');
      }

      const response = await fetch(
        `${API_URL}/api/opportunities/${opportunityId}/move/${stage}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao mover oportunidade');
      }

      // Atualizar state local
      setOpportunities((prev) =>
        prev.map((opp) =>
          opp.id === opportunityId
            ? { ...opp, stage: stage as any }
            : opp
        )
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(message);
      console.error('Erro ao mover oportunidade:', err);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  return {
    opportunities,
    loading,
    error,
    moveToStage,
    refetch: fetchOpportunities,
  };
}
