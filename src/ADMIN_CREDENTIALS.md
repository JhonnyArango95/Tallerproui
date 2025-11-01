# Credenciales de Acceso - Panel de Administración

## Acceso al Panel de Administración

Para acceder al panel de administración, haz clic en el botón **"Admin"** (con el ícono de escudo) ubicado en la esquina superior derecha de la pantalla principal.

## Credenciales de Prueba (Mock)

**Correo electrónico:** `tallerpro.com`  
**Contraseña:** `********` (8 asteriscos)

## Funcionalidades Disponibles

### Gestión de Usuarios
- ✅ Registrar nuevos usuarios
- ✅ Modificar usuarios existentes
- ✅ Eliminar usuarios
- ✅ Búsqueda por nombre o correo
- ✅ Filtros por Rol y Estado
- ✅ Validación de contraseñas

### Usuarios Pre-cargados (Mock)
1. **Ana García** - ana@example.com - Administrador - Activo
2. **Luis Pérez** - luis@empresa.com - Activo - Inactivo
3. **María Ríos** - maria@empresa.com - Sin rol - Sin estado

### Gestión de Servicios
- ✅ Registrar nuevos servicios
- ✅ Modificar servicios existentes
- ✅ Eliminar servicios
- ✅ Búsqueda por nombre
- ✅ Filtros por Categoría y Estado
- ✅ Campos: Nombre, Categoría, Precio, Duración, Descripción, Requisitos, Garantía, Habilitado

### Servicios Pre-cargados (Mock)
1. **Alineación y balanceo** - $45.00 - 2.5h - Activo
2. **Diagnóstico eléctrico** - $35.00 - 1.5h - Inactivo
3. **Servicio de frenos** - $80.00 - 2h - Activo

### Gestión de Citas
- ✅ **Visualizar citas** en vista de lista
- ✅ **Ver detalle completo** de cita con modal dedicado
- ✅ **Crear nuevas citas** con formulario completo
- ✅ **Editar citas** existentes con modal de edición
- ✅ **Eliminar citas** con confirmación y advertencias
- ✅ Filtros por: Taller, Técnico, Servicio, Estados
- ✅ Filtros de fecha: Hoy, Esta semana, Este mes
- ✅ Estados: En proceso, Pendiente, Completada, Cancelada
- ✅ Vistas disponibles: Lista (funcional), Calendario, Kanban
- ✅ Formulario completo con: Cliente, Vehículo, Servicio, Fecha/Hora, Notas
- ✅ Selección de horarios disponibles
- ✅ Prioridad: Normal, Urgente
- ✅ Asignación de técnico y bahía
- ✅ **Modal de visualización** con:
  - Información completa de la cita
  - Estado y técnico asignado
  - Datos de contacto del cliente
  - Botones: Imprimir, Reprogramar, Editar, Eliminar, Abrir detalle
- ✅ **Modal de eliminación** con:
  - Banner de advertencia naranja
  - Resumen de la cita a eliminar
  - Opción para cancelar notificaciones pendientes
  - Opción de archivar en lugar de eliminar
- ✅ **Flujo completo:** Después de crear/editar/eliminar → Permanece en el panel de citas

### Citas Pre-cargadas (Mock)
1. **Lun 14, 07:40** - Toyota Corolla ABC-123 - María López - Preventivo - En proceso
2. **Mar 15, 09:00** - Hyundai Tucson XYZ-221 - Carlos Vega - Frenos - Pendiente
3. **Mié 16, 13:00** - Kia Rio JKS-987 - Lucía Méndez - Alineación - Completada
4. **Jue 17, 16:20** - Ford Ranger FBK-852 - Andrés Soto - Motor - Cancelada

## Menú del Dashboard
- 📅 **Citas** (funcional - página inicial)
- 🔧 Técnicos (en desarrollo)
- ⚙️ **Servicios** (funcional)
- 📄 Reportes (en desarrollo)
- 👥 **Usuarios** (funcional)

**Nota:** El Dashboard fue eliminado según requerimiento del usuario.

## Notas Importantes

- Los datos son almacenados en memoria (mock)
- Al recargar la página, los cambios se perderán
- Próximamente se integrará con el backend Spring Boot
- Las credenciales y datos se reemplazarán con autenticación real

## Cerrar Sesión

Para cerrar sesión, haz clic en **"Cerrar sesión"** en la parte inferior del sidebar.
