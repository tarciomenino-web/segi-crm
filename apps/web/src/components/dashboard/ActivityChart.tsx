interface ActivityData {
  contacts: number;
  qualifications: number;
  agendamentos: number;
}

export default function ActivityChart({ data }: { data: ActivityData }) {
  const activities = [
    { label: 'Contatos Realizados', value: data.contacts, icon: '📞', color: 'bg-green-500' },
    { label: 'Qualificações', value: data.qualifications, icon: '✅', color: 'bg-blue-500' },
    { label: 'Agendamentos', value: data.agendamentos, icon: '📅', color: 'bg-purple-500' },
  ];

  const total = data.contacts + data.qualifications + data.agendamentos;
  const maxValue = Math.max(...activities.map((a) => a.value));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Atividades Esta Semana</h2>

      <div className="space-y-6">
        {activities.map((activity) => {
          const percentage = (activity.value / maxValue) * 100;
          const share = ((activity.value / total) * 100).toFixed(0);

          return (
            <div key={activity.label}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{activity.icon}</span>
                  <span className="text-sm font-medium text-gray-700">{activity.label}</span>
                </div>
                <span className="text-sm text-gray-600 font-semibold">{activity.value}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-6">
                <div
                  className={`h-6 rounded-full flex items-center justify-end pr-2 transition-all ${activity.color}`}
                  style={{ width: `${percentage}%` }}
                >
                  {percentage > 20 && (
                    <span className="text-white text-xs font-bold">{share}%</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
        <div className="text-center">
          <p className="text-xs text-gray-600">Total Atividades</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{total}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-600">Taxa Qualificação</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {((data.qualifications / data.contacts) * 100).toFixed(0)}%
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-600">Taxa Agendamento</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">
            {((data.agendamentos / data.qualifications) * 100).toFixed(0)}%
          </p>
        </div>
      </div>
    </div>
  );
}
