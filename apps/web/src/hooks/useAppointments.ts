import { useState, useEffect } from 'react';

interface Appointment {
  id: string;
  title: string;
  leadName: string;
  leadEmail: string;
  leadPhone: string;
  startTime: string;
  endTime: string;
  date: string;
  type: 'consultation' | 'call' | 'demo' | 'meeting';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  notes: string;
}

interface UseAppointmentsReturn {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
  updateStatus: (appointmentId: string, status: string) => Promise<void>;
  refetch: () => Promise<void>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export function useAppointments(): UseAppointmentsReturn {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Token não encontrado');
      }

      const response = await fetch(`${API_URL}/api/appointments`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('accessToken');
          throw new Error('Sessão expirada');
        }
        throw new Error('Erro ao carregar agendamentos');
      }

      const data = await response.json();
      setAppointments(data.data || data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(message);
      console.error('Erro ao buscar agendamentos:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (appointmentId: string, status: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Token não encontrado');
      }

      const response = await fetch(
        `${API_URL}/api/appointments/${appointmentId}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao atualizar agendamento');
      }

      // Atualizar state local
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === appointmentId
            ? { ...apt, status: status as any }
            : apt
        )
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(message);
      console.error('Erro ao atualizar agendamento:', err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return {
    appointments,
    loading,
    error,
    updateStatus,
    refetch: fetchAppointments,
  };
}
