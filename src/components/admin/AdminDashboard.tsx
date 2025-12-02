import { useState } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Wrench, 
  Settings, 
  FileText, 
  Users,
  LogOut,
  ChevronRight,
  History
} from 'lucide-react';
import { UserManagement } from './UserManagement';
import { ServiceManagement } from './ServiceManagement';
import { AppointmentManagement } from './AppointmentManagement';
import { AllAppointmentsManagement } from './AllAppointmentsManagement';
import Reports from './Reports';

interface AdminDashboardProps {
  user: {
    name: string;
    email: string;
    role: string;
  };
  onLogout: () => void;
}

type MenuItem = 'citas' | 'tecnicos' | 'servicios' | 'reportes' | 'usuarios';

export function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [activeMenu, setActiveMenu] = useState<MenuItem>('citas');

  const menuItems = [
    { id: 'citas' as MenuItem, label: 'Citas', icon: Calendar },
    { id: 'tecnicos' as MenuItem, label: 'Historial', icon: History },
    { id: 'servicios' as MenuItem, label: 'Servicios', icon: Settings },
    { id: 'reportes' as MenuItem, label: 'Reportes', icon: FileText },
    { id: 'usuarios' as MenuItem, label: 'Usuarios', icon: Users },
  ];

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      onLogout();
    }
  };

  return (
    <div className="flex h-screen bg-[#f5f5f5]">
      {/* Sidebar */}
      <div className="w-64 bg-[#1e293b] text-white flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
              <Wrench className="w-5 h-5 text-[#1e293b]" />
            </div>
            <span className="text-xl">TallerPro</span>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 py-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`w-full flex items-center gap-3 px-6 py-3 transition-colors ${
                  isActive
                    ? 'bg-[#2d3b4f] text-white border-l-4 border-blue-500'
                    : 'text-gray-300 hover:bg-[#2d3b4f] hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
              </button>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="border-t border-gray-700">
          <div className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                <span className="text-sm">{user.name.split(' ')[0][0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{user.name}</p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-[#2d3b4f] rounded transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <span>Buscar en:</span>
                <span className="text-gray-700 capitalize">
                  {activeMenu === 'tecnicos' ? 'Historial' : activeMenu}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {activeMenu === 'usuarios' && 'Gestión de usuarios'}
                {activeMenu === 'servicios' && 'Gestión de servicios'}
                {activeMenu === 'citas' && 'Gestión de citas'}
                {activeMenu === 'tecnicos' && 'Historial de citas'}
                {activeMenu === 'reportes' && 'Reportes y estadísticas'}
              </span>
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                {activeMenu === 'usuarios' && <Users className="w-5 h-5 text-gray-600" />}
                {activeMenu === 'servicios' && <Settings className="w-5 h-5 text-gray-600" />}
                {activeMenu === 'citas' && <Calendar className="w-5 h-5 text-gray-600" />}
                {activeMenu === 'tecnicos' && <History className="w-5 h-5 text-gray-600" />}
                {activeMenu === 'reportes' && <FileText className="w-5 h-5 text-gray-600" />}
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {activeMenu === 'usuarios' && (
            <div className="h-full overflow-auto p-8">
              <UserManagement />
            </div>
          )}
          {activeMenu === 'servicios' && (
            <div className="h-full overflow-auto p-8">
              <ServiceManagement />
            </div>
          )}
          {activeMenu === 'citas' && (
            <div className="h-full overflow-auto p-8">
              <AppointmentManagement />
            </div>
          )}
          {activeMenu === 'tecnicos' && <AllAppointmentsManagement />}
          {activeMenu === 'reportes' && <Reports />}
        </div>
      </div>
    </div>
  );
}