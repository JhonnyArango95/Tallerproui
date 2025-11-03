import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Pencil, Trash2, Search, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  password?: string;
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      firstName: 'Ana',
      lastName: 'García',
      email: 'ana@autotaller.com',
      phone: '',
      role: 'administrador',
      status: 'activo',
    },
    {
      id: 2,
      firstName: 'Luis',
      lastName: 'Pérez',
      email: 'luis@autotaller.com',
      phone: '',
      role: 'activo',
      status: 'inactivo',
    },
    {
      id: 3,
      firstName: 'María',
      lastName: 'Ríos',
      email: 'maria@autotaller.com',
      phone: '',
      role: '',
      status: '',
    },
  ]);

  const [formData, setFormData] = useState({
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    administrator: '',
    password: '',
    confirmPassword: '',
  });

  const [searchTerm, setSearchTerm] = useState('');
  //Guarda el valor seleccionado en el filtro de "Rol"
  const [filterRole, setFilterRole] = useState('todos');
  //Guarda el valor del filtro de "Estado"
  const [filterStatus, setFilterStatus] = useState('todos');
  const [editingUserId, setEditingUserId] = useState<number | null>(null);

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
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: '',
      administrator: '',
      password: '',
      confirmPassword: '',
    });
    setEditingUserId(null);
  };

  const handleSubmit = () => {
    // Validación básica
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.role || !formData.administrator || !formData.password || !formData.confirmPassword) {
      alert('Por favor completa los campos obligatorios');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    if (editingUserId) {
      // Editar usuario existente
      setUsers(
        users.map((user) =>
          user.id === editingUserId
            ? {
                ...user,
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                role: formData.role,
                status: formData.administrator,
              }
            : user
        )
      );
      setSuccessMessage({
        title: 'Usuario modificado',
        description: 'El usuario se ha guardado correctamente en el sistema.',
      });
    } else {
      // Crear nuevo usuario
      const newUser: User = {
        id: users.length + 1,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        status: formData.administrator,
      };
      setUsers([...users, newUser]);
      setSuccessMessage({
        title: 'Usuario registrado',
        description: 'Las credenciales han sido aplicadas exitosamente.',
      });
    }

    setShowSuccessDialog(true);
    handleClear();
  };

  const handleEdit = (user: User) => {
    setFormData({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      administrator: user.status,
      password: '',
      confirmPassword: '',
    });
    setEditingUserId(user.id);
  };

  const handleDelete = (userId: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      setUsers(users.filter((user) => user.id !== userId));
      setSuccessMessage({
        title: 'Usuario Eliminado',
        description: 'El usuario se ha eliminado completamente en el sistema.',
      });
      setShowSuccessDialog(true);
    }
  };

  // Filtrar usuarios
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === 'todos' || user.role === filterRole;
    const matchesStatus = filterStatus === 'todos' || user.status === filterStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-gray-900 mb-2">Usuarios</h2>
        <p className="text-gray-600">
          Registra, actualiza y elimina usuarios del sistema. Mantén la información al día.
        </p>
      </div>

      {/* Form Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="mb-6 text-gray-900">Formulario de usuario</h3>

        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          {/* Nombre */}
          <div>
            <Label className="text-gray-700 mb-2 block">Nombre</Label>
            <Input
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              placeholder="Ana"
              className="bg-white"
            />
          </div>

          {/* Apellidos */}
          <div>
            <Label className="text-gray-700 mb-2 block">Apellidos</Label>
            <Input
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              placeholder="García López"
              className="bg-white"
            />
          </div>

          {/* Correo */}
          <div>
            <Label className="text-gray-700 mb-2 block">Correo</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="ana@example.com"
              className="bg-white"
            />
          </div>

          {/* Teléfono */}
          <div>
            <Label className="text-gray-700 mb-2 block">Teléfono</Label>
            <Input
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+51 912 345 678"
              className="bg-white"
            />
          </div>

          {/* Rol */}
          <div>
            <Label className="text-gray-700 mb-2 block">Rol</Label>
            <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Administrador" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="administrador">Administrador</SelectItem>
                <SelectItem value="tecnico">Técnico</SelectItem>
                <SelectItem value="recepcionista">Recepcionista</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Administrador (Estado) */}
          <div>
            <Label className="text-gray-700 mb-2 block">Estado</Label>
            <Select
              value={formData.administrator}
              onValueChange={(value) => handleInputChange('administrator', value)}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Activo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="inactivo">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Contraseña */}
          <div>
            <Label className="text-gray-700 mb-2 block">Contraseña</Label>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="••••••••"
              className="bg-white"
            />
          </div>

          {/* Confirmar contraseña */}
          <div>
            <Label className="text-gray-700 mb-2 block">Confirmar contraseña</Label>
            <Input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              placeholder="••••••••"
              className="bg-white"
            />
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-4">
          Usa este formulario para crear o actualizar un usuario existente
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

      {/* Users Table Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="mb-6 text-gray-900">Usuarios registrados</h3>

        {/* Search and Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre o correo"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>

          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-40 bg-white">
              <SelectValue placeholder="Rol: Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Rol: Todos</SelectItem>
              <SelectItem value="administrador">Administrador</SelectItem>
              <SelectItem value="tecnico">Técnico</SelectItem>
              <SelectItem value="recepcionista">Recepcionista</SelectItem>
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
                <th className="text-left px-4 py-3 text-sm text-gray-700">Nombre</th>
                <th className="text-left px-4 py-3 text-sm text-gray-700">Correo</th>
                <th className="text-left px-4 py-3 text-sm text-gray-700">Rol</th>
                <th className="text-left px-4 py-3 text-sm text-gray-700">Estado</th>
                <th className="text-left px-4 py-3 text-sm text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={user.id} className="border-b last:border-b-0 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{index + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm">
                        {user.firstName[0]}
                      </div>
                      <span className="text-sm text-gray-900">
                        {user.firstName} {user.lastName}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                      {user.role || 'Sin rol'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded text-xs ${
                        user.status === 'activo'
                          ? 'bg-green-100 text-green-800'
                          : user.status === 'inactivo'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {user.status || 'Sin estado'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-1.5 hover:bg-gray-100 rounded"
                        title="Editar"
                      >
                        <Pencil className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
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
            <DialogDescription className="text-gray-600">
              {successMessage.description}
            </DialogDescription>
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
