'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import KanbanBoard from '@/components/opportunities/KanbanBoard';

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
  const [kanbanData, setKanbanData] = useState<KanbanData>({
    lead: [],
    contacted: [],
    qualified: [],
    proposal: [],
    negotiation: [],
    closed: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/');
      return;
    }

    fetchOpportunities(token);
  }, [router]);

  const fetchOpportunities = async (token: string) => {
    try {
      setLoading(true);

      // Mock data para desenvolvimento
      const mockOpportunities: Opportunity[] = [
        {
          id: 'opp-1',
          title: 'Chef Pastry - Turma Jan 2025',
          leadName: 'João Silva',
          email: 'joao@example.com',
          phone: '(21) 98765-4321',
          stage: 'lead',
          value: 3500,
          temperature: 'hot',
          probability: 10,
          daysInStage: 2,
          lastActivity: '2026-07-23',
        },
        {
          id: 'opp-2',
          title: 'Master Chef - Turma Fev 2025',
          leadName: 'Ana Costa',
          email: 'ana@example.com',
          phone: '(21) 97654-3210',
          stage: 'contacted',
          value: 8500,
          temperature: 'hot',
          probability: 25,
          daysInStage: 5,
          lastActivity: '2026-07-22',
        },
        {
          id: 'opp-3',
          title: 'Gastronomia Italiana',
          leadName: 'Maria Santos',
          email: 'maria@example.com',
          phone: '(21) 99876-5432',
          stage: 'qualified',
          value: 2800,
          temperature: 'warm',
          probability: 40,
          daysInStage: 8,
          lastActivity: '2026-07-20',
        },
        {
          id: 'opp-4',
          title: 'Confeitaria Profissional',
          leadName: 'Pedro Oliveira',
          email: 'pedro@example.com',
          phone: '(21) 91234-5678',
          stage: 'proposal',
          value: 4200,
          temperature: 'warm',
          probability: 60,
          daysInStage: 10,
          lastActivity: '2026-07-19',
        },
        {
          id: 'opp-5',
          title: 'Culinária Francesa',
          leadName: 'Carlos Mendes',
          email: 'carlos@example.com',
          phone: '(21) 98765-1234',
          stage: 'negotiation',
          value: 6500,
          temperature: 'hot',
          probability: 75,
          daysInStage: 15,
          lastActivity: '2026-07-21',
        },
        {
          id: 'opp-6',
          title: 'Gastronomia Asiática',
          leadName: 'Lucia Ferreira',
          email: 'lucia@example.com',
          phone: '(21) 92345-6789',
          stage: 'closed',
          value: 5000,
          temperature: 'hot',
          probability: 100,
          daysInStage: 20,
          lastActivity: '2026-07-17',
        },
        {
          id: 'opp-7',
          title: 'Panificação Industrial',
          leadName: 'Roberto Silva',
          email: 'roberto@example.com',
          phone: '(21) 93456-7890',
          stage: 'contacted',
          value: 3800,
          temperature: 'cold',
          probability: 15,
          daysInStage: 3,
          lastActivity: '2026-07-23',
        },
      ];

      // Organizar por stage
      const organized: KanbanData = {
        lead: mockOpportunities.filter((o) => o.stage === 'lead'),
        contacted: mockOpportunities.filter((o) => o.stage === 'contacted'),
        qualified: mockOpportunities.filter((o) => o.stage === 'qualified'),
        proposal: mockOpportunities.filter((o) => o.stage === 'proposal'),
        negotiation: mockOpportunities.filter((o) => o.stage === 'negotiation'),
        closed: mockOpportunities.filter((o) => o.stage === 'closed'),
      };

      setKanbanData(organized);
    } catch (error) {
      console.error('Erro ao carregar oportunidades:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMoveCard = (
    opportunityId: string,
    fromStage: keyof KanbanData,
    toStage: keyof KanbanData
  ) => {
    setKanbanData((prev) => {
      const opportunity = prev[fromStage].find((o) => o.id === opportunityId);
      if (!opportunity) return prev;

      return {
        ...prev,
        [fromStage]: prev[fromStage].filter((o) => o.id !== opportunityId),
        [toStage]: [...prev[toStage], { ...opportunity, stage: toStage as any }],
      };
    });
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
