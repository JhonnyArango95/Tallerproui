# 📱 Guía de Pantallas - Mapeo de Archivos

Esta guía te ayudará a identificar qué archivo `.tsx` corresponde a cada pantalla de la aplicación.

---

## 🏠 FLUJO PRINCIPAL - Agendamiento de Citas

### 1️⃣ Pantalla Inicial - Datos del Usuario
**Archivo:** `/App.tsx`
- **Descripción:** Formulario de captura de datos personales
- **Elementos clave:** 
  - Header: "1 Ingresa tus datos"
  - Tipo de documento (DNI/CE)
  - Número de documento con validación RENIEC
  - Nombres, apellidos, email, teléfono
  - Checkboxes de términos y condiciones
  - Botón "Admin" en la esquina superior derecha
  - Enlace "Reagendar o anular cita →"
  - Logos de marcas al lado derecho

---

### 2️⃣ Pantalla de Vehículo y Agendamiento
**Archivo:** `/components/VehicleAppointment.tsx`
- **Descripción:** Captura de datos del vehículo y selección de cita
- **Elementos clave:**
  - Header: "2 Datos del vehículo y 3 Agenda tu cita"
  - Número de placa
  - Marca y modelo del vehículo
  - Tipo de servicio (checkboxes)
  - Calendario para seleccionar fecha
  - Horarios disponibles
  - Botón "Continuar"

---

### 3️⃣ Pantalla de Confirmación
**Archivo:** `/components/ConfirmationScreen.tsx`
- **Descripción:** Confirmación de cita agendada
- **Elementos clave:**
  - Ícono de check verde
  - Mensaje: "¡Reserva exitosa!"
  - Resumen de datos personales
  - Resumen de datos del vehículo
  - Resumen de la cita
  - Botón "Volver a inicio"

---

## 🔄 FLUJO DE REAGENDAMIENTO/ANULACIÓN

### 4️⃣ Pantalla de Búsqueda de Cita
**Archivo:** `/components/RescheduleSearch.tsx`
- **Descripción:** Buscar cita existente para reagendar o anular
- **Elementos clave:**
  - Formulario de búsqueda
  - Tipo de documento
  - Número de documento
  - Número de placa
  - Botón "Buscar cita"
  - Botón "Volver"

---

### 5️⃣ Pantalla de Gestión de Cita
**Archivo:** `/components/RescheduleManage.tsx`
- **Descripción:** Ver detalles de cita y opciones para reagendar/anular
- **Elementos clave:**
  - Información de la cita encontrada
  - Datos del cliente
  - Datos del vehículo
  - Detalles de la cita
  - Botones: "Reagendar cita" y "Anular cita"
  - Botón "Nueva búsqueda"

---

## 🔐 FLUJO DE ADMINISTRACIÓN

### 6️⃣ Pantalla de Login - Administrador
**Archivo:** `/components/admin/LoginScreen.tsx`
- **Descripción:** Pantalla de inicio de sesión para administradores
- **Elementos clave:**
  - Logo "TallerPro" con ícono de llave
  - Fondo gris oscuro (#4a5568)
  - Campo de correo electrónico
  - Campo de contraseña
  - Checkbox "Recordarme"
  - Enlace "¿Olvidaste tu contraseña?"
  - Botón "Entrar"
  - Banner verde/rojo flotante arriba (éxito/error)
- **Credenciales:** 
  - Email: `tallerpro.com`
  - Password: `********`

---

### 7️⃣ Dashboard Principal - Admin
**Archivo:** `/components/admin/AdminDashboard.tsx`
- **Descripción:** Panel principal de administración con sidebar
- **Elementos clave:**
  - Sidebar oscuro (#1e293b) a la izquierda
  - Logo "AutoTaller"
  - Menú de navegación:
    - 📅 Citas (**ahora es la página inicial**)
    - 🔧 Técnicos
    - ⚙️ Servicios
    - 📄 Reportes
    - 👥 Usuarios
  - Avatar del usuario en la parte inferior
  - Botón "Cerrar sesión"
  - Área de contenido principal (derecha)
  - Header con breadcrumb
- **Nota:** El Dashboard fue eliminado según requerimiento

---

### 8️⃣ Pantalla de Gestión de Usuarios
**Archivo:** `/components/admin/UserManagement.tsx`
- **Descripción:** CRUD completo de usuarios
- **Elementos clave:**
  - Título: "Usuarios"
  - Formulario de usuario con campos:
    - Nombre, Apellidos
    - Correo, Teléfono
    - Rol, Administrador (Estado)
    - Contraseña, Confirmar contraseña
  - Botones: "Limpiar" y "Guardar"
  - Tabla de usuarios registrados
  - Búsqueda y filtros
  - Botones de editar (lápiz) y eliminar (papelera)
  - Popups de confirmación

---

### 9️⃣ Pantalla de Gestión de Servicios
**Archivo:** `/components/admin/ServiceManagement.tsx`
- **Descripción:** CRUD completo de servicios
- **Elementos clave:**
  - Título: "Servicios"
  - Formulario de servicio con campos:
    - Nombre de servicio
    - Categoría
    - Precio, Duración estimada
    - Descripción (textarea)
    - Requisitos
    - Habilitado (Sí/No)
    - Garantía
  - Botones: "Limpiar" y "Guardar"
  - Tabla de servicios registrados
  - Búsqueda y filtros
  - Botones de editar (lápiz) y eliminar (papelera)
  - Popups de confirmación

---

### 🔟 Pantalla de Gestión de Citas - Vista Lista
**Archivo:** `/components/admin/AppointmentManagement.tsx`
- **Descripción:** CRUD completo de citas con múltiples vistas
- **Elementos clave:**
  - Breadcrumb: "Inicio > Citas"
  - Filtros de fecha: "Hoy", "Esta semana", "Este mes"
  - Botón "+ Nueva cita" (naranja)
  - Filtros:
    - Taller (dropdown: Todos, Central, Norte, Sur)
    - Técnico (dropdown: Todos, Ana Ruiz, Pedro Díaz)
    - Servicio (dropdown: Multiple, Preventivo, Frenos, Motor)
    - Estados (botones: Pendiente, En proceso)
  - Vistas: Lista, Calendario, Kanban
  - Tabla con columnas:
    - Fecha, Hora, Vehículo, Cliente, Servicio
    - Taller, Técnico, Estado, Acciones
  - Estados con colores:
    - En proceso (naranja)
    - Pendiente (amarillo)
    - Completada (verde)
    - Cancelada (rojo)
  - Acciones: Visualizar, Editar, Eliminar

---

### 1️⃣1️⃣ Pantalla de Nueva Cita
**Archivo:** `/components/admin/AppointmentManagement.tsx` (misma vista)
- **Descripción:** Formulario completo para crear nueva cita
- **Elementos clave:**
  - Título: "Nueva cita"
  - Enlace "← Volver a Citas"
  - Secciones:
    - **Información del cliente:**
      - Cliente (buscar o crear)
      - Contacto (teléfono o correo)
    - **Vehículo:**
      - Marca / Modelo
      - Placa
    - **Servicio y taller:**
      - Servicio (dropdown)
      - Taller (dropdown)
      - Prioridad: Normal, Urgente
      - Estado inicial: Programada, Confirmada, Pendiente
    - **Fecha y hora:**
      - Fecha (selector de calendario)
      - Duración (dropdown)
      - Disponibilidad (slots de horarios)
      - Taller Central
    - **Notas:**
      - Textarea para descripción
  - Botones inferiores:
    - "Guardar borrador"
    - "Confirmar por email"
    - "Enviar SMS"
    - "Crear cita" (naranja)

---

### 1️⃣2️⃣ Modal de Editar Cita
**Archivo:** `/components/admin/AppointmentManagement.tsx` (Dialog)
- **Descripción:** Modal para editar cita existente
- **Elementos clave:**
  - Encabezado: "Editar cita" con botón "Cancelar"
  - **Formulario (lado izquierdo):**
    - Cliente (dropdown)
    - Vehículo y Placa
    - Fecha y hora (con mensaje de advertencia)
    - Servicios:
      - Lista de servicios con precios
      - "+ Agregar servicio"
      - "Aplicar descuento"
    - Asignación:
      - Técnico (dropdown)
      - Bahía (dropdown)
  - **Resumen (lado derecho):**
    - Cliente
    - Vehículo
    - Fecha
    - Horario
    - Técnico
    - Notas internas
    - Notificaciones:
      - Checkbox "Reenviar confirmación al cliente"
      - Nota: "Se enviará por SMS y correo"
  - Botones inferiores:
    - "Descartar cambios"
    - "Guardar como borrador"
    - "Guardar cambios" (naranja)

---

### 1️⃣3️⃣ Modal de Visualizar Cita (Detalle)
**Archivo:** `/components/admin/AppointmentManagement.tsx` (Dialog)
- **Descripción:** Modal para ver todos los detalles de una cita
- **Elementos clave:**
  - Encabezado: "📅 Detalle de cita" con botón "❌ Cerrar"
  - **Columna izquierda (Información):**
    - Fecha: "Mié 16 de Oct, 2025"
    - Hora
    - Cliente
    - Vehículo (con placa)
    - Servicio
    - Taller
    - Descripción/Notas
  - **Columna derecha (Estado y Contacto):**
    - Estado (badge verde/amarillo/naranja/rojo)
    - Técnico asignado (con avatar)
    - Contacto:
      - 📞 Teléfono
      - ✉️ Email
  - **Botones inferiores:**
    - "🖨️ Imprimir"
    - "🔄 Reprogramar"
    - "✏️ Editar"
    - "🗑️ Eliminar"
    - "🔗 Abrir detalle" (naranja)

---

### 1️⃣4️⃣ Modal de Eliminar Cita
**Archivo:** `/components/admin/AppointmentManagement.tsx` (Dialog)
- **Descripción:** Modal de confirmación para eliminar cita con advertencias
- **Elementos clave:**
  - Encabezado: "🗑️ Eliminar cita" con botón "❌ Cancelar"
  - **Banner de advertencia (naranja):**
    - ⚠️ "Esta acción no se puede deshacer."
    - "Se eliminarán permanentemente la cita seleccionada y sus registros asociados (recordatorios, historial de cambios)."
  - **Información de la cita:**
    - Cliente
    - Vehículo (modelo + año + placa)
    - Fecha y hora
    - Servicios (cantidad de ítems)
  - **Notificaciones pendientes:**
    - Checkbox: "También cancelar notificaciones pendientes"
    - Lista de notificaciones:
      - "Notificación SMS de confirmación" - Programada 16 Oct, 18:00
      - "Recordatorio 24h" - Programada 16 Oct, 10:00
  - **Botones inferiores:**
    - "🔄 Volver"
    - "📦 Archivar en lugar de eliminar"
    - "🗑️ Eliminar definitivamente" (rojo)

---

## 🧩 COMPONENTES AUXILIARES

### BrandLogos.tsx
- **Descripción:** Componente que muestra los logos de marcas automotrices
- **Ubicación:** Aparece en la pantalla inicial (App.tsx)

---

## 📝 NOTAS

### Navegación entre pantallas:
- **App.tsx** controla el flujo principal y decide qué componente renderizar
- El estado de la aplicación determina qué pantalla se muestra
- Los componentes de admin están aislados en `/components/admin/`

### Para probar cada pantalla:
1. **Pantalla inicial:** Carga la app normalmente
2. **Vehículo y agendamiento:** Completa el formulario inicial
3. **Confirmación:** Completa el agendamiento
4. **Búsqueda de cita:** Clic en "Reagendar o anular cita →"
5. **Login admin:** Clic en botón "Admin" (esquina superior derecha)
6. **Dashboard/Usuarios/Servicios:** Después de login exitoso

---

## 🎯 ACCESOS RÁPIDOS

| Pantalla | Archivo | Línea de código clave |
|----------|---------|----------------------|
| Principal | App.tsx | `return` principal |
| Vehículo | VehicleAppointment.tsx | `export function VehicleAppointment` |
| Confirmación | ConfirmationScreen.tsx | `export function ConfirmationScreen` |
| Reagendar Buscar | RescheduleSearch.tsx | `export function RescheduleSearch` |
| Reagendar Gestionar | RescheduleManage.tsx | `export function RescheduleManage` |
| Login Admin | LoginScreen.tsx | `export function LoginScreen` |
| Dashboard Admin | AdminDashboard.tsx | `export function AdminDashboard` |
| Usuarios | UserManagement.tsx | `export function UserManagement` |
| Servicios | ServiceManagement.tsx | `export function ServiceManagement` |
| Citas (Lista) | AppointmentManagement.tsx | `export function AppointmentManagement` |
| Nueva Cita | AppointmentManagement.tsx | Vista condicional `showNewAppointment` |
| Ver Detalle Cita | AppointmentManagement.tsx | Dialog `showViewDialog` |
| Editar Cita | AppointmentManagement.tsx | Dialog `showEditDialog` |
| Eliminar Cita | AppointmentManagement.tsx | Dialog `showDeleteDialog` |

---

**Última actualización:** 2025-10-29

## 🎨 Citas Mock Precargadas

Las siguientes citas están disponibles en el sistema para pruebas:

1. **Lun 14, 07:40** - Toyota Corolla (ABC-123) - María López - Preventivo - Central - No asignado - **En proceso**
2. **Mar 15, 09:00** - Hyundai Tucson (XYZ-221) - Carlos Vega - Frenos - Central - Ana Ruiz - **Pendiente**
3. **Mié 16, 13:00** - Kia Rio (JKS-987) - Lucía Méndez - Alineación - Central - Pedro Díaz - **Completada**
4. **Jue 17, 16:20** - Ford Ranger (FBK-852) - Andrés Soto - Motor - Central - No asignado - **Cancelada**
