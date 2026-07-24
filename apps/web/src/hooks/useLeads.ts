import { useState, useEffect } from 'react';

interface Lead {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  temperature: 'hot' | 'warm' | 'cold';
  leadScore: number;
  source: string;
  createdAt: string;
  lastContact: string;
}

interface UseLeadsReturn {
  leads: Lead[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export function useLeads(): UseLeadsReturn {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Token não encontrado');
      }

      const response = await fetch(`${API_URL}/api/leads`, {
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
        throw new Error('Erro ao carregar leads');
      }

      const data = await response.json();
      setLeads(data.data || data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(message);
      console.error('Erro ao buscar leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  return { leads, loading, error, refetch: fetchLeads };
}
