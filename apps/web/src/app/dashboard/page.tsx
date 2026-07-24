'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import MetricsGrid from '@/components/dashboard/MetricsGrid';
import FunnelChart from '@/components/dashboard/FunnelChart';
import ActivityChart from '@/components/dashboard/ActivityChart';

interface DashboardData {
  leads: {
    total: number;
    today: number;
    hot: number;
    warm: number;
    cold: number;
  };
  opportunities: {
    total: number;
    inProgress: number;
    value: number;
  };
  activities: {
    contacts: number;
    qualifications: number;
    agendamentos: number;
  };
  funnel: {
    leads: number;
    contacted: number;
    qualified: number;
    scheduled: number;
    attended: number;
    closed: number;
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/');
      return;
    }

    fetchDashboardData(token);
  }, [router]);

  const fetchDashboardData = async (token: string) => {
    try {
      setLoading(true);

      // Simular dados para desenvolvimento
      // Em produção, viriam da API
      const mockData: DashboardData = {
        leads: {
          total: 342,
          today: 12,
          hot: 28,
          warm: 95,
          cold: 219,
        },
        opportunities: {
          total: 47,
          inProgress: 31,
          value: 125000,
        },
        activities: {
          contacts: 156,
          qualifications: 84,
          agendamentos: 45,
        },
        funnel: {
          leads: 342,
          contacted: 256,
          qualified: 145,
          scheduled: 78,
          attended: 62,
          closed: 18,
        },
      };

      setData(mockData);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Bem-vindo ao SEGi CRM. Aqui está um resumo do seu desempenho.
          </p>
        </div>

        {/* Métricas principais */}
        {data && <MetricsGrid data={data} />}

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {data && <FunnelChart data={data.funnel} />}
          {data && <ActivityChart data={data.activities} />}
        </div>

        {/* Atividades recentes */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Atividades Recentes</h2>
          </div>
          <div className="px-6 py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="text-sm font-medium text-gray-900">João Silva qualificado</p>
                  <p className="text-xs text-gray-600">Há 2 horas</p>
                </div>
                <span className="px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full">
                  Lead
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="text-sm font-medium text-gray-900">Maria Santos agendou jornada</p>
                  <p className="text-xs text-gray-600">Há 4 horas</p>
                </div>
                <span className="px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
                  Agendamento
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">Pedro matriculado em Cozinheiro</p>
                  <p className="text-xs text-gray-600">Há 6 horas</p>
                </div>
                <span className="px-3 py-1 text-xs font-semibold text-purple-700 bg-purple-100 rounded-full">
                  Matrícula
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
