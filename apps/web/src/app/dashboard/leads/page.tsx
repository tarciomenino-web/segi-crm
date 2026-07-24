'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import LeadsFilters from '@/components/leads/LeadsFilters';
import LeadsTable from '@/components/leads/LeadsTable';

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
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
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

    fetchLeads(token);
  }, [router]);

  const fetchLeads = async (token: string) => {
    try {
      setLoading(true);

      // Mock data para desenvolvimento
      const mockLeads: Lead[] = [
        {
          id: 'lead-1',
          fullName: 'João Silva',
          email: 'joao@example.com',
          phone: '(21) 98765-4321',
          temperature: 'hot',
          leadScore: 85,
          source: 'Meta Ads',
          createdAt: '2026-07-23',
          lastContact: '2026-07-23 14:30',
        },
        {
          id: 'lead-2',
          fullName: 'Maria Santos',
          email: 'maria@example.com',
          phone: '(21) 99876-5432',
          temperature: 'warm',
          leadScore: 65,
          source: 'Site',
          createdAt: '2026-07-22',
          lastContact: '2026-07-22 10:15',
        },
        {
          id: 'lead-3',
          fullName: 'Pedro Oliveira',
          email: 'pedro@example.com',
          phone: '(21) 91234-5678',
          temperature: 'cold',
          leadScore: 35,
          source: 'WhatsApp',
          createdAt: '2026-07-21',
          lastContact: '2026-07-19 09:00',
        },
        {
          id: 'lead-4',
          fullName: 'Ana Costa',
          email: 'ana@example.com',
          phone: '(21) 97654-3210',
          temperature: 'hot',
          leadScore: 90,
          source: 'Meta Ads',
          createdAt: '2026-07-23',
          lastContact: '2026-07-23 16:45',
        },
        {
          id: 'lead-5',
          fullName: 'Carlos Mendes',
          email: 'carlos@example.com',
          phone: '(21) 98765-1234',
          temperature: 'warm',
          leadScore: 55,
          source: 'Indicação',
          createdAt: '2026-07-20',
          lastContact: '2026-07-20 13:20',
        },
      ];

      setLeads(mockLeads);
      applyFilters(mockLeads, filters);
    } catch (error) {
      console.error('Erro ao carregar leads:', error);
    } finally {
      setLoading(false);
    }
  };

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
