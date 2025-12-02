// Configuración de la API de Spring Boot
export const API_CONFIG = {
  // URL base del servidor WildFly para citas
  BASE_URL: 'http://localhost:8080/tallerpro-api-pe-1.0.0/api/v1',
  
  // URL base para autenticación (diferente ruta)
  AUTH_BASE_URL: 'http://localhost:8080/tallerpro-api-1.0.0/api/auth',
  
  // Modo de desarrollo: usar datos mock si la API no está disponible
  USE_MOCK_DATA: false, // Cambiado a false para usar la API real
  
  // Endpoints
  ENDPOINTS: {
    // Marcas y modelos
    MARCAS: '/marcas',
    MODELOS: (idMarca: number) => `/modelos/${idMarca}`,
    
    // Citas
    CITAS: '/citas',
    BUSCAR_CITA: '/citas/buscar',
    ANULAR_CITA: (idCita: number) => `/citas/${idCita}/anular`,
    REAGENDAR_CITA: (idCita: number) => `/citas/${idCita}/reagendar`,
    
    // Autenticación
    LOGIN: '/login',
    REGISTER: '/register',
  }
};

// Tipos de datos para TypeScript
export interface Marca {
  id: number;
  nombre: string;
}

export interface Modelo {
  id: number;
  nombre: string;
  marcaId: number;
}

export interface CitaRequest {
  tipoDocumento: string;
  numeroDocumento: string;
  nombre: string;
  apellido: string;
  correo: string;
  celular: string;
  aceptaTerminos: boolean;
  aceptaNovedades: boolean;
  tipoVehiculo: string;
  placa: string | null;
  marcaId: number;
  modeloId: number;
  anio: number;
  version?: string;
  fecha: string;
  hora: string;
  tipoServicio: string;
  local: string;
}

export interface BuscarCitaRequest {
  tipoDocumento: string;
  numeroDocumento: string;
  placa: string | null;
  sinPlaca: boolean;
}

export interface ReagendarCitaRequest {
  fecha: string;
  hora: string;
}

export interface CitaResponse {
  id: number;
  cliente?: {
    id: number;
    tipoDocumento: string;
    numeroDocumento: string;
    nombre: string;
    apellido: string;
    correo: string;
    celular: string;
  };
  tipoDocumento?: string;
  numeroDocumento?: string;
  nombre?: string;
  apellido?: string;
  correo?: string;
  celular?: string;
  tipoVehiculo?: string;
  placa: string | null;
  marcaId?: number;
  modeloId?: number;
  anio?: number;
  version?: string | null;
  fechaCita: string;  // El backend usa fechaCita, no fecha
  horaCita: string;   // El backend usa horaCita, no hora
  tipoServicio: string;
  localAtencion: string;  // El backend usa localAtencion, no local
  estado?: string;
  fechaRegistro?: string;
}

// Interfaces para Autenticación
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nombre: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token?: string;
  user?: {
    id: number;
    nombre: string;
    email: string;
  };
  message?: string;
}