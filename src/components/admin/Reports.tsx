import { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Download, 
  TrendingUp, 
  Wrench, 
  Clock, 
  CalendarCheck,
  ChevronDown
} from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

// Mock data
const metricsData = {
  revenue: { value: '$12,450', change: '+12% vs. mes anterior', trend: 'up' },
  completedServices: { value: '186', change: '-9 completados', trend: 'down' },
  inProgressServices: { value: '$67', change: '+3.2%', trend: 'up' },
  scheduledAppointments: { value: '4.6/5', subtitle: '120 encuentas', trend: 'neutral' }
};

const categoryDistributionData = [
  { name: 'Frenos', value: 35, color: '#3b82f6' },
  { name: 'Motor', value: 25, color: '#fbbf24' },
  { name: 'General', value: 20, color: '#10b981' },
  { name: 'Eléctrico', value: 20, color: '#a855f7' }
];

const technicianDistributionData = [
  { name: 'Ana', value: 35, color: '#f97316' },
  { name: 'Pedro', value: 30, color: '#ec4899' },
  { name: 'Luisa', value: 25, color: '#8b5cf6' },
  { name: 'Carlos', value: 10, color: '#06b6d4' }
];

const technicianServicesData = [
  { name: 'Ana', services: 42 },
  { name: 'Pedro', services: 39 },
  { name: 'Luisa', services: 35 }
];

const technicianPerformanceData = [
  { 
    id: 1,
    name: 'Ana', 
    avatar: '👩',
    services: 42, 
    revenue: '$2,180', 
    avgTime: '1.3h' 
  },
  { 
    id: 2,
    name: 'Pedro', 
    avatar: '👨',
    services: 39, 
    revenue: '$1,960', 
    avgTime: '1.5h' 
  },
  { 
    id: 3,
    name: 'Luisa', 
    avatar: '👩‍🦰',
    services: 35, 
    revenue: '$1,740', 
    avgTime: '1.2h' 
  }
];

const categoryData = [
  { category: 'Frenos', revenue: '$4,220', services: 58 },
  { category: 'Motor', revenue: '$3,180', services: 36 },
  { category: 'General', revenue: '$2,640', services: 62 }
];

const serviceHistoryData = [
  { 
    id: 1,
    service: 'Mantenimiento preventivo', 
    client: 'J. Herrera', 
    technician: 'Ana',
    date: '12/08/2025',
    status: 'Completado',
    amount: '$60'
  },
  { 
    id: 2,
    service: 'Servicio de frenos', 
    client: 'M. Rojas', 
    technician: 'Pedro',
    date: '11/08/2025',
    status: 'Completado',
    amount: '$80'
  },
  { 
    id: 3,
    service: 'Diagnóstico eléctrico', 
    client: 'L. Paredes', 
    technician: 'Luisa',
    date: '10/08/2025',
    status: 'En curso',
    amount: '$50'
  }
];

export default function Reports() {
  const [selectedWorkshop, setSelectedWorkshop] = useState('taller-a');
  const [selectedPeriod, setSelectedPeriod] = useState('30-dias');
  const [selectedTab, setSelectedTab] = useState<'todos' | 'top-5'>('todos');
  const [selectedPerformanceTab, setSelectedPerformanceTab] = useState<'todos' | 'top'>('todos');

  return (
    <div className="h-full bg-gray-50 overflow-auto flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <span>Inicio</span>
              <span>›</span>
              <span className="text-gray-900">Reportes</span>
            </div>
            <h1 className="text-2xl text-gray-900">Reportes</h1>
          </div>
          <div className="flex items-center gap-4">
            <Select value={selectedWorkshop} onValueChange={setSelectedWorkshop}>
              <SelectTrigger className="w-32 bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="taller-a">Taller A</SelectItem>
                <SelectItem value="taller-b">Taller B</SelectItem>
                <SelectItem value="taller-c">Taller C</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-40 bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7-dias">Últimos 7 días</SelectItem>
                <SelectItem value="30-dias">Últimos 30 días</SelectItem>
                <SelectItem value="90-dias">Últimos 90 días</SelectItem>
                <SelectItem value="este-mes">Este mes</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 flex-1 overflow-auto">
        {/* Metrics Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {/* Ingresos */}
          <div className="bg-white rounded-lg p-6 border">
            <div className="flex items-start justify-between mb-2">
              <p className="text-sm text-gray-600">Ingresos</p>
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-3xl text-gray-900 mb-1">{metricsData.revenue.value}</p>
            <p className="text-xs text-green-600">{metricsData.revenue.change}</p>
          </div>

          {/* Servicios completados */}
          <div className="bg-white rounded-lg p-6 border">
            <div className="flex items-start justify-between mb-2">
              <p className="text-sm text-gray-600">Servicios completados</p>
              <Wrench className="w-4 h-4 text-gray-600" />
            </div>
            <p className="text-3xl text-gray-900 mb-1">{metricsData.completedServices.value}</p>
            <p className="text-xs text-gray-500">{metricsData.completedServices.change}</p>
          </div>

          {/* Servicios en Proceso */}
          <div className="bg-white rounded-lg p-6 border">
            <div className="flex items-start justify-between mb-2">
              <p className="text-sm text-gray-600">Servicios en Proceso</p>
              <Clock className="w-4 h-4 text-orange-600" />
            </div>
            <p className="text-3xl text-gray-900 mb-1">{metricsData.inProgressServices.value}</p>
            <p className="text-xs text-green-600">{metricsData.inProgressServices.change}</p>
          </div>

          {/* Citas agendadas */}
          <div className="bg-white rounded-lg p-6 border">
            <div className="flex items-start justify-between mb-2">
              <p className="text-sm text-gray-600">Citas agendadas</p>
              <CalendarCheck className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-3xl text-gray-900 mb-1">{metricsData.scheduledAppointments.value}</p>
            <p className="text-xs text-gray-500">{metricsData.scheduledAppointments.subtitle}</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Left side - Charts */}
          <div className="space-y-8">
            {/* Reportes Section */}
            <div className="bg-white rounded-lg p-6 border">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg text-gray-900">Reportes</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedTab('todos')}
                    className={`px-3 py-1 text-sm rounded ${
                      selectedTab === 'todos' 
                        ? 'bg-gray-100 text-gray-900' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Todas
                  </button>
                  <button
                    onClick={() => setSelectedTab('top-5')}
                    className={`px-3 py-1 text-sm rounded ${
                      selectedTab === 'top-5' 
                        ? 'bg-gray-100 text-gray-900' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Top 5
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Distribución de Ingresos por Categoría */}
                <div>
                  <p className="text-sm text-gray-600 mb-4 text-center">Distribución de Ingresos por Categoría</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={categoryDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {categoryDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-4 mt-2">
                    {categoryDistributionData.map((item) => (
                      <div key={item.name} className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-xs text-gray-600">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Distribución de Ingresos por Técnico */}
                <div>
                  <p className="text-sm text-gray-600 mb-4 text-center">Distribución de Ingresos por Técnico</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={technicianDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {technicianDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-4 mt-2">
                    {technicianDistributionData.map((item) => (
                      <div key={item.name} className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-xs text-gray-600">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Servicios por Técnico - Bar Chart */}
            <div className="bg-white rounded-lg p-6 border">
              <p className="text-sm text-gray-600 mb-4">Servicios por Técnico</p>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={technicianServicesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="services" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right side - Tables */}
          <div className="space-y-8">
            {/* Rendimiento por técnico */}
            <div className="bg-white rounded-lg p-6 border">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg text-gray-900">Rendimiento por técnico</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedPerformanceTab('todos')}
                    className={`px-3 py-1 text-sm rounded ${
                      selectedPerformanceTab === 'todos' 
                        ? 'bg-gray-100 text-gray-900' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Todos
                  </button>
                  <button
                    onClick={() => setSelectedPerformanceTab('top')}
                    className={`px-3 py-1 text-sm rounded ${
                      selectedPerformanceTab === 'top' 
                        ? 'bg-gray-100 text-gray-900' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Top
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <div className="grid grid-cols-4 gap-4 pb-2 border-b text-xs text-gray-600">
                  <div>Técnico</div>
                  <div className="text-right">Servicios</div>
                  <div className="text-right">Ingresos</div>
                  <div className="text-right">Tiempo prom.</div>
                </div>
                {technicianPerformanceData.map((tech) => (
                  <div key={tech.id} className="grid grid-cols-4 gap-4 py-3 border-b hover:bg-gray-50">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{tech.avatar}</span>
                      <span className="text-sm text-gray-900">{tech.name}</span>
                    </div>
                    <div className="text-right text-sm text-gray-900">{tech.services}</div>
                    <div className="text-right text-sm text-gray-900">{tech.revenue}</div>
                    <div className="text-right text-sm text-gray-900">{tech.avgTime}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Performance Table */}
            <div className="bg-white rounded-lg p-6 border">
              <div className="space-y-1">
                <div className="grid grid-cols-3 gap-4 pb-2 border-b text-xs text-gray-600">
                  <div>Categoría</div>
                  <div className="text-right">Ingresos</div>
                  <div className="text-right">Servicios</div>
                </div>
                {categoryData.map((cat) => (
                  <div key={cat.category} className="grid grid-cols-3 gap-4 py-3 border-b hover:bg-gray-50">
                    <div className="text-sm text-gray-900">{cat.category}</div>
                    <div className="text-right text-sm text-gray-900">{cat.revenue}</div>
                    <div className="text-right text-sm text-gray-900">{cat.services}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Historial de servicios */}
        <div className="bg-white rounded-lg p-6 border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg text-gray-900">Historial de servicios</h3>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded">
                Estados
              </button>
              <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded">
                Rango de fechas
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Servicio</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Cliente</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Técnico</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Fecha</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Estado</th>
                  <th className="text-right py-3 px-4 text-sm text-gray-600">Monto</th>
                </tr>
              </thead>
              <tbody>
                {serviceHistoryData.map((service) => (
                  <tr key={service.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">{service.service}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{service.client}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{service.technician}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{service.date}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        service.status === 'Completado' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {service.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900 text-right">{service.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
