'use client';

import { Opportunity } from '@/app/dashboard/opportunities/page';
import KanbanCard from './KanbanCard';

interface Stage {
  id: string;
  label: string;
  icon: string;
  color: string;
}

interface KanbanColumnProps {
  stage: Stage;
  cards: Opportunity[];
  onDragStart: (e: React.DragEvent<HTMLDivElement>, id: string) => void;
  isDragTarget: boolean;
}

export default function KanbanColumn({
  stage,
  cards,
  onDragStart,
  isDragTarget,
}: KanbanColumnProps) {
  const totalValue = cards.reduce((sum, card) => sum + card.value, 0);
  const avgProbability =
    cards.length > 0
      ? Math.round(cards.reduce((sum, card) => sum + card.probability, 0) / cards.length)
      : 0;

  return (
    <div className="flex flex-col bg-white rounded-lg shadow overflow-hidden">
      {/* Header */}
      <div className={`${stage.color} px-4 py-4 border-b border-gray-200`}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">{stage.icon}</span>
          <div>
            <h3 className="font-semibold text-gray-900">{stage.label}</h3>
            <p className="text-xs text-gray-600">{cards.length} card(s)</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-white rounded px-2 py-1">
            <p className="text-gray-600">Valor</p>
            <p className="font-bold text-gray-900">R$ {(totalValue / 1000).toFixed(1)}k</p>
          </div>
          <div className="bg-white rounded px-2 py-1">
            <p className="text-gray-600">Prob. Média</p>
            <p className="font-bold text-gray-900">{avgProbability}%</p>
          </div>
        </div>
      </div>

      {/* Cards Container */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-96">
        {cards.length > 0 ? (
          cards.map((card) => (
            <KanbanCard
              key={card.id}
              opportunity={card}
              onDragStart={onDragStart}
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-24 text-center">
            <p className="text-sm text-gray-400">Nenhuma oportunidade</p>
          </div>
        )}
      </div>
    </div>
  );
}
