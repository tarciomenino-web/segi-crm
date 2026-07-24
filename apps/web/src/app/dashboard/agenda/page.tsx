'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import Calendar from '@/components/agenda/Calendar';
import AgendamentosPanel from '@/components/agenda/AgendamentosPanel';

export interface Agendamento {
  id: string;
  title: string;
  leadName: string;
  leadEmail: string;
  leadPhone: string;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  date: string; // YYYY-MM-DD
  type: 'consultation' | 'call' | 'demo' | 'meeting';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  notes: string;
}

export default function AgendaPage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/');
      return;
    }

    fetchAgendamentos(token);
  }, [router]);

  const fetchAgendamentos = async (token: string) => {
    try {
      setLoading(true);

      // Mock data para desenvolvimento
      const mockAgendamentos: Agendamento[] = [
        {
          id: 'ag-1',
          title: 'Consulta - Chef Pastry',
          leadName: 'João Silva',
          leadEmail: 'joao@example.com',
          leadPhone: '(21) 98765-4321',
          startTime: '09:00',
          endTime: '10:00',
          date: new Date().toISOString().split('T')[0],
          type: 'consultation',
          status: 'confirmed',
          notes: 'Interessado em turma de janeiro',
        },
        {
          id: 'ag-2',
          title: 'Ligação - Follow-up',
          leadName: 'Maria Santos',
          leadEmail: 'maria@example.com',
          leadPhone: '(21) 99876-5432',
          startTime: '11:00',
          endTime: '11:30',
          date: new Date().toISOString().split('T')[0],
          type: 'call',
          status: 'scheduled',
          notes: 'Validar interesse',
        },
        {
          id: 'ag-3',
          title: 'Demo - Master Chef',
          leadName: 'Ana Costa',
          leadEmail: 'ana@example.com',
          leadPhone: '(21) 97654-3210',
          startTime: '14:00',
          endTime: '15:00',
          date: new Date().toISOString().split('T')[0],
          type: 'demo',
          status: 'confirmed',
          notes: 'Aula experimental',
        },
        {
          id: 'ag-4',
          title: 'Reunião - Corporativo',
          leadName: 'Pedro Oliveira',
          leadEmail: 'pedro@example.com',
          leadPhone: '(21) 91234-5678',
          startTime: '16:00',
          endTime: '17:00',
          date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          type: 'meeting',
          status: 'scheduled',
          notes: 'Treinamento para equipe',
        },
        {
          id: 'ag-5',
          title: 'Consulta - Gastronomia Italiana',
          leadName: 'Carlos Mendes',
          leadEmail: 'carlos@example.com',
          leadPhone: '(21) 98765-1234',
          startTime: '10:00',
          endTime: '11:00',
          date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
          type: 'consultation',
          status: 'scheduled',
          notes: 'Primeira reunião',
        },
      ];

      setAgendamentos(mockAgendamentos);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const agendamentosDoDia = agendamentos
    .filter((a) => a.date === selectedDate)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const handleConfirm = (id: string) => {
    setAgendamentos((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'confirmed' } : a))
    );
  };

  const handleCancel = (id: string) => {
    setAgendamentos((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'cancelled' } : a))
    );
  };

  const handleComplete = (id: string) => {
    setAgendamentos((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'completed' } : a))
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agenda</h1>
          <p className="mt-2 text-gray-600">
            Gerenciar agendamentos e compromissos
          </p>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-xs text-gray-600">Total Mês</p>
            <p className="text-2xl font-bold text-gray-900">{agendamentos.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-xs text-gray-600">Confirmados</p>
            <p className="text-2xl font-bold text-green-600">
              {agendamentos.filter((a) => a.status === 'confirmed').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-xs text-gray-600">Agendados</p>
            <p className="text-2xl font-bold text-blue-600">
              {agendamentos.filter((a) => a.status === 'scheduled').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-xs text-gray-600">Concluídos</p>
            <p className="text-2xl font-bold text-purple-600">
              {agendamentos.filter((a) => a.status === 'completed').length}
            </p>
          </div>
        </div>

        {/* Calendário e Painel */}
        {loading ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">Carregando agenda...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendário */}
            <div className="lg:col-span-1">
              <Calendar
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                agendamentos={agendamentos}
              />
            </div>

            {/* Agendamentos do Dia */}
            <div className="lg:col-span-2">
              <AgendamentosPanel
                date={selectedDate}
                agendamentos={agendamentosDoDia}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                onComplete={handleComplete}
              />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
