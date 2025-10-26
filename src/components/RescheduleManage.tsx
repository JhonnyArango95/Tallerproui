import { Button } from './ui/button';
import { Label } from './ui/label';
import { AlertCircle } from 'lucide-react';

interface RescheduleManageProps {
  onBack: () => void;
  onReschedule: () => void;
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

export function RescheduleManage({
  onBack,
  onReschedule,
  onCancel,
  onNewSearch,
  appointmentData,
}: RescheduleManageProps) {
  const handleReschedule = () => {
    console.log('Reagendando cita:', appointmentData);
    onReschedule();
  };

  const handleCancel = () => {
    const confirmCancel = window.confirm(
      '¿Estás seguro que deseas anular esta cita?\n\nEsta acción no se puede deshacer.'
    );
    
    if (confirmCancel) {
      console.log('Anulando cita:', appointmentData);
      onCancel();
    }
  };

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
              Revisa los detalles de tu cita y elige si deseas reagendarla o anularla. Solo podrás realizar acciones si la cita está programada.
            </p>

            <div className="bg-[#fff8f0] rounded-lg p-6">
              <p className="text-sm text-gray-700">
                <span className="text-gray-900">Nota:</span>{' '}
                <span className="text-[#c17a2e]">
                  "Intentaremos el mismo local por defecto al reagendar."
                </span>
              </p>
            </div>
          </div>

          {/* Right Section - Appointment Details */}
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <div className="space-y-6">
              {/* Appointment Information */}
              <div className="space-y-4">
                <div>
                  <Label className="text-[#c17a2e] block mb-2">Local</Label>
                  <p className="text-gray-900">{appointmentData.location}</p>
                </div>

                <div>
                  <Label className="text-[#c17a2e] block mb-2">Día y hora de cita</Label>
                  <p className="text-gray-900">{appointmentData.date}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <Button
                  onClick={handleReschedule}
                  className="w-full bg-[#f59e0b] hover:bg-[#d97706] text-white"
                >
                  REAGENDAR CITA
                </Button>

                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  ANULAR CITA
                </Button>
              </div>

              {/* New Search Link */}
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={onNewSearch}
                  className="text-sm text-gray-600 underline hover:text-gray-800 w-full text-center"
                >
                  Realizar nueva búsqueda
                </button>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Si otra persona modificó esta cita, te avisaremos: "La cita cambió recientemente. Actualiza e intenta de nuevo".
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
