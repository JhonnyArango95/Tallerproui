import { useState, useEffect } from 'react';
import { Search, Calendar, User, Car, MapPin, Clock, Filter, Eye, Download } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { citasAdminService, marcasService } from '../../services/api.service';
import type { Marca, Modelo } from '../../config/api';
import { toast } from 'sonner@2.0.3';

interface Cita {
  id: number;
  cliente: {
    id: number;
    tipoDocumento: string;
    numeroDocumento: string;
    nombre: string;
    apellido: string;
    correo: string;
    celular: string;
    aceptaTerminos: boolean;
    aceptaNovedades: boolean;
    fechaRegistro: string;
  };
  fechaCita: string;
  horaCita: string;
  tipoServicio: string;
  estado: string;
  localAtencion: string;
  detalleVehiculo: {
    id: number;
    placa: string;
    tipoVehiculo: string;
    marcaId: number;
    modeloId: number;
    anio: number;
    version: string;
  };
}

export function AllAppointmentsManagement() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('TODOS');
  const [selectedCita, setSelectedCita] = useState<Cita | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  // Estados para mapeo de marcas y modelos
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [modelosPorMarca, setModelosPorMarca] = useState<Record<number, Modelo[]>>({});
  const [loadingMarcas, setLoadingMarcas] = useState(false);

  // Cargar marcas y sus modelos al iniciar
  useEffect(() => {
    cargarMarcasYModelos();
  }, []);

  const cargarMarcasYModelos = async () => {
    setLoadingMarcas(true);
    try {
      const marcasData = await marcasService.listarMarcas();
      setMarcas(marcasData);
      
      // Cargar todos los modelos de todas las marcas
      const modelosMap: Record<number, Modelo[]> = {};
      for (const marca of marcasData) {
        const modelos = await marcasService.listarModelos(marca.id);
        modelosMap[marca.id] = modelos;
      }
      setModelosPorMarca(modelosMap);
      
      console.log('✅ Marcas y modelos cargados:', marcasData, modelosMap);
    } catch (error) {
      console.error('Error al cargar marcas y modelos:', error);
      toast.error('Error al cargar información de vehículos');
    } finally {
      setLoadingMarcas(false);
    }
  };

  // Cargar citas al iniciar
  useEffect(() => {
    cargarCitas();
  }, []);

  const cargarCitas = async () => {
    setLoading(true);
    try {
      const data = await citasAdminService.listarTodasCitas();
      console.log('📋 Citas recibidas:', data);
      setCitas(data);
      toast.success(`${data.length} citas cargadas correctamente`);
    } catch (error) {
      console.error('Error al cargar citas:', error);
      toast.error('Error al cargar las citas');
    } finally {
      setLoading(false);
    }
  };

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

  // Filtrar citas por búsqueda y estado
  const citasFiltradas = citas.filter(cita => {
    const matchSearch = 
      cita.cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cita.cliente.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cita.cliente.numeroDocumento.includes(searchTerm) ||
      cita.detalleVehiculo.placa.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchStatus = filterStatus === 'TODOS' || cita.estado === filterStatus;
    
    return matchSearch && matchStatus;
  });

  // Obtener badge de estado
  const getEstadoBadge = (estado: string) => {
    const badges: Record<string, { bg: string; text: string }> = {
      AGENDADA: { bg: 'bg-blue-100', text: 'text-blue-800' },
      COMPLETADA: { bg: 'bg-green-100', text: 'text-green-800' },
      CANCELADA: { bg: 'bg-red-100', text: 'text-red-800' },
      EN_PROCESO: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    };
    
    const badge = badges[estado] || { bg: 'bg-gray-100', text: 'text-gray-800' };
    return `${badge.bg} ${badge.text} px-3 py-1 rounded-full text-xs`;
  };

  // Formatear fecha
  const formatearFecha = (fecha: string): string => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  // Formatear hora
  const formatearHora = (hora: string): string => {
    return hora.substring(0, 5); // HH:mm
  };

  const verDetalles = (cita: Cita) => {
    setSelectedCita(cita);
    setShowDetailsModal(true);
  };

  const exportarExcel = () => {
    try {
      // Crear CSV en lugar de Excel (no requiere librerías externas)
      const headers = ['ID', 'Nombre', 'Apellido', 'Documento', 'Correo', 'Celular', 'Placa', 'Tipo Vehículo', 'Marca', 'Modelo', 'Año', 'Versión', 'Fecha Cita', 'Hora Cita', 'Servicio', 'Estado', 'Local Atención'];
      
      const rows = citas.map(cita => [
        cita.id,
        cita.cliente.nombre,
        cita.cliente.apellido,
        `${cita.cliente.tipoDocumento}: ${cita.cliente.numeroDocumento}`,
        cita.cliente.correo,
        cita.cliente.celular,
        cita.detalleVehiculo.placa,
        cita.detalleVehiculo.tipoVehiculo,
        getNombreMarca(cita.detalleVehiculo.marcaId),
        getNombreModelo(cita.detalleVehiculo.marcaId, cita.detalleVehiculo.modeloId),
        cita.detalleVehiculo.anio,
        cita.detalleVehiculo.version,
        formatearFecha(cita.fechaCita),
        formatearHora(cita.horaCita),
        cita.tipoServicio,
        cita.estado,
        cita.localAtencion
      ]);
      
      // Crear contenido CSV
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');
      
      // Crear Blob y descargar
      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      // Generar nombre de archivo con fecha y hora
      const fecha = new Date().toISOString().split('T')[0];
      const hora = new Date().toTimeString().split(' ')[0].replace(/:/g, '-');
      const nombreArchivo = `citas_${fecha}_${hora}.csv`;
      
      link.setAttribute('href', url);
      link.setAttribute('download', nombreArchivo);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`Archivo exportado correctamente: ${nombreArchivo}`);
    } catch (error) {
      console.error('Error al exportar archivo:', error);
      toast.error('Error al exportar el archivo');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto p-8" style={{
        scrollbarWidth: 'thin',
        scrollbarColor: '#888 #f1f1f1',
      }}>
        <style jsx>{`
          div::-webkit-scrollbar {
            width: 12px;
          }
          
          div::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          
          div::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 10px;
          }
          
          div::-webkit-scrollbar-thumb:hover {
            background: #555;
          }
        `}</style>
        
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-gray-900 mb-2">Historial de Citas</h2>
          <p className="text-gray-600">Gestiona y visualiza todas las citas registradas en el sistema</p>
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por nombre, DNI o placa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filtro por estado */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="TODOS">Todos los estados</option>
                <option value="AGENDADA">Agendada</option>
                <option value="COMPLETADA">Completada</option>
                <option value="CANCELADA">Cancelada</option>
                <option value="EN_PROCESO">En Proceso</option>
              </select>
            </div>

            {/* Botón refrescar */}
            <Button
              onClick={cargarCitas}
              disabled={loading}
              variant="outline"
            >
              {loading ? 'Cargando...' : 'Refrescar'}
            </Button>

            {/* Botón exportar */}
            <Button
              onClick={exportarExcel}
              variant="outline"
            >
              <Download className="w-4 h-4 mr-1" />
              Exportar CSV
            </Button>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="bg-white rounded-lg shadow-sm p-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-gray-600">Total</p>
                <p className="text-xl text-gray-900">{citas.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-500 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-gray-600">Agendadas</p>
                <p className="text-xl text-gray-900">
                  {citas.filter(c => c.estado === 'AGENDADA').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-gray-600">Completadas</p>
                <p className="text-xl text-gray-900">
                  {citas.filter(c => c.estado === 'COMPLETADA').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-red-500 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-gray-600">Canceladas</p>
                <p className="text-xl text-gray-900">
                  {citas.filter(c => c.estado === 'CANCELADA').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de citas */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading || loadingMarcas ? (
            <div className="p-8 text-center text-gray-500">
              Cargando citas y datos de vehículos...
            </div>
          ) : citasFiltradas.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No se encontraron citas
            </div>
          ) : (
            <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                      Vehículo
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                      Fecha y Hora
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                      Servicio
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {citasFiltradas.map((cita) => (
                    <tr key={cita.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-900">
                              {cita.cliente.nombre} {cita.cliente.apellido}
                            </p>
                            <p className="text-xs text-gray-500">
                              {cita.cliente.tipoDocumento}: {cita.cliente.numeroDocumento}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Car className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-900">
                              {getNombreMarca(cita.detalleVehiculo.marcaId)} {getNombreModelo(cita.detalleVehiculo.marcaId, cita.detalleVehiculo.modeloId)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {cita.detalleVehiculo.placa} • {cita.detalleVehiculo.anio}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm text-gray-900">
                            {formatearFecha(cita.fechaCita)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatearHora(cita.horaCita)}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{cita.tipoServicio}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={getEstadoBadge(cita.estado)}>
                          {cita.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Button
                          onClick={() => verDetalles(cita)}
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Ver detalles
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Resultados */}
        <div className="mt-4 text-sm text-gray-600 text-center">
          Mostrando {citasFiltradas.length} de {citas.length} citas
        </div>
      </div>

      {/* Modal de detalles */}
      {showDetailsModal && selectedCita && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-gray-900 mb-1">Detalles de la Cita</h3>
                  <p className="text-sm text-gray-500">ID: {selectedCita.id}</p>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Información del Cliente */}
                <div>
                  <h4 className="text-sm text-gray-900 mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Información del Cliente
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex">
                      <span className="text-sm text-gray-600 w-32">Nombre:</span>
                      <span className="text-sm text-gray-900">
                        {selectedCita.cliente.nombre} {selectedCita.cliente.apellido}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="text-sm text-gray-600 w-32">Documento:</span>
                      <span className="text-sm text-gray-900">
                        {selectedCita.cliente.tipoDocumento}: {selectedCita.cliente.numeroDocumento}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="text-sm text-gray-600 w-32">Correo:</span>
                      <span className="text-sm text-gray-900">{selectedCita.cliente.correo}</span>
                    </div>
                    <div className="flex">
                      <span className="text-sm text-gray-600 w-32">Celular:</span>
                      <span className="text-sm text-gray-900">{selectedCita.cliente.celular}</span>
                    </div>
                  </div>
                </div>

                {/* Información del Vehículo */}
                <div>
                  <h4 className="text-sm text-gray-900 mb-3 flex items-center gap-2">
                    <Car className="w-4 h-4" />
                    Información del Vehículo
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex">
                      <span className="text-sm text-gray-600 w-32">Placa:</span>
                      <span className="text-sm text-gray-900">{selectedCita.detalleVehiculo.placa}</span>
                    </div>
                    <div className="flex">
                      <span className="text-sm text-gray-600 w-32">Tipo:</span>
                      <span className="text-sm text-gray-900">{selectedCita.detalleVehiculo.tipoVehiculo}</span>
                    </div>
                    <div className="flex">
                      <span className="text-sm text-gray-600 w-32">Marca:</span>
                      <span className="text-sm text-gray-900">
                        {getNombreMarca(selectedCita.detalleVehiculo.marcaId)}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="text-sm text-gray-600 w-32">Modelo:</span>
                      <span className="text-sm text-gray-900">
                        {getNombreModelo(selectedCita.detalleVehiculo.marcaId, selectedCita.detalleVehiculo.modeloId)}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="text-sm text-gray-600 w-32">Año:</span>
                      <span className="text-sm text-gray-900">{selectedCita.detalleVehiculo.anio}</span>
                    </div>
                    <div className="flex">
                      <span className="text-sm text-gray-600 w-32">Versión:</span>
                      <span className="text-sm text-gray-900">{selectedCita.detalleVehiculo.version}</span>
                    </div>
                  </div>
                </div>

                {/* Información de la Cita */}
                <div>
                  <h4 className="text-sm text-gray-900 mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Información de la Cita
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex">
                      <span className="text-sm text-gray-600 w-32">Fecha:</span>
                      <span className="text-sm text-gray-900">{formatearFecha(selectedCita.fechaCita)}</span>
                    </div>
                    <div className="flex">
                      <span className="text-sm text-gray-600 w-32">Hora:</span>
                      <span className="text-sm text-gray-900">{formatearHora(selectedCita.horaCita)}</span>
                    </div>
                    <div className="flex">
                      <span className="text-sm text-gray-600 w-32">Servicio:</span>
                      <span className="text-sm text-gray-900">{selectedCita.tipoServicio}</span>
                    </div>
                    <div className="flex">
                      <span className="text-sm text-gray-600 w-32">Estado:</span>
                      <span className={getEstadoBadge(selectedCita.estado)}>
                        {selectedCita.estado}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="text-sm text-gray-600 w-32">Local:</span>
                      <span className="text-sm text-gray-900">{selectedCita.localAtencion}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botón cerrar */}
              <div className="mt-6 flex justify-end">
                <Button
                  onClick={() => setShowDetailsModal(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white"
                >
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}