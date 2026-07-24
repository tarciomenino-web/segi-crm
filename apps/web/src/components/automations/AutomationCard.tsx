'use client';

import { useState } from 'react';
import { Automation } from '@/hooks/useAutomations';
import { Trash2, AlertCircle } from 'lucide-react';

interface AutomationCardProps {
  automation: Automation;
  onToggle: (id: string, enabled: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, automation: Partial<Automation>) => Promise<void>;
}

const triggerIcons = {
  lead_created: '👤',
  lead_scored: '⭐',
  opportunity_created: '🎯',
  appointment_completed: '✓',
  days_without_contact: '⏰',
};

const triggerLabels = {
  lead_created: 'Lead Criado',
  lead_scored: 'Lead Pontuado',
  opportunity_created: 'Oportunidade Criada',
  appointment_completed: 'Agendamento Concluído',
  days_without_contact: 'Dias Sem Contato',
};

const actionIcons = {
  assign_to_sdr: '👥',
  send_email: '📧',
  send_whatsapp: '💬',
  create_appointment: '📅',
  update_score: '⭐',
  notify_sdr: '🔔',
  move_to_stage: '🎯',
};

const actionLabels = {
  assign_to_sdr: 'Atribuir ao SDR',
  send_email: 'Enviar Email',
  send_whatsapp: 'Enviar WhatsApp',
  create_appointment: 'Criar Agendamento',
  update_score: 'Atualizar Score',
  notify_sdr: 'Notificar SDR',
  move_to_stage: 'Mover para Stage',
};

export default function AutomationCard({
  automation,
  onToggle,
  onDelete,
  onUpdate,
}: AutomationCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm('Tem certeza que deseja deletar esta automação?')) {
      setIsDeleting(true);
      try {
        await onDelete(automation.id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const lastExecutedTime = automation.lastExecuted
    ? new Date(automation.lastExecuted).toLocaleString('pt-BR')
    : 'Nunca';

  return (
    <div
      className={`rounded-lg shadow p-6 border-l-4 transition-all ${
        automation.enabled
          ? 'bg-white border-l-green-500 hover:shadow-lg'
          : 'bg-gray-50 border-l-gray-400'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className={`font-semibold text-lg ${automation.enabled ? 'text-gray-900' : 'text-gray-600'}`}>
            {automation.name}
          </h3>
          <p className={`text-sm mt-1 ${automation.enabled ? 'text-gray-600' : 'text-gray-500'}`}>
            {automation.description}
          </p>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={automation.enabled}
            onChange={(e) => onToggle(automation.id, e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 text-blue-600"
          />
          <span className="text-xs font-semibold text-gray-600">
            {automation.enabled ? 'Ativo' : 'Inativo'}
          </span>
        </label>
      </div>

      {/* Trigger */}
      <div className="mb-4 pb-4 border-b border-gray-200">
        <p className="text-xs text-gray-600 font-semibold mb-2">GATILHO</p>
        <div className="flex items-center gap-2">
          <span className="text-xl">{triggerIcons[automation.trigger as keyof typeof triggerIcons]}</span>
          <span className="text-sm font-medium text-gray-900">
            {triggerLabels[automation.trigger as keyof typeof triggerLabels]}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="mb-4">
        <p className="text-xs text-gray-600 font-semibold mb-2">AÇÕES ({automation.actions.length})</p>
        <div className="space-y-2">
          {automation.actions.map((action, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <span className="text-xs font-bold text-gray-500">{index + 1}.</span>
              <span className="text-lg">
                {actionIcons[action.type as keyof typeof actionIcons]}
              </span>
              <span className="text-gray-700">
                {actionLabels[action.type as keyof typeof actionLabels]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
        <div>
          <p className="text-xs text-gray-600">Execuções</p>
          <p className="text-lg font-bold text-gray-900">{automation.executedCount}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Última Exec.</p>
          <p className="text-xs font-semibold text-gray-900">{lastExecutedTime.split(' ')[0]}</p>
        </div>
      </div>

      {/* Warning */}
      {!automation.enabled && (
        <div className="flex items-center gap-2 mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
          <AlertCircle className="w-4 h-4 text-yellow-600" />
          <p className="text-xs text-yellow-800">Esta automação está desativada</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-100 hover:bg-red-200 disabled:bg-gray-100 text-red-700 disabled:text-gray-500 font-medium rounded-lg transition-colors text-sm"
        >
          <Trash2 className="w-4 h-4" />
          Deletar
        </button>
      </div>
    </div>
  );
}
