'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Automation, TriggerType, ActionType } from '@/hooks/useAutomations';

interface CreateAutomationModalProps {
  onClose: () => void;
  onCreate: (automation: Partial<Automation>) => Promise<void>;
}

const triggers = [
  { value: 'lead_created' as TriggerType, label: 'Lead Criado', icon: '👤' },
  { value: 'lead_scored' as TriggerType, label: 'Lead Pontuado', icon: '⭐' },
  { value: 'opportunity_created' as TriggerType, label: 'Oportunidade Criada', icon: '🎯' },
  { value: 'appointment_completed' as TriggerType, label: 'Agendamento Concluído', icon: '✓' },
  { value: 'days_without_contact' as TriggerType, label: 'Dias Sem Contato', icon: '⏰' },
];

const actions = [
  { value: 'assign_to_sdr' as ActionType, label: 'Atribuir ao SDR', icon: '👥' },
  { value: 'send_email' as ActionType, label: 'Enviar Email', icon: '📧' },
  { value: 'send_whatsapp' as ActionType, label: 'Enviar WhatsApp', icon: '💬' },
  { value: 'create_appointment' as ActionType, label: 'Criar Agendamento', icon: '📅' },
  { value: 'update_score' as ActionType, label: 'Atualizar Score', icon: '⭐' },
  { value: 'notify_sdr' as ActionType, label: 'Notificar SDR', icon: '🔔' },
  { value: 'move_to_stage' as ActionType, label: 'Mover para Stage', icon: '🎯' },
];

export default function CreateAutomationModal({
  onClose,
  onCreate,
}: CreateAutomationModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [trigger, setTrigger] = useState<TriggerType>('lead_created');
  const [selectedActions, setSelectedActions] = useState<ActionType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddAction = (action: ActionType) => {
    if (!selectedActions.includes(action)) {
      setSelectedActions([...selectedActions, action]);
    }
  };

  const handleRemoveAction = (action: ActionType) => {
    setSelectedActions(selectedActions.filter((a) => a !== action));
  };

  const handleCreate = async () => {
    if (!name || selectedActions.length === 0) {
      alert('Preencha nome e selecione pelo menos uma ação');
      return;
    }

    setIsLoading(true);
    try {
      await onCreate({
        name,
        description,
        trigger,
        triggerConfig: {},
        actions: selectedActions.map((type, index) => ({
          id: `action-${index}`,
          type,
          config: {},
          order: index,
        })),
        enabled: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
            <h2 className="text-2xl font-bold text-gray-900">Nova Automação</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Básicas */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Nome da Automação
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ex: Atribuir leads quentes"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Descrição
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva o propósito desta automação"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Trigger */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Gatilho (o que dispara)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {triggers.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setTrigger(t.value)}
                    className={`text-left p-3 rounded-lg border-2 transition-all ${
                      trigger === t.value
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 bg-gray-50 hover:border-blue-300'
                    }`}
                  >
                    <span className="text-lg">{t.icon}</span>
                    <p className="text-sm font-medium text-gray-900 mt-1">{t.label}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Ações (o que faz)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                {actions.map((a) => (
                  <button
                    key={a.value}
                    onClick={() =>
                      selectedActions.includes(a.value)
                        ? handleRemoveAction(a.value)
                        : handleAddAction(a.value)
                    }
                    className={`text-left p-3 rounded-lg border-2 transition-all ${
                      selectedActions.includes(a.value)
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 bg-gray-50 hover:border-green-300'
                    }`}
                  >
                    <span className="text-lg">{a.icon}</span>
                    <p className="text-sm font-medium text-gray-900 mt-1">{a.label}</p>
                  </button>
                ))}
              </div>

              {/* Selected Actions Preview */}
              {selectedActions.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Ações Selecionadas:</p>
                  <ol className="space-y-2">
                    {selectedActions.map((action, idx) => (
                      <li key={idx} className="text-sm text-gray-700">
                        <span className="font-semibold">{idx + 1}.</span>{' '}
                        {actions.find((a) => a.value === action)?.label}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-gray-200 sticky bottom-0 bg-gray-50">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleCreate}
              disabled={isLoading || !name || selectedActions.length === 0}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              {isLoading ? 'Criando...' : 'Criar Automação'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
