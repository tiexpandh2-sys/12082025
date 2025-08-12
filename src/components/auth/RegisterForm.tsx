import React, { useState } from 'react';
import { Eye, EyeOff, UserPlus, ArrowLeft } from 'lucide-react';
import { RegisterData } from '../../types/auth';
import { validateEmail, validatePassword, findUserByEmail, hashPassword, storeUser, generateUserId } from '../../utils/auth';

interface RegisterFormProps {
  onRegisterSuccess: () => void;
  onBackToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegisterSuccess, onBackToLogin }) => {
  const [formData, setFormData] = useState<RegisterData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
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
      
      if (!formData.name.trim()) {
        validationErrors.push('Nome completo é obrigatório');
      }
      
      if (!formData.email) {
        validationErrors.push('E-mail é obrigatório');
      } else if (!validateEmail(formData.email)) {
        validationErrors.push('Formato de e-mail inválido');
      }
      
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        validationErrors.push(...passwordValidation.errors);
      }
      
      if (formData.password !== formData.confirmPassword) {
        validationErrors.push('As senhas não coincidem');
      }

      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        return;
      }

      // Check if user already exists
      const existingUser = findUserByEmail(formData.email);
      if (existingUser) {
        setErrors(['Este e-mail já está cadastrado']);
        return;
      }

      // Create new user
      const hashedPassword = await hashPassword(formData.password);
      const newUser = {
        id: generateUserId(),
        name: formData.name.trim(),
        email: formData.email.toLowerCase(),
        password: hashedPassword,
        role: 'user' as const,
        createdAt: new Date().toISOString()
      };

      storeUser(newUser);
      onRegisterSuccess();
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
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Criar Conta</h1>
            <p className="text-gray-600 mt-2">Preencha os dados para se cadastrar</p>
          </div>

          {/* Error Messages */}
          {errors.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              {errors.map((error, index) => (
                <p key={index} className="text-red-600 text-sm">{error}</p>
              ))}
            </div>
          )}

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome Completo *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors"
                placeholder="Seu nome completo"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-mail *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors"
                placeholder="seu@email.com"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors"
                  placeholder="Mínimo 8 caracteres"
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
              <p className="text-xs text-gray-500 mt-1">
                A senha deve conter pelo menos 8 caracteres, incluindo maiúscula, minúscula e número
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Senha *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors"
                  placeholder="Digite a senha novamente"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-700 text-white py-3 px-4 rounded-lg hover:bg-green-800 focus:ring-2 focus:ring-green-600 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <UserPlus className="h-5 w-5 mr-2" />
                  Criar Conta
                </>
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <button
              onClick={onBackToLogin}
              className="inline-flex items-center text-green-700 hover:text-green-800 text-sm font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Voltar ao Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;