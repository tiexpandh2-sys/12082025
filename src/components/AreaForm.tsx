import React, { useState, useEffect } from 'react';
import { Area } from '../types';
import { Save, X, Upload, Trash2, MapPin } from 'lucide-react';

interface AreaFormProps {
  area: Area | null;
  onSave: (area: Omit<Area, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const AreaForm: React.FC<AreaFormProps> = ({ area, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Condomínio' as 'Condomínio' | 'Aberto' | 'Logístico',
    location: '',
    size: 0,
    areaSize: '',
    broker: '',
    status: 'Interesse' as 'Interesse' | 'Em Prospecção' | 'Prospectado' | 'Perdido',
    pricePerSquareMeter: 0,
    totalValue: 0,
    nextAction: '',
    nextActionDate: '',
    observations: '',
    attachments: [] as string[],
    checklist: {
      visitaTecnica: false,
      levantamentoDocumental: false,
      propostaApresentada: false,
      aprovacaoGestor: false
    }
  });
  const [availableKMZFiles, setAvailableKMZFiles] = useState<Array<{id: string, name: string}>>([]);

  useEffect(() => {
    if (area) {
      setFormData({
        name: area.name,
        type: area.type,
        location: area.location,
        size: area.size,
        areaSize: area.areaSize,
        broker: area.broker,
        status: area.status,
        pricePerSquareMeter: area.pricePerSquareMeter,
        totalValue: area.totalValue,
        nextAction: area.nextAction,
        nextActionDate: area.nextActionDate,
        observations: area.observations,
        attachments: area.attachments,
        checklist: area.checklist
      });
    }
    
    // Load available KMZ files
    const kmzFiles = localStorage.getItem('loteamentos-kmz-files');
    if (kmzFiles) {
      const files = JSON.parse(kmzFiles);
      setAvailableKMZFiles(files.map((f: any) => ({ id: f.id, name: f.name })));
    }
  }, [area]);

  useEffect(() => {
    // Calculate total value automatically
    const total = formData.size * formData.pricePerSquareMeter;
    setFormData(prev => ({ ...prev, totalValue: total }));
  }, [formData.size, formData.pricePerSquareMeter]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'size' || name === 'pricePerSquareMeter' ? Number(value) : value
    }));
  };

  const handleChecklistChange = (item: keyof typeof formData.checklist) => {
    setFormData(prev => ({
      ...prev,
      checklist: {
        ...prev.checklist,
        [item]: !prev.checklist[item]
      }
    }));
  };

  const handleKMZFileSelect = (fileId: string) => {
    if (!formData.attachments.includes(fileId)) {
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, fileId]
      }));
    }
  };

  const removeKMZFile = (fileId: string) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter(id => id !== fileId)
    }));
  };

  const getKMZFileName = (fileId: string) => {
    const file = availableKMZFiles.find(f => f.id === fileId);
    return file ? file.name : 'Arquivo não encontrado';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const checklistItems = [
    { key: 'visitaTecnica', label: 'Visita Técnica' },
    { key: 'levantamentoDocumental', label: 'Levantamento Documental' },
    { key: 'propostaApresentada', label: 'Proposta Apresentada' },
    { key: 'aprovacaoGestor', label: 'Aprovação do Gestor' }
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">
          {area ? 'Editar Área' : 'Nova Área'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome da Área *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-600 focus:border-green-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Loteamento *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-600 focus:border-green-600"
            >
              <option value="Condomínio">Condomínio</option>
              <option value="Aberto">Aberto</option>
              <option value="Logístico">Logístico</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Localização da Área *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-600 focus:border-green-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tamanho da Área *
            </label>
            <input
              type="text"
              name="areaSize"
              value={formData.areaSize}
              onChange={handleInputChange}
              required
              placeholder="Ex: 15 hectares, 2 alqueires, etc."
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-600 focus:border-green-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tamanho (m²) *
            </label>
            <input
              type="number"
              name="size"
              value={formData.size}
              onChange={handleInputChange}
              required
              min="0"
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-600 focus:border-green-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Corretor *
            </label>
            <input
              type="text"
              name="broker"
              value={formData.broker}
              onChange={handleInputChange}
              required
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-600 focus:border-green-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status *
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              required
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-600 focus:border-green-600"
            >
              <option value="Interesse">Interesse</option>
              <option value="Em Prospecção">Em Prospecção</option>
              <option value="Prospectado">Prospectado</option>
              <option value="Perdido">Perdido</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor por m² *
            </label>
            <input
              type="number"
              name="pricePerSquareMeter"
              value={formData.pricePerSquareMeter}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-600 focus:border-green-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor da Área
            </label>
            <input
              type="text"
              value={formatCurrency(formData.totalValue)}
              disabled
              className="w-full bg-gray-100 border-gray-300 rounded-md shadow-sm cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data da Próxima Ação *
            </label>
            <input
              type="date"
              name="nextActionDate"
              value={formData.nextActionDate}
              onChange={handleInputChange}
              required
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-600 focus:border-green-600"
            />
          </div>
        </div>

        {/* Next Action */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Próxima Ação *
          </label>
          <textarea
            name="nextAction"
            value={formData.nextAction}
            onChange={handleInputChange}
            required
            rows={3}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-600 focus:border-green-600"
            placeholder="Descreva a próxima ação a ser realizada..."
          />
        </div>

        {/* Observations */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Observações
          </label>
          <textarea
            name="observations"
            value={formData.observations}
            onChange={handleInputChange}
            rows={4}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-600 focus:border-green-600"
            placeholder="Observações adicionais sobre a área..."
          />
        </div>

        {/* Checklist */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Checklist de Etapas
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {checklistItems.map(item => (
              <div key={item.key} className="flex items-center">
                <input
                  type="checkbox"
                  id={item.key}
                  checked={formData.checklist[item.key as keyof typeof formData.checklist]}
                  onChange={() => handleChecklistChange(item.key as keyof typeof formData.checklist)}
                  className="h-4 w-4 text-green-700 focus:ring-green-600 border-gray-300 rounded"
                />
                <label htmlFor={item.key} className="ml-2 text-sm text-gray-700">
                  {item.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* KMZ Files */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Arquivos KMZ do Google Earth
          </label>
          
          {availableKMZFiles.length > 0 ? (
            <div className="space-y-4">
              <div>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleKMZFileSelect(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-600 focus:border-green-600"
                >
                  <option value="">Selecione um arquivo KMZ para anexar</option>
                  {availableKMZFiles
                    .filter(file => !formData.attachments.includes(file.id))
                    .map(file => (
                      <option key={file.id} value={file.id}>
                        {file.name}
                      </option>
                    ))}
                </select>
              </div>
              
              {formData.attachments.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Arquivos anexados:</p>
                  <div className="space-y-2">
                    {formData.attachments.map(fileId => (
                      <div key={fileId} className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-green-600 mr-2" />
                          <span className="text-sm font-medium text-green-800">
                            {getKMZFileName(fileId)}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeKMZFile(fileId)}
                          className="text-red-600 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6 bg-gray-50 border border-gray-200 rounded-lg">
              <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Nenhum arquivo KMZ disponível</p>
              <p className="text-xs text-gray-400 mt-1">
                Use o botão "Arquivos KMZ" no cabeçalho para fazer upload de arquivos
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 transition-colors"
          >
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </button>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 transition-colors"
          >
            <Save className="h-4 w-4 mr-2" />
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AreaForm;