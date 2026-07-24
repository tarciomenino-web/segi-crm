'use client';

import { SDR } from '@/hooks/useLeadDistribution';
import { TrendingUp } from 'lucide-react';

interface SDRCardProps {
  sdr: SDR;
}

export default function SDRCard({ sdr }: SDRCardProps) {
  const workload = sdr.leadsAssigned - sdr.leadsConverted;
  const workloadPercentage = sdr.leadsAssigned > 0 ?
    ((workload / sdr.leadsAssigned) * 100) :
    0;

  return (
    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">{sdr.name}</h3>
          <p className="text-xs text-gray-600 mt-1">{sdr.email}</p>
        </div>
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
            sdr.active
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${sdr.active ? 'bg-green-600' : 'bg-gray-600'}`}></span>
          {sdr.active ? 'Ativo' : 'Inativo'}
        </span>
      </div>

      {/* Métricas */}
      <div className="space-y-3 mb-4">
        {/* Atribuído vs Convertido */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-600">Leads</span>
            <span className="text-xs font-semibold text-gray-900">
              {sdr.leadsConverted} / {sdr.leadsAssigned}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-green-600 h-2 rounded-full transition-all"
              style={{
                width: `${
                  sdr.leadsAssigned > 0
                    ? (sdr.leadsConverted / sdr.leadsAssigned) * 100
                    : 0
                }%`,
              }}
            ></div>
          </div>
        </div>

        {/* Carga de Trabalho */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-600">Carga Atual</span>
            <span className="text-xs font-semibold text-gray-900">
              {workload} pendente(s)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all ${
                workloadPercentage > 70
                  ? 'bg-red-500'
                  : workloadPercentage > 40
                    ? 'bg-yellow-500'
                    : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(workloadPercentage, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Score Médio */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-600">Score Médio</span>
            <span className="text-xs font-semibold text-gray-900">
              {sdr.avgLeadScore.toFixed(0)}/100
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-purple-600 h-2 rounded-full"
              style={{ width: `${Math.min(sdr.avgLeadScore, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Taxa de Conversão */}
      <div className="bg-blue-50 rounded-lg p-3 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-600">Taxa de Conversão</p>
          <p className="text-xl font-bold text-blue-600">{sdr.conversionRate.toFixed(1)}%</p>
        </div>
        <TrendingUp className={`w-6 h-6 ${
          sdr.conversionRate > 30
            ? 'text-green-600'
            : sdr.conversionRate > 15
              ? 'text-yellow-600'
              : 'text-red-600'
        }`} />
      </div>
    </div>
  );
}
