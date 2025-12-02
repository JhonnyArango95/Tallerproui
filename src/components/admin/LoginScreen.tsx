import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Wrench, AlertCircle, CheckCircle2, Loader2, Eye, EyeOff } from 'lucide-react';
import { authService } from '../../services/api.service';
import { toast } from 'sonner@2.0.3';

interface LoginScreenProps {
  onLoginSuccess: (user: any) => void;
  onRegisterClick: () => void;
}

export function LoginScreen({ onLoginSuccess, onRegisterClick }: LoginScreenProps) {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setShowError(false);
    setShowSuccess(false);
    setIsLoading(true);

    // Simular petición al servidor
    authService.login(credentials)
      .then(response => {
        setShowSuccess(true);
        setTimeout(() => {
          onLoginSuccess({
            name: 'Maria Gómez',
            email: credentials.email,
            role: 'Administrador',
          });
        }, 1500);
      })
      .catch(error => {
        setShowError(true);
        setIsLoading(false);
        toast.error('Credenciales incorrectas');
      });
  };

  return (
    <div className="min-h-screen bg-[#4a5568] flex items-center justify-center p-4 relative">
      {/* Success Message - Top Center Banner */}
      {showSuccess && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 animate-in slide-in-from-top">
          <div className="bg-[#22c55e] text-white px-6 py-4 rounded-lg shadow-lg">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Bienvenido de nuevo</p>
                <p className="text-sm">Tu autenticación fue exitosa y tu sesión está activa.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Message - Top Center Banner */}
      {showError && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 animate-in slide-in-from-top">
          <div className="bg-[#ef4444] text-white px-6 py-4 rounded-lg shadow-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Credenciales incorrectas</p>
                <p className="text-sm">Verifica tu correo y contraseña e inténtalo nuevamente.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Login Card */}
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-[#1e293b] rounded flex items-center justify-center">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-gray-900">TallerPro</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Acceso seguro</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Panel diseñado para administrar los datos, ver el estado del servicio o la solicitud.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Field */}
          <div>
            <Label htmlFor="email" className="text-gray-700 mb-2 block">
              Correo electrónico
            </Label>
            <Input
              id="email"
              type="text"
              value={credentials.email}
              onChange={(e) => {
                setCredentials({ ...credentials, email: e.target.value });
                setShowError(false);
              }}
              className="bg-white border-gray-300"
              placeholder="tallerpro.com"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <Label htmlFor="password" className="text-gray-700 mb-2 block">
              Contraseña
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={credentials.password}
                onChange={(e) => {
                  setCredentials({ ...credentials, password: e.target.value });
                  setShowError(false);
                }}
                className="bg-white border-gray-300"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600">
              <input type="checkbox" className="rounded border-gray-300" />
              Recordarme
            </label>
            <a href="#" className="text-blue-600 hover:text-blue-700 underline">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Entrar'}
          </Button>

          {/* Help Link */}
          <div className="text-center">
            <a href="#" className="text-sm text-gray-500 hover:text-gray-700 inline-flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              Ayuda
            </a>
          </div>
        </form>

        {/* Register Link */}
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={onRegisterClick}
            className="text-sm text-blue-600 hover:text-blue-700 underline"
          >
            ¿No tienes una cuenta? Regístrate
          </button>
        </div>
      </div>
    </div>
  );
}