import { useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export default function Reports() {
  const [selectedWorkshop, setSelectedWorkshop] = useState('taller-a');
  const [selectedPeriod, setSelectedPeriod] = useState('30-dias');

  return (
    <div className="h-full bg-gray-50 overflow-auto flex flex-col">
      {/* Header - Navegación y Filtros */}
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

      {/* Main Content - Power BI Completo */}
      <div className="p-8 flex-1 overflow-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <h2 className="mb-6 text-lg text-gray-900 font-medium">Dashboard de Reportes</h2>
          
          {/* Contenedor del Iframe ajustado */}
          <div className="w-full bg-gray-100 rounded-lg overflow-hidden">
            <iframe 
              title="Dashboard Ingresos Taller Pro" 
              width="100%" 
              height="850"  /* Altura forzada en pixeles para evitar scroll interno */
              src="https://app.powerbi.com/view?r=eyJrIjoiMmM1ZGM0MmItNWM4NC00M2Q3LWFlNzAtZjUyYmY0YTI4ZGM3IiwidCI6IjMwODc2Y2U0LWIzZTktNGEyOC04MDkyLWIxYzZmNzBiN2RlMyIsImMiOjR9" 
              frameBorder="0" 
              allowFullScreen={true}
              className="w-full block"
              style={{ minHeight: '850px' }} /* Aseguramos compatibilidad */
            />
          </div>
          
        </div>
      </div>
    </div>
  );
}