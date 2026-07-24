'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import AutomationsList from '@/components/automations/AutomationsList';
import AutomationLogs from '@/components/automations/AutomationLogs';
import CreateAutomationModal from '@/components/automations/CreateAutomationModal';
import { useAutomations } from '@/hooks/useAutomations';
import { Plus } from 'lucide-react';

export default function AutomationsPage() {
  const router = useRouter();
  const {
    automations,
    logs,
    loading,
    error,
    createAutomation,
    updateAutomation,
    deleteAutomation,
    toggleAutomation,
    refetch,
  } = useAutomations();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'automations' | 'logs'>('automations');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/');
      return;
    }
  }, [router]);

  const stats = {
    total: automations.length,
    enabled: automations.filter((a) => a.enabled).length,
    executed: automations.reduce((sum, a) => sum + a.executedCount, 0),
    lastLog: logs.length > 0 ? logs[0].executedAt : null,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Automações</h1>
            <p className="mt-2 text-gray-600">
              Crie workflows automáticos para otimizar seu processo de vendas
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nova Automação
          </button>
        </div>

        {/* Erro */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg shadow p-4">
            <p className="text-red-800">⚠️ {error}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-xs text-gray-600 font-medium">Total</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-xs text-gray-600 font-medium">Ativadas</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{stats.enabled}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-xs text-gray-600 font-medium">Execuções</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{stats.executed}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-xs text-gray-600 font-medium">Última Execução</p>
            <p className="text-lg font-bold text-purple-600 mt-1">
              {stats.lastLog ? new Date(stats.lastLog).toLocaleTimeString('pt-BR') : 'Nenhuma'}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('automations')}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
              activeTab === 'automations'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Automações ({automations.length})
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
              activeTab === 'logs'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Logs ({logs.length})
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">Carregando automações...</p>
          </div>
        ) : activeTab === 'automations' ? (
          <AutomationsList
            automations={automations}
            onToggle={toggleAutomation}
            onDelete={deleteAutomation}
            onUpdate={updateAutomation}
          />
        ) : (
          <AutomationLogs logs={logs} />
        )}

        {/* Modal */}
        {isModalOpen && (
          <CreateAutomationModal
            onClose={() => setIsModalOpen(false)}
            onCreate={async (automation) => {
              await createAutomation(automation);
              setIsModalOpen(false);
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
