import React from 'react';
import { Area, HistoryEntry } from '../types';
import { Building2, TrendingUp, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';

interface DashboardProps {
  areas: Area[];
  history: HistoryEntry[];
}

const Dashboard: React.FC<DashboardProps> = ({ areas, history }) => {
  const totalAreas = areas.length;
  const totalSize = areas.reduce((sum, area) => sum + area.size, 0);
  const prospectedAreas = areas.filter(area => area.status === 'Prospectado').length;
  const successRate = totalAreas > 0 ? ((prospectedAreas / totalAreas) * 100).toFixed(1) : '0';

  const statusCounts = {
    'Interesse': areas.filter(a => a.status === 'Interesse').length,
    'Em Prospecção': areas.filter(a => a.status === 'Em Prospecção').length,
    'Prospectado': areas.filter(a => a.status === 'Prospectado').length,
    'Perdido': areas.filter(a => a.status === 'Perdido').length,
  };

  const overdueAreas = areas.filter(area => {
    const nextActionDate = new Date(area.nextActionDate);
    const today = new Date();
    return nextActionDate < today && area.status !== 'Prospectado' && area.status !== 'Perdido';
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

  return (
    <div className="space-y-8">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Building2 className="h-8 w-8 text-green-700" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total de Áreas</p>
              <p className="text-2xl font-bold text-gray-900">{totalAreas}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-700" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Área Total</p>
              <p className="text-2xl font-bold text-gray-900">{formatArea(totalSize)} m²</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-700" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Taxa de Sucesso</p>
              <p className="text-2xl font-bold text-gray-900">{successRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Ações Atrasadas</p>
              <p className="text-2xl font-bold text-gray-900">{overdueAreas.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Visual */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Pipeline de Prospecção</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="text-center">
                <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium mb-2 ${statusColors[status as keyof typeof statusColors]}`}>
                  {status}
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{count}</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      status === 'Interesse' ? 'bg-yellow-500' :
                     status === 'Em Prospecção' ? 'bg-green-600' :
                      status === 'Prospectado' ? 'bg-green-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${totalAreas > 0 ? (count / totalAreas) * 100 : 0}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {totalAreas > 0 ? ((count / totalAreas) * 100).toFixed(0) : 0}%
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overdue Areas */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <AlertTriangle className="h-5 w-5 text-green-600 mr-2" />
              Ações em Atraso
            </h3>
          </div>
          <div className="p-6">
            {overdueAreas.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Nenhuma ação em atraso</p>
            ) : (
              <div className="space-y-4">
                {overdueAreas.slice(0, 5).map(area => (
                  <div key={area.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{area.name}</p>
                      <p className="text-sm text-gray-600">{area.nextAction}</p>
                      <p className="text-xs text-orange-600">
                        Venceu em: {new Date(area.nextActionDate).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent History */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <Calendar className="h-5 w-5 text-green-700 mr-2" />
              Atividade Recente
            </h3>
          </div>
          <div className="p-6">
            {history.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Nenhuma atividade recente</p>
            ) : (
              <div className="space-y-4">
                {history.slice(-5).reverse().map(entry => (
                  <div key={entry.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-green-700" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{entry.areaName}</p>
                      <p className="text-xs text-gray-600">
                        Status alterado de "{entry.previousStatus}" para "{entry.newStatus}"
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(entry.date).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;