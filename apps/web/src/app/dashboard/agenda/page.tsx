'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import Calendar from '@/components/agenda/Calendar';
import AgendamentosPanel from '@/components/agenda/AgendamentosPanel';
import { useAppointments } from '@/hooks/useAppointments';

export interface Agendamento {
  id: string;
  title: string;
  leadName: string;
  leadEmail: string;
  leadPhone: string;
  startTime: string;
  endTime: string;
  date: string;
  type: 'consultation' | 'call' | 'demo' | 'meeting';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  notes: string;
}

export default function AgendaPage() {
  const router = useRouter();
  const { appointments: apiAppointments, loading, error, updateStatus } = useAppointments();
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/');
      return;
    }
  }, [router]);

  useEffect(() => {
    setAgendamentos(apiAppointments as Agendamento[]);
  }, [apiAppointments]);

  const agendamentosDoDia = agendamentos
    .filter((a) => a.date === selectedDate)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const handleConfirm = async (id: string) => {
    await updateStatus(id, 'confirmed');
  };

  const handleCancel = async (id: string) => {
    await updateStatus(id, 'cancelled');
  };

  const handleComplete = async (id: string) => {
    await updateStatus(id, 'completed');
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

        {/* Erro */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg shadow p-4">
            <p className="text-red-800">⚠️ {error}</p>
          </div>
        )}

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
