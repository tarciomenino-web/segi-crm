interface DashboardData {
  leads: {
    total: number;
    today: number;
    hot: number;
    warm: number;
    cold: number;
  };
  opportunities: {
    total: number;
    inProgress: number;
    value: number;
  };
  activities: {
    contacts: number;
    qualifications: number;
    agendamentos: number;
  };
  funnel: {
    leads: number;
    contacted: number;
    qualified: number;
    scheduled: number;
    attended: number;
    closed: number;
  };
}

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  trend?: number;
}

function MetricCard({ title, value, icon, color, trend }: MetricCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {trend !== undefined && (
            <p className={`text-sm mt-2 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% vs ontem
            </p>
          )}
        </div>
        <div className={`${color} p-4 rounded-lg text-2xl`}>{icon}</div>
      </div>
    </div>
  );
}

export default function MetricsGrid({ data }: { data: DashboardData }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Leads Totais"
        value={data.leads.total}
        icon="👥"
        color="bg-blue-100"
        trend={15}
      />
      <MetricCard
        title="Leads Hoje"
        value={data.leads.today}
        icon="⭐"
        color="bg-yellow-100"
        trend={8}
      />
      <MetricCard
        title="Oportunidades"
        value={data.opportunities.total}
        icon="🎯"
        color="bg-green-100"
        trend={5}
      />
      <MetricCard
        title="Valor em Negociação"
        value={`R$ ${(data.opportunities.value / 1000).toFixed(0)}k`}
        icon="💰"
        color="bg-purple-100"
        trend={12}
      />
    </div>
  );
}
