'use client';

import { Search } from 'lucide-react';

interface LeadsFiltersProps {
  filters: {
    search: string;
    temperature: string;
    source: string;
    sortBy: 'newest' | 'score' | 'contact';
  };
  onFilterChange: (filters: Partial<typeof filters>) => void;
}

export default function LeadsFilters({ filters, onFilterChange }: LeadsFiltersProps) {
  const temperatureOptions = [
    { value: '', label: 'Todas' },
    { value: 'hot', label: '🔥 Quente' },
    { value: 'warm', label: '⚠️ Morna' },
    { value: 'cold', label: '❄️ Fria' },
  ];

  const sourceOptions = [
    { value: '', label: 'Todas' },
    { value: 'Meta Ads', label: 'Meta Ads' },
    { value: 'Site', label: 'Site' },
    { value: 'WhatsApp', label: 'WhatsApp' },
    { value: 'Indicação', label: 'Indicação' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Mais Recentes' },
    { value: 'score', label: 'Por Score' },
    { value: 'contact', label: 'Último Contato' },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      {/* Search */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Nome, email ou telefone..."
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Filtros em Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Temperatura */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Temperatura</label>
          <select
            value={filters.temperature}
            onChange={(e) => onFilterChange({ temperature: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {temperatureOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Origem */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Origem</label>
          <select
            value={filters.source}
            onChange={(e) => onFilterChange({ source: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {sourceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Ordenar */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ordenar</label>
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Botão Limpar Filtros */}
      {(filters.search || filters.temperature || filters.source) && (
        <button
          onClick={() =>
            onFilterChange({ search: '', temperature: '', source: '' })
          }
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          ✕ Limpar filtros
        </button>
      )}
    </div>
  );
}
