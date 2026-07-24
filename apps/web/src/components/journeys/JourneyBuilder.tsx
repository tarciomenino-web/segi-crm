'use client';

import { useState } from 'react';
import { Journey, JourneyStage } from '@/hooks/useJourneys';
import { Plus, Trash2, ChevronRight } from 'lucide-react';

interface JourneyBuilderProps {
  onCreateJourney: (journey: Partial<Journey>) => Promise<Journey>;
}

const stageTypes = [
  { value: 'email' as const, label: 'Email', icon: '📧' },
  { value: 'whatsapp' as const, label: 'WhatsApp', icon: '💬' },
  { value: 'sms' as const, label: 'SMS', icon: '📱' },
  { value: 'appointment' as const, label: 'Agendamento', icon: '📅' },
  { value: 'score_update' as const, label: 'Atualizar Score', icon: '⭐' },
  { value: 'wait' as const, label: 'Esperar', icon: '⏳' },
];

export default function JourneyBuilder({ onCreateJourney }: JourneyBuilderProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [trigger, setTrigger] = useState<'lead_created' | 'score_reached' | 'custom'>('lead_created');
  const [stages, setStages] = useState<Partial<JourneyStage>[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleAddStage = (type: any) => {
    const newStage: Partial<JourneyStage> = {
      id: `stage-${Date.now()}`,
      order: stages.length,
      type,
      name: stageTypes.find((s) => s.value === type)?.label || '',
      config: {},
      delay: 0,
      delayUnit: 'hours',
    };
    setStages([...stages, newStage]);
  };

  const handleRemoveStage = (index: number) => {
    setStages(stages.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!name || stages.length === 0) {
      setMessage({ type: 'error', text: 'Preencha nome e adicione pelo menos uma etapa' });
      return;
    }

    setIsSaving(true);
    try {
      await onCreateJourney({
        name,
        description,
        trigger,
        triggerConfig: {},
        stages: stages as JourneyStage[],
        isActive: true,
      });
      setMessage({ type: 'success', text: 'Jornada criada com sucesso!' });
      setName('');
      setDescription('');
      setTrigger('lead_created');
      setStages([]);
    } catch {
      setMessage({ type: 'error', text: 'Erro ao criar jornada' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Message */}
      {message && (
        <div className={`rounded-lg p-4 ${
          message.type === 'success'
            ? 'bg-green-50 border border-green-200'
            : 'bg-red-50 border border-red-200'
        }`}>
          <p className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
            {message.text}
          </p>
        </div>
      )}

      {/* Info Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações da Jornada</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome da Jornada
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ex: Jornada de Leads Quentes"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o propósito desta jornada"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quando iniciar?
            </label>
            <select
              value={trigger}
              onChange={(e) => setTrigger(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="lead_created">Quando um novo lead é criado</option>
              <option value="score_reached">Quando o score atinge um valor</option>
              <option value="custom">Customizado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stages Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Etapas da Jornada</h2>

        {/* Visual Pipeline */}
        {stages.length > 0 && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg overflow-x-auto">
            <div className="flex items-center gap-2 min-w-max">
              {stages.map((stage, index) => (
                <div key={stage.id} className="flex items-center gap-2">
                  <div className="flex flex-col items-center">
                    <div className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold">
                      {stageTypes.find((s) => s.value === stage.type)?.icon}
                      {' '}
                      {stageTypes.find((s) => s.value === stage.type)?.label}
                    </div>
                    {stage.delay && (
                      <span className="text-xs text-gray-600 mt-1">
                        +{stage.delay} {stage.delayUnit}
                      </span>
                    )}
                  </div>
                  {index < stages.length - 1 && (
                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Stage */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-3">Adicionar Etapa:</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {stageTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => handleAddStage(type.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                {type.icon} {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stages List */}
        {stages.length > 0 && (
          <div className="space-y-3">
            {stages.map((stage, index) => (
              <div key={stage.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {index + 1}. {stageTypes.find((s) => s.value === stage.type)?.label}
                  </div>
                  <div className="flex gap-4 mt-2 text-xs text-gray-600">
                    {stage.type === 'wait' && (
                      <>
                        <label>
                          Delay:
                          <input
                            type="number"
                            value={stage.delay || 0}
                            onChange={(e) => {
                              const newStages = [...stages];
                              newStages[index] = { ...stage, delay: parseInt(e.target.value) };
                              setStages(newStages);
                            }}
                            className="ml-2 w-12 px-2 py-1 border border-gray-300 rounded"
                          />
                        </label>
                        <select
                          value={stage.delayUnit || 'hours'}
                          onChange={(e) => {
                            const newStages = [...stages];
                            newStages[index] = { ...stage, delayUnit: e.target.value as any };
                            setStages(newStages);
                          }}
                          className="px-2 py-1 border border-gray-300 rounded"
                        >
                          <option value="minutes">Minutos</option>
                          <option value="hours">Horas</option>
                          <option value="days">Dias</option>
                        </select>
                      </>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveStage(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={isSaving || !name || stages.length === 0}
        className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
      >
        {isSaving ? 'Criando...' : 'Criar Jornada'}
      </button>

      {/* Template Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Templates de Jornadas:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>Jornada Simples:</strong> Email welcome → Esperar 1 dia → Email follow-up</li>
          <li>• <strong>Jornada WhatsApp:</strong> WhatsApp boas-vindas → Esperar 3 horas → WhatsApp proposta</li>
          <li>• <strong>Jornada Completa:</strong> Email + WhatsApp + Agendamento + Score update</li>
        </ul>
      </div>
    </div>
  );
}
