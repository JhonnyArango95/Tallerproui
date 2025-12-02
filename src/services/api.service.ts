import { API_CONFIG, type Marca, type Modelo, type CitaRequest, type BuscarCitaRequest, type ReagendarCitaRequest, type CitaResponse } from '../config/api';
import type { LoginRequest, RegisterRequest, AuthResponse } from '../config/api';

// ========== DATOS MOCK PARA DESARROLLO ==========
const MOCK_MARCAS: Marca[] = [
  { id: 1, nombre: 'Toyota' },
  { id: 2, nombre: 'Nissan' },
  { id: 3, nombre: 'Honda' },
  { id: 4, nombre: 'Chevrolet' },
  { id: 5, nombre: 'Subaru' },
  { id: 6, nombre: 'Hyundai' },
  { id: 7, nombre: 'Renault' },
  { id: 8, nombre: 'KIA' },
];

const MOCK_MODELOS: Record<number, Modelo[]> = {
  1: [ // Toyota
    { id: 1, nombre: 'Corolla', marcaId: 1 },
    { id: 2, nombre: 'Yaris', marcaId: 1 },
    { id: 3, nombre: 'RAV4', marcaId: 1 },
    { id: 4, nombre: 'Hilux', marcaId: 1 },
  ],
  2: [ // Nissan
    { id: 5, nombre: 'Versa', marcaId: 2 },
    { id: 6, nombre: 'Sentra', marcaId: 2 },
    { id: 7, nombre: 'Kicks', marcaId: 2 },
    { id: 8, nombre: 'X-Trail', marcaId: 2 },
  ],
  3: [ // Honda
    { id: 9, nombre: 'Civic', marcaId: 3 },
    { id: 10, nombre: 'Accord', marcaId: 3 },
    { id: 11, nombre: 'CR-V', marcaId: 3 },
    { id: 12, nombre: 'HR-V', marcaId: 3 },
  ],
  4: [ // Chevrolet
    { id: 13, nombre: 'Spark', marcaId: 4 },
    { id: 14, nombre: 'Sail', marcaId: 4 },
    { id: 15, nombre: 'Cruze', marcaId: 4 },
    { id: 16, nombre: 'Tracker', marcaId: 4 },
  ],
  5: [ // Subaru
    { id: 17, nombre: 'Impreza', marcaId: 5 },
    { id: 18, nombre: 'Forester', marcaId: 5 },
    { id: 19, nombre: 'Outback', marcaId: 5 },
  ],
  6: [ // Hyundai
    { id: 20, nombre: 'Accent', marcaId: 6 },
    { id: 21, nombre: 'Elantra', marcaId: 6 },
    { id: 22, nombre: 'Tucson', marcaId: 6 },
    { id: 23, nombre: 'Santa Fe', marcaId: 6 },
  ],
  7: [ // Renault
    { id: 24, nombre: 'Kwid', marcaId: 7 },
    { id: 25, nombre: 'Sandero', marcaId: 7 },
    { id: 26, nombre: 'Duster', marcaId: 7 },
  ],
  8: [ // KIA
    { id: 27, nombre: 'Rio', marcaId: 8 },
    { id: 28, nombre: 'Sportage', marcaId: 8 },
    { id: 29, nombre: 'Sorento', marcaId: 8 },
  ],
};

// Almacenamiento temporal de citas en memoria (solo para modo mock)
let MOCK_CITAS: CitaResponse[] = [];
let MOCK_CITA_ID_COUNTER = 1;

// Helper para hacer peticiones a la API
async function fetchAPI<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    console.log(`🌐 Haciendo petición a: ${url}`);
    console.log('📤 Opciones:', options);
    
    const response = await fetch(url, {
      ...options,
      mode: 'cors', // Habilitar CORS
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options?.headers,
      },
    });

    console.log(`📥 Respuesta recibida: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error en respuesta:', errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }
      
      throw new Error(errorData.mensaje || errorData.message || errorData.error || `Error HTTP: ${response.status}`);
    }

    // Intentar parsear como JSON, si falla, usar texto plano
    const responseText = await response.text();
    console.log('📄 Texto de respuesta:', responseText);
    
    try {
      const data = JSON.parse(responseText);
      console.log('✅ Datos recibidos (JSON):', data);
      return data;
    } catch (parseError) {
      // Si no es JSON válido, retornar el texto como mensaje de éxito
      console.log('✅ Datos recibidos (Texto):', responseText);
      return { message: responseText } as T;
    }
  } catch (error) {
    console.error('❌ Error en la petición API:', error);
    
    // Si estamos en modo mock, no propagar el error
    if (API_CONFIG.USE_MOCK_DATA) {
      console.warn('⚠️ API no disponible. Usando datos mock.');
      throw new Error('USAR_MOCK'); // Señal especial para usar datos mock
    }
    
    throw error;
  }
}

// Simular delay de red para datos mock
const mockDelay = () => new Promise(resolve => setTimeout(resolve, 300));

// Servicios para Marcas y Modelos
export const marcasService = {
  // Listar todas las marcas
  listarMarcas: async (): Promise<Marca[]> => {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MARCAS}`;
    console.log('📦 Obteniendo marcas desde:', url);
    return await fetchAPI<Marca[]>(url);
  },

  // Listar modelos por marca
  listarModelos: async (idMarca: number): Promise<Modelo[]> => {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MODELOS(idMarca)}`;
    console.log('📦 Obteniendo modelos desde:', url);
    return await fetchAPI<Modelo[]>(url);
  },
};

// Servicios para Citas
export const citasService = {
  // Crear nueva cita
  crearCita: async (cita: CitaRequest): Promise<CitaResponse> => {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CITAS}`;
    console.log('📦 Creando cita en:', url);
    console.log('📤 Datos de la cita:', cita);
    return await fetchAPI<CitaResponse>(url, {
      method: 'POST',
      body: JSON.stringify(cita),
    });
  },

  // Buscar cita
  buscarCita: async (busqueda: BuscarCitaRequest): Promise<CitaResponse> => {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.BUSCAR_CITA}`;
    console.log('📦 Buscando cita en:', url);
    console.log('📤 Criterios de búsqueda:', busqueda);
    return await fetchAPI<CitaResponse>(url, {
      method: 'POST',
      body: JSON.stringify(busqueda),
    });
  },

  // Anular cita
  anularCita: async (idCita: number): Promise<void> => {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ANULAR_CITA(idCita)}`;
    console.log('📦 Anulando cita en:', url);
    return await fetchAPI<void>(url, {
      method: 'PATCH',
    });
  },

  // Reagendar cita
  reagendarCita: async (idCita: number, nuevaFechaHora: ReagendarCitaRequest): Promise<CitaResponse> => {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REAGENDAR_CITA(idCita)}`;
    console.log('📦 Reagendando cita en:', url);
    console.log('📤 Nueva fecha/hora:', nuevaFechaHora);
    return await fetchAPI<CitaResponse>(url, {
      method: 'PUT',
      body: JSON.stringify(nuevaFechaHora),
    });
  },
};

// Servicios para Autenticación
export const authService = {
  // Iniciar sesión
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    console.log('🔐 Intentando iniciar sesión con:', credentials.email);
    
    try {
      const url = `${API_CONFIG.AUTH_BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}`;
      console.log('URL de login:', url);
      return await fetchAPI<AuthResponse>(url, {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  },

  // Registrar nuevo usuario
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    console.log('📝 Intentando registrar usuario:', userData.nombre);
    
    try {
      const url = `${API_CONFIG.AUTH_BASE_URL}${API_CONFIG.ENDPOINTS.REGISTER}`;
      console.log('URL de registro:', url);
      return await fetchAPI<AuthResponse>(url, {
        method: 'POST',
        body: JSON.stringify(userData),
      });
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  },
};