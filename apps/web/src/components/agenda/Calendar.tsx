'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Agendamento } from '@/app/dashboard/agenda/page';

interface CalendarProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  agendamentos: Agendamento[];
}

export default function Calendar({
  selectedDate,
  onSelectDate,
  agendamentos,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getAgendamentosCount = (date: string) => {
    return agendamentos.filter((a) => a.date === date).length;
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = [];
  const months = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];

  // Preencher dias em branco antes do primeiro dia do mês
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Adicionar dias do mês
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="bg-blue-600 text-white px-6 py-4 rounded-t-lg">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            className="p-1 hover:bg-blue-700 rounded"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="font-semibold text-lg">
            {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h2>
          <button
            onClick={nextMonth}
            className="p-1 hover:bg-blue-700 rounded"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-1 px-4 py-2 bg-gray-50 border-b">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map((day) => (
          <div key={day} className="text-center text-xs font-semibold text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1 p-4">
        {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const dateStr = `${currentMonth.getFullYear()}-${String(
            currentMonth.getMonth() + 1
          ).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

          const count = getAgendamentosCount(dateStr);
          const isSelected = selectedDate === dateStr;
          const isToday =
            dateStr ===
            new Date().toISOString().split('T')[0];

          return (
            <button
              key={day}
              onClick={() => onSelectDate(dateStr)}
              className={`aspect-square rounded-lg text-sm font-medium transition-all relative ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-md'
                  : isToday
                    ? 'bg-yellow-100 text-gray-900 border border-yellow-400'
                    : count > 0
                      ? 'bg-blue-50 text-gray-900 border border-blue-200 hover:bg-blue-100'
                      : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <span>{day}</span>
                {count > 0 && (
                  <span
                    className={`text-xs mt-0.5 px-1.5 rounded-full font-semibold ${
                      isSelected
                        ? 'bg-white text-blue-600'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="px-6 py-4 border-t border-gray-200 space-y-2">
        <p className="text-xs font-semibold text-gray-700 mb-2">Legenda:</p>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-100 border border-yellow-400 rounded"></div>
            <span className="text-gray-600">Hoje</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-50 border border-blue-200 rounded"></div>
            <span className="text-gray-600">Com agendamentos</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-600 rounded"></div>
            <span className="text-gray-600">Data selecionada</span>
          </div>
        </div>
      </div>
    </div>
  );
}
