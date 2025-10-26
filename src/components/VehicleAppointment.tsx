import { useState } from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ChevronLeft, ChevronRight, Car, Truck } from 'lucide-react';
import { BrandLogos } from './BrandLogos';

interface VehicleAppointmentProps {
  onBack: () => void;
  onConfirm: (vehicleData: any, appointmentData: any) => void;
  userData: {
    documentType: string;
    documentNumber: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

export function VehicleAppointment({ onBack, onConfirm, userData }: VehicleAppointmentProps) {
  const [vehicleData, setVehicleData] = useState({
    vehicleType: '',
    plate: '',
    year: '',
    brand: '',
    model: '',
    version: '',
    service: '',
  });

  const [appointmentData, setAppointmentData] = useState({
    location: 'Av. Aviación 1003, La Victoria (Lima)',
    date: '',
    time: '',
  });

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 9)); // Octubre 2025
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const services = [
    { value: 'preventivo', label: 'Preventivo' },
    { value: 'correctivo', label: 'Correctivo' },
    { value: 'carroceria', label: 'Carrocería y Pintura' },
    { value: 'repuestos', label: 'Repuestos y Accesorios' },
  ];

  const years = Array.from({ length: 30 }, (_, i) => (new Date().getFullYear() - i).toString());

  const brands = [
    { value: 'nissan', label: 'Nissan' },
    { value: 'honda', label: 'Honda' },
    { value: 'chevrolet', label: 'Chevrolet' },
    { value: 'subaru', label: 'Subaru' },
    { value: 'toyota', label: 'Toyota' },
    { value: 'hyundai', label: 'Hyundai' },
    { value: 'renault', label: 'Renault' },
    { value: 'kia', label: 'KIA' },
  ];

  // Modelos según la marca (datos mock)
  const modelsByBrand: Record<string, { value: string; label: string }[]> = {
    nissan: [
      { value: 'versa', label: 'Versa' },
      { value: 'sentra', label: 'Sentra' },
      { value: 'kicks', label: 'Kicks' },
      { value: 'xtrail', label: 'X-Trail' },
    ],
    honda: [
      { value: 'civic', label: 'Civic' },
      { value: 'accord', label: 'Accord' },
      { value: 'crv', label: 'CR-V' },
      { value: 'hrv', label: 'HR-V' },
    ],
    toyota: [
      { value: 'corolla', label: 'Corolla' },
      { value: 'yaris', label: 'Yaris' },
      { value: 'rav4', label: 'RAV4' },
      { value: 'hilux', label: 'Hilux' },
    ],
    chevrolet: [
      { value: 'spark', label: 'Spark' },
      { value: 'sail', label: 'Sail' },
      { value: 'cruze', label: 'Cruze' },
      { value: 'tracker', label: 'Tracker' },
    ],
    hyundai: [
      { value: 'accent', label: 'Accent' },
      { value: 'elantra', label: 'Elantra' },
      { value: 'tucson', label: 'Tucson' },
      { value: 'santafe', label: 'Santa Fe' },
    ],
  };

  const availableModels = vehicleData.brand ? modelsByBrand[vehicleData.brand] || [] : [];

  const timeSlots = [
    { time: '07:00', available: true },
    { time: '07:20', available: true },
    { time: '07:40', available: false },
    { time: '08:00', available: true },
    { time: '08:20', available: true },
    { time: '08:40', available: true },
    { time: '09:00', available: true },
    { time: '09:20', available: false },
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const handleDateSelect = (day: number) => {
    const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(selected);
    setAppointmentData((prev) => ({
      ...prev,
      date: selected.toLocaleDateString('es-PE'),
    }));
  };

  const handleTimeSelect = (time: string) => {
    setAppointmentData((prev) => ({
      ...prev,
      time,
    }));
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleConfirm = () => {
    const errors: Record<string, string> = {};

    if (!vehicleData.vehicleType) {
      errors.vehicleType = 'Selecciona un tipo de vehículo';
    }
    if (!vehicleData.plate) {
      errors.plate = 'La placa es requerida';
    }
    if (!vehicleData.year) {
      errors.year = 'El año es requerido';
    }
    if (!vehicleData.brand) {
      errors.brand = 'La marca es requerida';
    }
    if (!vehicleData.model) {
      errors.model = 'El modelo es requerido';
    }
    if (!vehicleData.service) {
      errors.service = 'El servicio es requerido';
    }
    if (!appointmentData.date) {
      errors.date = 'Selecciona una fecha';
    }
    if (!appointmentData.time) {
      errors.time = 'Selecciona una hora';
    }

    setValidationErrors(errors);

    if (Object.keys(errors).length === 0) {
      console.log('Reservation confirmed:', {
        userData,
        vehicleData,
        appointmentData,
      });
      onConfirm(vehicleData, appointmentData);
    }
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <div className="bg-[#1a2332] text-white py-6 px-8">
        <h1 className="text-center">2 Ingresa tu auto</h1>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Vehicle Data */}
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <h2 className="mb-6">Datos del vehículo</h2>

            {/* Vehicle Type */}
            <div className="mb-6">
              <Label className="text-[#666] mb-3 block">Tipo de vehículo</Label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setVehicleData({ ...vehicleData, vehicleType: 'auto' })}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded border-2 transition-colors ${
                    vehicleData.vehicleType === 'auto'
                      ? 'border-[#ff9800] bg-[#fff8f0]'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Car className="w-5 h-5" />
                  <span>Auto</span>
                </button>
                <button
                  type="button"
                  onClick={() => setVehicleData({ ...vehicleData, vehicleType: 'camion' })}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded border-2 transition-colors ${
                    vehicleData.vehicleType === 'camion'
                      ? 'border-[#ff9800] bg-[#fff8f0]'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Truck className="w-5 h-5" />
                  <span>Camión</span>
                </button>
              </div>
              {validationErrors.vehicleType && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.vehicleType}</p>
              )}
            </div>

            {/* Plate */}
            <div className="mb-6">
              <Label htmlFor="plate" className="text-[#666] mb-2 block">
                Placa
              </Label>
              <Input
                id="plate"
                value={vehicleData.plate}
                onChange={(e) =>
                  setVehicleData({ ...vehicleData, plate: e.target.value.toUpperCase() })
                }
                placeholder="CET-669"
                className={validationErrors.plate ? 'border-red-500' : ''}
              />
              {vehicleData.plate && (
                <p className="text-sm text-[#666] mt-1">
                  Formato: ABC-123. Se convertirá a mayúsculas.
                </p>
              )}
              {validationErrors.plate && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.plate}</p>
              )}
              <button
                type="button"
                className="text-sm text-[#666] mt-2 underline"
                onClick={() => setVehicleData({ ...vehicleData, plate: '' })}
              >
                No recuerdo mi placa
              </button>
            </div>

            {/* Year and Brand */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <Label htmlFor="year" className="text-[#666] mb-2 block">
                  Año
                </Label>
                <Select
                  value={vehicleData.year}
                  onValueChange={(value) => setVehicleData({ ...vehicleData, year: value })}
                >
                  <SelectTrigger className={validationErrors.year ? 'border-red-500' : ''}>
                    <SelectValue placeholder="2022" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {validationErrors.year && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.year}</p>
                )}
              </div>

              <div>
                <Label htmlFor="brand" className="text-[#666] mb-2 block">
                  Marca
                </Label>
                <Select
                  value={vehicleData.brand}
                  onValueChange={(value) => setVehicleData({ ...vehicleData, brand: value })}
                >
                  <SelectTrigger className={validationErrors.brand ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Selecciona marca" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand.value} value={brand.value}>
                        {brand.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {validationErrors.brand && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.brand}</p>
                )}
              </div>
            </div>

            {/* Model and Version */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <Label htmlFor="model" className="text-[#666] mb-2 block">
                  Modelo
                </Label>
                <Select
                  value={vehicleData.model}
                  onValueChange={(value) => setVehicleData({ ...vehicleData, model: value })}
                  disabled={!vehicleData.brand}
                >
                  <SelectTrigger className={validationErrors.model ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Selecciona modelo" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableModels.length > 0 ? (
                      availableModels.map((model) => (
                        <SelectItem key={model.value} value={model.value}>
                          {model.label}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        Primero selecciona una marca
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {validationErrors.model && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.model}</p>
                )}
                {!vehicleData.brand && (
                  <p className="text-sm text-[#666] mt-1">Primero selecciona una marca</p>
                )}
              </div>

              <div>
                <Label htmlFor="version" className="text-[#666] mb-2 block">
                  Versión (opcional)
                </Label>
                <Select
                  value={vehicleData.version}
                  onValueChange={(value) => setVehicleData({ ...vehicleData, version: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona versión" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="version1">Versión 1</SelectItem>
                    <SelectItem value="version2">Versión 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Service */}
            <div className="mb-6">
              <Label htmlFor="service" className="text-[#666] mb-2 block">
                Servicio a realizar
              </Label>
              <Select
                value={vehicleData.service}
                onValueChange={(value) => setVehicleData({ ...vehicleData, service: value })}
              >
                <SelectTrigger className={validationErrors.service ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Preventivo" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.value} value={service.value}>
                      {service.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {validationErrors.service && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.service}</p>
              )}
            </div>
          </div>

          {/* Right Column - Location, Date & Time */}
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <h2 className="mb-6">Local, fecha y hora</h2>

            {/* Location */}
            <div className="mb-6">
              <Label htmlFor="location" className="text-[#666] mb-2 block">
                Local
              </Label>
              <Select value={appointmentData.location} onValueChange={(value) => setAppointmentData({ ...appointmentData, location: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Av. Aviación 1003, La Victoria (Lima)">
                    Av. Aviación 1003, La Victoria (Lima)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Calendar */}
            <div className="mb-6">
              <div className="border rounded-lg p-4 bg-[#fef9f5]">
                <div className="flex items-center justify-between mb-4">
                  <button
                    type="button"
                    onClick={handlePreviousMonth}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="capitalize">{monthName}</span>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => (
                    <div key={index} className="text-center text-sm text-[#666] p-2">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                    <div key={`empty-${index}`} className="p-2" />
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, index) => {
                    const day = index + 1;
                    const isSelected = selectedDate?.getDate() === day;
                    const isToday = day === 21; // Example: 21 is highlighted in the image

                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleDateSelect(day)}
                        className={`p-2 text-center rounded transition-colors ${
                          isSelected
                            ? 'bg-[#1a2332] text-white'
                            : isToday
                            ? 'border-2 border-[#1a2332]'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
              {validationErrors.date && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.date}</p>
              )}
            </div>

            {/* Time Slots */}
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.time}
                    type="button"
                    disabled={!slot.available}
                    onClick={() => handleTimeSelect(slot.time)}
                    className={`p-3 rounded border-2 text-left transition-colors ${
                      appointmentData.time === slot.time
                        ? 'border-[#ff9800] bg-[#fff8f0]'
                        : slot.available
                        ? 'border-gray-300 hover:border-gray-400'
                        : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <div>{slot.time}</div>
                    <div className="text-xs text-[#ff9800]">
                      {slot.available ? 'Disponible' : 'Ocupado'}
                    </div>
                  </button>
                ))}
              </div>
              {validationErrors.time && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.time}</p>
              )}
            </div>

            {/* Confirmation Message */}
            {appointmentData.date && appointmentData.time && (
              <div className="bg-[#ff9800] text-white p-4 rounded mb-4">
                Has seleccionado el día {appointmentData.date} a las {appointmentData.time}hs
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                onClick={handleConfirm}
                className="flex-1 bg-[#ff9800] hover:bg-[#f57c00] text-white"
              >
                CONFIRMAR CITA
              </Button>
              <Button
                type="button"
                onClick={onBack}
                variant="outline"
                className="border-gray-300"
              >
                ← Volver
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
