'use client';

import { DistributionStats as DistributionStatsType } from '@/hooks/useLeadDistribution';
import { TrendingUp } from 'lucide-react';

interface DistributionStatsProps {
  stats: DistributionStatsType;
}

export default function DistributionStats({ stats }: DistributionStatsProps) {
  const distributionRate = stats.totalLeads > 0 ?
    ((stats.distributedLeads / stats.totalLeads) * 100).toFixed(1) :
    '0';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* Total Leads */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-600 font-medium">Total de Leads</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalLeads}</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-lg text-xl">👥</div>
        </div>
      </div>

      {/* Distribuídos */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-600 font-medium">Distribuídos</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{stats.distributedLeads}</p>
          </div>
          <div className="bg-green-100 p-3 rounded-lg text-xl">✓</div>
        </div>
      </div>

      {/* Pendentes */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-600 font-medium">Pendentes</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.pendingLeads}</p>
          </div>
          <div className="bg-yellow-100 p-3 rounded-lg text-xl">⏳</div>
        </div>
      </div>

      {/* Média por SDR */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-600 font-medium">Média/SDR</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">{stats.averagePerSDR.toFixed(1)}</p>
          </div>
          <div className="bg-purple-100 p-3 rounded-lg text-xl">📊</div>
        </div>
      </div>

      {/* Taxa Distribuição */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-600 font-medium">Taxa Dist.</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{distributionRate}%</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-lg text-xl">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Última Distribuição */}
      <div className="bg-white rounded-lg shadow p-4 md:col-span-2 lg:col-span-5">
        <p className="text-xs text-gray-600 font-medium">Última Distribuição</p>
        <div className="flex items-center justify-between mt-2">
          <p className="text-gray-900">
            {stats.lastDistribution ? (
              new Date(stats.lastDistribution).toLocaleString('pt-BR')
            ) : (
              'Nenhuma distribuição realizada'
            )}
          </p>
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">
            ✓ Atualizado
          </span>
        </div>
      </div>
    </div>
  );
}
