/* ============================================
   GESTIÓN DE SERVICIOS - COMPONENTE CON API REAL
   ============================================
   
   Este componente maneja el CRUD completo de servicios:
   - CREATE (Crear servicios)
   - READ (Listar y filtrar servicios)
   - UPDATE (Editar servicios existentes)
   - DELETE (Eliminar servicios)
   
   ✅ Conectado al backend Spring Boot
*/

import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Pencil, Trash2, Search, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { serviciosService } from '../../services/api.service';
import type { ServicioResponse } from '../../config/api';
import { toast } from 'sonner@2.0.3';

/* ============================================
   INTERFACE - ESTRUCTURA DE UN SERVICIO
   ============================================
   Define los campos que tiene cada servicio
*/
interface Service {
  id: number;                 // Identificador único
  name: string;               // Nombre del servicio
  category: string;           // Categoría (General, Frenos, Motor, Eléctrico)
  price: number;              // Precio del servicio
  estimatedDuration: number;  // Duración estimada en horas
  description: string;        // Descripción detallada
  requirements: string;       // Requisitos (herramientas, repuestos)
  warranty: string;           // Garantía (ej. 3 meses / 5,000 km)
  enabled: boolean;           // Estado (true/false)
}

export function ServiceManagement() {
  /* ============================================
     ESTADO 1: LISTA DE SERVICIOS (DESDE API)
     ============================================
     Array con todos los servicios del sistema
  */
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  /* ============================================
     ESTADO 2: DATOS DEL FORMULARIO
     ============================================
     Almacena los valores de todos los campos
     del formulario (tanto para crear como editar)
  */
  const [formData, setFormData] = useState({
    id: 0,
    name: '',
    category: '',
    price: '',
    estimatedDuration: '',
    description: '',
    requirements: '',
    warranty: '',
    enabled: '',
  });

  /* ============================================
     ESTADO 3: FILTROS Y BÚSQUEDA
     ============================================
     Para filtrar la tabla de servicios
  */
  const [searchTerm, setSearchTerm] = useState('');           // Texto de búsqueda
  const [filterCategory, setFilterCategory] = useState('todos'); // Filtro por categoría
  const [filterStatus, setFilterStatus] = useState('todos');     // Filtro por estado

  /* ============================================
     ESTADO 4: CONTROL DE EDICIÓN
     ============================================
     Guarda el ID del servicio que se está editando
     null = modo crear, número = modo editar
  */
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);

  /* ============================================
     ESTADO 5: POPUP DE ÉXITO
     ============================================
     Controla el modal de confirmación
  */
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState({
    title: '',
    description: '',
  });

  /* ============================================
     EFECTO: CARGAR SERVICIOS AL INICIO
     ============================================
     Se ejecuta una vez cuando el componente se monta
  */
  useEffect(() => {
    cargarServicios();
  }, []);

  /* ============================================
     FUNCIÓN: CARGAR SERVICIOS DESDE API
     ============================================
  */
  const cargarServicios = async () => {
    try {
      setIsLoading(true);
      const servicios = await serviciosService.listarServicios();
      
      // Mapear respuesta del backend a formato del frontend
      const serviciosMapeados: Service[] = servicios.map((srv: ServicioResponse) => ({
        id: srv.id,
        name: srv.nombre,
        category: srv.categoria,
        price: srv.precio,
        estimatedDuration: srv.duracionEstimada,
        description: srv.descripcion,
        requirements: srv.requisitos,
        warranty: srv.garantia,
        enabled: srv.habilitado,
      }));
      
      setServices(serviciosMapeados);
    } catch (error) {
      console.error('Error al cargar servicios:', error);
      toast.error('Error al cargar la lista de servicios');
    } finally {
      setIsLoading(false);
    }
  };

  /* ============================================
     FUNCIÓN 1: MANEJAR CAMBIOS EN EL FORMULARIO
     ============================================
     Se ejecuta cada vez que escribes en un campo
  */
  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  /* ============================================
     FUNCIÓN 2: LIMPIAR FORMULARIO
     ============================================
     Resetea todos los campos a valores vacíos
  */
  const handleClear = () => {
    setFormData({
      id: 0,
      name: '',
      category: '',
      price: '',
      estimatedDuration: '',
      description: '',
      requirements: '',
      warranty: '',
      enabled: '',
    });
    setEditingServiceId(null); // Sale del modo edición
  };

  /* ============================================
     FUNCIÓN 3: GUARDAR SERVICIO (CREAR O EDITAR)
     ============================================
     Se ejecuta al dar clic en "Guardar"
  */
  const handleSubmit = async () => {
    // VALIDACIÓN: Verifica que los campos obligatorios estén llenos
    if (!formData.name || !formData.category || !formData.price || !formData.estimatedDuration || !formData.enabled) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }

    // VALIDACIÓN: Verifica que el precio sea un número válido
    const precio = parseFloat(formData.price);
    if (isNaN(precio) || precio <= 0) {
      toast.error('El precio debe ser un número válido mayor a 0');
      return;
    }

    // VALIDACIÓN: Verifica que la duración sea un número válido
    const duracion = parseFloat(formData.estimatedDuration);
    if (isNaN(duracion) || duracion <= 0) {
      toast.error('La duración debe ser un número válido mayor a 0');
      return;
    }

    try {
      // Preparar datos para enviar al backend
      const servicioData = {
        nombre: formData.name,
        categoria: formData.category,
        precio: precio,
        duracionEstimada: duracion,
        descripcion: formData.description,
        requisitos: formData.requirements,
        garantia: formData.warranty,
        habilitado: formData.enabled === 'true' || formData.enabled === 'activo',
      };

      if (editingServiceId) {
        /* ============================================
           MODO EDITAR: Actualiza servicio existente
           ============================================ */
        await serviciosService.editarServicio(editingServiceId, servicioData);
        
        // Mensaje de éxito para edición
        setSuccessMessage({
          title: 'Servicio modificado',
          description: 'El servicio se ha actualizado correctamente en el sistema.',
        });
      } else {
        /* ============================================
           MODO CREAR: Agrega nuevo servicio
           ============================================ */
        await serviciosService.crearServicio(servicioData);
        
        // Mensaje de éxito para creación
        setSuccessMessage({
          title: 'Servicio registrado',
          description: 'El nuevo servicio ha sido agregado exitosamente.',
        });
      }

      // Muestra el popup de éxito
      setShowSuccessDialog(true);
      // Limpia el formulario
      handleClear();
      // Recarga la lista de servicios
      await cargarServicios();
      
    } catch (error) {
      console.error('Error al guardar servicio:', error);
      toast.error(error instanceof Error ? error.message : 'Error al guardar el servicio');
    }
  };

  /* ============================================
     FUNCIÓN 4: EDITAR SERVICIO
     ============================================
     Se ejecuta al dar clic en el icono de lápiz
     Carga los datos del servicio en el formulario
  */
  const handleEdit = (service: Service) => {
    setFormData({
      id: service.id,
      name: service.name,
      category: service.category,
      price: service.price.toString(),
      estimatedDuration: service.estimatedDuration.toString(),
      description: service.description,
      requirements: service.requirements,
      warranty: service.warranty,
      enabled: service.enabled ? 'true' : 'false',
    });
    setEditingServiceId(service.id); // Activa modo edición
  };

  /* ============================================
     FUNCIÓN 5: ELIMINAR SERVICIO
     ============================================
     Se ejecuta al dar clic en el icono de basura
  */
  const handleDelete = async (serviceId: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este servicio?')) {
      try {
        await serviciosService.eliminarServicio(serviceId);
        
        setSuccessMessage({
          title: 'Servicio eliminado',
          description: 'El servicio se ha eliminado completamente del sistema.',
        });
        setShowSuccessDialog(true);
        
        // Recarga la lista de servicios
        await cargarServicios();
        
      } catch (error) {
        console.error('Error al eliminar servicio:', error);
        toast.error(error instanceof Error ? error.message : 'Error al eliminar el servicio');
      }
    }
  };

  /* ============================================
     FUNCIÓN 6: FILTRAR SERVICIOS
     ============================================
     Filtra la lista según búsqueda, categoría y estado
  */
  const filteredServices = services.filter((service) => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'todos' || service.category.toLowerCase().includes(filterCategory.toLowerCase());
    const matchesStatus = filterStatus === 'todos' || 
      (filterStatus === 'activo' && service.enabled) || 
      (filterStatus === 'inactivo' && !service.enabled);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  /* ============================================
     RENDERIZADO DE LA PANTALLA
     ============================================ */
  return (
    <div className="space-y-8">
      {/* ========================================
          SECCIÓN 1: HEADER CON TÍTULO
          ======================================== */}
      <div>
        <h2 className="text-gray-900 mb-2">Servicios</h2>
        <p className="text-gray-600">
          Registra, actualiza y elimina servicios del sistema, mantén la información al día.
        </p>
      </div>

      {/* ========================================
          SECCIÓN 2: FORMULARIO DE SERVICIO
          ========================================
          Esta caja blanca contiene el formulario
          para crear o editar servicios
          ======================================== */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="mb-6 text-gray-900">Formulario de servicio</h3>

        {/* Grid de 2 columnas para los campos */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          
          {/* CAMPO: Nombre de servicio */}
          <div>
            <Label className="text-gray-700 mb-2 block">Nombre de servicio</Label>
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Ej. Alineación y balanceo"
              className="bg-white"
            />
          </div>

          {/* CAMPO: Categoría (Selector dropdown) */}
          <div>
            <Label className="text-gray-700 mb-2 block">Categoría</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="General">General</SelectItem>
                <SelectItem value="Frenos">Frenos</SelectItem>
                <SelectItem value="Motor">Motor</SelectItem>
                <SelectItem value="Eléctrico">Eléctrico</SelectItem>
                <SelectItem value="Transmisión">Transmisión</SelectItem>
                <SelectItem value="Suspensión">Suspensión</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* CAMPO: Precio */}
          <div>
            <Label className="text-gray-700 mb-2 block">Precio</Label>
            <Input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              placeholder="Ej. 45.00"
              className="bg-white"
            />
          </div>

          {/* CAMPO: Duración estimada */}
          <div>
            <Label className="text-gray-700 mb-2 block">Duración estimada (horas)</Label>
            <Input
              type="number"
              step="0.5"
              value={formData.estimatedDuration}
              onChange={(e) => handleInputChange('estimatedDuration', e.target.value)}
              placeholder="Ej. 1.5"
              className="bg-white"
            />
          </div>

          {/* CAMPO: Descripción (ocupa 2 columnas completas) */}
          <div className="col-span-2">
            <Label className="text-gray-700 mb-2 block">Descripción</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Detalle del servicio y alcance"
              className="bg-white min-h-20"
            />
          </div>

          {/* CAMPO: Requisitos */}
          <div>
            <Label className="text-gray-700 mb-2 block">Requisitos</Label>
            <Input
              value={formData.requirements}
              onChange={(e) => handleInputChange('requirements', e.target.value)}
              placeholder="Herramientas, repuestos, notas"
              className="bg-white"
            />
          </div>

          {/* CAMPO: Habilitado (Sí/No) */}
          <div>
            <Label className="text-gray-700 mb-2 block">Habilitado</Label>
            <Select value={formData.enabled} onValueChange={(value) => handleInputChange('enabled', value)}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Sí</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* CAMPO: Garantía (ocupa 2 columnas completas) */}
          <div className="col-span-2">
            <Label className="text-gray-700 mb-2 block">Garantía</Label>
            <Input
              value={formData.warranty}
              onChange={(e) => handleInputChange('warranty', e.target.value)}
              placeholder="Ej. 3 meses / 5,000 km"
              className="bg-white"
            />
          </div>
        </div>

        {/* Texto de ayuda debajo del formulario */}
        <p className="text-sm text-gray-500 mt-4">
          Usa este formulario para crear o actualizar un servicio existente.
        </p>

        {/* BOTONES: Limpiar y Guardar */}
        <div className="flex gap-3 mt-6">
          <Button onClick={handleClear} variant="outline" className="border-gray-300">
            Limpiar
          </Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white">
            {editingServiceId ? 'Actualizar' : 'Guardar'}
          </Button>
        </div>
      </div>

      {/* ========================================
          SECCIÓN 3: TABLA DE SERVICIOS REGISTRADOS
          ========================================
          Muestra todos los servicios en una tabla
          con opciones de búsqueda y filtrado
          ======================================== */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="mb-6 text-gray-900">Servicios registrados</h3>

        {/* BARRA DE BÚSQUEDA Y FILTROS */}
        <div className="flex gap-4 mb-6">
          
          {/* Buscador de texto */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>

          {/* Filtro por Categoría */}
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-52 bg-white">
              <SelectValue placeholder="Categoría: Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Categoría: Todos</SelectItem>
              <SelectItem value="General">General</SelectItem>
              <SelectItem value="Frenos">Frenos</SelectItem>
              <SelectItem value="Motor">Motor</SelectItem>
              <SelectItem value="Eléctrico">Eléctrico</SelectItem>
              <SelectItem value="Transmisión">Transmisión</SelectItem>
              <SelectItem value="Suspensión">Suspensión</SelectItem>
            </SelectContent>
          </Select>

          {/* Filtro por Estado */}
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40 bg-white">
              <SelectValue placeholder="Estado: Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Estado: Todos</SelectItem>
              <SelectItem value="activo">Activo</SelectItem>
              <SelectItem value="inactivo">Inactivo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* TABLA DE SERVICIOS */}
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Cargando servicios...</div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              {/* ENCABEZADO DE LA TABLA */}
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 text-sm text-gray-700">#</th>
                  <th className="text-left px-4 py-3 text-sm text-gray-700">Servicio</th>
                  <th className="text-left px-4 py-3 text-sm text-gray-700">Duración estimada</th>
                  <th className="text-left px-4 py-3 text-sm text-gray-700">Estado</th>
                  <th className="text-left px-4 py-3 text-sm text-gray-700">Acciones</th>
                </tr>
              </thead>
              {/* CUERPO DE LA TABLA (filas con datos) */}
              <tbody>
                {filteredServices.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500">
                      No se encontraron servicios
                    </td>
                  </tr>
                ) : (
                  filteredServices.map((service, index) => (
                    <tr key={service.id} className="border-b last:border-b-0 hover:bg-gray-50">
                      {/* Columna: Número de fila */}
                      <td className="px-4 py-3 text-sm">{index + 1}</td>
                      
                      {/* Columna: Nombre y categoría del servicio */}
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm text-gray-900">{service.name}</p>
                          <p className="text-xs text-gray-500">{service.category}</p>
                        </div>
                      </td>
                      
                      {/* Columna: Duración estimada */}
                      <td className="px-4 py-3 text-sm text-gray-600">{service.estimatedDuration}h</td>
                      
                      {/* Columna: Estado (badge verde o rojo) */}
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded text-xs ${
                            service.enabled
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {service.enabled ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      
                      {/* Columna: Acciones (Editar y Eliminar) */}
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {/* Botón EDITAR */}
                          <button
                            onClick={() => handleEdit(service)}
                            className="p-1.5 hover:bg-gray-100 rounded"
                            title="Editar"
                          >
                            <Pencil className="w-4 h-4 text-gray-600" />
                          </button>
                          {/* Botón ELIMINAR */}
                          <button
                            onClick={() => handleDelete(service.id)}
                            className="p-1.5 hover:bg-red-50 rounded"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========================================
          SECCIÓN 4: POPUP DE CONFIRMACIÓN
          ========================================
          Modal que aparece después de crear,
          editar o eliminar un servicio
          ======================================== */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            {/* Icono de éxito + Título */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <DialogTitle className="text-xl">{successMessage.title}</DialogTitle>
            </div>
            {/* Descripción */}
            <DialogDescription className="text-gray-600">{successMessage.description}</DialogDescription>
          </DialogHeader>
          {/* Botón para cerrar el modal */}
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
    </div>
  );
}
