import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import {
  Eye,
  Pencil,
  Trash2,
  Plus,
  Search,
  Wrench,
  User,
  Settings,
  CheckCircle2,
  CalendarIcon,
  Clock,
  X,
  Bell,
  Printer,
  RotateCcw,
  ExternalLink,
  AlertTriangle,
  Archive,
  Phone,
  Mail,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Appointment {
  id: number;
  date: string;
  time: string;
  vehicle: string;
  vehiclePlate: string;
  client: string;
  clientEmail: string;
  clientPhone: string;
  service: string;
  location: string;
  technician: string;
  status: 'en-proceso' | 'pendiente' | 'completada' | 'cancelada';
  duration: string;
  notes: string;
  priority: 'normal' | 'urgente';
  price: number;
}

const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 1,
    date: 'Lun 14',
    time: '07:40',
    vehicle: 'Toyota Corolla',
    vehiclePlate: 'ABC-123',
    client: 'María López',
    clientEmail: 'maria.lopez@email.com',
    clientPhone: '+51 999 222 111',
    service: 'Preventivo',
    location: 'Central',
    technician: 'No asignado',
    status: 'en-proceso',
    duration: '2h',
    notes: 'Cliente solicita revisión general del vehículo.',
    priority: 'normal',
    price: 80,
  },
  {
    id: 2,
    date: 'Mar 15',
    time: '09:00',
    vehicle: 'Hyundai Tucson',
    vehiclePlate: 'XYZ-221',
    client: 'Carlos Vega',
    clientEmail: 'carlos.vega@email.com',
    clientPhone: '+51 987 654 321',
    service: 'Frenos',
    location: 'Central',
    technician: 'Ana Ruiz',
    status: 'pendiente',
    duration: '1.5h',
    notes: 'Revisar sistema de frenos delanteros.',
    priority: 'normal',
    price: 120,
  },
  {
    id: 3,
    date: 'Mié 16',
    time: '13:00',
    vehicle: 'Kia Rio',
    vehiclePlate: 'JKS-987',
    client: 'Lucía Méndez',
    clientEmail: 'lucia.mendez@email.com',
    clientPhone: '+51 999 222 111',
    service: 'Alineación y balanceo',
    location: 'Central',
    technician: 'Pedro Díaz',
    status: 'completada',
    duration: '1h',
    notes: 'Vibración a partir de 80 km/h. Revisar desgaste irregular de neumáticos.',
    priority: 'normal',
    price: 45,
  },
  {
    id: 4,
    date: 'Jue 17',
    time: '16:20',
    vehicle: 'Ford Ranger',
    vehiclePlate: 'FBK-852',
    client: 'Andrés Soto',
    clientEmail: 'andres.soto@email.com',
    clientPhone: '+51 912 345 678',
    service: 'Motor',
    location: 'Central',
    technician: 'No asignado',
    status: 'cancelada',
    duration: '3h',
    notes: 'Cliente canceló por emergencia personal.',
    priority: 'urgente',
    price: 200,
  },
];

const TIME_SLOTS = [
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
];

export function AppointmentManagement() {
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [view, setView] = useState<'lista' | 'calendario' | 'kanban'>('lista');
  const [dateFilter, setDateFilter] = useState('esta-semana');
  const [filterLocation, setFilterLocation] = useState('todos');
  const [filterTechnician, setFilterTechnician] = useState('todos');
  const [filterService, setFilterService] = useState('multiple');
  const [filterStatus, setFilterStatus] = useState<string[]>(['pendiente', 'en-proceso']);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados para nueva cita
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Estados para visualización y eliminación
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [viewingAppointment, setViewingAppointment] = useState<Appointment | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingAppointment, setDeletingAppointment] = useState<Appointment | null>(null);

  // Form data
  const [formData, setFormData] = useState({
    client: '',
    contact: '',
    vehicleBrand: '',
    plate: '',
    service: '',
    location: '',
    priority: 'normal',
    initialStatus: 'programada',
    date: new Date(),
    duration: '1h',
    selectedTime: '',
    notes: '',
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const resetForm = () => {
    setFormData({
      client: '',
      contact: '',
      vehicleBrand: '',
      plate: '',
      service: '',
      location: '',
      priority: 'normal',
      initialStatus: 'programada',
      date: new Date(),
      duration: '1h',
      selectedTime: '',
      notes: '',
    });
  };

  const handleCreateAppointment = () => {
    if (!formData.client || !formData.plate || !formData.service || !formData.selectedTime) {
      alert('Por favor completa los campos obligatorios');
      return;
    }

    const newAppointment: Appointment = {
      id: appointments.length + 1,
      date: format(formData.date, 'EEE dd', { locale: es }),
      time: formData.selectedTime,
      vehicle: formData.vehicleBrand || 'Vehículo',
      vehiclePlate: formData.plate,
      client: formData.client,
      clientEmail: formData.contact.includes('@') ? formData.contact : 'cliente@email.com',
      clientPhone: formData.contact.includes('@') ? '+51 999 999 999' : formData.contact,
      service: formData.service,
      location: formData.location || 'Central',
      technician: 'No asignado',
      status: 'pendiente',
      duration: formData.duration,
      notes: formData.notes,
      priority: formData.priority as 'normal' | 'urgente',
      price: 100,
    };

    setAppointments([...appointments, newAppointment]);
    setSuccessMessage('Cita creada exitosamente');
    setShowSuccessDialog(true);
    setShowNewAppointment(false);
    resetForm();
  };

  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setShowEditDialog(true);
  };

  const handleSaveEdit = () => {
    if (!editingAppointment) return;

    setAppointments(
      appointments.map((apt) =>
        apt.id === editingAppointment.id ? editingAppointment : apt
      )
    );
    setSuccessMessage('Cita actualizada exitosamente');
    setShowSuccessDialog(true);
    setShowEditDialog(false);
    setEditingAppointment(null);
  };

  const handleView = (appointment: Appointment) => {
    setViewingAppointment(appointment);
    setShowViewDialog(true);
  };

  const handleDeleteClick = (appointment: Appointment) => {
    setDeletingAppointment(appointment);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (!deletingAppointment) return;
    
    setAppointments(appointments.filter((apt) => apt.id !== deletingAppointment.id));
    setSuccessMessage('Cita eliminada exitosamente');
    setShowSuccessDialog(true);
    setShowDeleteDialog(false);
    setDeletingAppointment(null);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'en-proceso': { label: 'En proceso', className: 'bg-orange-100 text-orange-800' },
      pendiente: { label: 'Pendiente', className: 'bg-yellow-100 text-yellow-800' },
      completada: { label: 'Completada', className: 'bg-green-100 text-green-800' },
      cancelada: { label: 'Cancelada', className: 'bg-red-100 text-red-800' },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge className={`${config.className} border-0`}>{config.label}</Badge>
    );
  };

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus.length === 0 || filterStatus.includes(apt.status);
    return matchesSearch && matchesStatus;
  });

  // Vista Nueva Cita
  if (showNewAppointment) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-gray-900 mb-1">Nueva cita</h2>
            <button
              onClick={() => {
                setShowNewAppointment(false);
                resetForm();
              }}
              className="text-sm text-orange-600 hover:text-orange-700 flex items-center gap-1"
            >
              ← Volver a Citas
            </button>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-gray-300">
              Semana actual
            </Button>
            <Button variant="outline" className="border-gray-300">
              Todos los estados
            </Button>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          {/* Información del cliente */}
          <div className="mb-6">
            <h3 className="mb-4 text-gray-900">Información del cliente</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-700 mb-2 block">Cliente</Label>
                <Input
                  placeholder="Buscar o crear cliente"
                  value={formData.client}
                  onChange={(e) => handleInputChange('client', e.target.value)}
                  className="bg-white"
                />
              </div>
              <div>
                <Label className="text-gray-700 mb-2 block">Contacto</Label>
                <Input
                  placeholder="Teléfono o correo"
                  value={formData.contact}
                  onChange={(e) => handleInputChange('contact', e.target.value)}
                  className="bg-white"
                />
              </div>
            </div>
          </div>

          {/* Vehículo */}
          <div className="mb-6">
            <h3 className="mb-4 text-gray-900">Vehículo</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-700 mb-2 block">Marca / Modelo</Label>
                <Input
                  placeholder="Ej. Toyota Corolla 2018"
                  value={formData.vehicleBrand}
                  onChange={(e) => handleInputChange('vehicleBrand', e.target.value)}
                  className="bg-white"
                />
              </div>
              <div>
                <Label className="text-gray-700 mb-2 block">Placa</Label>
                <Input
                  placeholder="AAA-123"
                  value={formData.plate}
                  onChange={(e) => handleInputChange('plate', e.target.value)}
                  className="bg-white"
                />
              </div>
            </div>
          </div>

          {/* Servicio y taller */}
          <div className="mb-6">
            <h3 className="mb-4 text-gray-900">Servicio y taller</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label className="text-gray-700 mb-2 block">Servicio</Label>
                <Select value={formData.service} onValueChange={(value) => handleInputChange('service', value)}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Seleccionar servicio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Preventivo">Preventivo</SelectItem>
                    <SelectItem value="Frenos">Frenos</SelectItem>
                    <SelectItem value="Alineación">Alineación</SelectItem>
                    <SelectItem value="Motor">Motor</SelectItem>
                    <SelectItem value="Cambio de aceite">Cambio de aceite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-gray-700 mb-2 block">Taller</Label>
                <Select value={formData.location} onValueChange={(value) => handleInputChange('location', value)}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Sede" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Central">Central</SelectItem>
                    <SelectItem value="Norte">Norte</SelectItem>
                    <SelectItem value="Sur">Sur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-700 mb-2 block">Prioridad</Label>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleInputChange('priority', 'normal')}
                    className={`flex items-center gap-2 px-4 py-2 rounded border ${
                      formData.priority === 'normal'
                        ? 'bg-orange-50 border-orange-500 text-orange-700'
                        : 'bg-white border-gray-300'
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    Normal
                  </button>
                  <button
                    onClick={() => handleInputChange('priority', 'urgente')}
                    className={`flex items-center gap-2 px-4 py-2 rounded border ${
                      formData.priority === 'urgente'
                        ? 'bg-orange-50 border-orange-500 text-orange-700'
                        : 'bg-white border-gray-300'
                    }`}
                  >
                    <span className="text-orange-600">⚠</span>
                    Urgente
                  </button>
                </div>
              </div>
              <div>
                <Label className="text-gray-700 mb-2 block">Estado inicial</Label>
                <div className="flex gap-2">
                  {['Programada', 'Confirmada', 'Pendiente'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleInputChange('initialStatus', status.toLowerCase())}
                      className={`px-3 py-2 text-sm rounded ${
                        formData.initialStatus === status.toLowerCase()
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Fecha y hora */}
          <div className="mb-6">
            <h3 className="mb-4 text-gray-900">Fecha y hora</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label className="text-gray-700 mb-2 block">Fecha</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start bg-white">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(formData.date, 'EEE dd MMM yyyy', { locale: es })}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={(date) => date && handleInputChange('date', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label className="text-gray-700 mb-2 block">Duración</Label>
                <Select value={formData.duration} onValueChange={(value) => handleInputChange('duration', value)}>
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.5h">30 min</SelectItem>
                    <SelectItem value="1h">1 h</SelectItem>
                    <SelectItem value="1.5h">1.5 h</SelectItem>
                    <SelectItem value="2h">2 h</SelectItem>
                    <SelectItem value="3h">3 h</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-gray-700 mb-2 block">
                Disponibilidad (hoy) - Taller Central
              </Label>
              <div className="flex gap-2 flex-wrap">
                {TIME_SLOTS.map((time) => (
                  <button
                    key={time}
                    onClick={() => handleInputChange('selectedTime', time)}
                    className={`px-4 py-2 rounded text-sm ${
                      formData.selectedTime === time
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Notas */}
          <div className="mb-6">
            <Label className="text-gray-700 mb-2 block">Notas</Label>
            <Textarea
              placeholder="Describe el problema, síntomas o instrucciones adicionales."
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className="bg-white min-h-24"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="flex gap-3">
              <Button variant="outline" className="border-gray-300">
                <span className="mr-2">📋</span>
                Guardar borrador
              </Button>
              <Button variant="outline" className="border-gray-300">
                <span className="mr-2">✉️</span>
                Confirmar por email
              </Button>
              <Button variant="outline" className="border-gray-300">
                <span className="mr-2">📱</span>
                Enviar SMS
              </Button>
            </div>
            <Button
              onClick={handleCreateAppointment}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Crear cita
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Vista Lista de Citas
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <span>Inicio</span>
            <span>›</span>
            <span>Citas</span>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant={dateFilter === 'hoy' ? 'default' : 'outline'}
            onClick={() => setDateFilter('hoy')}
            className={dateFilter === 'hoy' ? 'bg-orange-500 hover:bg-orange-600' : ''}
          >
            Hoy
          </Button>
          <Button
            variant={dateFilter === 'esta-semana' ? 'default' : 'outline'}
            onClick={() => setDateFilter('esta-semana')}
            className={dateFilter === 'esta-semana' ? 'bg-orange-500 hover:bg-orange-600' : ''}
          >
            Esta semana
          </Button>
          <Button
            variant={dateFilter === 'este-mes' ? 'default' : 'outline'}
            onClick={() => setDateFilter('este-mes')}
            className={dateFilter === 'este-mes' ? 'bg-orange-500 hover:bg-orange-600' : ''}
          >
            Este mes
          </Button>
          <Button
            onClick={() => setShowNewAppointment(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva cita
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Taller</span>
            <Select value={filterLocation} onValueChange={setFilterLocation}>
              <SelectTrigger className="w-32 bg-white border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="central">Central</SelectItem>
                <SelectItem value="norte">Norte</SelectItem>
                <SelectItem value="sur">Sur</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Técnico</span>
            <Select value={filterTechnician} onValueChange={setFilterTechnician}>
              <SelectTrigger className="w-32 bg-white border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="ana-ruiz">Ana Ruiz</SelectItem>
                <SelectItem value="pedro-diaz">Pedro Díaz</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Servicio</span>
            <Select value={filterService} onValueChange={setFilterService}>
              <SelectTrigger className="w-32 bg-white border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="multiple">Multiple</SelectItem>
                <SelectItem value="preventivo">Preventivo</SelectItem>
                <SelectItem value="frenos">Frenos</SelectItem>
                <SelectItem value="motor">Motor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Estados</span>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setFilterStatus(
                    filterStatus.includes('pendiente')
                      ? filterStatus.filter((s) => s !== 'pendiente')
                      : [...filterStatus, 'pendiente']
                  )
                }
                className={`px-3 py-1 text-sm rounded ${
                  filterStatus.includes('pendiente')
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                Pendiente
              </button>
              <button
                onClick={() =>
                  setFilterStatus(
                    filterStatus.includes('en-proceso')
                      ? filterStatus.filter((s) => s !== 'en-proceso')
                      : [...filterStatus, 'en-proceso']
                  )
                }
                className={`px-3 py-1 text-sm rounded ${
                  filterStatus.includes('en-proceso')
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                En proceso
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={view === 'lista' ? 'default' : 'outline'}
            onClick={() => setView('lista')}
            className={view === 'lista' ? 'bg-orange-500 hover:bg-orange-600' : ''}
          >
            Lista
          </Button>
          <Button variant="outline" onClick={() => setView('calendario')}>
            Calendario
          </Button>
          <Button variant="outline" onClick={() => setView('kanban')}>
            Kanban
          </Button>
        </div>
        <div className="flex gap-2 text-sm text-gray-600">
          <span>Semana actual</span>
          <button className="text-blue-600">◀</button>
          <button className="text-blue-600">▶</button>
          <span className="ml-2">Vista: Día</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <h3 className="px-6 py-4 border-b">
          Calendario semanal <span className="text-orange-600">• Citas</span>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-orange-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-sm text-gray-700">Fecha</th>
                <th className="text-left px-4 py-3 text-sm text-gray-700">Hora</th>
                <th className="text-left px-4 py-3 text-sm text-gray-700">Vehículo</th>
                <th className="text-left px-4 py-3 text-sm text-gray-700">Cliente</th>
                <th className="text-left px-4 py-3 text-sm text-gray-700">Servicio</th>
                <th className="text-left px-4 py-3 text-sm text-gray-700">Taller</th>
                <th className="text-left px-4 py-3 text-sm text-gray-700">Técnico</th>
                <th className="text-left px-4 py-3 text-sm text-gray-700">Estado</th>
                <th className="text-left px-4 py-3 text-sm text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((apt) => (
                <tr key={apt.id} className="border-b last:border-b-0 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{apt.date}</td>
                  <td className="px-4 py-3 text-sm">{apt.time}</td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-900">{apt.vehicle}</div>
                    <div className="text-xs text-gray-500">Placa {apt.vehiclePlate}</div>
                  </td>
                  <td className="px-4 py-3 text-sm">{apt.client}</td>
                  <td className="px-4 py-3 text-sm">{apt.service}</td>
                  <td className="px-4 py-3 text-sm">{apt.location}</td>
                  <td className="px-4 py-3 text-sm">
                    {apt.technician === 'No asignado' ? (
                      <span className="text-gray-400">{apt.technician}</span>
                    ) : (
                      apt.technician
                    )}
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(apt.status)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleView(apt)}
                        className="text-orange-600 hover:text-orange-700"
                        title="Visualizar"
                      >
                        Visualizar
                      </button>
                      <button
                        onClick={() => handleEdit(apt)}
                        className="text-orange-600 hover:text-orange-700"
                        title="Editar"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteClick(apt)}
                        className="text-orange-600 hover:text-orange-700"
                        title="Eliminar"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <div className="flex items-center justify-between pb-3 border-b">
              <div className="flex items-center gap-2">
                <Pencil className="w-5 h-5" />
                <DialogTitle>Editar cita</DialogTitle>
              </div>
              <button
                onClick={() => setShowEditDialog(false)}
                className="text-orange-600 hover:text-orange-700 flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Cancelar
              </button>
            </div>
          </DialogHeader>

          {editingAppointment && (
            <div className="grid grid-cols-2 gap-6 overflow-auto flex-1 py-4">
              {/* Left side - Form */}
              <div className="space-y-4">
                {/* Cliente */}
                <div>
                  <Label className="text-gray-700 mb-1.5 block text-sm">Cliente</Label>
                  <Select
                    value={editingAppointment.client}
                    onValueChange={(value) =>
                      setEditingAppointment({ ...editingAppointment, client: value })
                    }
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Juan Pérez">Juan Pérez</SelectItem>
                      <SelectItem value="María López">María López</SelectItem>
                      <SelectItem value="Carlos Vega">Carlos Vega</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Vehículo */}
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <Label className="text-gray-700 mb-1.5 block text-sm">Vehículo</Label>
                    <Input
                      value={editingAppointment.vehicle}
                      onChange={(e) =>
                        setEditingAppointment({ ...editingAppointment, vehicle: e.target.value })
                      }
                      className="bg-white"
                    />
                  </div>
                  <div className="w-32">
                    <Label className="text-gray-700 mb-1.5 block text-sm">Placa</Label>
                    <Input
                      value={editingAppointment.vehiclePlate}
                      onChange={(e) =>
                        setEditingAppointment({ ...editingAppointment, vehiclePlate: e.target.value })
                      }
                      className="bg-white"
                    />
                  </div>
                </div>

                {/* Fecha y hora */}
                <div>
                  <Label className="text-gray-700 mb-1.5 block text-sm">Fecha y hora</Label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <CalendarIcon className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input 
                        value={editingAppointment.date} 
                        onChange={(e) =>
                          setEditingAppointment({ ...editingAppointment, date: e.target.value })
                        }
                        className="bg-white pl-8" 
                        placeholder="Jue 17 Oct"
                      />
                    </div>
                    <div className="w-28 relative">
                      <Clock className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input 
                        value={editingAppointment.time}
                        onChange={(e) =>
                          setEditingAppointment({ ...editingAppointment, time: e.target.value })
                        }
                        className="bg-white pl-8" 
                        placeholder="10:00"
                      />
                    </div>
                    <div className="w-28 relative">
                      <Clock className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input 
                        value={editingAppointment.duration}
                        onChange={(e) =>
                          setEditingAppointment({ ...editingAppointment, duration: e.target.value })
                        }
                        className="bg-white pl-8" 
                        placeholder="60 min"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1.5">
                    Ajusta el horario para evitar solapamientos con otros trabajos.
                  </p>
                </div>

                {/* Servicios */}
                <div>
                  <Label className="text-gray-700 mb-1.5 block text-sm">Servicios</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2.5 bg-orange-50 rounded border border-orange-100">
                      <span className="text-orange-900">{editingAppointment.service}</span>
                      <span className="px-2.5 py-1 bg-white rounded-full text-sm border">${editingAppointment.price}</span>
                    </div>
                    <div className="flex gap-3">
                      <button className="text-orange-600 text-sm flex items-center gap-1 hover:text-orange-700">
                        <Plus className="w-3.5 h-3.5" />
                        Agregar servicio
                      </button>
                      <button className="text-orange-600 text-sm flex items-center gap-1 hover:text-orange-700">
                        <span>🔄</span>
                        Aplicar descuento
                      </button>
                    </div>
                  </div>
                </div>

                {/* Asignación */}
                <div>
                  <Label className="text-gray-700 mb-1.5 block text-sm">Asignación</Label>
                  <div className="flex gap-3">
                    <Select
                      value={editingAppointment.technician}
                      onValueChange={(value) =>
                        setEditingAppointment({ ...editingAppointment, technician: value })
                      }
                    >
                      <SelectTrigger className="bg-white flex-1">
                        <SelectValue placeholder="Técnico" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="No asignado">No asignado</SelectItem>
                        <SelectItem value="Ana Torres">Ana Torres</SelectItem>
                        <SelectItem value="Pedro Díaz">Pedro Díaz</SelectItem>
                        <SelectItem value="Ana Ruiz">Ana Ruiz</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="bahia-3">
                      <SelectTrigger className="bg-white w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bahia-1">Bahía 1</SelectItem>
                        <SelectItem value="bahia-2">Bahía 2</SelectItem>
                        <SelectItem value="bahia-3">Bahía 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="text-xs text-gray-500 mt-1.5">
                    Selecciona técnico y bahía disponibles.
                  </p>
                </div>
              </div>

              {/* Right side - Summary */}
              <div className="bg-orange-50 p-4 rounded-lg space-y-3 h-fit">
                <h4 className="text-orange-900 mb-3">Resumen</h4>
                
                <div>
                  <p className="text-xs text-orange-700 mb-0.5">Cliente</p>
                  <p className="text-orange-900">{editingAppointment.client}</p>
                </div>

                <div>
                  <p className="text-xs text-orange-700 mb-0.5">Vehículo</p>
                  <p className="text-gray-900">{editingAppointment.vehicle} {editingAppointment.vehiclePlate}</p>
                </div>

                <div>
                  <p className="text-xs text-orange-700 mb-0.5">Fecha</p>
                  <p className="text-gray-900">{editingAppointment.date}</p>
                </div>

                <div>
                  <p className="text-xs text-orange-700 mb-0.5">Horario</p>
                  <p className="text-gray-900">{editingAppointment.time} — {editingAppointment.duration}</p>
                </div>

                <div>
                  <p className="text-xs text-orange-700 mb-0.5">Técnico</p>
                  <p className="text-gray-900">{editingAppointment.technician === 'No asignado' ? (
                    <span className="text-gray-500">{editingAppointment.technician}</span>
                  ) : (
                    editingAppointment.technician
                  )}</p>
                </div>

                <div className="pt-3 border-t border-orange-200">
                  <p className="text-xs text-orange-700 mb-0.5">Notas internas</p>
                  <p className="text-sm text-orange-900">
                    {editingAppointment.notes || 'Sin notas'}
                  </p>
                </div>

                <div className="pt-3 border-t border-orange-200">
                  <p className="text-xs text-orange-700 mb-2">Notificaciones</p>
                  <div className="flex items-start gap-2">
                    <input type="checkbox" id="notify" className="rounded mt-0.5" />
                    <div className="flex-1">
                      <label htmlFor="notify" className="text-sm text-gray-900 flex items-center gap-1">
                        Reenviar confirmación al cliente
                        <Bell className="w-3.5 h-3.5" />
                      </label>
                      <p className="text-xs text-gray-600 mt-1">Se enviará por SMS y correo.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="flex justify-between items-center pt-3 border-t flex-shrink-0">
            <Button 
              variant="outline" 
              onClick={() => setShowEditDialog(false)}
              className="text-gray-600"
            >
              <span className="mr-1.5">←</span>
              Descartar cambios
            </Button>
            <div className="flex gap-2.5">
              <Button variant="outline" className="border-gray-300 text-gray-700">
                <span className="mr-1.5">📋</span>
                Guardar como borrador
              </Button>
              <Button
                onClick={handleSaveEdit}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                <span className="mr-1.5">💾</span>
                Guardar cambios
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <DialogTitle className="text-xl">Éxito</DialogTitle>
            </div>
            <p className="text-gray-600">{successMessage}</p>
          </DialogHeader>
          <div className="flex justify-end mt-4">
            <Button
              onClick={() => setShowSuccessDialog(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Regresar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-lg max-h-[85vh] flex flex-col">
          <DialogHeader className="flex flex-row items-center justify-between pb-4 flex-shrink-0">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              <DialogTitle>Detalle de cita</DialogTitle>
            </div>
            <button
              onClick={() => setShowViewDialog(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </DialogHeader>

          {viewingAppointment && (
            <div className="space-y-3 pt-2 overflow-y-auto flex-1 pr-2">
              {/* Fecha y Hora */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Fecha</p>
                  <p className="text-gray-900">{viewingAppointment.date}, Oct 2025</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Hora</p>
                  <p className="text-gray-900">{viewingAppointment.time}</p>
                </div>
              </div>

              {/* Cliente */}
              <div>
                <p className="text-sm text-gray-600 mb-1">Cliente</p>
                <p className="text-gray-900">{viewingAppointment.client}</p>
              </div>

              {/* Vehículo */}
              <div>
                <p className="text-sm text-gray-600 mb-1">Vehículo</p>
                <p className="text-gray-900">
                  {viewingAppointment.vehicle} — Placa {viewingAppointment.vehiclePlate}
                </p>
              </div>

              {/* Servicio */}
              <div>
                <p className="text-sm text-gray-600 mb-1">Servicio</p>
                <p className="text-gray-900">{viewingAppointment.service}</p>
              </div>

              {/* Taller */}
              <div>
                <p className="text-sm text-gray-600 mb-1">Taller</p>
                <p className="text-gray-900">{viewingAppointment.location}</p>
              </div>

              {/* Descripción / Notas */}
              <div>
                <p className="text-sm text-gray-600 mb-1">Descripción / Notas</p>
                <p className="text-gray-900">
                  {viewingAppointment.notes || 'Sin notas adicionales'}
                </p>
              </div>

              {/* Estado */}
              <div>
                <p className="text-sm text-gray-600 mb-2">Estado</p>
                {getStatusBadge(viewingAppointment.status)}
              </div>

              {/* Técnico asignado */}
              <div>
                <p className="text-sm text-gray-600 mb-2">Técnico asignado</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                    <User className="w-4 h-4 text-orange-600" />
                  </div>
                  <span className="text-gray-900">
                    {viewingAppointment.technician}
                  </span>
                </div>
              </div>

              {/* Contacto */}
              <div>
                <p className="text-sm text-gray-600 mb-2">Contacto</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{viewingAppointment.clientPhone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>{viewingAppointment.clientEmail}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="flex flex-wrap gap-2 pt-4 border-t mt-4 flex-shrink-0">
            <Button variant="outline" size="sm">
              <Printer className="w-4 h-4 mr-1" />
              Imprimir
            </Button>
            <Button variant="outline" size="sm">
              <RotateCcw className="w-4 h-4 mr-1" />
              Reprogramar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (viewingAppointment) {
                  setShowViewDialog(false);
                  handleEdit(viewingAppointment);
                }
              }}
            >
              <Pencil className="w-4 h-4 mr-1" />
              Editar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (viewingAppointment) {
                  setShowViewDialog(false);
                  handleDeleteClick(viewingAppointment);
                }
              }}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Eliminar
            </Button>
            <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
              <ExternalLink className="w-4 h-4 mr-1" />
              Abrir detalle
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-xl max-h-[85vh] flex flex-col">
          <DialogHeader className="pb-4 flex-shrink-0">
            <div className="flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              <DialogTitle>Eliminar cita</DialogTitle>
            </div>
          </DialogHeader>

          {deletingAppointment && (
            <div className="space-y-4 pt-2 overflow-y-auto flex-1 pr-2">
              {/* Warning Banner */}
              <div className="bg-orange-500 text-white p-4 rounded-lg flex gap-3">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="mb-1">Esta acción no se puede deshacer.</p>
                  <p className="text-sm text-orange-100">
                    Se eliminarán permanentemente la cita seleccionada y sus registros asociados (recordatorios, historial de cambios).
                  </p>
                </div>
              </div>

              {/* Appointment Info */}
              <div className="bg-orange-50 p-4 rounded space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-700">Cliente</span>
                  <span className="text-gray-900">{deletingAppointment.client}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-700">Vehículo</span>
                  <span className="text-gray-900">
                    {deletingAppointment.vehicle} - {deletingAppointment.vehiclePlate}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-700">Fecha y hora</span>
                  <span className="text-gray-900">
                    {deletingAppointment.date}, {deletingAppointment.time} — {deletingAppointment.duration}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-700">Servicios</span>
                  <span className="text-gray-900">2 ítems</span>
                </div>
              </div>

              {/* Notifications */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="checkbox"
                    id="cancel-notifications"
                    defaultChecked
                    className="rounded"
                  />
                  <label htmlFor="cancel-notifications" className="text-sm text-gray-700">
                    También cancelar notificaciones pendientes
                  </label>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm py-2">
                    <span className="text-gray-900">Notificación SMS de confirmación</span>
                    <span className="text-gray-500">Programada 16 Oct, 18:00</span>
                  </div>
                  <div className="flex justify-between items-center text-sm py-2">
                    <span className="text-gray-900">Recordatorio 24h</span>
                    <span className="text-gray-500">Programada 16 Oct, 10:00</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="flex justify-between items-center pt-4 border-t mt-4 flex-shrink-0">
            <Button variant="outline" size="sm" onClick={() => setShowDeleteDialog(false)}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Archive className="w-4 h-4 mr-2" />
                Archivar en lugar de eliminar
              </Button>
              <Button
                size="sm"
                onClick={handleConfirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
