import { useState, useEffect } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Checkbox } from './components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './components/ui/dialog';
import { BrandLogos } from './components/BrandLogos';

// --- Constantes de la API ---
// Es una mejor práctica definir esto fuera del componente.
const API_TOKEN = 'c16e2bb53733fbfef5a0a9f69fde50c70410a13a0363accb46404b06083e1391';
const API_BASE_URL = 'https://apiperu.dev/api/dni';

export default function App() {
  const [formData, setFormData] = useState({
    documentType: 'DNI',
    documentNumber: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    termsAccepted: false,
    infoAccepted: false,
  });

  const [showNumericError, setShowNumericError] = useState(false);
  const [showPhoneNumericError, setShowPhoneNumericError] = useState(false);
  const [isLoadingDNI, setIsLoadingDNI] = useState(false);
  const [dniError, setDniError] = useState<string | null>(null);
  const [dataFromAPI, setDataFromAPI] = useState(false);
  const [showNextStep, setShowNextStep] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Función para consultar la API de RENIEC
  const fetchDNIData = async (dni: string) => {
    setIsLoadingDNI(true);
    setDniError(null);
    setDataFromAPI(false); // Resetea el estado en cada nueva consulta

    try {
      // 1. Construir la URL de la API
      const url = `${API_BASE_URL}/${dni}?api_token=${API_TOKEN}`;

      // 2. Realizar la llamada a la API con fetch
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      // 3. Verificar si la respuesta de red es exitosa
      if (!response.ok) {
        throw new Error(`Error de red: ${response.status} ${response.statusText}`);
      }

      // 4. Parsear la respuesta JSON
      const result = await response.json();

      // 5. Verificar si la API indica éxito (basado en tu JSON de ejemplo)
      if (!result.success || !result.data) {
        throw new Error(result.message || 'DNI no encontrado o error en la API');
      }
      
      // 6. Extraer los datos del DNI
      const apiData = result.data;

      // 7. Actualizar el formulario con los datos obtenidos de la API
      setFormData((prev) => ({
        ...prev,
        // Usamos los campos de la API: "nombres" y "apellido_paterno", "apellido_materno"
        firstName: apiData.nombres || '',
        lastName: `${apiData.apellido_paterno || ''} ${apiData.apellido_materno || ''}`.trim(),
      }));
      
      // 8. Marcar que los datos provienen de la API
      setDataFromAPI(true);
      
      // 9. Limpiar errores de validación de nombre y apellido
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.firstName;
        delete newErrors.lastName;
        delete newErrors.documentNumber;
        return newErrors;
      });

    } catch (error) {
      // 10. Manejar cualquier error
      setDniError(error instanceof Error ? error.message : 'Error al consultar DNI');
      setDataFromAPI(false);
      // Limpiar campos si la consulta falla
      setFormData((prev) => ({
        ...prev,
        firstName: '',
        lastName: '',
      }));
      console.error('Error completo:', error);
    } finally {
      // 11. Indicar que la carga ha terminado
      setIsLoadingDNI(false);
    }
  };

  // Efecto para consultar la API cuando el DNI tenga 8 dígitos
  useEffect(() => {
    if (formData.documentType === 'DNI' && formData.documentNumber.length === 8) {
      fetchDNIData(formData.documentNumber);
    } else {
      setDniError(null);
      setDataFromAPI(false);
    }
  }, [formData.documentNumber, formData.documentType]);

  const services = [
    'Mantenimiento Preventivo y Correctivo',
    'Reparaciones Generales',
    'Carrocería y Pintura',
    'Repuestos y Accesorios Originales',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar todos los campos
    const errors: Record<string, string> = {};

    // Validar documento
    if (formData.documentType === 'DNI' && formData.documentNumber.length !== 8) {
      errors.documentNumber = 'El DNI debe tener 8 dígitos';
    } else if (!formData.documentNumber) {
      errors.documentNumber = 'El número de documento es requerido';
    }

    // Validar nombre
    if (!formData.firstName.trim()) {
      errors.firstName = 'El nombre es requerido';
    }

    // Validar apellido
    if (!formData.lastName.trim()) {
      errors.lastName = 'El apellido es requerido';
    }

    // Validar email
    if (!formData.email.trim()) {
      errors.email = 'El correo es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Ingresa un correo válido';
    }

    // Validar teléfono
    if (formData.phone.length !== 9) {
      errors.phone = 'El celular debe tener 9 dígitos';
    }

    // Validar checkboxes (solo el de términos es obligatorio)
    if (!formData.termsAccepted) {
      errors.terms = 'Debes aceptar los términos y condiciones';
    }

    setValidationErrors(errors);

    // Si no hay errores, continuar al siguiente paso
    if (Object.keys(errors).length === 0) {
      setShowNextStep(true);
      console.log('Form submitted:', formData);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="max-w-7xl mx-auto p-8">
        {/* Step Header */}
        <div className="bg-[#1e293b] text-white px-6 py-4 rounded-lg mb-8">
          <span className="text-sm">1 Ingresa tus datos</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Section */}
          <div>
            <h1 className="text-3xl mb-4 text-gray-900">Agendar Servicio Técnico</h1>
            <p className="text-[#c17a2e] mb-6">
              Completa tus datos para continuar con la reserva. Nuestro equipo te contactará para confirmar detalles y disponibilidad.
            </p>

            {/* Service List */}
            <div className="space-y-3 mb-8">
              {services.map((service, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#22c55e] flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-900">{service}</span>
                </div>
              ))}
            </div>

            {/* Brand Logos */}
            <BrandLogos />
          </div>

          {/* Right Section - Form */}
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Document Type and Number */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-[#c17a2e] mb-2 block">Tipo de documento</Label>
                  <Select
                    value={formData.documentType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, documentType: value })
                    }
                  >
                    <SelectTrigger className="bg-[#f8f8f8] border-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DNI">DNI</SelectItem>
                      <SelectItem value="RUC">RUC</SelectItem>
                      <SelectItem value="CE">CE</SelectItem>
                      <SelectItem value="Pasaporte">Pasaporte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-[#c17a2e] mb-2 block">Nº documento</Label>
                  <div className="relative">
                    <Input
                      type="text"
                      className="bg-[#f8f8f8] border-0"
                      value={formData.documentNumber}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Para DNI: solo números y máximo 8 dígitos
                        if (formData.documentType === 'DNI') {
                          if (/^\d*$/.test(value) && value.length <= 8) {
                            setFormData({ ...formData, documentNumber: value });
                            setShowNumericError(false);
                            // Limpiar error de validación si existe
                            if (validationErrors.documentNumber) {
                              const newErrors = { ...validationErrors };
                              delete newErrors.documentNumber;
                              setValidationErrors(newErrors);
                            }
                          } else if (!/^\d*$/.test(value)) {
                            // Intentó ingresar letras u otros caracteres no numéricos
                            setShowNumericError(true);
                          }
                        } else {
                          setFormData({ ...formData, documentNumber: value });
                          setShowNumericError(false);
                          // Limpiar error de validación si existe
                          if (validationErrors.documentNumber) {
                            const newErrors = { ...validationErrors };
                            delete newErrors.documentNumber;
                            setValidationErrors(newErrors);
                          }
                        }
                      }}
                      disabled={isLoadingDNI}
                    />
                    {isLoadingDNI && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Loader2 className="w-5 h-5 animate-spin text-[#c17a2e]" />
                      </div>
                    )}
                  </div>
                  <div className="min-h-[20px] mt-1">
                    {showNumericError && formData.documentType === 'DNI' && (
                      <p className="text-xs text-red-600">
                        Debe ingresar datos numéricos
                      </p>
                    )}
                    {dniError && (
                      <p className="text-xs text-red-600">
                        {dniError}
                      </p>
                    )}
                    {isLoadingDNI && (
                      <p className="text-xs text-[#22c55e]">
                        Consultando DNI...
                      </p>
                    )}
                    {validationErrors.documentNumber && !showNumericError && !dniError && !isLoadingDNI && (
                      <p className="text-xs text-red-600">
                        {validationErrors.documentNumber}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Nombres */}
              <div>
                <Label className="text-[#c17a2e] mb-2 block">Nombre</Label>
                <Input
                  type="text"
                  placeholder="Tu nombre"
                  className="bg-[#f8f8f8] border-0"
                  value={formData.firstName}
                  onChange={(e) => {
                    setFormData({ ...formData, firstName: e.target.value });
                    // Limpiar error de validación si existe
                    if (validationErrors.firstName) {
                      const newErrors = { ...validationErrors };
                      delete newErrors.firstName;
                      setValidationErrors(newErrors);
                    }
                  }}
                  disabled={isLoadingDNI || dataFromAPI}
                />
                <div className="min-h-[20px] mt-1">
                  {validationErrors.firstName && (
                    <p className="text-xs text-red-600">
                      {validationErrors.firstName}
                    </p>
                  )}
                </div>
              </div>

              {/* Apellidos */}
              <div>
                <Label className="text-[#c17a2e] mb-2 block">Apellido</Label>
                <Input
                  type="text"
                  placeholder="Tu apellido"
                  className="bg-[#f8f8f8] border-0"
                  value={formData.lastName}
                  onChange={(e) => {
                    setFormData({ ...formData, lastName: e.target.value });
                    // Limpiar error de validación si existe
                    if (validationErrors.lastName) {
                      const newErrors = { ...validationErrors };
                      delete newErrors.lastName;
                      setValidationErrors(newErrors);
                    }
                  }}
                  disabled={isLoadingDNI || dataFromAPI}
                />
                <div className="min-h-[20px] mt-1">
                  {validationErrors.lastName && (
                    <p className="text-xs text-red-600">
                      {validationErrors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Correo */}
              <div>
                <Label className="text-[#c17a2e] mb-2 block">Correo</Label>
                <Input
                  type="email"
                  placeholder="tu@email.com"
                  className="bg-[#f8f8f8] border-0"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    // Limpiar error de validación si existe
                    if (validationErrors.email) {
                      const newErrors = { ...validationErrors };
                      delete newErrors.email;
                      setValidationErrors(newErrors);
                    }
                  }}
                />
                <div className="min-h-[20px] mt-1">
                  {validationErrors.email && (
                    <p className="text-xs text-red-600">
                      {validationErrors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Celular */}
              <div>
                <Label className="text-[#c17a2e] mb-2 block">Celular</Label>
                <Input
                  type="tel"
                  placeholder="+51 9XXXXXXXX"
                  className="bg-[#f8f8f8] border-0"
                  value={formData.phone}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Solo números y máximo 9 dígitos
                    if (/^\d*$/.test(value) && value.length <= 9) {
                      setFormData({ ...formData, phone: value });
                      setShowPhoneNumericError(false);
                      // Limpiar error de validación si existe
                      if (validationErrors.phone) {
                        const newErrors = { ...validationErrors };
                        delete newErrors.phone;
                        setValidationErrors(newErrors);
                      }
                    } else if (!/^\d*$/.test(value)) {
                      // Intentó ingresar letras u otros caracteres no numéricos
                      setShowPhoneNumericError(true);
                    }
                  }}
                />
                <div className="min-h-[20px] mt-1">
                  {showPhoneNumericError && (
                    <p className="text-xs text-red-600">
                      Debe ingresar datos numéricos
                    </p>
                  )}
                  {validationErrors.phone && !showPhoneNumericError && (
                    <p className="text-xs text-red-600">
                      {validationErrors.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-3">
                <div>
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="terms"
                      checked={formData.termsAccepted}
                      onCheckedChange={(checked) => {
                        setFormData({ ...formData, termsAccepted: checked as boolean });
                        // Limpiar error de validación si existe
                        if (validationErrors.terms && checked) {
                          const newErrors = { ...validationErrors };
                          delete newErrors.terms;
                          setValidationErrors(newErrors);
                        }
                      }}
                      className="mt-1"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer">
                      He leído y acepto los términos y condiciones...
                    </label>
                  </div>
                  <div className="min-h-[20px] mt-1 ml-9">
                    {validationErrors.terms && (
                      <p className="text-xs text-red-600">
                        {validationErrors.terms}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="info"
                    checked={formData.infoAccepted}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, infoAccepted: checked as boolean })
                    }
                    className="mt-1"
                  />
                  <label htmlFor="info" className="text-sm text-gray-700 cursor-pointer">
                    Acepto recibir información... <span className="text-gray-400">(Opcional)</span>
                  </label>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  className="bg-[#f59e0b] hover:bg-[#d97706] text-white px-8 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoadingDNI}
                >
                  Continuar
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="border-gray-300 text-gray-700"
                >
                  Salir
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
