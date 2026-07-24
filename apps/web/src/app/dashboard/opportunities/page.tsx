'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import KanbanBoard from '@/components/opportunities/KanbanBoard';
import { useOpportunities } from '@/hooks/useOpportunities';

export interface Opportunity {
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

interface KanbanData {
  lead: Opportunity[];
  contacted: Opportunity[];
  qualified: Opportunity[];
  proposal: Opportunity[];
  negotiation: Opportunity[];
  closed: Opportunity[];
}

export default function OpportunitiesPage() {
  const router = useRouter();
  const { opportunities: apiOpportunities, loading, error, moveToStage } = useOpportunities();
  const [kanbanData, setKanbanData] = useState<KanbanData>({
    lead: [],
    contacted: [],
    qualified: [],
    proposal: [],
    negotiation: [],
    closed: [],
  });

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/');
      return;
    }
  }, [router]);

  useEffect(() => {
    // Organizar oportunidades por stage
    const organized: KanbanData = {
      lead: apiOpportunities.filter((o) => o.stage === 'lead'),
      contacted: apiOpportunities.filter((o) => o.stage === 'contacted'),
      qualified: apiOpportunities.filter((o) => o.stage === 'qualified'),
      proposal: apiOpportunities.filter((o) => o.stage === 'proposal'),
      negotiation: apiOpportunities.filter((o) => o.stage === 'negotiation'),
      closed: apiOpportunities.filter((o) => o.stage === 'closed'),
    };

    setKanbanData(organized);
  }, [apiOpportunities]);

  const handleMoveCard = async (
    opportunityId: string,
    fromStage: keyof KanbanData,
    toStage: keyof KanbanData
  ) => {
    await moveToStage(opportunityId, toStage);
  };

  // Calcular totais
  const totalValue = Object.values(kanbanData)
    .flat()
    .reduce((sum, opp) => sum + opp.value, 0);

  const totalOpportunities = Object.values(kanbanData).flat().length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Oportunidades</h1>
          <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-3">
              <p className="text-xs text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{totalOpportunities}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-3">
              <p className="text-xs text-gray-600">Valor em Negociação</p>
              <p className="text-2xl font-bold text-green-600">
                R$ {(totalValue / 1000).toFixed(1)}k
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-3">
              <p className="text-xs text-gray-600">Taxa Média</p>
              <p className="text-2xl font-bold text-blue-600">
                {(
                  Object.values(kanbanData)
                    .flat()
                    .reduce((sum, opp) => sum + opp.probability, 0) / totalOpportunities
                ).toFixed(0)}
                %
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-3">
              <p className="text-xs text-gray-600">Dias Médios</p>
              <p className="text-2xl font-bold text-purple-600">
                {(
                  Object.values(kanbanData)
                    .flat()
                    .reduce((sum, opp) => sum + opp.daysInStage, 0) / totalOpportunities
                ).toFixed(0)}
              </p>
            </div>
          </div>
        </div>

        {/* Erro */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg shadow p-4">
            <p className="text-red-800">⚠️ {error}</p>
          </div>
        )}

        {/* Kanban Board */}
        {loading ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">Carregando oportunidades...</p>
          </div>
        ) : (
          <KanbanBoard data={kanbanData} onMoveCard={handleMoveCard} />
        )}
      </div>
    </DashboardLayout>
  );
}
