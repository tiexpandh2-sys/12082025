import React, { useState, useRef } from 'react';
import { Upload, X, Check } from 'lucide-react';
import { setCompanyLogo, getCompanyLogo } from '../../utils/auth';

interface LogoUploadProps {
  onLogoUpdate?: () => void;
  className?: string;
}

const LogoUpload: React.FC<LogoUploadProps> = ({ onLogoUpdate, className = '' }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [currentLogo, setCurrentLogo] = useState<string | null>(getCompanyLogo());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file) return;

    // Validate file type
    const validTypes = ['image/png', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      alert('Apenas arquivos PNG e SVG são permitidos');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('O arquivo deve ter no máximo 2MB');
      return;
    }

    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setCompanyLogo(result);
      setCurrentLogo(result);
      setIsUploading(false);
      onLogoUpdate?.();
    };
    reader.onerror = () => {
      alert('Erro ao carregar o arquivo');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemoveLogo = () => {
    localStorage.removeItem('loteamentos-company-logo');
    setCurrentLogo(null);
    onLogoUpdate?.();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Logo da Empresa</h3>
        {currentLogo && (
          <button
            onClick={handleRemoveLogo}
            className="text-red-600 hover:text-red-700 text-sm font-medium"
          >
            Remover Logo
          </button>
        )}
      </div>

      {/* Current Logo Preview */}
      {currentLogo && (
        <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg border">
          <img 
            src={currentLogo} 
            alt="Logo atual" 
            className="max-h-16 max-w-48 object-contain"
          />
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".png,.svg,image/png,image/svg+xml"
          onChange={handleFileInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />
        
        <div className="space-y-2">
          {isUploading ? (
            <>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-gray-600">Carregando logo...</p>
            </>
          ) : (
            <>
              <Upload className="h-8 w-8 text-gray-400 mx-auto" />
              <div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer">
                    Clique para selecionar
                  </span> ou arraste o arquivo aqui
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG ou SVG, máximo 2MB
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-500">
        O logo será exibido na tela de login e no cabeçalho do sistema após o login.
      </p>
    </div>
  );
};

export default LogoUpload;