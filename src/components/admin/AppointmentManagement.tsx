import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import {
  Eye,
  Search,
  CalendarIcon,
  X,
  RotateCcw,
  AlertTriangle,
  User,
  Car,
  MapPin,
  Clock,
  Plus,
  ArrowLeft,
  Loader2,
  Check,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { citasService, marcasService } from '../../services/api.service';
import type { CitaResponse, BuscarCitaRequest, ReagendarCitaRequest, Marca, Modelo, CitaRequest } from '../../config/api';
import { toast } from 'sonner@2.0.3';

// Constantes de RENIEC API
const API_TOKEN = 'c16e2bb53733fbfef5a0a9f69fde50c70410a13a0363accb46404b06083e1391';
const API_BASE_URL = 'https://apiperu.dev/api/dni';

export function AppointmentManagement() {
  const [view, setView] = useState<'main' | 'new-appointment'>('main');
  const [searchMode, setSearchMode] = useState<'none' | 'searching' | 'found'>('none');
  const [foundCita, setFoundCita] = useState<CitaResponse | null>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  // Estados para DNI/RENIEC
  const [isLoadingDNI, setIsLoadingDNI] = useState(false);
  const [dniError, setDniError] = useState<string | null>(null);
  const [dataFromAPI, setDataFromAPI] = useState(false);

  // Estados para validación
  const [showNumericError, setShowNumericError] = useState(false);
  const [showPhoneNumericError, setShowPhoneNumericError] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Estados para mapeo de marcas y modelos
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [modelosPorMarca, setModelosPorMarca] = useState<Record<number, Modelo[]>>({});
  const [modelosDisponibles, setModelosDisponibles] = useState<Modelo[]>([]);

  // Form de búsqueda
  const [searchForm, setSearchForm] = useState({
    numeroDocumento: '',
    placa: '',
  });

  // Form de reagendamiento
  const [rescheduleForm, setRescheduleForm] = useState({
    fechaCita: new Date(),
    horaCita: '',
  });

  // Form de nueva cita (con todos los campos necesarios)
  const [newAppointmentForm, setNewAppointmentForm] = useState({
    // Datos del cliente
    tipoDocumento: 'DNI',
    numeroDocumento: '',
    nombre: '',
    apellido: '',
    correo: '',
    celular: '',
    aceptaTerminos: false,
    aceptaNovedades: false,
    // Datos del vehículo
    tipoVehiculo: 'Auto',
    placa: '',
    marcaId: 0,
    modeloId: 0,
    anio: new Date().getFullYear(),
    version: '',
    // Datos de la cita
    fecha: new Date(),
    hora: '',
    tipoServicio: '',
    local: 'TALLER CENTRAL',
  });

  const TIME_SLOTS = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00'
  ];

  const SERVICIOS = [
    'Mantenimiento Preventivo',
    'Mantenimiento Correctivo',
    'Cambio de Aceite',
    'Revisión de Frenos',
    'Alineación y Balanceo',
    'Revisión de Motor',
    'Cambio de Neumáticos',
    'Diagnóstico General'
  ];

  // ========== FUNCIONES DE RENIEC API ==========
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

      setNewAppointmentForm((prev) => ({
        ...prev,
        nombre: apiData.nombres || '',
        apellido: `${apiData.apellido_paterno || ''} ${apiData.apellido_materno || ''}`.trim(),
      }));

      setDataFromAPI(true);
      toast.success('¡DNI consultado exitosamente!');

      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.nombre;
        delete newErrors.apellido;
        delete newErrors.numeroDocumento;
        return newErrors;
      });

    } catch (error) {
      setDniError(error instanceof Error ? error.message : 'Error al consultar DNI');
      setDataFromAPI(false);
      setNewAppointmentForm((prev) => ({
        ...prev,
        nombre: '',
        apellido: '',
      }));
      console.error('Error completo:', error);
      toast.error('No se pudo consultar el DNI');
    } finally {
      setIsLoadingDNI(false);
    }
  };

  // Efecto para consultar DNI automáticamente cuando tenga 8 dígitos
  useEffect(() => {
    if (view === 'new-appointment' &&
      newAppointmentForm.tipoDocumento === 'DNI' &&
      newAppointmentForm.numeroDocumento.length === 8) {
      fetchDNIData(newAppointmentForm.numeroDocumento);
    } else {
      setDniError(null);
      setDataFromAPI(false);
    }
  }, [newAppointmentForm.numeroDocumento, newAppointmentForm.tipoDocumento, view]);

  // ========== CARGAR MARCAS Y MODELOS ==========
  useEffect(() => {
    cargarMarcasYModelos();
  }, []);

  const cargarMarcasYModelos = async () => {
    try {
      const marcasData = await marcasService.listarMarcas();
      setMarcas(marcasData);

      const modelosMap: Record<number, Modelo[]> = {};
      for (const marca of marcasData) {
        const modelos = await marcasService.listarModelos(marca.id);
        modelosMap[marca.id] = modelos;
      }
      setModelosPorMarca(modelosMap);

      console.log('✅ Marcas y modelos cargados correctamente');
    } catch (error) {
      console.error('Error al cargar marcas y modelos:', error);
      toast.error('Error al cargar información de vehículos');
    }
  };

  // Actualizar modelos cuando cambia la marca
  useEffect(() => {
    if (newAppointmentForm.marcaId > 0) {
      const modelos = modelosPorMarca[newAppointmentForm.marcaId] || [];
      setModelosDisponibles(modelos);
      // Resetear el modelo seleccionado si ya no está disponible
      if (!modelos.find(m => m.id === newAppointmentForm.modeloId)) {
        setNewAppointmentForm(prev => ({ ...prev, modeloId: 0 }));
      }
    } else {
      setModelosDisponibles([]);
      setNewAppointmentForm(prev => ({ ...prev, modeloId: 0 }));
    }
  }, [newAppointmentForm.marcaId, modelosPorMarca]);

  // Obtener nombre de marca por ID
  const getNombreMarca = (marcaId: number): string => {
    const marca = marcas.find(m => m.id === marcaId);
    return marca?.nombre || `Marca ID: ${marcaId}`;
  };

  // Obtener nombre de modelo por ID
  const getNombreModelo = (marcaId: number, modeloId: number): string => {
    const modelos = modelosPorMarca[marcaId] || [];
    const modelo = modelos.find(m => m.id === modeloId);
    return modelo?.nombre || `Modelo ID: ${modeloId}`;
  };

  // ========== BUSCAR CITA EXISTENTE ==========
  const handleSearchCita = async () => {
    if (!searchForm.numeroDocumento || !searchForm.placa) {
      toast.error('Ingresa el DNI y la placa del vehículo');
      return;
    }

    setSearchMode('searching');
    setLoading(true);

    try {
      const request: BuscarCitaRequest = {
        tipoDocumento: 'DNI', // Por defecto DNI en el admin
        numeroDocumento: searchForm.numeroDocumento,
        placa: searchForm.placa,
        sinPlaca: false, // false porque estamos buscando con placa
      };

      const response = await citasService.buscarCita(request);
      setFoundCita(response);
      setSearchMode('found');
      toast.success('¡Cita encontrada!');
    } catch (error) {
      console.error('Error al buscar cita:', error);
      toast.error('No se encontró ninguna cita con esos datos');
      setSearchMode('none');
      setFoundCita(null);
    } finally {
      setLoading(false);
    }
  };

  // ========== REAGENDAR CITA ==========
  const handleConfirmReschedule = async () => {
    if (!foundCita) return;

    if (!rescheduleForm.horaCita) {
      toast.error('Selecciona una hora para la cita');
      return;
    }

    setLoading(true);

    try {
      const fechaFormateada = format(rescheduleForm.fechaCita, 'yyyy-MM-dd');

      const request: ReagendarCitaRequest = {
        fecha: fechaFormateada,
        hora: rescheduleForm.horaCita,
      };

      await citasService.reagendarCita(foundCita.id, request);

      toast.success('¡Cita reagendada exitosamente!');
      setShowRescheduleDialog(false);

      // Recargar la cita actualizada
      const updatedCita = await citasService.buscarCita({
        tipoDocumento: 'DNI',
        numeroDocumento: searchForm.numeroDocumento,
        placa: searchForm.placa,
        sinPlaca: false,
      });
      setFoundCita(updatedCita);

    } catch (error) {
      console.error('Error al reagendar cita:', error);
      toast.error('Error al reagendar la cita');
    } finally {
      setLoading(false);
    }
  };

  // ========== ANULAR CITA ==========
  const handleConfirmCancel = async () => {
    if (!foundCita) return;

    setLoading(true);

    try {
      await citasService.anularCita(foundCita.id);

      toast.success('Cita anulada exitosamente');
      setShowCancelDialog(false);

      // Recargar la cita actualizada
      const updatedCita = await citasService.buscarCita({
        tipoDocumento: 'DNI',
        numeroDocumento: searchForm.numeroDocumento,
        placa: searchForm.placa,
        sinPlaca: false,
      });
      setFoundCita(updatedCita);

    } catch (error) {
      console.error('Error al anular cita:', error);
      toast.error('Error al anular la cita');
    } finally {
      setLoading(false);
    }
  };

  // ========== CREAR NUEVA CITA ==========
  const handleCreateAppointment = async () => {
    console.log('========== CREANDO CITA EN ADMIN ==========');
    console.log('📋 Datos del formulario:', newAppointmentForm);

    // Validaciones
    const errors: Record<string, string> = {};

    if (newAppointmentForm.tipoDocumento === 'DNI' && newAppointmentForm.numeroDocumento.length !== 8) {
      errors.numeroDocumento = 'El DNI debe tener 8 dígitos';
    } else if (!newAppointmentForm.numeroDocumento) {
      errors.numeroDocumento = 'El número de documento es requerido';
    }

    if (!newAppointmentForm.nombre.trim()) {
      errors.nombre = 'El nombre es requerido';
    }

    if (!newAppointmentForm.apellido.trim()) {
      errors.apellido = 'El apellido es requerido';
    }

    if (!newAppointmentForm.correo.trim()) {
      errors.correo = 'El correo es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newAppointmentForm.correo)) {
      errors.correo = 'Ingresa un correo válido';
    }

    if (newAppointmentForm.celular.length !== 9) {
      errors.celular = 'El celular debe tener 9 dígitos';
    }

    if (!newAppointmentForm.aceptaTerminos) {
      errors.aceptaTerminos = 'Debes aceptar los términos y condiciones';
    }

    if (!newAppointmentForm.placa.trim()) {
      errors.placa = 'La placa es requerida';
    }

    if (newAppointmentForm.marcaId === 0) {
      errors.marcaId = 'Selecciona una marca';
    }

    if (newAppointmentForm.modeloId === 0) {
      errors.modeloId = 'Selecciona un modelo';
    }

    if (!newAppointmentForm.hora) {
      errors.hora = 'Selecciona un horario';
    }

    if (!newAppointmentForm.tipoServicio) {
      errors.tipoServicio = 'Selecciona un tipo de servicio';
    }

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error('Por favor, completa todos los campos requeridos');
      return;
    }

    setLoading(true);

    try {
      const fechaFormateada = format(newAppointmentForm.fecha, 'yyyy-MM-dd');

      const citaRequest: CitaRequest = {
        // Datos del cliente
        tipoDocumento: newAppointmentForm.tipoDocumento,
        numeroDocumento: newAppointmentForm.numeroDocumento,
        nombre: newAppointmentForm.nombre,
        apellido: newAppointmentForm.apellido,
        correo: newAppointmentForm.correo,
        celular: newAppointmentForm.celular,
        aceptaTerminos: newAppointmentForm.aceptaTerminos,
        aceptaNovedades: newAppointmentForm.aceptaNovedades,

        // Datos del vehículo
        tipoVehiculo: newAppointmentForm.tipoVehiculo,
        placa: newAppointmentForm.placa || null,
        marcaId: newAppointmentForm.marcaId,
        modeloId: newAppointmentForm.modeloId,
        anio: newAppointmentForm.anio,
        version: newAppointmentForm.version || null,

        // Datos de la cita
        fecha: fechaFormateada,
        hora: newAppointmentForm.hora,
        tipoServicio: newAppointmentForm.tipoServicio,
        local: newAppointmentForm.local,
      };

      console.log('📤 Enviando al backend:', JSON.stringify(citaRequest, null, 2));

      const response = await citasService.crearCita(citaRequest);

      console.log('✅ ¡CITA CREADA EXITOSAMENTE!');
      console.log('📦 Respuesta del backend:', response);

      toast.success('¡Cita creada y guardada exitosamente!');

      // Resetear formulario y volver a la vista principal
      resetNewAppointmentForm();
      setView('main');

    } catch (error) {
      console.error('❌ ERROR AL CREAR LA CITA:', error);
      toast.error(error instanceof Error ? error.message : 'Error al crear la cita');
    } finally {
      setLoading(false);
    }
  };

  // ========== RESETEAR BÚSQUEDA ==========
  const resetSearch = () => {
    setSearchMode('none');
    setFoundCita(null);
    setSearchForm({
      numeroDocumento: '',
      placa: '',
    });
  };

  // ========== RESETEAR FORMULARIO DE NUEVA CITA ==========
  const resetNewAppointmentForm = () => {
    setNewAppointmentForm({
      tipoDocumento: 'DNI',
      numeroDocumento: '',
      nombre: '',
      apellido: '',
      correo: '',
      celular: '',
      aceptaTerminos: false,
      aceptaNovedades: false,
      tipoVehiculo: 'Auto',
      placa: '',
      marcaId: 0,
      modeloId: 0,
      anio: new Date().getFullYear(),
      version: '',
      fecha: new Date(),
      hora: '',
      tipoServicio: '',
      local: 'TALLER CENTRAL',
    });
    setValidationErrors({});
    setDataFromAPI(false);
    setDniError(null);
  };

  // Obtener badge de estado
  const getEstadoBadge = (estado: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      AGENDADA: { bg: 'bg-blue-500', text: 'text-white', label: 'Agendada' },
      COMPLETADA: { bg: 'bg-green-500', text: 'text-white', label: 'Completada' },
      CANCELADA: { bg: 'bg-red-500', text: 'text-white', label: 'Cancelada' },
    };

    const badge = badges[estado] || { bg: 'bg-gray-500', text: 'text-white', label: estado };
    return (
      <Badge className={`${badge.bg} ${badge.text}`}>
        {badge.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 mb-2">Gestión de Citas</h2>
          <p className="text-gray-600 text-sm">
            {view === 'main'
              ? 'Busca, visualiza, reagenda o anula citas existentes'
              : 'Registra una nueva cita en el sistema'
            }
          </p>
        </div>
        {view === 'main' && (
          <Button
            onClick={() => setView('new-appointment')}
            className="bg-[#22c55e] hover:bg-[#16a34a] text-white shadow-md"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Cita
          </Button>
        )}
      </div>

      {/* ========== VISTA PRINCIPAL: BUSCAR CITA ========== */}
      {view === 'main' && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900 flex items-center gap-2">
              <Search className="w-5 h-5 text-gray-500" />
              Buscar Cita
            </h3>
            {searchMode === 'found' && (
              <Button
                onClick={resetSearch}
                variant="outline"
                size="sm"
              >
                <X className="w-4 h-4 mr-1" />
                Nueva búsqueda
              </Button>
            )}
          </div>

          {searchMode === 'none' || searchMode === 'searching' ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Ingresa el DNI del cliente y la placa del vehículo para buscar una cita
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-700 mb-2 block">Número de Documento (DNI)</Label>
                  <Input
                    placeholder="Ej: 12345678"
                    value={searchForm.numeroDocumento}
                    onChange={(e) => setSearchForm({ ...searchForm, numeroDocumento: e.target.value })}
                    maxLength={8}
                  />
                </div>

                <div>
                  <Label className="text-gray-700 mb-2 block">Placa del Vehículo</Label>
                  <Input
                    placeholder="Ej: ABC-123"
                    value={searchForm.placa}
                    onChange={(e) => setSearchForm({ ...searchForm, placa: e.target.value.toUpperCase() })}
                  />
                </div>
              </div>

              <Button
                onClick={handleSearchCita}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Buscando...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Buscar Cita
                  </>
                )}
              </Button>
            </div>
          ) : foundCita && (
            <div className="space-y-6">
              {/* Información de la cita encontrada */}
              <div className="border rounded-lg p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-lg text-gray-900 mb-1">Cita Encontrada</h4>
                    <p className="text-sm text-gray-500">ID: {foundCita.id}</p>
                  </div>
                  {getEstadoBadge(foundCita.estado)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Cliente */}
                  <div>
                    <h5 className="text-sm text-gray-900 mb-3 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Información del Cliente
                    </h5>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">Nombre:</span>
                        <span className="ml-2 text-gray-900">
                          {foundCita.cliente.nombre} {foundCita.cliente.apellido}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Documento:</span>
                        <span className="ml-2 text-gray-900">
                          {foundCita.cliente.tipoDocumento}: {foundCita.cliente.numeroDocumento}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Correo:</span>
                        <span className="ml-2 text-gray-900">{foundCita.cliente.correo}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Celular:</span>
                        <span className="ml-2 text-gray-900">{foundCita.cliente.celular}</span>
                      </div>
                    </div>
                  </div>

                  {/* Vehículo */}
                  <div>
                    <h5 className="text-sm text-gray-900 mb-3 flex items-center gap-2">
                      <Car className="w-4 h-4" />
                      Información del Vehículo
                    </h5>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">Placa:</span>
                        <span className="ml-2 text-gray-900">{foundCita.detalleVehiculo.placa}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Tipo:</span>
                        <span className="ml-2 text-gray-900">{foundCita.detalleVehiculo.tipoVehiculo}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Marca:</span>
                        <span className="ml-2 text-gray-900">
                          {getNombreMarca(foundCita.detalleVehiculo.marcaId)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Modelo:</span>
                        <span className="ml-2 text-gray-900">
                          {getNombreModelo(foundCita.detalleVehiculo.marcaId, foundCita.detalleVehiculo.modeloId)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Año:</span>
                        <span className="ml-2 text-gray-900">{foundCita.detalleVehiculo.anio}</span>
                      </div>
                    </div>
                  </div>

                  {/* Cita */}
                  <div>
                    <h5 className="text-sm text-gray-900 mb-3 flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      Información de la Cita
                    </h5>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">Fecha:</span>
                        <span className="ml-2 text-gray-900">{foundCita.fechaCita}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Hora:</span>
                        <span className="ml-2 text-gray-900">{foundCita.horaCita}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Servicio:</span>
                        <span className="ml-2 text-gray-900">{foundCita.tipoServicio}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Local:</span>
                        <span className="ml-2 text-gray-900">{foundCita.localAtencion}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botones de acción */}
                {foundCita.estado === 'AGENDADA' && (
                  <div className="flex gap-3 pt-4 border-t">
                    <Button
                      onClick={() => setShowViewDialog(true)}
                      variant="outline"
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Detalles
                    </Button>
                    <Button
                      onClick={() => {
                        setRescheduleForm({
                          fechaCita: new Date(foundCita.fechaCita),
                          horaCita: foundCita.horaCita.substring(0, 5),
                        });
                        setShowRescheduleDialog(true);
                      }}
                      className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reagendar
                    </Button>
                    <Button
                      onClick={() => setShowCancelDialog(true)}
                      variant="destructive"
                      className="flex-1"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Anular
                    </Button>
                  </div>
                )}

                {(foundCita.estado === 'COMPLETADA' || foundCita.estado === 'CANCELADA') && (
                  <div className="flex gap-3 pt-4 border-t">
                    <Button
                      onClick={() => setShowViewDialog(true)}
                      variant="outline"
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Detalles
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========== VISTA: NUEVA CITA ========== */}
      {view === 'new-appointment' && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-gray-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-green-600" />
              Registrar Nueva Cita
            </h3>
            <Button
              onClick={() => {
                resetNewAppointmentForm();
                setView('main');
              }}
              variant="outline"
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Volver
            </Button>
          </div>

          <div className="space-y-6">
            {/* SECCIÓN 1: DATOS DEL CLIENTE */}
            <div className="border rounded-lg p-6">
              <h4 className="text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Datos del Cliente
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tipo de Documento */}
                <div>
                  <Label className="text-gray-700 mb-2 block">Tipo de documento *</Label>
                  <Select
                    value={newAppointmentForm.tipoDocumento}
                    onValueChange={(value) =>
                      setNewAppointmentForm({ ...newAppointmentForm, tipoDocumento: value, numeroDocumento: '' })
                    }
                  >
                    <SelectTrigger>
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

                {/* Número de Documento */}
                <div>
                  <Label className="text-gray-700 mb-2 block">Nº documento *</Label>
                  <div className="relative">
                    <Input
                      type="text"
                      value={newAppointmentForm.numeroDocumento}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (newAppointmentForm.tipoDocumento === 'DNI') {
                          if (/^\d*$/.test(value) && value.length <= 8) {
                            setNewAppointmentForm({ ...newAppointmentForm, numeroDocumento: value });
                            setShowNumericError(false);
                            if (validationErrors.numeroDocumento) {
                              const newErrors = { ...validationErrors };
                              delete newErrors.numeroDocumento;
                              setValidationErrors(newErrors);
                            }
                          } else if (!/^\d*$/.test(value)) {
                            setShowNumericError(true);
                          }
                        } else {
                          setNewAppointmentForm({ ...newAppointmentForm, numeroDocumento: value });
                          setShowNumericError(false);
                        }
                      }}
                      disabled={isLoadingDNI}
                    />
                    {isLoadingDNI && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                      </div>
                    )}
                  </div>
                  <div className="min-h-[20px] mt-1">
                    {showNumericError && newAppointmentForm.tipoDocumento === 'DNI' && (
                      <p className="text-xs text-red-600">Debe ingresar datos numéricos</p>
                    )}
                    {dniError && <p className="text-xs text-red-600">{dniError}</p>}
                    {isLoadingDNI && <p className="text-xs text-blue-600">Consultando DNI...</p>}
                    {dataFromAPI && <p className="text-xs text-green-600">✓ DNI consultado exitosamente</p>}
                    {validationErrors.numeroDocumento && !showNumericError && !dniError && !isLoadingDNI && (
                      <p className="text-xs text-red-600">{validationErrors.numeroDocumento}</p>
                    )}
                  </div>
                </div>

                {/* Nombre */}
                <div>
                  <Label className="text-gray-700 mb-2 block">Nombre *</Label>
                  <Input
                    placeholder="Nombre del cliente"
                    value={newAppointmentForm.nombre}
                    onChange={(e) => {
                      setNewAppointmentForm({ ...newAppointmentForm, nombre: e.target.value });
                      if (validationErrors.nombre) {
                        const newErrors = { ...validationErrors };
                        delete newErrors.nombre;
                        setValidationErrors(newErrors);
                      }
                    }}
                    disabled={isLoadingDNI || dataFromAPI}
                  />
                  {validationErrors.nombre && (
                    <p className="text-xs text-red-600 mt-1">{validationErrors.nombre}</p>
                  )}
                </div>

                {/* Apellido */}
                <div>
                  <Label className="text-gray-700 mb-2 block">Apellido *</Label>
                  <Input
                    placeholder="Apellido del cliente"
                    value={newAppointmentForm.apellido}
                    onChange={(e) => {
                      setNewAppointmentForm({ ...newAppointmentForm, apellido: e.target.value });
                      if (validationErrors.apellido) {
                        const newErrors = { ...validationErrors };
                        delete newErrors.apellido;
                        setValidationErrors(newErrors);
                      }
                    }}
                    disabled={isLoadingDNI || dataFromAPI}
                  />
                  {validationErrors.apellido && (
                    <p className="text-xs text-red-600 mt-1">{validationErrors.apellido}</p>
                  )}
                </div>

                {/* Correo */}
                <div>
                  <Label className="text-gray-700 mb-2 block">Correo electrónico *</Label>
                  <Input
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={newAppointmentForm.correo}
                    onChange={(e) => {
                      setNewAppointmentForm({ ...newAppointmentForm, correo: e.target.value });
                      if (validationErrors.correo) {
                        const newErrors = { ...validationErrors };
                        delete newErrors.correo;
                        setValidationErrors(newErrors);
                      }
                    }}
                  />
                  {validationErrors.correo && (
                    <p className="text-xs text-red-600 mt-1">{validationErrors.correo}</p>
                  )}
                </div>

                {/* Celular */}
                <div>
                  <Label className="text-gray-700 mb-2 block">Celular *</Label>
                  <Input
                    type="tel"
                    placeholder="9XXXXXXXX"
                    value={newAppointmentForm.celular}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value) && value.length <= 9) {
                        setNewAppointmentForm({ ...newAppointmentForm, celular: value });
                        setShowPhoneNumericError(false);
                        if (validationErrors.celular) {
                          const newErrors = { ...validationErrors };
                          delete newErrors.celular;
                          setValidationErrors(newErrors);
                        }
                      } else if (!/^\d*$/.test(value)) {
                        setShowPhoneNumericError(true);
                      }
                    }}
                  />
                  {showPhoneNumericError && (
                    <p className="text-xs text-red-600 mt-1">Debe ingresar datos numéricos</p>
                  )}
                  {validationErrors.celular && !showPhoneNumericError && (
                    <p className="text-xs text-red-600 mt-1">{validationErrors.celular}</p>
                  )}
                </div>
              </div>

              {/* Checkboxes */}
              <div className="mt-4 space-y-3">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="terms"
                    checked={newAppointmentForm.aceptaTerminos}
                    onCheckedChange={(checked) => {
                      setNewAppointmentForm({ ...newAppointmentForm, aceptaTerminos: checked as boolean });
                      if (validationErrors.aceptaTerminos && checked) {
                        const newErrors = { ...validationErrors };
                        delete newErrors.aceptaTerminos;
                        setValidationErrors(newErrors);
                      }
                    }}
                    className="mt-1"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer">
                    He leído y acepto los términos y condiciones *
                  </label>
                </div>
                {validationErrors.aceptaTerminos && (
                  <p className="text-xs text-red-600 ml-9">{validationErrors.aceptaTerminos}</p>
                )}

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="news"
                    checked={newAppointmentForm.aceptaNovedades}
                    onCheckedChange={(checked) =>
                      setNewAppointmentForm({ ...newAppointmentForm, aceptaNovedades: checked as boolean })
                    }
                    className="mt-1"
                  />
                  <label htmlFor="news" className="text-sm text-gray-700 cursor-pointer">
                    Acepto recibir información sobre promociones y novedades
                  </label>
                </div>
              </div>
            </div>

            {/* SECCIÓN 2: DATOS DEL VEHÍCULO */}
            <div className="border rounded-lg p-6">
              <h4 className="text-gray-900 mb-4 flex items-center gap-2">
                <Car className="w-5 h-5 text-blue-600" />
                Datos del Vehículo
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tipo de Vehículo */}
                <div>
                  <Label className="text-gray-700 mb-2 block">Tipo de vehículo *</Label>
                  <Select
                    value={newAppointmentForm.tipoVehiculo}
                    onValueChange={(value) =>
                      setNewAppointmentForm({ ...newAppointmentForm, tipoVehiculo: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Auto">Auto</SelectItem>
                      <SelectItem value="Camión">Camión</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Placa */}
                <div>
                  <Label className="text-gray-700 mb-2 block">Placa *</Label>
                  <Input
                    placeholder="ABC-123"
                    value={newAppointmentForm.placa}
                    onChange={(e) => {
                      setNewAppointmentForm({ ...newAppointmentForm, placa: e.target.value.toUpperCase() });
                      if (validationErrors.placa) {
                        const newErrors = { ...validationErrors };
                        delete newErrors.placa;
                        setValidationErrors(newErrors);
                      }
                    }}
                  />
                  {validationErrors.placa && (
                    <p className="text-xs text-red-600 mt-1">{validationErrors.placa}</p>
                  )}
                </div>

                {/* Marca */}
                <div>
                  <Label className="text-gray-700 mb-2 block">Marca *</Label>
                  <Select
                    value={newAppointmentForm.marcaId.toString()}
                    onValueChange={(value) => {
                      const marcaId = parseInt(value);
                      setNewAppointmentForm({ ...newAppointmentForm, marcaId });
                      if (validationErrors.marcaId) {
                        const newErrors = { ...validationErrors };
                        delete newErrors.marcaId;
                        setValidationErrors(newErrors);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una marca" />
                    </SelectTrigger>
                    <SelectContent>
                      {marcas.map((marca) => (
                        <SelectItem key={marca.id} value={marca.id.toString()}>
                          {marca.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {validationErrors.marcaId && (
                    <p className="text-xs text-red-600 mt-1">{validationErrors.marcaId}</p>
                  )}
                </div>

                {/* Modelo */}
                <div>
                  <Label className="text-gray-700 mb-2 block">Modelo *</Label>
                  <Select
                    value={newAppointmentForm.modeloId.toString()}
                    onValueChange={(value) => {
                      const modeloId = parseInt(value);
                      setNewAppointmentForm({ ...newAppointmentForm, modeloId });
                      if (validationErrors.modeloId) {
                        const newErrors = { ...validationErrors };
                        delete newErrors.modeloId;
                        setValidationErrors(newErrors);
                      }
                    }}
                    disabled={modelosDisponibles.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un modelo" />
                    </SelectTrigger>
                    <SelectContent>
                      {modelosDisponibles.map((modelo) => (
                        <SelectItem key={modelo.id} value={modelo.id.toString()}>
                          {modelo.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {validationErrors.modeloId && (
                    <p className="text-xs text-red-600 mt-1">{validationErrors.modeloId}</p>
                  )}
                </div>

                {/* Año */}
                <div>
                  <Label className="text-gray-700 mb-2 block">Año *</Label>
                  <Input
                    type="number"
                    placeholder="2024"
                    value={newAppointmentForm.anio}
                    onChange={(e) =>
                      setNewAppointmentForm({ ...newAppointmentForm, anio: parseInt(e.target.value) || new Date().getFullYear() })
                    }
                    min={1900}
                    max={new Date().getFullYear() + 1}
                  />
                </div>

                {/* Versión */}
                <div>
                  <Label className="text-gray-700 mb-2 block">Versión (opcional)</Label>
                  <Input
                    placeholder="Ej: GLX, GT, Turbo"
                    value={newAppointmentForm.version}
                    onChange={(e) =>
                      setNewAppointmentForm({ ...newAppointmentForm, version: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* SECCIÓN 3: DATOS DE LA CITA */}
            <div className="border rounded-lg p-6">
              <h4 className="text-gray-900 mb-4 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-blue-600" />
                Datos de la Cita
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tipo de Servicio */}
                <div className="md:col-span-2">
                  <Label className="text-gray-700 mb-2 block">Tipo de servicio *</Label>
                  <Select
                    value={newAppointmentForm.tipoServicio}
                    onValueChange={(value) => {
                      setNewAppointmentForm({ ...newAppointmentForm, tipoServicio: value });
                      if (validationErrors.tipoServicio) {
                        const newErrors = { ...validationErrors };
                        delete newErrors.tipoServicio;
                        setValidationErrors(newErrors);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un servicio" />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICIOS.map((servicio) => (
                        <SelectItem key={servicio} value={servicio}>
                          {servicio}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {validationErrors.tipoServicio && (
                    <p className="text-xs text-red-600 mt-1">{validationErrors.tipoServicio}</p>
                  )}
                </div>

                {/* Fecha */}

                {/* Fecha - Input Modificable */}
                <div>
                  <Label className="text-gray-700 mb-2 block">Fecha *</Label>
                  <Input
                    type="date"
                    value={newAppointmentForm.fecha ? format(newAppointmentForm.fecha, 'yyyy-MM-dd') : ''}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    onChange={(e) => {
                      // Validamos que el input no esté vacío
                      if (!e.target.value) return;

                      // Dividimos el string para crear la fecha localmente y evitar errores de zona horaria
                      const [year, month, day] = e.target.value.split('-').map(Number);
                      const newDate = new Date(year, month - 1, day);

                      setNewAppointmentForm({ ...newAppointmentForm, fecha: newDate });
                    }}
                  />
                </div>


                {/* Hora */}
                <div>
                  <Label className="text-gray-700 mb-2 block">Hora *</Label>
                  <Select
                    value={newAppointmentForm.hora}
                    onValueChange={(value) => {
                      setNewAppointmentForm({ ...newAppointmentForm, hora: value });
                      if (validationErrors.hora) {
                        const newErrors = { ...validationErrors };
                        delete newErrors.hora;
                        setValidationErrors(newErrors);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una hora" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_SLOTS.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {validationErrors.hora && (
                    <p className="text-xs text-red-600 mt-1">{validationErrors.hora}</p>
                  )}
                </div>

                {/* Local */}
                <div className="md:col-span-2">
                  <Label className="text-gray-700 mb-2 block">Local de atención *</Label>
                  <Select
                    value={newAppointmentForm.local}
                    onValueChange={(value) =>
                      setNewAppointmentForm({ ...newAppointmentForm, local: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TALLER CENTRAL">Av. Aviación 1003, La Victoria</SelectItem>
                      <SelectItem value="SUCURSAL NORTE">Av. Javier Prado Este 5268, La Molina</SelectItem>
                      <SelectItem value="SUCURSAL SUR">Av. Universitaria 1801, San Miguel</SelectItem>
                      <SelectItem value="SUCURSAL CENTRO">Av. Los Héroes 123, San Juan de Miraflores</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  resetNewAppointmentForm();
                  setView('main');
                }}
                variant="outline"
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCreateAppointment}
                disabled={loading}
                className="flex-1 bg-[#22c55e] hover:bg-[#16a34a] text-white shadow-md"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Crear Cita
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========== DIALOG: REAGENDAR CITA ========== */}
      {showRescheduleDialog && foundCita && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-gray-900 mb-4">Reagendar Cita</h3>

            <div className="space-y-4 mb-6">
              <div>
                <Label className="text-gray-700 mb-2 block">Nueva Fecha</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(rescheduleForm.fechaCita, 'PPP', { locale: es })}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={rescheduleForm.fechaCita}
                      onSelect={(date) =>
                        date && setRescheduleForm({ ...rescheduleForm, fechaCita: date })
                      }
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label className="text-gray-700 mb-2 block">Nueva Hora</Label>
                <Select
                  value={rescheduleForm.horaCita}
                  onValueChange={(value) =>
                    setRescheduleForm({ ...rescheduleForm, horaCita: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una hora" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_SLOTS.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setShowRescheduleDialog(false)}
                variant="outline"
                className="flex-1"
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleConfirmReschedule}
                disabled={loading}
                className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  'Confirmar'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========== DIALOG: ANULAR CITA ========== */}
      {showCancelDialog && foundCita && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-gray-900">Anular Cita</h3>
                <p className="text-sm text-gray-600">Esta acción no se puede deshacer</p>
              </div>
            </div>

            <p className="text-gray-700 mb-6">
              ¿Estás seguro de que deseas anular la cita del cliente{' '}
              <span className="font-medium">{foundCita.cliente.nombre} {foundCita.cliente.apellido}</span>?
            </p>

            <div className="flex gap-3">
              <Button
                onClick={() => setShowCancelDialog(false)}
                variant="outline"
                className="flex-1"
                disabled={loading}
              >
                No, mantener
              </Button>
              <Button
                onClick={handleConfirmCancel}
                disabled={loading}
                variant="destructive"
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Anulando...
                  </>
                ) : (
                  'Sí, anular'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}