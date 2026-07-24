'use client';

import { WebhookLog } from '@/hooks/useWebhookConfig';

interface WebhookLogsProps {
  logs: WebhookLog[];
}

export default function WebhookLogs({ logs }: WebhookLogsProps) {
  if (logs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <p className="text-lg font-semibold text-gray-900">Nenhum webhook recebido</p>
        <p className="text-gray-600 mt-2">
          Seus logs apareceão aqui conforme webhooks forem recebidos
        </p>
      </div>
    );
  }

  const successCount = logs.filter((l) => l.status === 'success').length;
  const failureCount = logs.filter((l) => l.status === 'failed').length;
  const pendingCount = logs.filter((l) => l.status === 'pending').length;

  const sortedLogs = [...logs].sort(
    (a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()
  );

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-xs text-gray-600 font-medium">Total</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{logs.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-xs text-gray-600 font-medium">Sucessos</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{successCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-xs text-gray-600 font-medium">Falhas</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{failureCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-xs text-gray-600 font-medium">Pendentes</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">{pendingCount}</p>
        </div>
      </div>

      {/* Taxa de Sucesso */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Taxa de Sucesso</h2>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="bg-green-600 h-4 rounded-full transition-all"
            style={{ width: `${(successCount / logs.length) * 100}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {((successCount / logs.length) * 100).toFixed(1)}% ({successCount} / {logs.length})
        </p>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Data/Hora</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Lead ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Resposta</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tempo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedLogs.map((log) => {
                const receivedDate = new Date(log.receivedAt);
                const processedDate = log.processedAt ? new Date(log.processedAt) : null;
                const duration = processedDate
                  ? processedDate.getTime() - receivedDate.getTime()
                  : null;

                return (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {receivedDate.toLocaleString('pt-BR')}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                          log.status === 'success'
                            ? 'bg-green-100 text-green-700'
                            : log.status === 'failed'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {log.status === 'success'
                          ? '✓'
                          : log.status === 'failed'
                            ? '✕'
                            : '⏳'}
                        {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-900">
                      {log.leadId ? (
                        <a href={`/dashboard/leads/${log.leadId}`} className="text-blue-600 hover:underline">
                          {log.leadId}
                        </a>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                      {log.response}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {duration ? `${duration}ms` : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payload Example */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Exemplo de Payload</h2>
        <div className="bg-gray-50 rounded-lg p-4 font-mono text-xs overflow-x-auto">
          <pre>{JSON.stringify(
            {
              entry: [
                {
                  id: 'page-id',
                  time: 1690000000,
                  messaging: [
                    {
                      sender: { id: 'lead-id' },
                      recipient: { id: 'page-id' },
                      timestamp: 1690000000000,
                      message: {
                        mid: 'message-id',
                        text: 'Olá, estou interessado',
                      },
                    },
                  ],
                },
              ],
            },
            null,
            2
          )}</pre>
        </div>
      </div>
    </div>
  );
}
