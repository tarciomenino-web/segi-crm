'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import MetricsGrid from '@/components/dashboard/MetricsGrid';
import FunnelChart from '@/components/dashboard/FunnelChart';
import ActivityChart from '@/components/dashboard/ActivityChart';
import { useLeads } from '@/hooks/useLeads';
import { useOpportunities } from '@/hooks/useOpportunities';
import { useAppointments } from '@/hooks/useAppointments';

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
  const { leads, loading: leadsLoading, error: leadsError } = useLeads();
  const { opportunities, loading: oppsLoading, error: oppsError } = useOpportunities();
  const { appointments, loading: aptsLoading, error: aptsError } = useAppointments();
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/');
      return;
    }
  }, [router]);

  useEffect(() => {
    if (!leadsLoading && !oppsLoading && !aptsLoading) {
      const today = new Date().toISOString().split('T')[0];
      const todayLeads = leads.filter((l) => l.createdAt === today).length;

      const leadsData = {
        total: leads.length,
        today: todayLeads,
        hot: leads.filter((l) => l.temperature === 'hot').length,
        warm: leads.filter((l) => l.temperature === 'warm').length,
        cold: leads.filter((l) => l.temperature === 'cold').length,
      };

      const oppsData = {
        total: opportunities.length,
        inProgress: opportunities.filter((o) => o.stage !== 'closed').length,
        value: opportunities.reduce((sum, o) => sum + o.value, 0),
      };

      const activitiesData = {
        contacts: appointments.length,
        qualifications: Math.round(appointments.length * 0.6),
        agendamentos: Math.round(appointments.length * 0.3),
      };

      const funnel = {
        leads: leadsData.total,
        contacted: Math.round(leadsData.total * 0.75),
        qualified: Math.round(leadsData.total * 0.42),
        scheduled: Math.round(leadsData.total * 0.23),
        attended: Math.round(leadsData.total * 0.18),
        closed: Math.round(leadsData.total * 0.053),
      };

      setData({
        leads: leadsData,
        opportunities: oppsData,
        activities: activitiesData,
        funnel,
      });
    }
  }, [leads, opportunities, appointments, leadsLoading, oppsLoading, aptsLoading]);

  const loading = leadsLoading || oppsLoading || aptsLoading;
  const error = leadsError || oppsError || aptsError;

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

        {/* Erro */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg shadow p-4">
            <p className="text-red-800">⚠️ Erro ao carregar dados: {error}</p>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">Carregando dashboard...</p>
          </div>
        ) : (
          <>
            {/* Métricas principais */}
            {data && <MetricsGrid data={data} />}

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {data && <FunnelChart data={data.funnel} />}
              {data && <ActivityChart data={data.activities} />}
            </div>
          </>
        )}

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
