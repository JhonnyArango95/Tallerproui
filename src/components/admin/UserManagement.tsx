/* ============================================
   GESTIÓN DE USUARIOS - COMPONENTE COMPLETO
   ============================================
   
   Este componente maneja el CRUD completo de usuarios:
   - CREATE (Crear usuarios)
   - READ (Listar y filtrar usuarios)
   - UPDATE (Editar usuarios existentes)
   - DELETE (Eliminar usuarios)
*/

import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Pencil, Trash2, Search, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';

/* ============================================
   INTERFACE - ESTRUCTURA DE UN USUARIO
   ============================================
   Define los campos que tiene cada usuario
*/
interface User {
  id: number;           // Identificador único
  firstName: string;    // Nombre
  lastName: string;     // Apellidos
  email: string;        // Correo electrónico
  phone: string;        // Teléfono
  role: string;         // Rol (administrador, técnico, recepcionista)
  status: string;       // Estado (activo, inactivo)
  password?: string;    // Contraseña (opcional)
}

export function UserManagement() {
  /* ============================================
     ESTADO 1: LISTA DE USUARIOS (DATOS MOCK)
     ============================================
     Array con todos los usuarios del sistema
  */
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      firstName: 'Ana',
      lastName: 'García',
      email: 'ana@example.com',
      phone: '',
      role: 'administrador',
      status: 'activo',
    },
    {
      id: 2,
      firstName: 'Luis',
      lastName: 'Pérez',
      email: 'luis@empresa.com',
      phone: '',
      role: 'activo',
      status: 'inactivo',
    },
    {
      id: 3,
      firstName: 'María',
      lastName: 'Ríos',
      email: 'maria@empresa.com',
      phone: '',
      role: '',
      status: '',
    },
  ]);

  /* ============================================
     ESTADO 2: DATOS DEL FORMULARIO
     ============================================
     Almacena los valores de todos los campos
     del formulario (tanto para crear como editar)
  */
  const [formData, setFormData] = useState({
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    administrator: '',    // Esto es el estado (activo/inactivo)
    password: '',
    confirmPassword: '',
  });

  /* ============================================
     ESTADO 3: FILTROS Y BÚSQUEDA
     ============================================
     Para filtrar la tabla de usuarios
  */
  const [searchTerm, setSearchTerm] = useState('');        // Texto de búsqueda
  const [filterRole, setFilterRole] = useState('todos');    // Filtro por rol
  const [filterStatus, setFilterStatus] = useState('todos'); // Filtro por estado

  /* ============================================
     ESTADO 4: CONTROL DE EDICIÓN
     ============================================
     Guarda el ID del usuario que se está editando
     null = modo crear, número = modo editar
  */
  const [editingUserId, setEditingUserId] = useState<number | null>(null);

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
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: '',
      administrator: '',
      password: '',
      confirmPassword: '',
    });
    setEditingUserId(null); // Sale del modo edición
  };

  /* ============================================
     FUNCIÓN 3: GUARDAR USUARIO (CREAR O EDITAR)
     ============================================
     Se ejecuta al dar clic en "Guardar"
  */
  const handleSubmit = () => {
    // VALIDACIÓN: Verifica que los campos obligatorios estén llenos
    if (!formData.firstName || !formData.lastName || !formData.email) {
      alert('Por favor completa los campos obligatorios');
      return;
    }

    // VALIDACIÓN: Verifica que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    if (editingUserId) {
      /* ============================================
         MODO EDITAR: Actualiza usuario existente
         ============================================ */
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
      // Mensaje de éxito para edición
      setSuccessMessage({
        title: 'Usuario modificado',
        description: 'El usuario se ha guardado correctamente en el sistema.',
      });
    } else {
      /* ============================================
         MODO CREAR: Agrega nuevo usuario
         ============================================ */
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
      // Mensaje de éxito para creación
      setSuccessMessage({
        title: 'Usuario registrado',
        description: 'Las credenciales han sido aplicadas exitosamente.',
      });
    }

    // Muestra el popup de éxito
    setShowSuccessDialog(true);
    // Limpia el formulario
    handleClear();
  };

  /* ============================================
     FUNCIÓN 4: EDITAR USUARIO
     ============================================
     Se ejecuta al dar clic en el icono de lápiz
     Carga los datos del usuario en el formulario
  */
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
    setEditingUserId(user.id); // Activa modo edición
  };

  /* ============================================
     FUNCIÓN 5: ELIMINAR USUARIO
     ============================================
     Se ejecuta al dar clic en el icono de basura
  */
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

  /* ============================================
     FUNCIÓN 6: FILTRAR USUARIOS
     ============================================
     Filtra la lista según búsqueda, rol y estado
  */
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === 'todos' || user.role === filterRole;
    const matchesStatus = filterStatus === 'todos' || user.status === filterStatus;

    return matchesSearch && matchesRole && matchesStatus;
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
        <h2 className="text-gray-900 mb-2">Usuarios</h2>
        <p className="text-gray-600">
          Registra, actualiza y elimina usuarios del sistema. Mantén la información al día.
        </p>
      </div>

      {/* ========================================
          SECCIÓN 2: FORMULARIO DE USUARIO
          ========================================
          Esta caja blanca contiene el formulario
          para crear o editar usuarios
          ======================================== */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="mb-6 text-gray-900">Formulario de usuario</h3>

        {/* Grid de 2 columnas para los campos */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          
          {/* CAMPO: Nombre */}
          <div>
            <Label className="text-gray-700 mb-2 block">Nombre</Label>
            <Input
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              placeholder="Ana"
              className="bg-white"
            />
          </div>

          {/* CAMPO: Apellidos */}
          <div>
            <Label className="text-gray-700 mb-2 block">Apellidos</Label>
            <Input
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              placeholder="García López"
              className="bg-white"
            />
          </div>

          {/* CAMPO: Correo */}
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

          {/* CAMPO: Teléfono */}
          <div>
            <Label className="text-gray-700 mb-2 block">Teléfono</Label>
            <Input
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+51 912 345 678"
              className="bg-white"
            />
          </div>

          {/* CAMPO: Rol (Selector dropdown) */}
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

          {/* CAMPO: Administrador (Estado: Activo/Inactivo) */}
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

          {/* CAMPO: Contraseña */}
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

          {/* CAMPO: Confirmar contraseña */}
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

        {/* Texto de ayuda debajo del formulario */}
        <p className="text-sm text-gray-500 mt-4">
          Usa este formulario para crear o actualizar un usuario existente
        </p>

        {/* BOTONES: Limpiar y Guardar */}
        <div className="flex gap-3 mt-6">
          <Button onClick={handleClear} variant="outline" className="border-gray-300">
            Limpiar
          </Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white">
            Guardar
          </Button>
        </div>
      </div>

      {/* ========================================
          SECCIÓN 3: TABLA DE USUARIOS REGISTRADOS
          ========================================
          Muestra todos los usuarios en una tabla
          con opciones de búsqueda y filtrado
          ======================================== */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="mb-6 text-gray-900">Usuarios registrados</h3>

        {/* BARRA DE BÚSQUEDA Y FILTROS */}
        <div className="flex gap-4 mb-6">
          
          {/* Buscador de texto */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre o correo"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>

          {/* Filtro por Rol */}
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

        {/* TABLA DE USUARIOS */}
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            {/* ENCABEZADO DE LA TABLA */}
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
            {/* CUERPO DE LA TABLA (filas con datos) */}
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={user.id} className="border-b last:border-b-0 hover:bg-gray-50">
                  {/* Columna: Número de fila */}
                  <td className="px-4 py-3 text-sm">{index + 1}</td>
                  
                  {/* Columna: Nombre con avatar */}
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
                  
                  {/* Columna: Correo */}
                  <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                  
                  {/* Columna: Rol (badge azul) */}
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                      {user.role || 'Sin rol'}
                    </span>
                  </td>
                  
                  {/* Columna: Estado (badge verde o rojo) */}
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
                  
                  {/* Columna: Acciones (Editar y Eliminar) */}
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {/* Botón EDITAR */}
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-1.5 hover:bg-gray-100 rounded"
                        title="Editar"
                      >
                        <Pencil className="w-4 h-4 text-gray-600" />
                      </button>
                      {/* Botón ELIMINAR */}
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

      {/* ========================================
          SECCIÓN 4: POPUP DE CONFIRMACIÓN
          ========================================
          Modal que aparece después de crear,
          editar o eliminar un usuario
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
            <DialogDescription className="text-gray-600">
              {successMessage.description}
            </DialogDescription>
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
