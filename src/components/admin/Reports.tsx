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