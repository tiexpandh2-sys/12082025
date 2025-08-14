import React from 'react';
import { Area } from '../types';
import { X, Edit, MapPin, User, Calendar, CheckCircle, Clock, DollarSign, Download } from 'lucide-react';

interface AreaDetailsProps {
  area: Area;
  onClose: () => void;
  onEdit: () => void;
}

const AreaDetails: React.FC<AreaDetailsProps> = ({ area, onClose, onEdit }) => {
  const statusColors = {
    'Interesse': 'bg-yellow-100 text-yellow-800',
    'Em Prospecção': 'bg-blue-100 text-blue-800',
    'Prospectado': 'bg-green-100 text-green-800',
    'Perdido': 'bg-red-100 text-red-800',
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatArea = (size: number) => {
    return new Intl.NumberFormat('pt-BR').format(size);
  };

  const checklistItems = [
    { key: 'visitaTecnica', label: 'Visita Técnica' },
    { key: 'levantamentoDocumental', label: 'Levantamento Documental' },
    { key: 'propostaApresentada', label: 'Proposta Apresentada' },
    { key: 'aprovacaoGestor', label: 'Aprovação do Gestor' }
  ];

  const completedSteps = Object.values(area.checklist).filter(Boolean).length;
  
  const getKMZFiles = () => {
    const kmzFiles = localStorage.getItem('loteamentos-kmz-files');
    if (!kmzFiles) return [];
    
    const allFiles = JSON.parse(kmzFiles);
    return allFiles.filter((file: any) => area.attachments.includes(file.id));
  };
  
  const downloadKMZFile = (file: any) => {
    const link = document.createElement('a');
    link.href = file.data;
    link.download = file.originalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const attachedKMZFiles = getKMZFiles();

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{area.name}</h2>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${statusColors[area.status]}`}>
              {area.status}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onEdit}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <MapPin className="h-5 w-5 text-gray-600 mr-2" />
                <span className="text-sm font-medium text-gray-600">Tipo</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">{area.type}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <MapPin className="h-5 w-5 text-gray-600 mr-2" />
                <span className="text-sm font-medium text-gray-600">Localização</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">{area.location}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <User className="h-5 w-5 text-gray-600 mr-2" />
                <span className="text-sm font-medium text-gray-600">Corretor</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">{area.broker}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Calendar className="h-5 w-5 text-gray-600 mr-2" />
                <span className="text-sm font-medium text-gray-600">Criado em</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(area.createdAt).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>

          {/* Financial Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Informações Financeiras
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-gray-200 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Tamanho da Área</p>
                <p className="text-2xl font-bold text-gray-900">{area.areaSize}</p>
              </div>
              <div className="border border-gray-200 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Área Total</p>
                <p className="text-2xl font-bold text-gray-900">{formatArea(area.size)} m²</p>
              </div>
              <div className="border border-gray-200 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Valor por m²</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(area.pricePerSquareMeter)}</p>
              </div>
              <div className="border border-green-200 p-4 rounded-lg bg-green-50">
                <p className="text-sm text-green-600 mb-1">Valor da Área</p>
                <p className="text-2xl font-bold text-green-800">{formatCurrency(area.totalValue)}</p>
              </div>
            </div>
          </div>

          {/* Next Action */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Próxima Ação
            </h3>
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <p className="text-gray-800 mb-2">{area.nextAction}</p>
              <div className="flex items-center text-sm text-blue-600">
                <Calendar className="h-4 w-4 mr-1" />
                Data prevista: {new Date(area.nextActionDate).toLocaleDateString('pt-BR')}
              </div>
            </div>
          </div>

          {/* Checklist */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Checklist de Etapas ({completedSteps}/4)
            </h3>
            <div className="space-y-3">
              {checklistItems.map(item => (
                <div key={item.key} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className={`flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center ${
                    area.checklist[item.key as keyof typeof area.checklist]
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {area.checklist[item.key as keyof typeof area.checklist] && (
                      <CheckCircle className="h-3 w-3" />
                    )}
                  </div>
                  <span className={`ml-3 text-sm font-medium ${
                    area.checklist[item.key as keyof typeof area.checklist]
                      ? 'text-green-800'
                      : 'text-gray-700'
                  }`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Progress bar */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progresso</span>
                <span>{Math.round((completedSteps / 4) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(completedSteps / 4) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* KMZ Files */}
          {attachedKMZFiles.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Arquivos KMZ do Google Earth
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {attachedKMZFiles.map((file: any) => (
                  <div key={file.id} className="border border-green-200 bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-green-800 truncate">{file.name}</h4>
                        <p className="text-sm text-green-600">{file.originalName}</p>
                        <p className="text-xs text-green-500 mt-1">
                          Upload: {new Date(file.uploadDate).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <button
                        onClick={() => downloadKMZFile(file)}
                        className="ml-3 p-2 text-green-600 hover:text-green-700 hover:bg-green-100 rounded-full transition-colors"
                        title="Download arquivo KMZ"
                      >
                        <Download className="h-5 w-5" />
                      </button>
                    </div>
                    {file.description && (
                      <p className="text-sm text-green-700 mt-2 bg-green-100 p-2 rounded">
                        {file.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Observations */}
          {area.observations && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Observações</h3>
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                <p className="text-gray-800 whitespace-pre-wrap">{area.observations}</p>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 h-6 w-6 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="h-2 w-2 bg-green-600 rounded-full"></div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Área cadastrada</p>
                  <p className="text-xs text-gray-500">
                    {new Date(area.createdAt).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
              
              {area.createdAt !== area.updatedAt && (
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Última atualização</p>
                    <p className="text-xs text-gray-500">
                      {new Date(area.updatedAt).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AreaDetails;