'use client';

import { Journey } from '@/hooks/useJourneys';
import JourneyCard from './JourneyCard';

interface JourneysListProps {
  journeys: Journey[];
  isCreating: boolean;
  onCreateJourney: (journey: Partial<Journey>) => Promise<Journey>;
  onUpdateJourney: (id: string, journey: Partial<Journey>) => Promise<void>;
  onDeleteJourney: (id: string) => Promise<void>;
  onToggleJourney: (id: string, isActive: boolean) => Promise<void>;
  onCloseCreate: () => void;
}

export default function JourneysList({
  journeys,
  onDeleteJourney,
  onToggleJourney,
}: JourneysListProps) {
  const activeJourneys = journeys.filter((j) => j.isActive);
  const inactiveJourneys = journeys.filter((j) => !j.isActive);

  if (journeys.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <div className="mb-4">
          <span className="text-6xl">🎯</span>
        </div>
        <p className="text-lg font-semibold text-gray-900">Nenhuma jornada criada</p>
        <p className="text-gray-600 mt-2">
          Clique em "Nova Jornada" para começar a criar seus funis de vendas
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resumo */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow p-6 border border-blue-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-600">Total de Jornadas</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{journeys.length}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Ativas</p>
            <p className="text-3xl font-bold text-green-600 mt-1">
              {activeJourneys.length}
              <span className="text-sm text-gray-600 ml-2">
                ({inactiveJourneys.length} inativas)
              </span>
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Total Inscritos</p>
            <p className="text-3xl font-bold text-blue-600 mt-1">
              {journeys.reduce((sum, j) => sum + j.enrolledLeads, 0)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Conv. Média</p>
            <p className="text-3xl font-bold text-purple-600 mt-1">
              {journeys.length > 0
                ? (
                    journeys.reduce((sum, j) => sum + j.avgConversion, 0) / journeys.length
                  ).toFixed(1)
                : '0'}
              %
            </p>
          </div>
        </div>
      </div>

      {/* Jornadas Ativas */}
      {activeJourneys.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">✓ Ativas ({activeJourneys.length})</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {activeJourneys.map((journey) => (
              <JourneyCard
                key={journey.id}
                journey={journey}
                onToggle={onToggleJourney}
                onDelete={onDeleteJourney}
              />
            ))}
          </div>
        </div>
      )}

      {/* Jornadas Inativas */}
      {inactiveJourneys.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">✕ Inativas ({inactiveJourneys.length})</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {inactiveJourneys.map((journey) => (
              <JourneyCard
                key={journey.id}
                journey={journey}
                onToggle={onToggleJourney}
                onDelete={onDeleteJourney}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
