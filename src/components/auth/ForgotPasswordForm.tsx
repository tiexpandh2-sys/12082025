import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { validateEmail, findUserByEmail } from '../../utils/auth';

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors([]);

    try {
      // Validation
      if (!email) {
        setErrors(['E-mail é obrigatório']);
        return;
      }
      
      if (!validateEmail(email)) {
        setErrors(['Formato de e-mail inválido']);
        return;
      }

      // Check if user exists
      const user = findUserByEmail(email);
      if (!user) {
        setErrors(['E-mail não encontrado em nossa base de dados']);
        return;
      }

      // Simulate email sending (in a real app, this would call an API)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsSuccess(true);
    } catch (error) {
      setErrors(['Erro interno. Tente novamente.']);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-700 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">E-mail Enviado!</h1>
            <p className="text-gray-600 mb-6">
              Enviamos as instruções para recuperação de senha para <strong>{email}</strong>.
              Verifique sua caixa de entrada e spam.
            </p>
            <button
              onClick={onBackToLogin}
              className="inline-flex items-center text-green-700 hover:text-green-800 font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Voltar ao Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Mail className="h-16 w-16 text-green-700 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900">Recuperar Senha</h1>
            <p className="text-gray-600 mt-2">
              Digite seu e-mail para receber as instruções de recuperação
            </p>
          </div>

          {/* Error Messages */}
          {errors.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              {errors.map((error, index) => (
                <p key={index} className="text-red-600 text-sm">{error}</p>
              ))}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors"
                placeholder="seu@email.com"
                disabled={isLoading}
              />
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
                  <Mail className="h-5 w-5 mr-2" />
                  Enviar Instruções
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

          {/* Note */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">
              <strong>Nota:</strong> Esta é uma demonstração. Em um ambiente real, 
              um e-mail seria enviado com um link seguro para redefinir a senha.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;