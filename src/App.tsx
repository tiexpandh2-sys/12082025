import React, { useState, useEffect } from 'react';
import { Building2, Plus, FileText, Bell, Calendar, Users, Database } from 'lucide-react';
import AuthWrapper from './components/auth/AuthWrapper';
import UserMenu from './components/UserMenu';
import Dashboard from './components/Dashboard';
import AreasList from './components/AreasList';
import AreaForm from './components/AreaForm';
import Reports from './components/Reports';
import DataManagement from './components/DataManagement';
import { Area, HistoryEntry } from './types';
import { sampleData } from './data/sampleData';
import { getCompanyLogo } from './utils/auth';

function App() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [view, setView] = useState<'dashboard' | 'areas' | 'form' | 'reports' | 'data-management'>('dashboard');
  const [editingArea, setEditingArea] = useState<Area | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [companyLogo, setCompanyLogo] = useState<string | null>(getCompanyLogo());
  const [authKey, setAuthKey] = useState(0);
  const [showDataManagement, setShowDataManagement] = useState(false);

  useEffect(() => {
    // Load data from localStorage or use sample data
    const savedAreas = localStorage.getItem('loteamentos-areas');
    const savedHistory = localStorage.getItem('loteamentos-history');
    
    if (savedAreas) {
      setAreas(JSON.parse(savedAreas));
    } else {
      setAreas(sampleData);
      localStorage.setItem('loteamentos-areas', JSON.stringify(sampleData));
    }
    
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const saveArea = (areaData: Omit<Area, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingArea) {
      // Update existing area
      const oldStatus = editingArea.status;
      const updatedArea = {
        ...editingArea,
        ...areaData,
        updatedAt: new Date().toISOString()
      };
      
      const updatedAreas = areas.map(area => 
        area.id === editingArea.id ? updatedArea : area
      );
      
      setAreas(updatedAreas);
      localStorage.setItem('loteamentos-areas', JSON.stringify(updatedAreas));
      
      // Add to history if status changed
      if (oldStatus !== areaData.status) {
        const historyEntry: HistoryEntry = {
          id: Date.now().toString(),
          areaId: editingArea.id,
          areaName: areaData.name,
          user: 'Sistema',
          date: new Date().toISOString(),
          previousStatus: oldStatus,
          newStatus: areaData.status
        };
        
        const updatedHistory = [...history, historyEntry];
        setHistory(updatedHistory);
        localStorage.setItem('loteamentos-history', JSON.stringify(updatedHistory));
      }
      
      setEditingArea(null);
    } else {
      // Create new area
      const newArea: Area = {
        ...areaData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const updatedAreas = [...areas, newArea];
      setAreas(updatedAreas);
      localStorage.setItem('loteamentos-areas', JSON.stringify(updatedAreas));
    }
    
    setView('areas');
  };

  const deleteArea = (id: string) => {
    const updatedAreas = areas.filter(area => area.id !== id);
    setAreas(updatedAreas);
    localStorage.setItem('loteamentos-areas', JSON.stringify(updatedAreas));
  };

  const handleEdit = (area: Area) => {
    setEditingArea(area);
    setView('form');
  };

  const handleNewArea = () => {
    setEditingArea(null);
    setView('form');
  };

  const handleLogout = () => {
    setAuthKey(prev => prev + 1);
  };

  const handleLogoUpdate = () => {
    setCompanyLogo(getCompanyLogo());
  };

  const handleImportAreas = (importedAreas: Area[]) => {
    setAreas(importedAreas);
    localStorage.setItem('loteamentos-areas', JSON.stringify(importedAreas));
    setShowDataManagement(false);
  };

  const handleImportHistory = (importedHistory: HistoryEntry[]) => {
    setHistory(importedHistory);
    localStorage.setItem('loteamentos-history', JSON.stringify(importedHistory));
    setShowDataManagement(false);
  };

  return (
    <AuthWrapper key={authKey}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-3">
                {companyLogo ? (
                  <img 
                    src={companyLogo} 
                    alt="Logo da Empresa" 
                    className="h-8 w-auto"
                  />
                ) : (
                  <Building2 className="h-8 w-8 text-blue-600" />
                )}
                <h1 className="text-2xl font-bold text-gray-900">Prospecção de Loteamentos</h1>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleNewArea}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Área
                </button>
                <button
                  onClick={() => setShowDataManagement(true)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <Database className="h-4 w-4 mr-2" />
                  Gerenciar Dados
                </button>
                <UserMenu onLogout={handleLogout} onLogoUpdate={handleLogoUpdate} />
              </div>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8">
              {[
                { key: 'dashboard', label: 'Dashboard', icon: Calendar },
                { key: 'areas', label: 'Áreas', icon: Building2 },
                { key: 'reports', label: 'Relatórios', icon: FileText }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setView(key as any)}
                  className={`flex items-center px-1 py-4 text-sm font-medium border-b-2 transition-colors ${
                    view === key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {view === 'dashboard' && <Dashboard areas={areas} history={history} />}
          {view === 'areas' && (
            <AreasList 
              areas={areas} 
              onEdit={handleEdit}
              onDelete={deleteArea}
            />
          )}
          {view === 'form' && (
            <AreaForm 
              area={editingArea}
              onSave={saveArea}
              onCancel={() => setView('areas')}
            />
          )}
          {view === 'reports' && <Reports areas={areas} history={history} />}
        </main>

        {/* Data Management Modal */}
        {showDataManagement && (
          <DataManagement
            areas={areas}
            history={history}
            onImportAreas={handleImportAreas}
            onImportHistory={handleImportHistory}
            onClose={() => setShowDataManagement(false)}
          />
        )}
      </div>
    </AuthWrapper>
  );
}

export default App;