import React, { useState } from 'react';
import { Area } from '../types';
import { Edit, Trash2, Eye, MapPin, User, Calendar, AlertTriangle } from 'lucide-react';
import AreaDetails from './AreaDetails';

interface AreasListProps {
  areas: Area[];
  onEdit: (area: Area) => void;
  onDelete: (id: string) => void;
}

const AreasList: React.FC<AreasListProps> = ({ areas, onEdit, onDelete }) => {
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');
  const [filterBroker, setFilterBroker] = useState<string>('');
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);

  const filteredAreas = areas.filter(area => {
    return (!filterStatus || area.status === filterStatus) &&
           (!filterType || area.type === filterType) &&
           (!filterBroker || area.broker.toLowerCase().includes(filterBroker.toLowerCase()));
  });

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

  const isOverdue = (area: Area) => {
    const nextActionDate = new Date(area.nextActionDate);
    const today = new Date();
    return nextActionDate < today && area.status !== 'Prospectado' && area.status !== 'Perdido';
  };

  const brokers = [...new Set(areas.map(area => area.broker))];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos os status</option>
              <option value="Interesse">Interesse</option>
              <option value="Em Prospecção">Em Prospecção</option>
              <option value="Prospectado">Prospectado</option>
              <option value="Perdido">Perdido</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos os tipos</option>
              <option value="Condomínio">Condomínio</option>
              <option value="Aberto">Aberto</option>
              <option value="Logístico">Logístico</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Corretor</label>
            <input
              type="text"
              value={filterBroker}
              onChange={(e) => setFilterBroker(e.target.value)}
              placeholder="Digite o nome do corretor"
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Areas Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredAreas.map(area => (
          <div key={area.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{area.name}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {area.type}
                    </span>
                    <span className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {area.broker}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {isOverdue(area) && (
                    <AlertTriangle className="h-5 w-5 text-orange-500" title="Ação em atraso" />
                  )}
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[area.status]}`}>
                    {area.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Tamanho da Área</p>
                  <p className="font-semibold text-gray-900">{area.areaSize}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Área</p>
                  <p className="font-semibold text-gray-900">{formatArea(area.size)} m²</p>
                </div>
              </div>

              <div className="mb-4">
                <div>
                  <p className="text-sm text-gray-600">Valor da Área</p>
                  <p className="font-semibold text-gray-900">{formatCurrency(area.totalValue)}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-1">Próxima Ação</p>
                <p className="text-sm text-gray-800 line-clamp-2">{area.nextAction}</p>
                <div className="flex items-center mt-1 text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(area.nextActionDate).toLocaleDateString('pt-BR')}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="text-xs text-gray-500">
                  Criado em {new Date(area.createdAt).toLocaleDateString('pt-BR')}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedArea(area)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Ver detalhes"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onEdit(area)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Editar"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Tem certeza que deseja excluir esta área?')) {
                        onDelete(area.id);
                      }
                    }}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAreas.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Nenhuma área encontrada com os filtros selecionados.</p>
        </div>
      )}

      {/* Area Details Modal */}
      {selectedArea && (
        <AreaDetails
          area={selectedArea}
          onClose={() => setSelectedArea(null)}
          onEdit={() => {
            onEdit(selectedArea);
            setSelectedArea(null);
          }}
        />
      )}
    </div>
  );
};

export default AreasList;