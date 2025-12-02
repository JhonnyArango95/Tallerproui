import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { AlertCircle } from 'lucide-react';
import { citasService } from '../services/api.service';
import type { CitaResponse } from '../config/api';
import { toast } from 'sonner@2.0.3';

interface RescheduleSearchProps {
  onBack: () => void;
  onSearchSuccess: (appointmentData: any) => void;
}

export function RescheduleSearch({ onBack, onSearchSuccess }: RescheduleSearchProps) {
  const [searchData, setSearchData] = useState({
    documentType: 'DNI',
    documentNumber: '',
    plate: '',
    noPlate: false,
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    const errors: Record<string, string> = {};

    if (!searchData.documentNumber) {
      errors.documentNumber = 'El número de documento es requerido';
    } else if (searchData.documentType === 'DNI' && searchData.documentNumber.length !== 8) {
      errors.documentNumber = 'El DNI debe tener 8 dígitos';
    } else if (searchData.documentType === 'CE' && (searchData.documentNumber.length < 9 || searchData.documentNumber.length > 12)) {
      errors.documentNumber = 'El CE debe tener entre 9-12 caracteres alfanuméricos';
    } else if (searchData.documentType === 'Pasaporte' && (searchData.documentNumber.length < 6 || searchData.documentNumber.length > 12)) {
      errors.documentNumber = 'El Pasaporte debe tener entre 6-12 caracteres alfanuméricos';
    }

    if (!searchData.noPlate && !searchData.plate) {
      errors.plate = 'La placa es requerida o marca "Agendé sin placa"';
    }

    setValidationErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsSearching(true);
      
      try {
        // Preparar datos para enviar a la API
        const busquedaRequest = {
          tipoDocumento: searchData.documentType,
          numeroDocumento: searchData.documentNumber,
          placa: searchData.noPlate ? null : searchData.plate,
          sinPlaca: searchData.noPlate,
        };

        console.log('Buscando cita con:', busquedaRequest);
        
        // Llamar a la API
        const citaEncontrada: CitaResponse = await citasService.buscarCita(busquedaRequest);
        
        console.log('========== CITA ENCONTRADA ==========');
        console.log('📦 Respuesta completa del backend:', citaEncontrada);
        console.log('🏢 Local:', citaEncontrada.localAtencion);
        console.log('📅 Fecha:', citaEncontrada.fechaCita);
        console.log('🕐 Hora:', citaEncontrada.horaCita);
        console.log('🚗 Placa:', citaEncontrada.placa);
        console.log('🎯 Servicio:', citaEncontrada.tipoServicio);
        console.log('🆔 ID de la cita:', citaEncontrada.id);
        toast.success('¡Cita encontrada!');
        
        // El backend devuelve los campos con nombres específicos
        const rawResponse: any = citaEncontrada;
        
        const appointmentData = {
          id: rawResponse.id,
          location: rawResponse.localAtencion || 'Local no especificado',
          date: rawResponse.fechaCita && rawResponse.horaCita
            ? `${rawResponse.fechaCita} - ${rawResponse.horaCita}` 
            : 'Fecha no especificada',
          service: rawResponse.tipoServicio || 'Servicio no especificado',
          plate: rawResponse.placa || 'Sin placa',
          documentNumber: rawResponse.cliente?.numeroDocumento || rawResponse.numeroDocumento,
          // Mantener todos los datos originales para operaciones posteriores
          rawData: citaEncontrada,
        };
        
        console.log('📋 Datos transformados para mostrar:', appointmentData);
        
        onSearchSuccess(appointmentData);
        
      } catch (error) {
        console.error('❌ Error al buscar la cita:', error);
        
        // Mensaje personalizado dependiendo del tipo de error
        let errorMessage = 'No se encontró la cita. Verifica los datos e intenta de nuevo.';
        
        if (error instanceof Error) {
          if (error.message.includes('400')) {
            errorMessage = 'No se encontró una cita agendada con esos datos. Verifica DNI o Placa.';
          } else if (error.message.includes('404')) {
            errorMessage = 'Cita no encontrada. Verifica que el DNI y la placa sean correctos.';
          } else if (error.message.includes('500')) {
            errorMessage = 'Error en el servidor. Por favor, intenta más tarde.';
          } else {
            errorMessage = error.message;
          }
        }
        
        toast.error(errorMessage, {
          duration: 5000,
        });
      } finally {
        setIsSearching(false);
      }
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
          <h1 className="flex-1 text-center">1 Ingresa los datos de tu cita</h1>
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
                <span className="text-gray-900">Paso 1</span>
              </div>
            </div>

            <h2 className="mb-4 text-gray-900">Reagenda tu servicio</h2>
            
            <p className="text-[#c17a2e] mb-6">
              Busca tu cita por tipo y número de documento. Si no registraste placa, marca la opción y busca solo con tu documento.
            </p>

            <div className="bg-[#fff8f0] rounded-lg p-6 space-y-4">
              <h3 className="text-gray-900">Consejos</h3>
              
              <div className="space-y-2 text-sm text-gray-700">
                <p className="text-[#c17a2e]">
                  Verifica que el tipo de documento coincida con el de tu registro.
                </p>
                <p className="text-gray-600">
                  La placa debe tener el formato ABC-123.
                </p>
                <p className="text-gray-600">
                  Si no recuerdas la placa, usa la opción "Agendé sin placa".
                </p>
              </div>
            </div>
          </div>

          {/* Right Section - Form */}
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <div className="space-y-6">
              {/* Document Type */}
              <div>
                <Label className="text-gray-700 mb-2 block">
                  Tipo de documento <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={searchData.documentType}
                  onValueChange={(value) =>
                    setSearchData({ ...searchData, documentType: value, documentNumber: '' })
                  }
                >
                  <SelectTrigger className="bg-[#f8f8f8] border-0">
                    <SelectValue placeholder="Selecciona: DNI, CE o Pasaporte" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DNI">DNI</SelectItem>
                    <SelectItem value="CE">CE</SelectItem>
                    <SelectItem value="Pasaporte">Pasaporte</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-[#c17a2e] mt-1">
                  Elige el tipo de documento para validar el formato.
                </p>
              </div>

              {/* Document Number */}
              <div>
                <Label className="text-gray-700 mb-2 block">
                  Nº documento <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  className="bg-[#f8f8f8] border-0"
                  value={searchData.documentNumber}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (searchData.documentType === 'DNI') {
                      if (/^\d*$/.test(value) && value.length <= 8) {
                        setSearchData({ ...searchData, documentNumber: value });
                        if (validationErrors.documentNumber) {
                          const newErrors = { ...validationErrors };
                          delete newErrors.documentNumber;
                          setValidationErrors(newErrors);
                        }
                      }
                    } else {
                      setSearchData({ ...searchData, documentNumber: value });
                      if (validationErrors.documentNumber) {
                        const newErrors = { ...validationErrors };
                        delete newErrors.documentNumber;
                        setValidationErrors(newErrors);
                      }
                    }
                  }}
                />
                <div className="min-h-[20px] mt-1">
                  {searchData.documentType === 'DNI' && (
                    <p className="text-xs text-gray-500">DNI: 8 dígitos. CE: 9-12 alfanuméricos. Pasaporte: 6-12 alfanuméricos.</p>
                  )}
                  {validationErrors.documentNumber && (
                    <p className="text-xs text-red-600">{validationErrors.documentNumber}</p>
                  )}
                </div>
              </div>

              {/* No Plate Checkbox */}
              <div className="flex items-start gap-3">
                <Checkbox
                  id="noPlate"
                  checked={searchData.noPlate}
                  onCheckedChange={(checked) => {
                    setSearchData({ ...searchData, noPlate: checked as boolean, plate: '' });
                    if (validationErrors.plate) {
                      const newErrors = { ...validationErrors };
                      delete newErrors.plate;
                      setValidationErrors(newErrors);
                    }
                  }}
                  className="mt-1"
                />
                <label htmlFor="noPlate" className="text-sm text-gray-700 cursor-pointer">
                  Agendé sin placa
                </label>
              </div>

              {/* Plate */}
              <div>
                <Label className="text-gray-700 mb-2 block">Placa</Label>
                <Input
                  type="text"
                  placeholder="CET-669"
                  className="bg-[#f8f8f8] border-0"
                  value={searchData.plate}
                  onChange={(e) => {
                    setSearchData({ ...searchData, plate: e.target.value.toUpperCase() });
                    if (validationErrors.plate) {
                      const newErrors = { ...validationErrors };
                      delete newErrors.plate;
                      setValidationErrors(newErrors);
                    }
                  }}
                  disabled={searchData.noPlate}
                />
                <div className="min-h-[20px] mt-1">
                  <p className="text-xs text-[#c17a2e]">Formato requerido: ABC-123. Se normaliza a MAYÚSCULAS.</p>
                  {validationErrors.plate && (
                    <p className="text-xs text-red-600">{validationErrors.plate}</p>
                  )}
                </div>
              </div>

              {/* Search Button */}
              <Button
                onClick={handleSearch}
                className="w-full bg-[#f59e0b] hover:bg-[#d97706] text-white"
                disabled={isSearching}
              >
                {isSearching ? 'BUSCANDO...' : 'BUSCAR'}
              </Button>

              {/* Exit Link */}
              <div className="text-center">
                <button
                  onClick={onBack}
                  className="text-sm text-gray-600 underline hover:text-gray-800"
                >
                  ← Salir
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}