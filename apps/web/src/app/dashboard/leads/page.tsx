'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import LeadsFilters from '@/components/leads/LeadsFilters';
import LeadsTable from '@/components/leads/LeadsTable';
import { useLeads } from '@/hooks/useLeads';

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

interface FilterState {
  search: string;
  temperature: string;
  source: string;
  sortBy: 'newest' | 'score' | 'contact';
}

export default function LeadsPage() {
  const router = useRouter();
  const { leads: apiLeads, loading, error } = useLeads();
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    temperature: '',
    source: '',
    sortBy: 'newest',
  });

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/');
      return;
    }
  }, [router]);

  useEffect(() => {
    applyFilters(apiLeads, filters);
  }, [apiLeads, filters]);

  const applyFilters = (data: Lead[], filterState: FilterState) => {
    let result = data;

    // Filtro de busca
    if (filterState.search) {
      result = result.filter(
        (lead) =>
          lead.fullName.toLowerCase().includes(filterState.search.toLowerCase()) ||
          lead.email.toLowerCase().includes(filterState.search.toLowerCase()) ||
          lead.phone.includes(filterState.search)
      );
    }

    // Filtro de temperatura
    if (filterState.temperature) {
      result = result.filter((lead) => lead.temperature === filterState.temperature);
    }

    // Filtro de origem
    if (filterState.source) {
      result = result.filter((lead) => lead.source === filterState.source);
    }

    // Sorting
    result.sort((a, b) => {
      switch (filterState.sortBy) {
        case 'score':
          return b.leadScore - a.leadScore;
        case 'contact':
          return new Date(b.lastContact).getTime() - new Date(a.lastContact).getTime();
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    setFilteredLeads(result);
    setPage(1);
  };

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    applyFilters(leads, updated);
  };

  // Paginar dados
  const paginatedLeads = filteredLeads.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
          <p className="mt-2 text-gray-600">
            Total: {filteredLeads.length} leads ({leads.length} no banco)
          </p>
        </div>

        {/* Filtros */}
        <LeadsFilters filters={filters} onFilterChange={handleFilterChange} />

        {/* Erro */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg shadow p-4">
            <p className="text-red-800">⚠️ {error}</p>
          </div>
        )}

        {/* Tabela */}
        {loading ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">Carregando leads...</p>
          </div>
        ) : (
          <>
            <LeadsTable leads={paginatedLeads} />

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="bg-white rounded-lg shadow px-6 py-4 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Página {page} de {totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                  >
                    ← Anterior
                  </button>
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                  >
                    Próxima →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
