'use client';

import { Opportunity } from '@/app/dashboard/opportunities/page';
import { ChevronRight } from 'lucide-react';

interface KanbanCardProps {
  opportunity: Opportunity;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, id: string) => void;
}

const temperatureIcons = {
  hot: '🔥',
  warm: '⚠️',
  cold: '❄️',
};

export default function KanbanCard({ opportunity, onDragStart }: KanbanCardProps) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, opportunity.id)}
      className="bg-white border border-gray-200 rounded-lg p-4 cursor-move hover:shadow-md transition-shadow hover:border-blue-300 active:opacity-50"
    >
      {/* Título */}
      <h4 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">
        {opportunity.title}
      </h4>

      {/* Lead Info */}
      <div className="mb-3 text-xs space-y-1">
        <p className="text-gray-700">{opportunity.leadName}</p>
        <p className="text-gray-600">{opportunity.phone}</p>
      </div>

      {/* Valor e Temperatura */}
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
        <div>
          <p className="text-xs text-gray-600">Valor</p>
          <p className="text-sm font-bold text-green-600">
            R$ {(opportunity.value / 1000).toFixed(1)}k
          </p>
        </div>
        <div className="text-center">
          <span className="text-lg">{temperatureIcons[opportunity.temperature]}</span>
          <p className="text-xs text-gray-600 mt-1">
            {opportunity.daysInStage}d
          </p>
        </div>
      </div>

      {/* Probabilidade */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs text-gray-600">Probabilidade</p>
          <p className="text-xs font-semibold text-gray-900">{opportunity.probability}%</p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${opportunity.probability}%` }}
          ></div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">
          Última atividade: {opportunity.lastActivity}
        </p>
        <ChevronRight className="w-4 h-4 text-gray-400" />
      </div>
    </div>
  );
}
