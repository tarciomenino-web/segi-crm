'use client';

import { useState } from 'react';
import { Journey } from '@/hooks/useJourneys';
import { Trash2, ChevronRight } from 'lucide-react';

interface JourneyCardProps {
  journey: Journey;
  onToggle: (id: string, isActive: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const triggerIcons = {
  lead_created: '👤',
  score_reached: '⭐',
  custom: '✏️',
};

const triggerLabels = {
  lead_created: 'Quando lead é criado',
  score_reached: 'Quando score atinge limite',
  custom: 'Customizado',
};

export default function JourneyCard({
  journey,
  onToggle,
  onDelete,
}: JourneyCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const handleDelete = async () => {
    if (confirm('Tem certeza que deseja deletar esta jornada?')) {
      setIsDeleting(true);
      try {
        await onDelete(journey.id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      await onToggle(journey.id, !journey.isActive);
    } finally {
      setIsToggling(false);
    }
  };

  const conversionRate = journey.enrolledLeads > 0
    ? ((journey.completedLeads / journey.enrolledLeads) * 100).toFixed(1)
    : '0';

  return (
    <div
      className={`rounded-lg shadow p-6 border-l-4 transition-all ${
        journey.isActive
          ? 'bg-white border-l-blue-500 hover:shadow-lg'
          : 'bg-gray-50 border-l-gray-400'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className={`font-semibold text-lg ${journey.isActive ? 'text-gray-900' : 'text-gray-600'}`}>
            {journey.name}
          </h3>
          <p className={`text-sm mt-1 ${journey.isActive ? 'text-gray-600' : 'text-gray-500'}`}>
            {journey.description}
          </p>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={journey.isActive}
            onChange={handleToggle}
            disabled={isToggling}
            className="w-5 h-5 rounded border-gray-300 text-blue-600 disabled:opacity-50"
          />
          <span className="text-xs font-semibold text-gray-600">
            {journey.isActive ? 'Ativa' : 'Inativa'}
          </span>
        </label>
      </div>

      {/* Trigger */}
      <div className="mb-4 pb-4 border-b border-gray-200">
        <p className="text-xs text-gray-600 font-semibold mb-2">GATILHO</p>
        <div className="flex items-center gap-2">
          <span className="text-lg">
            {triggerIcons[journey.trigger as keyof typeof triggerIcons]}
          </span>
          <span className="text-sm text-gray-700">
            {triggerLabels[journey.trigger as keyof typeof triggerLabels]}
          </span>
        </div>
      </div>

      {/* Stages */}
      <div className="mb-4">
        <p className="text-xs text-gray-600 font-semibold mb-2">ETAPAS ({journey.stages.length})</p>
        <div className="flex items-center gap-1 flex-wrap">
          {journey.stages.slice(0, 3).map((stage, index) => (
            <div key={index} className="flex items-center gap-1">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                {stage.type === 'email' && '📧'}
                {stage.type === 'whatsapp' && '💬'}
                {stage.type === 'sms' && '📱'}
                {stage.type === 'appointment' && '📅'}
                {stage.type === 'score_update' && '⭐'}
                {stage.type === 'wait' && '⏳'}
              </span>
              {index < Math.min(2, journey.stages.length - 1) && (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </div>
          ))}
          {journey.stages.length > 3 && (
            <span className="text-xs text-gray-600 font-semibold">
              +{journey.stages.length - 3} mais
            </span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
        <div>
          <p className="text-xs text-gray-600">Inscritos</p>
          <p className="text-lg font-bold text-gray-900">{journey.enrolledLeads}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Completados</p>
          <p className="text-lg font-bold text-green-600">{journey.completedLeads}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Taxa Conv.</p>
          <p className="text-lg font-bold text-blue-600">{conversionRate}%</p>
        </div>
      </div>

      {/* Actions */}
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-100 hover:bg-red-200 disabled:bg-gray-100 text-red-700 disabled:text-gray-500 font-medium rounded-lg transition-colors text-sm"
      >
        <Trash2 className="w-4 h-4" />
        Deletar
      </button>
    </div>
  );
}
