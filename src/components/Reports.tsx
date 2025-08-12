import React, { useState } from 'react';
import { Area, HistoryEntry } from '../types';
import { FileDown, Filter, Calendar, TrendingUp, Building2, Users } from 'lucide-react';

interface ReportsProps {
  areas: Area[];
  history: HistoryEntry[];
}

const Reports: React.FC<ReportsProps> = ({ areas, history }) => {
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');
  const [filterBroker, setFilterBroker] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const filteredAreas = areas.filter(area => {
    const createdDate = new Date(area.createdAt);
    const startDateObj = startDate ? new Date(startDate) : null;
    const endDateObj = endDate ? new Date(endDate) : null;

    return (!filterStatus || area.status === filterStatus) &&
           (!filterType || area.type === filterType) &&
           (!filterBroker || area.broker.toLowerCase().includes(filterBroker.toLowerCase())) &&
           (!startDateObj || createdDate >= startDateObj) &&
           (!endDateObj || createdDate <= endDateObj);
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatArea = (size: number) => {
    return new Intl.NumberFormat('pt-BR').format(size);
  };

  const exportToCSV = () => {
    // Create a simplified report CSV with filtered data
    const headers = [
      'Nome da Área',
      'Tipo',
      'Localização',
      'Tamanho da Área',
      'Tamanho (m²)',
      'Corretor',
      'Status',
      'Valor por m²',
      'Valor da Área',
      'Data de Cadastro',
      'Próxima Ação',
      'Data da Próxima Ação',
      'Observações'
    ];

    const csvData = filteredAreas.map(area => [
      area.name,
      area.type,
      area.location,
      area.areaSize,
      area.size,
      area.broker,
      area.status,
      area.pricePerSquareMeter,
      area.totalValue,
      new Date(area.createdAt).toLocaleDateString('pt-BR'),
      area.nextAction,
      new Date(area.nextActionDate).toLocaleDateString('pt-BR'),
      area.observations.replace(/\n/g, ' ')
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio_areas_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const brokers = [...new Set(areas.map(area => area.broker))];

  // Calculate summary statistics
  const totalAreas = filteredAreas.length;
  const totalSize = filteredAreas.reduce((sum, area) => sum + area.size, 0);
  const totalValue = filteredAreas.reduce((sum, area) => sum + area.totalValue, 0);
  const prospectedAreas = filteredAreas.filter(area => area.status === 'Prospectado').length;
  const successRate = totalAreas > 0 ? ((prospectedAreas / totalAreas) * 100).toFixed(1) : '0';

  const statusCounts = {
    'Interesse': filteredAreas.filter(a => a.status === 'Interesse').length,
    'Em Prospecção': filteredAreas.filter(a => a.status === 'Em Prospecção').length,
    'Prospectado': filteredAreas.filter(a => a.status === 'Prospectado').length,
    'Perdido': filteredAreas.filter(a => a.status === 'Perdido').length,
  };

  const typeCounts = {
    'Condomínio': filteredAreas.filter(a => a.type === 'Condomínio').length,
    'Aberto': filteredAreas.filter(a => a.type === 'Aberto').length,
    'Logístico': filteredAreas.filter(a => a.type === 'Logístico').length,
  };

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Filter className="h-5 w-5 mr-2" />
          Filtros do Relatório
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-600 focus:border-green-600"
            >
              <option value="">Todos</option>
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
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-600 focus:border-green-600"
            >
              <option value="">Todos</option>
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
              placeholder="Digite o nome"
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-600 focus:border-green-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Data Início</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-600 focus:border-green-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Data Fim</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-600 focus:border-green-600"
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={exportToCSV}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 transition-colors"
          >
            <FileDown className="h-4 w-4 mr-2" />
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Summary Statistics */}
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
            <Calendar className="h-8 w-8 text-green-700" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Valor Total da Área</p>
              <p className="text-sm font-medium text-gray-500">Valor da Área</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalValue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-green-700" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Taxa de Sucesso</p>
              <p className="text-2xl font-bold text-gray-900">{successRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Breakdown */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Distribuição por Status</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {Object.entries(statusCounts).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{status}</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
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
                    <span className="text-sm font-bold text-gray-900 min-w-[2rem]">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Type Breakdown */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Distribuição por Tipo</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {Object.entries(typeCounts).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{type}</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div
                        className={`h-2 rounded-full ${
                          type === 'Condomínio' ? 'bg-purple-500' :
                         type === 'Aberto' ? 'bg-green-600' :
                         'bg-green-700'
                        }`}
                        style={{ width: `${totalAreas > 0 ? (count / totalAreas) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-gray-900 min-w-[2rem]">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Dados Detalhados</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Área
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Localização
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Corretor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tamanho
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor da Área
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data Cadastro
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAreas.map(area => (
                <tr key={area.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{area.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{area.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{area.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{area.broker}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      area.status === 'Interesse' ? 'bg-yellow-100 text-yellow-800' :
                      area.status === 'Em Prospecção' ? 'bg-blue-100 text-blue-800' :
                      area.status === 'Prospectado' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {area.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatArea(area.size)} m²</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{formatCurrency(area.totalValue)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(area.createdAt).toLocaleDateString('pt-BR')}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredAreas.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Nenhuma área encontrada com os filtros selecionados.</p>
        </div>
      )}
    </div>
  );
};

export default Reports;