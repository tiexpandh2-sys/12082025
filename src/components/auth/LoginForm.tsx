import React, { useState } from 'react';
import { Eye, EyeOff, LogIn, Building2, Upload } from 'lucide-react';
import { LoginCredentials } from '../../types/auth';
import { validateEmail, findUserByEmail, comparePassword, setUserSession, getCompanyLogo } from '../../utils/auth';

interface LoginFormProps {
  onLogin: () => void;
  onSwitchToRegister: () => void;
  onSwitchToForgotPassword: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onSwitchToRegister, onSwitchToForgotPassword }) => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const companyLogo = getCompanyLogo();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors([]);

    try {
      // Validation
      const validationErrors: string[] = [];
      
      if (!credentials.email) {
        validationErrors.push('E-mail é obrigatório');
      } else if (!validateEmail(credentials.email)) {
        validationErrors.push('Formato de e-mail inválido');
      }
      
      if (!credentials.password) {
        validationErrors.push('Senha é obrigatória');
      }

      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        return;
      }

      // Find user
      const user = findUserByEmail(credentials.email);
      if (!user) {
        setErrors(['E-mail ou senha incorretos']);
        return;
      }

      // Verify password
      const isPasswordValid = await comparePassword(credentials.password, user.password);
      if (!isPasswordValid) {
        setErrors(['E-mail ou senha incorretos']);
        return;
      }

      // Set session and login
      setUserSession(user);
      onLogin();
    } catch (error) {
      setErrors(['Erro interno. Tente novamente.']);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            {companyLogo ? (
              <img 
                src={companyLogo} 
                alt="Logo da Empresa" 
                className="h-16 w-auto mx-auto mb-4"
              />
            ) : (
              <Building2 className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            )}
            <h1 className="text-2xl font-bold text-gray-900">Prospecção de Loteamentos</h1>
            <p className="text-gray-600 mt-2">Faça login para acessar o sistema</p>
          </div>

          {/* Error Messages */}
          {errors.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              {errors.map((error, index) => (
                <p key={index} className="text-red-600 text-sm">{error}</p>
              ))}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-mail
              </label>
              <input
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="seu@email.com"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={credentials.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Sua senha"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <LogIn className="h-5 w-5 mr-2" />
                  Entrar
                </>
              )}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center space-y-2">
            <button
              onClick={onSwitchToForgotPassword}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Esqueceu sua senha?
            </button>
            <div className="text-gray-500 text-sm">
              Não tem uma conta?{' '}
              <button
                onClick={onSwitchToRegister}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Cadastre-se
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginForm;