import { useState } from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

interface RescheduleAppointmentProps {
  onBack: () => void;
  onConfirm: (newDate: string, newTime: string) => void;
  onCancel: () => void;
  onNewSearch: () => void;
  appointmentData: {
    location: string;
    date: string;
    service: string;
    plate: string;
    documentNumber: string;
  };
}

// Mock data para horarios disponibles
const mockTimeSlots = [
  { time: '07:00', available: true },
  { time: '07:20', available: true },
  { time: '07:40', available: false },
  { time: '08:00', available: true },
  { time: '08:20', available: true },
  { time: '08:40', available: true },
  { time: '09:00', available: true },
  { time: '09:20', available: false },
  { time: '09:40', available: true },
  { time: '10:00', available: true },
];

export function RescheduleAppointment({
  onBack,
  onConfirm,
  onCancel,
  onNewSearch,
  appointmentData,
}: RescheduleAppointmentProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 9, 1)); // Octubre 2025
  const [selectedDate, setSelectedDate] = useState<number | null>(21);
  const [selectedTime, setSelectedTime] = useState<string | null>('07:00');
  const [activeTab, setActiveTab] = useState<'reschedule' | 'cancel'>('reschedule');

  const daysOfWeek = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  
  // Generar días del mes
  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days: (number | null)[] = [];
    
    // Ajustar para que lunes sea el primer día (0 = lunes, 6 = domingo)
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
    
    // Agregar días vacíos al inicio
    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push(null);
    }
    
    // Agregar días del mes
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  const handleDateSelect = (day: number) => {
    setSelectedDate(day);
    setSelectedTime(null); // Resetear hora seleccionada
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleConfirmReschedule = () => {
    if (selectedDate && selectedTime) {
      const monthName = currentMonth.toLocaleDateString('es-ES', { month: 'long' });
      const newDate = `${selectedDate} de ${monthName} de ${currentMonth.getFullYear()}`;
      onConfirm(newDate, selectedTime);
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const monthYear = currentMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <div className="bg-[#1e293b] text-white py-6 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-white hover:bg-[#2d3b4f] px-4"
          >
            ← Volver
          </Button>
          <h1 className="flex-1 text-center">2 Reagenda/Anula tu cita</h1>
          <div className="w-24"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Section - Information */}
          <div>
            <div className="bg-[#fff8f0] border-l-4 border-[#f59e0b] p-4 rounded mb-6">
              <div className="flex items-start gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-[#f59e0b] flex-shrink-0 mt-0.5" />
                <span className="text-gray-900">Paso 2</span>
              </div>
            </div>

            <h2 className="mb-4 text-gray-900">Reagenda tu servicio</h2>
            
            <p className="text-[#c17a2e] mb-6">
              Modifica el día, la hora de servicio en taller, además, también puedes anularla si lo deseas. Cuando hagas el nº documento con el cual agendaste el servicio y también la placa del vehículo.
            </p>

            <div className="bg-[#fff8f0] rounded-lg p-6">
              <p className="text-sm text-gray-700">
                <span className="text-gray-900">Nota:</span>{' '}
                <span className="text-[#c17a2e]">
                  mantendremos el mismo local por defecto al reagendar.
                </span>
              </p>
            </div>
          </div>

          {/* Right Section - Appointment Details and Calendar */}
          <div className="space-y-6">
            {/* Current Appointment Info */}
            <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
              <div>
                <Label className="text-[#c17a2e] block mb-2">Local</Label>
                <p className="text-gray-900">{appointmentData.location}</p>
              </div>

              <div>
                <Label className="text-[#c17a2e] block mb-2">Día y hora de cita</Label>
                <p className="text-gray-900">{appointmentData.date}</p>
              </div>

              {/* Tab Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={() => setActiveTab('reschedule')}
                  className={`flex-1 ${
                    activeTab === 'reschedule'
                      ? 'bg-[#f59e0b] hover:bg-[#d97706] text-white'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  REAGENDAR CITA
                </Button>

                <Button
                  onClick={onCancel}
                  className="flex-1 bg-gray-200 text-gray-600 hover:bg-gray-300"
                >
                  ANULAR CITA
                </Button>
              </div>
            </div>

            {/* Calendar and Time Selection */}
            {activeTab === 'reschedule' && (
              <>
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  {/* Calendar Header */}
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={handlePrevMonth}
                      className="p-2 hover:bg-gray-100 rounded"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <h3 className="text-gray-900 capitalize">{monthYear}</h3>
                    <button
                      onClick={handleNextMonth}
                      className="p-2 hover:bg-gray-100 rounded"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-2">
                    {/* Day Headers */}
                    {daysOfWeek.map((day, index) => (
                      <div
                        key={index}
                        className="text-center text-sm text-gray-600 py-2"
                      >
                        {day}
                      </div>
                    ))}

                    {/* Calendar Days */}
                    {getDaysInMonth().map((day, index) => (
                      <div key={index} className="aspect-square">
                        {day && (
                          <button
                            onClick={() => handleDateSelect(day)}
                            className={`w-full h-full flex items-center justify-center rounded-lg transition-colors ${
                              selectedDate === day
                                ? 'bg-[#f59e0b] text-white'
                                : 'hover:bg-gray-100 text-gray-900'
                            }`}
                          >
                            {day}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Time Slots */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="space-y-2">
                    {mockTimeSlots.map((slot) => (
                      <button
                        key={slot.time}
                        onClick={() => slot.available && handleTimeSelect(slot.time)}
                        disabled={!slot.available}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-colors ${
                          selectedTime === slot.time
                            ? 'border-[#f59e0b] bg-[#fff8f0]'
                            : slot.available
                            ? 'border-gray-200 hover:border-[#f59e0b] hover:bg-[#fff8f0]'
                            : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                        }`}
                      >
                        <span className={slot.available ? 'text-gray-900' : 'text-gray-400'}>
                          {slot.time}
                        </span>
                        <span
                          className={`text-xs ${
                            slot.available ? 'text-[#f59e0b]' : 'text-gray-400'
                          }`}
                        >
                          {slot.available ? 'Disponible' : 'Ocupado'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected Time Confirmation */}
                {selectedDate && selectedTime && (
                  <div className="bg-[#fff8f0] border-l-4 border-[#f59e0b] p-4 rounded">
                    <p className="text-gray-900 text-sm">
                      Has seleccionado el día <span className="font-medium">{selectedDate} de octubre</span> a las{' '}
                      <span className="font-medium">{selectedTime}hs</span>
                    </p>
                  </div>
                )}

                {/* Confirm Button */}
                <Button
                  onClick={handleConfirmReschedule}
                  disabled={!selectedDate || !selectedTime}
                  className="w-full bg-[#f59e0b] hover:bg-[#d97706] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  CONFIRMAR REAGENDA
                </Button>

                {/* New Search Link */}
                <div className="text-center">
                  <button
                    onClick={onNewSearch}
                    className="text-sm text-[#f59e0b] underline hover:text-[#d97706]"
                  >
                    REALIZAR NUEVA BÚSQUEDA
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
