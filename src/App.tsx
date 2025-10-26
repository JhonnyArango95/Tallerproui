import { useState, useEffect } from 'react';
import { Check, Loader2, ArrowRight, Shield } from 'lucide-react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Checkbox } from './components/ui/checkbox';
import { BrandLogos } from './components/BrandLogos';
import { VehicleAppointment } from './components/VehicleAppointment';
import { ConfirmationScreen } from './components/ConfirmationScreen';
import { RescheduleSearch } from './components/RescheduleSearch';
import { RescheduleManage } from './components/RescheduleManage';
import { LoginScreen } from './components/admin/LoginScreen';
import { AdminDashboard } from './components/admin/AdminDashboard';

// --- Constantes de la API ---
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
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Estados para los datos del vehículo y la cita
  const [vehicleData, setVehicleData] = useState<any>(null);
  const [appointmentData, setAppointmentData] = useState<any>(null);

  // Estados para el flujo de reagendamiento
  const [showRescheduleSearch, setShowRescheduleSearch] = useState(false);
  const [showRescheduleManage, setShowRescheduleManage] = useState(false);
  const [foundAppointment, setFoundAppointment] = useState<any>(null);

  // Estados para el panel de administración
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [isAdminMode, setIsAdminMode] = useState(false);

  // Función para consultar la API de RENIEC
  const fetchDNIData = async (dni: string) => {
    setIsLoadingDNI(true);
    setDniError(null);
    setDataFromAPI(false);

    try {
      const url = `${API_BASE_URL}/${dni}?api_token=${API_TOKEN}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error de red: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      if (!result.success || !result.data) {
        throw new Error(result.message || 'DNI no encontrado o error en la API');
      }
      
      const apiData = result.data;

      setFormData((prev) => ({
        ...prev,
        firstName: apiData.nombres || '',
        lastName: `${apiData.apellido_paterno || ''} ${apiData.apellido_materno || ''}`.trim(),
      }));
      
      setDataFromAPI(true);
      
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.firstName;
        delete newErrors.lastName;
        delete newErrors.documentNumber;
        return newErrors;
      });

    } catch (error) {
      setDniError(error instanceof Error ? error.message : 'Error al consultar DNI');
      setDataFromAPI(false);
      setFormData((prev) => ({
        ...prev,
        firstName: '',
        lastName: '',
      }));
      console.error('Error completo:', error);
    } finally {
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
    
    const errors: Record<string, string> = {};

    if (formData.documentType === 'DNI' && formData.documentNumber.length !== 8) {
      errors.documentNumber = 'El DNI debe tener 8 dígitos';
    } else if (!formData.documentNumber) {
      errors.documentNumber = 'El número de documento es requerido';
    }

    if (!formData.firstName.trim()) {
      errors.firstName = 'El nombre es requerido';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'El apellido es requerido';
    }

    if (!formData.email.trim()) {
      errors.email = 'El correo es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Ingresa un correo válido';
    }

    if (formData.phone.length !== 9) {
      errors.phone = 'El celular debe tener 9 dígitos';
    }

    if (!formData.termsAccepted) {
      errors.terms = 'Debes aceptar los términos y condiciones';
    }

    setValidationErrors(errors);

    if (Object.keys(errors).length === 0) {
      setShowNextStep(true);
      console.log('Form submitted:', formData);
    }
  };

  const handleConfirmAppointment = (vehicle: any, appointment: any) => {
    setVehicleData(vehicle);
    setAppointmentData(appointment);
    setShowConfirmation(true);
    console.log('Cita confirmada:', { userData: formData, vehicle, appointment });
  };

  const handleBackToHome = () => {
    // Resetear todos los estados
    setShowConfirmation(false);
    setShowNextStep(false);
    setShowRescheduleSearch(false);
    setShowRescheduleManage(false);
    setFormData({
      documentType: 'DNI',
      documentNumber: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      termsAccepted: false,
      infoAccepted: false,
    });
    setVehicleData(null);
    setAppointmentData(null);
    setFoundAppointment(null);
  };

  const handleRescheduleClick = () => {
    setShowRescheduleSearch(true);
  };

  const handleSearchSuccess = (appointment: any) => {
    setFoundAppointment(appointment);
    setShowRescheduleManage(true);
  };

  const handleBackFromReschedule = () => {
    setShowRescheduleSearch(false);
    setShowRescheduleManage(false);
    setFoundAppointment(null);
  };

  const handleNewSearch = () => {
    setShowRescheduleManage(false);
    setFoundAppointment(null);
  };

  const handleRescheduleAppointment = () => {
    // Aquí iríamos a la pantalla de selección de nueva fecha
    // Por ahora mostramos un mensaje
    alert('Funcionalidad de reagendar: Aquí se mostraría el calendario para seleccionar nueva fecha y hora.');
    console.log('Reagendando cita para:', foundAppointment);
  };

  const handleCancelAppointment = () => {
    // Después de cancelar, volver al home
    alert('Cita anulada exitosamente');
    handleBackToHome();
  };

  const handleAdminAccess = () => {
    setShowAdminLogin(true);
  };

  const handleAdminLoginSuccess = (user: any) => {
    setAdminUser(user);
    setIsAdminMode(true);
    setShowAdminLogin(false);
  };

  const handleAdminLogout = () => {
    setAdminUser(null);
    setIsAdminMode(false);
    setShowAdminLogin(false);
  };

  // Si isAdminMode es true, mostrar el dashboard de admin
  if (isAdminMode && adminUser) {
    return <AdminDashboard user={adminUser} onLogout={handleAdminLogout} />;
  }

  // Si showAdminLogin es true, mostrar la pantalla de login
  if (showAdminLogin) {
    return <LoginScreen onLoginSuccess={handleAdminLoginSuccess} />;
  }

  // Si showRescheduleManage es true, mostrar la pantalla de gestión de cita
  if (showRescheduleManage && foundAppointment) {
    return (
      <RescheduleManage
        onBack={handleBackFromReschedule}
        onReschedule={handleRescheduleAppointment}
        onCancel={handleCancelAppointment}
        onNewSearch={handleNewSearch}
        appointmentData={foundAppointment}
      />
    );
  }

  // Si showRescheduleSearch es true, mostrar la pantalla de búsqueda de cita
  if (showRescheduleSearch) {
    return (
      <RescheduleSearch
        onBack={handleBackFromReschedule}
        onSearchSuccess={handleSearchSuccess}
      />
    );
  }

  // Si showConfirmation es true, mostrar la pantalla de confirmación
  if (showConfirmation && vehicleData && appointmentData) {
    return (
      <ConfirmationScreen
        onBackToHome={handleBackToHome}
        userData={{
          documentType: formData.documentType,
          documentNumber: formData.documentNumber,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        }}
        vehicleData={vehicleData}
        appointmentData={appointmentData}
      />
    );
  }

  // Si showNextStep es true, mostrar la pantalla 2
  if (showNextStep) {
    return (
      <VehicleAppointment
        onBack={() => setShowNextStep(false)}
        onConfirm={handleConfirmAppointment}
        userData={{
          documentType: formData.documentType,
          documentNumber: formData.documentNumber,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        }}
      />
    );
  }

  // Pantalla 1 - Formulario de datos personales
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <div className="bg-[#1e293b] text-white py-6 px-8">
        <div className="max-w-7xl mx-auto relative">
          <h1 className="text-center">Ingresa tus datos</h1>
          <button
            onClick={handleAdminAccess}
            className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2 px-4 py-2 rounded bg-[#2d3b4f] hover:bg-[#3d4b5f] transition-colors text-sm"
            title="Panel de Administración"
          >
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Admin</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Section */}
          <div>
            <h2 className="mb-4 text-gray-900">Agendar Servicio Técnico</h2>
            <p className="text-[#c17a2e] mb-6">
              Completa tus datos para continuar con la reserva. Nuestro equipo te contactará para confirmar detalles y disponibilidad.
            </p>

            {/* Service List */}
            <div className="space-y-3 mb-6">
              {services.map((service, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#22c55e] flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-900">{service}</span>
                </div>
              ))}
            </div>

            {/* Reschedule Link */}
            <div className="mb-8">
              <button
                onClick={handleRescheduleClick}
                className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 underline transition-colors"
              >
                Reagendar o anular cita
                <ArrowRight className="w-4 h-4" />
              </button>
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
                      setFormData({ ...formData, documentType: value, documentNumber: '' })
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
                        if (formData.documentType === 'DNI') {
                          if (/^\d*$/.test(value) && value.length <= 8) {
                            setFormData({ ...formData, documentNumber: value });
                            setShowNumericError(false);
                            if (validationErrors.documentNumber) {
                              const newErrors = { ...validationErrors };
                              delete newErrors.documentNumber;
                              setValidationErrors(newErrors);
                            }
                          } else if (!/^\d*$/.test(value)) {
                            setShowNumericError(true);
                          }
                        } else {
                          setFormData({ ...formData, documentNumber: value });
                          setShowNumericError(false);
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
                      <p className="text-xs text-red-600">Debe ingresar datos numéricos</p>
                    )}
                    {dniError && <p className="text-xs text-red-600">{dniError}</p>}
                    {isLoadingDNI && <p className="text-xs text-[#22c55e]">Consultando DNI...</p>}
                    {validationErrors.documentNumber && !showNumericError && !dniError && !isLoadingDNI && (
                      <p className="text-xs text-red-600">{validationErrors.documentNumber}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Nombre */}
              <div>
                <Label className="text-[#c17a2e] mb-2 block">Nombre</Label>
                <Input
                  type="text"
                  placeholder="Tu nombre"
                  className="bg-[#f8f8f8] border-0"
                  value={formData.firstName}
                  onChange={(e) => {
                    setFormData({ ...formData, firstName: e.target.value });
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
                    <p className="text-xs text-red-600">{validationErrors.firstName}</p>
                  )}
                </div>
              </div>

              {/* Apellido */}
              <div>
                <Label className="text-[#c17a2e] mb-2 block">Apellido</Label>
                <Input
                  type="text"
                  placeholder="Tu apellido"
                  className="bg-[#f8f8f8] border-0"
                  value={formData.lastName}
                  onChange={(e) => {
                    setFormData({ ...formData, lastName: e.target.value });
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
                    <p className="text-xs text-red-600">{validationErrors.lastName}</p>
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
                    if (validationErrors.email) {
                      const newErrors = { ...validationErrors };
                      delete newErrors.email;
                      setValidationErrors(newErrors);
                    }
                  }}
                />
                <div className="min-h-[20px] mt-1">
                  {validationErrors.email && (
                    <p className="text-xs text-red-600">{validationErrors.email}</p>
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
                    if (/^\d*$/.test(value) && value.length <= 9) {
                      setFormData({ ...formData, phone: value });
                      setShowPhoneNumericError(false);
                      if (validationErrors.phone) {
                        const newErrors = { ...validationErrors };
                        delete newErrors.phone;
                        setValidationErrors(newErrors);
                      }
                    } else if (!/^\d*$/.test(value)) {
                      setShowPhoneNumericError(true);
                    }
                  }}
                />
                <div className="min-h-[20px] mt-1">
                  {showPhoneNumericError && (
                    <p className="text-xs text-red-600">Debe ingresar datos numéricos</p>
                  )}
                  {validationErrors.phone && !showPhoneNumericError && (
                    <p className="text-xs text-red-600">{validationErrors.phone}</p>
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
                      <p className="text-xs text-red-600">{validationErrors.terms}</p>
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
