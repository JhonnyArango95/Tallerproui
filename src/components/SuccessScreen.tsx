import { Button } from './ui/button';
import { Check } from 'lucide-react';

interface SuccessScreenProps {
  onBackToHome: () => void;
  type: 'reschedule' | 'cancel';
  details: {
    date?: string;
    location?: string;
  };
}

export function SuccessScreen({ onBackToHome, type, details }: SuccessScreenProps) {
  const isReschedule = type === 'reschedule';

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <div className="bg-[#1e293b] text-white py-6 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button
            onClick={onBackToHome}
            variant="ghost"
            className="text-white hover:bg-[#2d3b4f] px-4"
          >
            ← Volver
          </Button>
          <h1 className="flex-1 text-center">3 ¡Gracias!</h1>
          <div className="w-24"></div>
        </div>
      </div>

      {/* Success Content */}
      <div className="max-w-3xl mx-auto px-8 py-16">
        <div className="bg-white rounded-lg shadow-sm p-12 text-center space-y-6">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-[#22c55e] flex items-center justify-center">
              <Check className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Success Message */}
          <h2 className="text-gray-900">
            {isReschedule
              ? '¡Tu cita ha sido reagendada con éxito!'
              : '¡Tu cita ha sido anulada con éxito!'}
          </h2>

          {/* Details */}
          {isReschedule && details.date && details.location && (
            <div className="text-[#c17a2e]">
              <p>
                Hemos eliminado correctamente tu cita agendada para:{' '}
                <span className="text-gray-900">{details.date}</span> en{' '}
                <span className="text-gray-900">{details.location}</span>.
              </p>
            </div>
          )}

          {!isReschedule && details.date && details.location && (
            <div className="text-[#c17a2e]">
              <p>
                Hemos eliminado correctamente tu cita agendada para:{' '}
                <span className="text-gray-900">{details.date}</span> en{' '}
                <span className="text-gray-900">{details.location}</span>.
              </p>
            </div>
          )}

          {/* Additional Info */}
          <div className="pt-4">
            <p className="text-gray-700 mb-2">
              Si deseas agendar una nueva cita puedes hacerlo en:
            </p>
            <p className="text-[#c17a2e]">Agendar servicio.</p>
          </div>

          {/* Button */}
          <div className="pt-6">
            <Button
              onClick={onBackToHome}
              className="bg-[#f59e0b] hover:bg-[#d97706] text-white px-12"
            >
              VOLVER AL HOME
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
