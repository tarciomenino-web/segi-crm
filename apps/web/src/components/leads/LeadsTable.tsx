'use client';

import { ExternalLink } from 'lucide-react';

interface Lead {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  temperature: 'hot' | 'warm' | 'cold';
  leadScore: number;
  source: string;
  createdAt: string;
  lastContact: string;
}

interface LeadsTableProps {
  leads: Lead[];
}

const temperatureIcons = {
  hot: '🔥',
  warm: '⚠️',
  cold: '❄️',
};

const temperatureLabels = {
  hot: 'Quente',
  warm: 'Morna',
  cold: 'Fria',
};

export default function LeadsTable({ leads }: LeadsTableProps) {
  if (leads.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-600">Nenhum lead encontrado com os filtros selecionados.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Nome</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Contato</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Temperatura</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Score</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Origem</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Último Contato</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {leads.map((lead) => (
              <tr
                key={lead.id}
                className="hover:bg-gray-50 transition-colors"
              >
                {/* Nome */}
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-gray-900">{lead.fullName}</p>
                    <p className="text-xs text-gray-500">ID: {lead.id}</p>
                  </div>
                </td>

                {/* Email e Telefone */}
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <p className="text-gray-900">{lead.email}</p>
                    <p className="text-gray-600">{lead.phone}</p>
                  </div>
                </td>

                {/* Temperatura */}
                <td className="px-6 py-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100">
                    <span className="text-lg">{temperatureIcons[lead.temperature]}</span>
                    <span className="text-sm font-medium text-gray-700">
                      {temperatureLabels[lead.temperature]}
                    </span>
                  </div>
                </td>

                {/* Score */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${lead.leadScore}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{lead.leadScore}</span>
                  </div>
                </td>

                {/* Origem */}
                <td className="px-6 py-4">
                  <span className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-blue-50 text-blue-700">
                    {lead.source}
                  </span>
                </td>

                {/* Último Contato */}
                <td className="px-6 py-4 text-sm text-gray-600">
                  {lead.lastContact}
                </td>

                {/* Ações */}
                <td className="px-6 py-4">
                  <button className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm">
                    <ExternalLink className="w-4 h-4" />
                    Ver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
