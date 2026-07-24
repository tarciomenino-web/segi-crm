'use client';

import { useState } from 'react';
import { Opportunity } from '@/app/dashboard/opportunities/page';
import KanbanColumn from './KanbanColumn';

interface KanbanData {
  lead: Opportunity[];
  contacted: Opportunity[];
  qualified: Opportunity[];
  proposal: Opportunity[];
  negotiation: Opportunity[];
  closed: Opportunity[];
}

interface KanbanBoardProps {
  data: KanbanData;
  onMoveCard: (opportunityId: string, fromStage: keyof KanbanData, toStage: keyof KanbanData) => void;
}

const STAGES = [
  { id: 'lead', label: 'Lead', icon: '👤', color: 'bg-gray-100' },
  { id: 'contacted', label: 'Contatado', icon: '📞', color: 'bg-blue-100' },
  { id: 'qualified', label: 'Qualificado', icon: '✅', color: 'bg-green-100' },
  { id: 'proposal', label: 'Proposta', icon: '📋', color: 'bg-yellow-100' },
  { id: 'negotiation', label: 'Negociação', icon: '🤝', color: 'bg-purple-100' },
  { id: 'closed', label: 'Fechado', icon: '🎯', color: 'bg-emerald-100' },
];

export default function KanbanBoard({ data, onMoveCard }: KanbanBoardProps) {
  const [draggedCard, setDraggedCard] = useState<{
    id: string;
    fromStage: keyof KanbanData;
  } | null>(null);

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    opportunityId: string,
    stage: keyof KanbanData
  ) => {
    setDraggedCard({ id: opportunityId, fromStage: stage });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    toStage: keyof KanbanData
  ) => {
    e.preventDefault();
    if (!draggedCard) return;

    if (draggedCard.fromStage !== toStage) {
      onMoveCard(draggedCard.id, draggedCard.fromStage, toStage);
    }

    setDraggedCard(null);
  };

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-6 min-w-max">
        {STAGES.map((stage) => {
          const stageKey = stage.id as keyof KanbanData;
          const cards = data[stageKey];

          return (
            <div
              key={stage.id}
              className="flex-shrink-0 w-80"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stageKey)}
            >
              <KanbanColumn
                stage={stage}
                cards={cards}
                onDragStart={(e, id) => handleDragStart(e, id, stageKey)}
                isDragTarget={draggedCard?.fromStage === stageKey}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
