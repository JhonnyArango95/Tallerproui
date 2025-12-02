import { Check, MapPin } from 'lucide-react';
import { Button } from './ui/button';

interface ConfirmationScreenProps {
  onBackToHome: () => void;
  userData: {
    documentType: string;
    documentNumber: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  vehicleData: {
    vehicleType: string;
    plate: string;
    year: string;
    brand: string;
    model: string;
    version: string;
    service: string;
  };
  appointmentData: {
    location: string;
    date: string;
    time: string;
  };
}

export function ConfirmationScreen({
  onBackToHome,
  userData,
  vehicleData,
  appointmentData,
}: ConfirmationScreenProps) {
  // Mapeo de servicios
  const serviceLabels: Record<string, string> = {
    preventivo: 'Preventivo',
    correctivo: 'Correctivo',
    carroceria: 'Carrocería y Pintura',
    repuestos: 'Repuestos y Accesorios',
  };

  // Mapeo de marcas
  const brandLabels: Record<string, string> = {
    nissan: 'Nissan',
    honda: 'Honda',
    chevrolet: 'Chevrolet',
    subaru: 'Subaru',
    toyota: 'Toyota',
    hyundai: 'Hyundai',
    renault: 'Renault',
    kia: 'KIA',
  };

  // Mapeo de modelos
  const modelLabels: Record<string, string> = {
    versa: 'Versa',
    sentra: 'Sentra',
    kicks: 'Kicks',
    xtrail: 'X-Trail',
    civic: 'Civic',
    accord: 'Accord',
    crv: 'CR-V',
    hrv: 'HR-V',
    corolla: 'Corolla',
    yaris: 'Yaris',
    rav4: 'RAV4',
    hilux: 'Hilux',
    spark: 'Spark',
    sail: 'Sail',
    cruze: 'Cruze',
    tracker: 'Tracker',
    accent: 'Accent',
    elantra: 'Elantra',
    tucson: 'Tucson',
    santafe: 'Santa Fe',
  };

  const serviceName = serviceLabels[vehicleData.service] || vehicleData.service;
  const brandName = brandLabels[vehicleData.brand] || vehicleData.brandName || vehicleData.brand;
  const modelName = modelLabels[vehicleData.model] || vehicleData.modelName || vehicleData.model;

  // Datos mock del local (en producción vendrían del backend)
  const locationDetails = {
    name: 'Autoland Nissan | San Miguel',
    address: 'Av. La Marina 2201, San Miguel (Lima)',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Av.+La+Marina+2201+San+Miguel+Lima',
    wazeUrl: 'https://waze.com/ul?q=Av.+La+Marina+2201+San+Miguel+Lima',
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <div className="bg-[#1e293b] text-white py-6 px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-center">3 Confirmación</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-8">
        {/* Main Content */}
        <div className="bg-white rounded-lg p-8 shadow-sm">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-[#f59e0b] flex items-center justify-center">
              <Check className="w-8 h-8 text-white" strokeWidth={3} />
            </div>
          </div>

          {/* Success Message */}
          <h2 className="text-center text-gray-900 mb-2">
            ¡Tu cita ha sido agendada con éxito!
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Te hemos enviado un correo con los detalles de tu cita
          </p>

          {/* Appointment Details */}
          <div className="mb-8">
            <h3 className="mb-4 text-gray-900">Servicio Técnico Agendado</h3>
            
            <div className="space-y-3">
              <div className="flex">
                <span className="text-gray-500 w-32">Servicio</span>
                <span className="text-gray-900">{serviceName}</span>
              </div>

              <div className="flex">
                <span className="text-gray-500 w-32">Fecha</span>
                <span className="text-gray-900">{appointmentData.date}</span>
              </div>

              <div className="flex">
                <span className="text-gray-500 w-32">Hora</span>
                <span className="text-gray-900">{appointmentData.time}</span>
              </div>

              <div className="flex">
                <span className="text-gray-500 w-32">Local</span>
                <span className="text-gray-900">{locationDetails.name}</span>
              </div>

              <div className="flex">
                <span className="text-gray-500 w-32">Dirección</span>
                <span className="text-gray-900">{locationDetails.address}</span>
              </div>

              <div className="flex">
                <span className="text-gray-500 w-32">Google Maps</span>
                <a
                  href={locationDetails.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1e40af] underline hover:text-[#1e3a8a]"
                >
                  Ver mapa
                </a>
              </div>

              <div className="flex">
                <span className="text-gray-500 w-32">Waze</span>
                <a
                  href={locationDetails.wazeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1e40af] underline hover:text-[#1e3a8a]"
                >
                  Abrir con Waze
                </a>
              </div>
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="mb-8">
            <h3 className="mb-4 text-gray-900">Auto Agendado</h3>
            
            <div className="space-y-3">
              <div className="flex">
                <span className="text-gray-500 w-32">Placa</span>
                <span className="text-gray-900">{vehicleData.plate}</span>
              </div>

              <div className="flex">
                <span className="text-gray-500 w-32">Marca</span>
                <span className="text-gray-900">{brandName}</span>
              </div>

              <div className="flex">
                <span className="text-gray-500 w-32">Modelo</span>
                <span className="text-gray-900">{modelName}</span>
              </div>

              <div className="flex">
                <span className="text-gray-500 w-32">Año</span>
                <span className="text-gray-900">{vehicleData.year}</span>
              </div>
            </div>
          </div>

          {/* Back to Home Button */}
          <div className="flex justify-center">
            <Button
              onClick={onBackToHome}
              className="bg-[#f59e0b] hover:bg-[#d97706] text-white px-12"
            >
              Volver al home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}