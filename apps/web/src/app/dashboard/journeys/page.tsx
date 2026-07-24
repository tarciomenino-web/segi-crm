'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import JourneysList from '@/components/journeys/JourneysList';
import JourneyBuilder from '@/components/journeys/JourneyBuilder';
import JourneyEnrollments from '@/components/journeys/JourneyEnrollments';
import { useJourneys } from '@/hooks/useJourneys';
import { Plus } from 'lucide-react';

export default function JourneysPage() {
  const router = useRouter();
  const {
    journeys,
    enrollments,
    loading,
    error,
    createJourney,
    updateJourney,
    deleteJourney,
    toggleJourney,
    enrollLead,
  } = useJourneys();
  const [activeTab, setActiveTab] = useState<'journeys' | 'enrollments' | 'builder'>('journeys');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/');
      return;
    }
  }, [router]);

  const activeJourneys = journeys.filter((j) => j.isActive).length;
  const totalEnrollments = journeys.reduce((sum, j) => sum + j.enrolledLeads, 0);
  const avgConversion =
    journeys.length > 0
      ? (journeys.reduce((sum, j) => sum + j.avgConversion, 0) / journeys.length).toFixed(1)
      : '0';

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Jornadas</h1>
            <p className="mt-2 text-gray-600">
              Crie funis de vendas automáticos para seus leads
            </p>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nova Jornada
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
            <p className="text-2xl font-bold text-gray-900 mt-1">{journeys.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-xs text-gray-600 font-medium">Ativas</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{activeJourneys}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-xs text-gray-600 font-medium">Inscritos</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{totalEnrollments}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-xs text-gray-600 font-medium">Conv. Média</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">{avgConversion}%</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('journeys')}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
              activeTab === 'journeys'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Jornadas ({journeys.length})
          </button>
          <button
            onClick={() => setActiveTab('enrollments')}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
              activeTab === 'enrollments'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Inscritos ({enrollments.length})
          </button>
          <button
            onClick={() => setActiveTab('builder')}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
              activeTab === 'builder'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Construtor
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">Carregando jornadas...</p>
          </div>
        ) : activeTab === 'journeys' ? (
          <JourneysList
            journeys={journeys}
            isCreating={isCreating}
            onCreateJourney={createJourney}
            onUpdateJourney={updateJourney}
            onDeleteJourney={deleteJourney}
            onToggleJourney={toggleJourney}
            onCloseCreate={() => setIsCreating(false)}
          />
        ) : activeTab === 'enrollments' ? (
          <JourneyEnrollments enrollments={enrollments} onEnrollLead={enrollLead} />
        ) : (
          <JourneyBuilder onCreateJourney={createJourney} />
        )}
      </div>
    </DashboardLayout>
  );
}
