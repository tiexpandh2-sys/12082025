import React, { useState, useRef } from 'react';
import { Download, Upload, FileText, History, AlertCircle, CheckCircle, X } from 'lucide-react';
import { Area, HistoryEntry } from '../types';
import { 
  exportAreasToCSV, 
  exportHistoryToCSV, 
  importAreasFromCSV, 
  importHistoryFromCSV, 
  downloadCSV 
} from '../utils/csvUtils';

interface DataManagementProps {
  areas: Area[];
  history: HistoryEntry[];
  onImportAreas: (areas: Area[]) => void;
  onImportHistory: (history: HistoryEntry[]) => void;
  onClose: () => void;
}

const DataManagement: React.FC<DataManagementProps> = ({ 
  areas, 
  history, 
  onImportAreas, 
  onImportHistory, 
  onClose 
}) => {
  const [importType, setImportType] = useState<'areas' | 'history'>('areas');
  const [importStatus, setImportStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportAreas = () => {
    const csvContent = exportAreasToCSV(areas);
    const filename = `areas_${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(csvContent, filename);
  };

  const handleExportHistory = () => {
    const csvContent = exportHistoryToCSV(history);
    const filename = `historico_${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(csvContent, filename);
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setImportStatus({
        type: 'error',
        message: 'Por favor, selecione um arquivo CSV válido'
      });
      return;
    }

    setIsImporting(true);
    setImportStatus({ type: null, message: '' });

    try {
      const content = await file.text();
      
      if (importType === 'areas') {
        const importedAreas = importAreasFromCSV(content);
        onImportAreas(importedAreas);
        setImportStatus({
          type: 'success',
          message: `${importedAreas.length} área(s) importada(s) com sucesso!`
        });
      } else {
        const importedHistory = importHistoryFromCSV(content);
        onImportHistory(importedHistory);
        setImportStatus({
          type: 'success',
          message: `${importedHistory.length} entrada(s) de histórico importada(s) com sucesso!`
        });
      }
    } catch (error) {
      setImportStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Erro ao importar arquivo'
      });
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Gerenciar Dados</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Export Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Download className="h-5 w-5 mr-2" />
              Exportar Dados
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <FileText className="h-6 w-6 text-blue-600 mr-2" />
                  <div>
                    <h4 className="font-medium text-gray-900">Áreas</h4>
                    <p className="text-sm text-gray-600">{areas.length} registro(s)</p>
                  </div>
                </div>
                <button
                  onClick={handleExportAreas}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Exportar Áreas
                </button>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <History className="h-6 w-6 text-green-600 mr-2" />
                  <div>
                    <h4 className="font-medium text-gray-900">Histórico</h4>
                    <p className="text-sm text-gray-600">{history.length} registro(s)</p>
                  </div>
                </div>
                <button
                  onClick={handleExportHistory}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  Exportar Histórico
                </button>
              </div>
            </div>
          </div>

          {/* Import Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Upload className="h-5 w-5 mr-2" />
              Importar Dados
            </h3>

            {/* Import Type Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de dados para importar
              </label>
              <select
                value={importType}
                onChange={(e) => setImportType(e.target.value as 'areas' | 'history')}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                disabled={isImporting}
              >
                <option value="areas">Áreas</option>
                <option value="history">Histórico</option>
              </select>
            </div>

            {/* File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
              disabled={isImporting}
            />

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Selecione um arquivo CSV para importar {importType === 'areas' ? 'áreas' : 'histórico'}
                </p>
                <button
                  onClick={triggerFileInput}
                  disabled={isImporting}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isImporting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Importando...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Selecionar Arquivo
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Import Status */}
            {importStatus.type && (
              <div className={`mt-4 p-4 rounded-lg flex items-start ${
                importStatus.type === 'success' 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                {importStatus.type === 'success' ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                )}
                <p className={`text-sm ${
                  importStatus.type === 'success' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {importStatus.message}
                </p>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Instruções Importantes:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Os arquivos devem estar no formato CSV com codificação UTF-8</li>
              <li>• Ao importar áreas, os dados existentes serão substituídos</li>
              <li>• Ao importar histórico, os dados existentes serão substituídos</li>
              <li>• Faça backup dos dados atuais antes de importar novos dados</li>
              <li>• Verifique se o formato do arquivo está correto antes da importação</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataManagement;