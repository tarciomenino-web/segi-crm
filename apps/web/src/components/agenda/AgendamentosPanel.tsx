'use client';

import { Agendamento } from '@/app/dashboard/agenda/page';
import AgendamentoCard from './AgendamentoCard';

interface AgendamentosPanelProps {
  date: string;
  agendamentos: Agendamento[];
  onConfirm: (id: string) => void;
  onCancel: (id: string) => void;
  onComplete: (id: string) => void;
}

export default function AgendamentosPanel({
  date,
  agendamentos,
  onConfirm,
  onCancel,
  onComplete,
}: AgendamentosPanelProps) {
  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateStr).toLocaleDateString('pt-BR', options);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-blue-200 rounded-t-lg">
        <h2 className="font-bold text-gray-900 text-lg">
          {formatDate(date)}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {agendamentos.length} agendamento(s)
        </p>
      </div>

      {/* Content */}
      <div className="p-6">
        {agendamentos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Nenhum agendamento para este dia
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Clique em outro dia para ver os agendamentos
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {agendamentos.map((agendamento) => (
              <AgendamentoCard
                key={agendamento.id}
                agendamento={agendamento}
                onConfirm={() => onConfirm(agendamento.id)}
                onCancel={() => onCancel(agendamento.id)}
                onComplete={() => onComplete(agendamento.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Timeline View (se houver agendamentos) */}
      {agendamentos.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <h3 className="font-semibold text-gray-900 mb-4 text-sm">Timeline do Dia</h3>
          <div className="space-y-2">
            {agendamentos.map((agendamento) => (
              <div
                key={agendamento.id}
                className="flex items-center gap-3 text-xs"
              >
                <div className="font-semibold text-gray-900 w-12">
                  {agendamento.startTime}
                </div>
                <div className="h-1 bg-gray-300 flex-1 rounded-full relative">
                  <div
                    className={`absolute top-1/2 -translate-y-1/2 -left-1.5 w-4 h-4 rounded-full border-2 border-white ${
                      agendamento.status === 'confirmed'
                        ? 'bg-green-500'
                        : agendamento.status === 'scheduled'
                          ? 'bg-blue-500'
                          : agendamento.status === 'completed'
                            ? 'bg-purple-500'
                            : 'bg-red-500'
                    }`}
                  ></div>
                </div>
                <span className="text-gray-700 flex-1 truncate">
                  {agendamento.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
