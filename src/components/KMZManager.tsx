import React, { useState, useRef } from 'react';
import { Upload, Download, Trash2, Eye, X, MapPin, FileText } from 'lucide-react';

interface KMZFile {
  id: string;
  name: string;
  originalName: string;
  size: number;
  uploadDate: string;
  data: string; // Base64 encoded file data
  description?: string;
}

interface KMZManagerProps {
  onClose: () => void;
}

const KMZManager: React.FC<KMZManagerProps> = ({ onClose }) => {
  const [files, setFiles] = useState<KMZFile[]>(() => {
    const stored = localStorage.getItem('loteamentos-kmz-files');
    return stored ? JSON.parse(stored) : [];
  });
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<KMZFile | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const saveFiles = (updatedFiles: KMZFile[]) => {
    setFiles(updatedFiles);
    localStorage.setItem('loteamentos-kmz-files', JSON.stringify(updatedFiles));
  };

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.kmz')) {
      alert('Apenas arquivos KMZ são permitidos');
      return;
    }

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      alert('O arquivo deve ter no máximo 50MB');
      return;
    }

    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const newFile: KMZFile = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name.replace('.kmz', ''),
          originalName: file.name,
          size: file.size,
          uploadDate: new Date().toISOString(),
          data: result,
          description: ''
        };

        const updatedFiles = [...files, newFile];
        saveFiles(updatedFiles);
        setIsUploading(false);
      };
      reader.onerror = () => {
        alert('Erro ao carregar o arquivo');
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      alert('Erro ao processar o arquivo');
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFileSelect(droppedFiles[0]);
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
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      handleFileSelect(selectedFiles[0]);
    }
  };

  const downloadFile = (file: KMZFile) => {
    const link = document.createElement('a');
    link.href = file.data;
    link.download = file.originalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const deleteFile = (fileId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este arquivo?')) {
      const updatedFiles = files.filter(f => f.id !== fileId);
      saveFiles(updatedFiles);
      if (selectedFile?.id === fileId) {
        setSelectedFile(null);
        setShowDetails(false);
      }
    }
  };

  const updateFileDescription = (fileId: string, description: string) => {
    const updatedFiles = files.map(f => 
      f.id === fileId ? { ...f, description } : f
    );
    saveFiles(updatedFiles);
    if (selectedFile?.id === fileId) {
      setSelectedFile({ ...selectedFile, description });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Arquivos KMZ do Google Earth
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Upload Area */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload de Arquivos KMZ</h3>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".kmz"
              onChange={handleFileInputChange}
              className="hidden"
              disabled={isUploading}
            />

            <div
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <div className="space-y-4">
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                    <p className="text-sm text-gray-600">Carregando arquivo...</p>
                  </>
                ) : (
                  <>
                    <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-sm text-gray-600">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="font-medium text-green-600 hover:text-green-500 cursor-pointer"
                        >
                          Clique para selecionar
                        </button> ou arraste arquivos KMZ aqui
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Arquivos KMZ do Google Earth, máximo 50MB
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Files List */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Arquivos Armazenados ({files.length})
            </h3>

            {files.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Nenhum arquivo KMZ armazenado</p>
                <p className="text-sm text-gray-400 mt-1">
                  Faça upload de arquivos do Google Earth para começar
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {files.map(file => (
                  <div key={file.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{file.name}</h4>
                        <p className="text-sm text-gray-500">{file.originalName}</p>
                      </div>
                      <MapPin className="h-5 w-5 text-green-600 flex-shrink-0 ml-2" />
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tamanho:</span>
                        <span className="font-medium">{formatFileSize(file.size)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Upload:</span>
                        <span className="font-medium">
                          {new Date(file.uploadDate).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>

                    {file.description && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          {file.description}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => {
                          setSelectedFile(file);
                          setShowDetails(true);
                        }}
                        className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Detalhes
                      </button>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => downloadFile(file)}
                          className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                          title="Download"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteFile(file.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* File Details Modal */}
        {showDetails && selectedFile && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-60">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Detalhes do Arquivo</h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{selectedFile.name}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Arquivo Original</label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{selectedFile.originalName}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tamanho</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{formatFileSize(selectedFile.size)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data Upload</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                      {new Date(selectedFile.uploadDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                  <textarea
                    value={selectedFile.description || ''}
                    onChange={(e) => updateFileDescription(selectedFile.id, e.target.value)}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-600 focus:border-green-600"
                    rows={3}
                    placeholder="Adicione uma descrição para este arquivo..."
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => downloadFile(selectedFile)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </button>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-700 hover:bg-green-800 transition-colors"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KMZManager;