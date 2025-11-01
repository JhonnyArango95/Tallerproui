import { Button } from './ui/button';

interface CancelAppointmentConfirmationProps {
  onConfirm: () => void;
  onReschedule: () => void;
  appointmentData: {
    location: string;
    date: string;
    plate: string;
  };
}

export function CancelAppointmentConfirmation({
  onConfirm,
  onReschedule,
  appointmentData,
}: CancelAppointmentConfirmationProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
        <h3 className="text-gray-900 text-center">
          ¿Deseas anular la cita de servicio en taller?
        </h3>

        <div className="space-y-3 py-4">
          <div>
            <p className="text-sm text-gray-600">Placa:</p>
            <p className="text-gray-900">{appointmentData.plate}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Local:</p>
            <p className="text-gray-900">{appointmentData.location}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Día y hora de cita:</p>
            <p className="text-gray-900">{appointmentData.date}</p>
          </div>
        </div>

        <div className="bg-[#fff8f0] border-l-4 border-[#f59e0b] p-4 rounded">
          <p className="text-sm text-gray-700">
            Recuerda que puedes modificarla si necesitas cambiar de día o hora
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            onClick={onConfirm}
            variant="outline"
            className="flex-1 border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            ANULAR CITA
          </Button>

          <Button
            onClick={onReschedule}
            className="flex-1 bg-[#f59e0b] hover:bg-[#d97706] text-white"
          >
            REAGENDAR
          </Button>
        </div>
      </div>
    </div>
  );
}
