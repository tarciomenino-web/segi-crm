'use client';

import { Play } from 'lucide-react';

interface DistributionControlsProps {
  selectedStrategy: string;
  onStrategyChange: (strategy: string) => void;
  leadsToDistribute: number;
  onLeadsChange: (count: number) => void;
  onDistribute: () => Promise<void>;
  isLoading: boolean;
  pendingLeads: number;
}

const strategies = [
  {
    id: 'round_robin',
    label: 'Round Robin',
    icon: '🔄',
    description: 'Distribui sequencialmente entre SDRs',
    best_for: 'Carga equilibrada',
  },
  {
    id: 'workload',
    label: 'Por Carga de Trabalho',
    icon: '⚖️',
    description: 'Prioriza SDRs com menos leads pendentes',
    best_for: 'Balanceamento dinâmico',
  },
  {
    id: 'performance',
    label: 'Por Performance',
    icon: '⭐',
    description: 'Atribui aos melhores conversores',
    best_for: 'Maximizar conversões',
  },
  {
    id: 'manual',
    label: 'Manual',
    icon: '✋',
    description: 'Você escolhe para qual SDR distribuir',
    best_for: 'Casos específicos',
  },
];

export default function DistributionControls({
  selectedStrategy,
  onStrategyChange,
  leadsToDistribute,
  onLeadsChange,
  onDistribute,
  isLoading,
  pendingLeads,
}: DistributionControlsProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900">Distribuir Leads</h2>
        <p className="text-sm text-gray-600 mt-1">
          {pendingLeads} lead(s) pendente(s) para distribuir
        </p>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Estratégia */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Estratégia de Distribuição
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {strategies.map((strategy) => (
              <button
                key={strategy.id}
                onClick={() => onStrategyChange(strategy.id)}
                className={`text-left p-4 rounded-lg border-2 transition-all ${
                  selectedStrategy === strategy.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 bg-gray-50 hover:border-blue-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{strategy.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{strategy.label}</h3>
                    <p className="text-xs text-gray-600 mt-1">{strategy.description}</p>
                    <p className="text-xs text-blue-600 mt-2">Melhor para: {strategy.best_for}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Quantidade */}
        <div>
          <label htmlFor="leads-count" className="block text-sm font-semibold text-gray-900 mb-2">
            Quantidade de Leads a Distribuir
          </label>
          <div className="flex items-center gap-4">
            <input
              id="leads-count"
              type="range"
              min="1"
              max={Math.max(pendingLeads, 10)}
              value={leadsToDistribute}
              onChange={(e) => onLeadsChange(parseInt(e.target.value))}
              className="flex-1"
            />
            <input
              type="number"
              value={leadsToDistribute}
              onChange={(e) => onLeadsChange(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Máximo disponível: {pendingLeads} leads
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">Como funciona: </span>
            Será distribuído {leadsToDistribute} lead(s) usando a estratégia <strong>{strategies.find(s => s.id === selectedStrategy)?.label}</strong>.
            Os SDRs receberão notificação assim que forem atribuídos.
          </p>
        </div>

        {/* Button */}
        <button
          onClick={onDistribute}
          disabled={isLoading || pendingLeads === 0}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
        >
          <Play className="w-5 h-5" />
          {isLoading ? 'Distribuindo...' : 'Distribuir Agora'}
        </button>

        {/* Status */}
        {pendingLeads === 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <p className="text-sm text-green-800">✓ Todos os leads foram distribuídos!</p>
          </div>
        )}
      </div>
    </div>
  );
}
