'use client';

import { SDR } from '@/hooks/useLeadDistribution';
import SDRCard from './SDRCard';

interface SDRsListProps {
  sdrs: SDR[];
  onAssign: (leadId: string, sdrId: string) => Promise<void>;
}

export default function SDRsList({ sdrs, onAssign }: SDRsListProps) {
  if (sdrs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-600">Nenhum SDR cadastrado</p>
      </div>
    );
  }

  // Ordenar por carga de trabalho
  const sortedSDRs = [...sdrs].sort((a, b) => {
    const loadA = a.leadsAssigned - a.leadsConverted;
    const loadB = b.leadsAssigned - b.leadsConverted;
    return loadA - loadB;
  });

  const totalLeads = sortedSDRs.reduce((sum, sdr) => sum + sdr.leadsAssigned, 0);
  const totalConverted = sortedSDRs.reduce((sum, sdr) => sum + sdr.leadsConverted, 0);
  const avgConversion = totalLeads > 0 ?
    ((totalConverted / totalLeads) * 100).toFixed(1) :
    '0';

  return (
    <div className="space-y-6">
      {/* Resumo Geral */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow p-6 border border-blue-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumo Geral de SDRs</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-600">Total de SDRs</p>
            <p className="text-3xl font-bold text-gray-900">{sdrs.length}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Ativos</p>
            <p className="text-3xl font-bold text-green-600">
              {sdrs.filter((s) => s.active).length}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Total Atribuído</p>
            <p className="text-3xl font-bold text-blue-600">{totalLeads}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Taxa Conversão Geral</p>
            <p className="text-3xl font-bold text-purple-600">{avgConversion}%</p>
          </div>
        </div>
      </div>

      {/* SDRs Grid */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance por SDR</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedSDRs.map((sdr) => (
            <SDRCard key={sdr.id} sdr={sdr} />
          ))}
        </div>
      </div>

      {/* Tabela Detalhada */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-900">Detalhamento</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Nome</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Atribuído</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Convertido</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Taxa</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Score Médio</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedSDRs.map((sdr) => (
                <tr key={sdr.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{sdr.name}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{sdr.email}</td>
                  <td className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    {sdr.leadsAssigned}
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-semibold text-green-600">
                    {sdr.leadsConverted}
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-semibold text-blue-600">
                    {sdr.conversionRate.toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${Math.min(sdr.avgLeadScore, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {sdr.avgLeadScore.toFixed(0)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                        sdr.active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${sdr.active ? 'bg-green-600' : 'bg-gray-600'}`}></span>
                      {sdr.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
