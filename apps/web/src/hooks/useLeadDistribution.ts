import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export interface SDR {
  id: string;
  name: string;
  email: string;
  leadsAssigned: number;
  leadsConverted: number;
  conversionRate: number;
  avgLeadScore: number;
  active: boolean;
}

export interface DistributionRule {
  id: string;
  name: string;
  strategy: 'round_robin' | 'workload' | 'performance' | 'manual';
  autoAssign: boolean;
  description: string;
}

export interface DistributionStats {
  totalLeads: number;
  distributedLeads: number;
  pendingLeads: number;
  averagePerSDR: number;
  sdrs: SDR[];
  lastDistribution: string;
}

interface UseLeadDistributionReturn {
  sdrs: SDR[];
  stats: DistributionStats | null;
  loading: boolean;
  error: string | null;
  distributeLeads: (strategy: string, count: number) => Promise<void>;
  assignLeadToSDR: (leadId: string, sdrId: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useLeadDistribution(): UseLeadDistributionReturn {
  const [sdrs, setSDRs] = useState<SDR[]>([]);
  const [stats, setStats] = useState<DistributionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDistributionData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscar SDRs
      const sdrsResponse = await api.get<SDR[]>('/api/sdrs');
      setSDRs(sdrsResponse);

      // Buscar stats
      const statsResponse = await api.get<DistributionStats>('/api/distribution/stats');
      setStats(statsResponse);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(message);
      console.error('Erro ao buscar dados de distribuição:', err);
    } finally {
      setLoading(false);
    }
  };

  const distributeLeads = async (strategy: string, count: number) => {
    try {
      const response = await api.post<{
        distributed: number;
        sdrs: SDR[];
        stats: DistributionStats;
      }>('/api/distribution/distribute', {
        strategy,
        count,
      });

      setSDRs(response.sdrs);
      setStats(response.stats);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao distribuir leads';
      setError(message);
      console.error('Erro ao distribuir leads:', err);
    }
  };

  const assignLeadToSDR = async (leadId: string, sdrId: string) => {
    try {
      await api.post(`/api/leads/${leadId}/assign`, {
        sdrId,
      });

      // Atualizar dados
      await fetchDistributionData();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atribuir lead';
      setError(message);
      console.error('Erro ao atribuir lead:', err);
    }
  };

  useEffect(() => {
    fetchDistributionData();
  }, []);

  return {
    sdrs,
    stats,
    loading,
    error,
    distributeLeads,
    assignLeadToSDR,
    refetch: fetchDistributionData,
  };
}
