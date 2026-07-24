'use client';

import { Automation } from '@/hooks/useAutomations';
import AutomationCard from './AutomationCard';

interface AutomationsListProps {
  automations: Automation[];
  onToggle: (id: string, enabled: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, automation: Partial<Automation>) => Promise<void>;
}

export default function AutomationsList({
  automations,
  onToggle,
  onDelete,
  onUpdate,
}: AutomationsListProps) {
  const enabledCount = automations.filter((a) => a.enabled).length;
  const disabledCount = automations.filter((a) => !a.enabled).length;

  if (automations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <div className="mb-4">
          <span className="text-6xl">🤖</span>
        </div>
        <p className="text-lg font-semibold text-gray-900">Nenhuma automação criada</p>
        <p className="text-gray-600 mt-2">
          Clique em "Nova Automação" para começar a criar seus workflows
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resumo */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow p-6 border border-blue-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-gray-600">Total de Automações</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{automations.length}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Ativadas</p>
            <p className="text-3xl font-bold text-green-600 mt-1">
              {enabledCount}
              <span className="text-sm text-gray-600 ml-2">({disabledCount} desativadas)</span>
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Total de Execuções</p>
            <p className="text-3xl font-bold text-blue-600 mt-1">
              {automations.reduce((sum, a) => sum + a.executedCount, 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Automações Ativadas */}
      {enabledCount > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">✓ Ativadas ({enabledCount})</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {automations
              .filter((a) => a.enabled)
              .map((automation) => (
                <AutomationCard
                  key={automation.id}
                  automation={automation}
                  onToggle={onToggle}
                  onDelete={onDelete}
                  onUpdate={onUpdate}
                />
              ))}
          </div>
        </div>
      )}

      {/* Automações Desativadas */}
      {disabledCount > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">✕ Desativadas ({disabledCount})</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {automations
              .filter((a) => !a.enabled)
              .map((automation) => (
                <AutomationCard
                  key={automation.id}
                  automation={automation}
                  onToggle={onToggle}
                  onDelete={onDelete}
                  onUpdate={onUpdate}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
