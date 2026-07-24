'use client';

import { Agendamento } from '@/app/dashboard/agenda/page';
import { Mail, Phone, Clock, CheckCircle2, XCircle, Play } from 'lucide-react';

interface AgendamentoCardProps {
  agendamento: Agendamento;
  onConfirm: () => void;
  onCancel: () => void;
  onComplete: () => void;
}

const typeIcons = {
  consultation: '👤',
  call: '📞',
  demo: '🎓',
  meeting: '👥',
};

const typeLabels = {
  consultation: 'Consulta',
  call: 'Ligação',
  demo: 'Demo',
  meeting: 'Reunião',
};

const statusColors = {
  scheduled: 'bg-blue-50 border-blue-200',
  confirmed: 'bg-green-50 border-green-200',
  completed: 'bg-purple-50 border-purple-200',
  cancelled: 'bg-red-50 border-red-200',
};

const statusLabels = {
  scheduled: 'Agendado',
  confirmed: 'Confirmado',
  completed: 'Concluído',
  cancelled: 'Cancelado',
};

const statusBadgeColors = {
  scheduled: 'bg-blue-100 text-blue-800',
  confirmed: 'bg-green-100 text-green-800',
  completed: 'bg-purple-100 text-purple-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function AgendamentoCard({
  agendamento,
  onConfirm,
  onCancel,
  onComplete,
}: AgendamentoCardProps) {
  return (
    <div
      className={`border-2 rounded-lg p-4 transition-all ${statusColors[agendamento.status]}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <span className="text-2xl">{typeIcons[agendamento.type]}</span>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{agendamento.title}</h3>
            <p className="text-xs text-gray-600 mt-1">
              {typeLabels[agendamento.type]} • {agendamento.startTime} às{' '}
              {agendamento.endTime}
            </p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadgeColors[agendamento.status]}`}>
          {statusLabels[agendamento.status]}
        </span>
      </div>

      {/* Lead Info */}
      <div className="bg-white rounded-lg p-3 mb-4 space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-gray-600 font-medium">{agendamento.leadName}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-700">
          <Mail className="w-4 h-4 text-blue-600" />
          <a href={`mailto:${agendamento.leadEmail}`} className="text-blue-600 hover:underline">
            {agendamento.leadEmail}
          </a>
        </div>

        <div className="flex items-center gap-2 text-gray-700">
          <Phone className="w-4 h-4 text-green-600" />
          <a href={`tel:${agendamento.leadPhone}`} className="text-green-600 hover:underline">
            {agendamento.leadPhone}
          </a>
        </div>
      </div>

      {/* Duração */}
      <div className="bg-white rounded-lg p-3 mb-4 flex items-center gap-2 text-sm">
        <Clock className="w-4 h-4 text-gray-600" />
        <span className="text-gray-700">
          <span className="font-semibold">{agendamento.startTime}</span> -{' '}
          <span className="font-semibold">{agendamento.endTime}</span>
          <span className="text-gray-600">
            {' '}
            (
            {Math.round(
              (parseInt(agendamento.endTime.split(':')[0]) -
                parseInt(agendamento.startTime.split(':')[0])) *
                60 +
                (parseInt(agendamento.endTime.split(':')[1]) -
                  parseInt(agendamento.startTime.split(':')[1]))
            ) / 60}
            h)
          </span>
        </span>
      </div>

      {/* Notes */}
      {agendamento.notes && (
        <div className="bg-white rounded-lg p-3 mb-4 border-l-4 border-yellow-400">
          <p className="text-sm text-gray-700">
            <span className="font-semibold text-gray-900">Notas: </span>
            {agendamento.notes}
          </p>
        </div>
      )}

      {/* Actions */}
      {agendamento.status !== 'cancelled' && agendamento.status !== 'completed' && (
        <div className="flex gap-2">
          {agendamento.status === 'scheduled' && (
            <>
              <button
                onClick={onConfirm}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                Confirmar
              </button>
              <button
                onClick={onCancel}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <XCircle className="w-4 h-4" />
                Cancelar
              </button>
            </>
          )}

          {agendamento.status === 'confirmed' && (
            <>
              <button
                onClick={onComplete}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <Play className="w-4 h-4" />
                Concluir
              </button>
              <button
                onClick={onCancel}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <XCircle className="w-4 h-4" />
                Cancelar
              </button>
            </>
          )}
        </div>
      )}

      {agendamento.status === 'cancelled' && (
        <div className="flex items-center justify-center px-3 py-2 bg-red-100 rounded-lg text-red-800 text-sm font-medium">
          ✕ Agendamento cancelado
        </div>
      )}

      {agendamento.status === 'completed' && (
        <div className="flex items-center justify-center px-3 py-2 bg-purple-100 rounded-lg text-purple-800 text-sm font-medium">
          ✓ Agendamento concluído
        </div>
      )}
    </div>
  );
}
