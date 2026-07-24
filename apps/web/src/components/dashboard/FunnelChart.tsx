interface FunnelData {
  leads: number;
  contacted: number;
  qualified: number;
  scheduled: number;
  attended: number;
  closed: number;
}

export default function FunnelChart({ data }: { data: FunnelData }) {
  const stages = [
    { label: 'Leads', value: data.leads, color: 'bg-blue-500' },
    { label: 'Contatados', value: data.contacted, color: 'bg-blue-600' },
    { label: 'Qualificados', value: data.qualified, color: 'bg-blue-700' },
    { label: 'Agendados', value: data.scheduled, color: 'bg-blue-800' },
    { label: 'Compareceram', value: data.attended, color: 'bg-blue-900' },
    { label: 'Fechados', value: data.closed, color: 'bg-blue-950' },
  ];

  const maxValue = Math.max(...stages.map((s) => s.value));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Funil de Vendas</h2>

      <div className="space-y-4">
        {stages.map((stage, index) => {
          const percentage = (stage.value / maxValue) * 100;
          const conversion =
            index > 0
              ? (((stage.value / stages[index - 1].value) * 100).toFixed(1) as unknown as string)
              : null;

          return (
            <div key={stage.label}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{stage.label}</span>
                <span className="text-sm text-gray-600">
                  {stage.value} {conversion && `(${conversion}%)`}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-8 flex items-center">
                <div
                  className={`h-8 rounded-full flex items-center justify-end pr-3 transition-all ${stage.color}`}
                  style={{ width: `${percentage}%` }}
                >
                  {percentage > 15 && <span className="text-white text-xs font-semibold">{Math.round(percentage)}%</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-600">Taxa de Conversão Geral</p>
            <p className="text-2xl font-bold text-gray-900">
              {((data.closed / data.leads) * 100).toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Etapa Crítica</p>
            <p className="text-2xl font-bold text-orange-600">
              {(((data.attended - data.closed) / data.attended) * 100).toFixed(0)}% perdidos pós-consultoria
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
