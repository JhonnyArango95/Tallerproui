import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Pencil, Trash2, Search, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';

interface Service {
  id: number;
  name: string;
  category: string;
  price: string;
  estimatedDuration: string;
  description: string;
  requirements: string;
  warranty: string;
  enabled: string;
}

export function ServiceManagement() {
  const [services, setServices] = useState<Service[]>([
    {
      id: 1,
      name: 'Alineación y balanceo',
      category: 'General / Frenos / Motor / Eléctrico',
      price: '45.00',
      estimatedDuration: '2.5h',
      description: 'Servicio completo de alineación y balanceo',
      requirements: 'Herramientas, repuestos, notas',
      warranty: '3 meses / 5,000 km',
      enabled: 'activo',
    },
    {
      id: 2,
      name: 'Diagnóstico eléctrico',
      category: 'Eléctrico',
      price: '35.00',
      estimatedDuration: '1.5h',
      description: 'Revisión completa del sistema eléctrico',
      requirements: 'Escáner, multímetro',
      warranty: '1 mes / 2,000 km',
      enabled: 'inactivo',
    },
    {
      id: 3,
      name: 'Servicio de frenos',
      category: 'Frenos',
      price: '80.00',
      estimatedDuration: '2h',
      description: 'Cambio de pastillas y revisión completa',
      requirements: 'Pastillas, líquido de frenos',
      warranty: '6 meses / 10,000 km',
      enabled: 'activo',
    },
  ]);

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

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('todos');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);

  // Estado para popups
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState({
    title: '',
    description: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

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
    setEditingServiceId(null);
  };

  const handleSubmit = () => {
    // Validación básica
    if (!formData.name || !formData.category || !formData.price) {
      alert('Por favor completa los campos obligatorios');
      return;
    }

    if (editingServiceId) {
      // Editar servicio existente
      setServices(
        services.map((service) =>
          service.id === editingServiceId
            ? {
                ...service,
                name: formData.name,
                category: formData.category,
                price: formData.price,
                estimatedDuration: formData.estimatedDuration,
                description: formData.description,
                requirements: formData.requirements,
                warranty: formData.warranty,
                enabled: formData.enabled,
              }
            : service
        )
      );
      setSuccessMessage({
        title: 'Servicio modificado',
        description: 'El servicio se ha actualizado correctamente en el sistema.',
      });
    } else {
      // Crear nuevo servicio
      const newService: Service = {
        id: services.length + 1,
        name: formData.name,
        category: formData.category,
        price: formData.price,
        estimatedDuration: formData.estimatedDuration,
        description: formData.description,
        requirements: formData.requirements,
        warranty: formData.warranty,
        enabled: formData.enabled,
      };
      setServices([...services, newService]);
      setSuccessMessage({
        title: 'Servicio registrado',
        description: 'El nuevo servicio ha sido agregado exitosamente.',
      });
    }

    setShowSuccessDialog(true);
    handleClear();
  };

  const handleEdit = (service: Service) => {
    setFormData({
      id: service.id,
      name: service.name,
      category: service.category,
      price: service.price,
      estimatedDuration: service.estimatedDuration,
      description: service.description,
      requirements: service.requirements,
      warranty: service.warranty,
      enabled: service.enabled,
    });
    setEditingServiceId(service.id);
  };

  const handleDelete = (serviceId: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este servicio?')) {
      setServices(services.filter((service) => service.id !== serviceId));
      setSuccessMessage({
        title: 'Servicio eliminado',
        description: 'El servicio se ha eliminado completamente del sistema.',
      });
      setShowSuccessDialog(true);
    }
  };

  // Filtrar servicios
  const filteredServices = services.filter((service) => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'todos' || service.category.includes(filterCategory);
    const matchesStatus = filterStatus === 'todos' || service.enabled === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-gray-900 mb-2">Servicios</h2>
        <p className="text-gray-600">
          Registra, actualiza y elimina servicios del sistema, mantén la información al día.
        </p>
      </div>

      {/* Form Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="mb-6 text-gray-900">Formulario de servicio</h3>

        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          {/* Nombre de servicio */}
          <div>
            <Label className="text-gray-700 mb-2 block">Nombre de servicio</Label>
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Ej. Alineación y balanceo"
              className="bg-white"
            />
          </div>

          {/* Categoría */}
          <div>
            <Label className="text-gray-700 mb-2 block">Categoría</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="General / Frenos / Motor / Eléctrico" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="General">General</SelectItem>
                <SelectItem value="Frenos">Frenos</SelectItem>
                <SelectItem value="Motor">Motor</SelectItem>
                <SelectItem value="Eléctrico">Eléctrico</SelectItem>
                <SelectItem value="General / Frenos / Motor / Eléctrico">
                  General / Frenos / Motor / Eléctrico
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Precio */}
          <div>
            <Label className="text-gray-700 mb-2 block">Precio</Label>
            <Input
              type="text"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              placeholder="Ej. S/. 45.00"
              className="bg-white"
            />
          </div>

          {/* Duración estimada */}
          <div>
            <Label className="text-gray-700 mb-2 block">Duración estimada</Label>
            <Input
              value={formData.estimatedDuration}
              onChange={(e) => handleInputChange('estimatedDuration', e.target.value)}
              placeholder="Ej. 1.5h"
              className="bg-white"
            />
          </div>

          {/* Descripción */}
          <div className="col-span-2">
            <Label className="text-gray-700 mb-2 block">Descripción</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Detalle del servicio y alcance"
              className="bg-white min-h-20"
            />
          </div>

          {/* Requisitos */}
          <div>
            <Label className="text-gray-700 mb-2 block">Requisitos</Label>
            <Input
              value={formData.requirements}
              onChange={(e) => handleInputChange('requirements', e.target.value)}
              placeholder="Herramientas, repuestos, notas"
              className="bg-white"
            />
          </div>

          {/* Habilitado */}
          <div>
            <Label className="text-gray-700 mb-2 block">Habilitado</Label>
            <Select value={formData.enabled} onValueChange={(value) => handleInputChange('enabled', value)}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Sí / No" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="activo">Sí</SelectItem>
                <SelectItem value="inactivo">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Garantía */}
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

        <p className="text-sm text-gray-500 mt-4">
          Usa este formulario para crear o actualizar un servicio existente.
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <Button onClick={handleClear} variant="outline" className="border-gray-300">
            Limpiar
          </Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white">
            Guardar
          </Button>
        </div>
      </div>

      {/* Services Table Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="mb-6 text-gray-900">Servicios registrados</h3>

        {/* Search and Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>

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
            </SelectContent>
          </Select>

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

        {/* Table */}
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-sm text-gray-700">#</th>
                <th className="text-left px-4 py-3 text-sm text-gray-700">Servicio</th>
                <th className="text-left px-4 py-3 text-sm text-gray-700">Duración estimada</th>
                <th className="text-left px-4 py-3 text-sm text-gray-700">Estado</th>
                <th className="text-left px-4 py-3 text-sm text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.map((service, index) => (
                <tr key={service.id} className="border-b last:border-b-0 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{index + 1}</td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm text-gray-900">{service.name}</p>
                      <p className="text-xs text-gray-500">{service.category}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{service.estimatedDuration}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded text-xs ${
                        service.enabled === 'activo'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {service.enabled === 'activo' ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(service)}
                        className="p-1.5 hover:bg-gray-100 rounded"
                        title="Editar"
                      >
                        <Pencil className="w-4 h-4 text-gray-600" />
                      </button>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <DialogTitle className="text-xl">{successMessage.title}</DialogTitle>
            </div>
            <DialogDescription className="text-gray-600">{successMessage.description}</DialogDescription>
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
    </div>
  );
}
