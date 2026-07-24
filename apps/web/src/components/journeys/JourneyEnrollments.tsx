'use client';

import { JourneyEnrollment } from '@/hooks/useJourneys';

interface JourneyEnrollmentsProps {
  enrollments: JourneyEnrollment[];
  onEnrollLead: (journeyId: string, leadId: string) => Promise<void>;
}

export default function JourneyEnrollments({
  enrollments,
}: JourneyEnrollmentsProps) {
  if (enrollments.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <p className="text-lg font-semibold text-gray-900">Nenhum lead inscrito</p>
        <p className="text-gray-600 mt-2">
          Leads aparecerão aqui conforme forem inscritos nas jornadas
        </p>
      </div>
    );
  }

  const activeEnrollments = enrollments.filter((e) => e.status === 'active').length;
  const completedEnrollments = enrollments.filter((e) => e.status === 'completed').length;
  const abandonedEnrollments = enrollments.filter((e) => e.status === 'abandoned').length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-xs text-gray-600 font-medium">Total</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{enrollments.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-xs text-gray-600 font-medium">Em Progresso</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{activeEnrollments}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-xs text-gray-600 font-medium">Completos</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{completedEnrollments}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-xs text-gray-600 font-medium">Abandonados</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{abandonedEnrollments}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Lead</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Jornada</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Etapa</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Inscrito em</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {enrollments.map((enrollment) => (
                <tr key={enrollment.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {enrollment.leadName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {enrollment.journeyId}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${(enrollment.currentStage / 5) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Etapa {enrollment.currentStage + 1}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                        enrollment.status === 'active'
                          ? 'bg-blue-100 text-blue-700'
                          : enrollment.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {enrollment.status === 'active'
                        ? '⏳ Em Progresso'
                        : enrollment.status === 'completed'
                          ? '✓ Completo'
                          : '✕ Abandonado'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(enrollment.enrolledAt).toLocaleString('pt-BR')}
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
