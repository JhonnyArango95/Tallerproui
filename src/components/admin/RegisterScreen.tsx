import { useState } from 'react';
import { Shield, User, Mail, Lock, Loader2, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { authService } from '../../services/api.service';
import { toast } from 'sonner@2.0.3';

interface RegisterScreenProps {
  onRegisterSuccess: () => void;
  onBackToLogin: () => void;
}

export function RegisterScreen({ onRegisterSuccess, onBackToLogin }: RegisterScreenProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    const errors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      errors.nombre = 'El nombre es requerido';
    }

    if (!formData.email.trim()) {
      errors.email = 'El correo es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Ingresa un correo válido';
    }

    if (!formData.password) {
      errors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      errors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsLoading(true);
    setShowError(false);
    setShowSuccess(false);

    try {
      const response = await authService.register({
        nombre: formData.nombre,
        email: formData.email,
        password: formData.password,
      });

      console.log('Registro exitoso:', response);
      
      // Mostrar banner de éxito
      setShowSuccess(true);
      toast.success('¡Registro exitoso! Redirigiendo al login...');
      
      // Redirigir al login después de 2.5 segundos
      setTimeout(() => {
        onRegisterSuccess();
      }, 2500);

    } catch (error) {
      console.error('Error en el registro:', error);
      const errorMsg = error instanceof Error ? error.message : 'Error al registrar. Verifica tus datos.';
      setErrorMessage(errorMsg);
      setShowError(true);
      toast.error(errorMsg);
      setIsLoading(false);
    }
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
                <p className="font-medium">¡Registro exitoso!</p>
                <p className="text-sm">Tu cuenta ha sido creada. Redirigiendo al inicio de sesión...</p>
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
                <p className="font-medium">Error en el registro</p>
                <p className="text-sm">{errorMessage}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#ff9800]/10 rounded-full mb-4">
            <Shield className="w-8 h-8 text-[#ff9800]" />
          </div>
          <h1 className="text-white mb-2">Registro de Administrador</h1>
          <p className="text-gray-400">Crea tu cuenta para acceder al panel</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nombre Completo */}
            <div>
              <Label htmlFor="nombre" className="text-gray-700 mb-2 block">
                Nombre Completo
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="nombre"
                  type="text"
                  placeholder="Ingresa tu nombre completo"
                  className="pl-10"
                  value={formData.nombre}
                  onChange={(e) => {
                    setFormData({ ...formData, nombre: e.target.value });
                    if (validationErrors.nombre) {
                      const newErrors = { ...validationErrors };
                      delete newErrors.nombre;
                      setValidationErrors(newErrors);
                    }
                  }}
                />
              </div>
              {validationErrors.nombre && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.nombre}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-gray-700 mb-2 block">
                Correo Electrónico
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  className="pl-10"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (validationErrors.email) {
                      const newErrors = { ...validationErrors };
                      delete newErrors.email;
                      setValidationErrors(newErrors);
                    }
                  }}
                />
              </div>
              {validationErrors.email && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
              )}
            </div>

            {/* Contraseña */}
            <div>
              <Label htmlFor="password" className="text-gray-700 mb-2 block">
                Contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo 8 caracteres"
                  className="pl-10 pr-10"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    if (validationErrors.password) {
                      const newErrors = { ...validationErrors };
                      delete newErrors.password;
                      setValidationErrors(newErrors);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {validationErrors.password && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.password}</p>
              )}
            </div>

            {/* Confirmar Contraseña */}
            <div>
              <Label htmlFor="confirmPassword" className="text-gray-700 mb-2 block">
                Confirmar Contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Repite tu contraseña"
                  className="pl-10 pr-10"
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    setFormData({ ...formData, confirmPassword: e.target.value });
                    if (validationErrors.confirmPassword) {
                      const newErrors = { ...validationErrors };
                      delete newErrors.confirmPassword;
                      setValidationErrors(newErrors);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {validationErrors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.confirmPassword}</p>
              )}
            </div>

            {/* Botones */}
            <div className="space-y-3 pt-2">
              <Button
                type="submit"
                className="w-full bg-[#ff9800] hover:bg-[#f57c00] text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Registrando...
                  </>
                ) : (
                  'Registrarse'
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={onBackToLogin}
                disabled={isLoading}
              >
                Volver al Inicio de Sesión
              </Button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            ¿Ya tienes cuenta?{' '}
            <button
              onClick={onBackToLogin}
              className="text-[#ff9800] hover:text-[#f57c00] underline"
              disabled={isLoading}
            >
              Inicia sesión aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}