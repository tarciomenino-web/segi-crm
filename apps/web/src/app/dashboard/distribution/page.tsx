'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import DistributionStats from '@/components/distribution/DistributionStats';
import SDRsList from '@/components/distribution/SDRsList';
import DistributionControls from '@/components/distribution/DistributionControls';
import { useLeadDistribution } from '@/hooks/useLeadDistribution';

export default function DistributionPage() {
  const router = useRouter();
  const { sdrs, stats, loading, error, distributeLeads, assignLeadToSDR, refetch } =
    useLeadDistribution();
  const [selectedStrategy, setSelectedStrategy] = useState('round_robin');
  const [leadsToDistribute, setLeadsToDistribute] = useState(5);
  const [isDistributing, setIsDistributing] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/');
      return;
    }
  }, [router]);

  const handleDistribute = async () => {
    try {
      setIsDistributing(true);
      await distributeLeads(selectedStrategy, leadsToDistribute);
    } finally {
      setIsDistributing(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Distribuição de Leads</h1>
          <p className="mt-2 text-gray-600">
            Gerencie a distribuição automática de leads entre SDRs
          </p>
        </div>

        {/* Erro */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg shadow p-4">
            <p className="text-red-800">⚠️ {error}</p>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">Carregando dados de distribuição...</p>
          </div>
        ) : (
          <>
            {/* Stats */}
            {stats && <DistributionStats stats={stats} />}

            {/* Controles */}
            <DistributionControls
              selectedStrategy={selectedStrategy}
              onStrategyChange={setSelectedStrategy}
              leadsToDistribute={leadsToDistribute}
              onLeadsChange={setLeadsToDistribute}
              onDistribute={handleDistribute}
              isLoading={isDistributing}
              pendingLeads={stats?.pendingLeads || 0}
            />

            {/* SDRs */}
            <SDRsList sdrs={sdrs} onAssign={assignLeadToSDR} />
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
