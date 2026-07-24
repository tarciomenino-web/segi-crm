'use client';

import { AutomationLog } from '@/hooks/useAutomations';

interface AutomationLogsProps {
  logs: AutomationLog[];
}

export default function AutomationLogs({ logs }: AutomationLogsProps) {
  if (logs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <p className="text-lg font-semibold text-gray-900">Nenhuma execução registrada</p>
        <p className="text-gray-600 mt-2">
          Seus logs apareceão aqui após as automações serem executadas
        </p>
      </div>
    );
  }

  // Agrupar logs por data
  const logsByDate = logs.reduce(
    (acc, log) => {
      const date = new Date(log.executedAt).toLocaleDateString('pt-BR');
      if (!acc[date]) acc[date] = [];
      acc[date].push(log);
      return acc;
    },
    {} as Record<string, AutomationLog[]>
  );

  const sortedDates = Object.keys(logsByDate).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow p-6 border border-blue-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-gray-600">Total de Logs</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{logs.length}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Sucessos</p>
            <p className="text-3xl font-bold text-green-600 mt-1">
              {logs.filter((l) => l.actions.every((a) => a.status === 'success')).length}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Falhas</p>
            <p className="text-3xl font-bold text-red-600 mt-1">
              {logs.filter((l) => l.actions.some((a) => a.status === 'failed')).length}
            </p>
          </div>
        </div>
      </div>

      {/* Logs by Date */}
      <div className="space-y-6">
        {sortedDates.map((date) => (
          <div key={date}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{date}</h3>
            <div className="space-y-2">
              {logsByDate[date].map((log) => {
                const allSuccess = log.actions.every((a) => a.status === 'success');
                const time = new Date(log.executedAt).toLocaleTimeString('pt-BR');

                return (
                  <div
                    key={log.id}
                    className={`rounded-lg p-4 border-l-4 ${
                      allSuccess
                        ? 'bg-green-50 border-l-green-500'
                        : 'bg-red-50 border-l-red-500'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">
                          Automação: {log.automationId}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          <span className="font-mono">{log.triggerId}</span> • {time} •{' '}
                          <span className="font-semibold">{log.duration}ms</span>
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          allSuccess
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {allSuccess ? '✓ Sucesso' : '✕ Falha'}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="mt-3 space-y-1">
                      {log.actions.map((action, idx) => (
                        <div
                          key={idx}
                          className={`text-xs p-2 rounded ${
                            action.status === 'success'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          <span className="font-semibold">{action.type}</span>: {action.message}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
