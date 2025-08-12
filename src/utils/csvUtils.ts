import { Area, HistoryEntry } from '../types';

export const exportAreasToCSV = (areas: Area[]): string => {
  const headers = [
    'id',
    'name',
    'type',
    'size',
    'broker',
    'status',
    'pricePerSquareMeter',
    'totalValue',
    'createdAt',
    'updatedAt',
    'nextAction',
    'nextActionDate',
    'observations',
    'attachments',
    'visitaTecnica',
    'levantamentoDocumental',
    'propostaApresentada',
    'aprovacaoGestor'
  ];

  const csvData = areas.map(area => [
    area.id,
    area.name,
    area.type,
    area.size,
    area.broker,
    area.status,
    area.pricePerSquareMeter,
    area.totalValue,
    area.createdAt,
    area.updatedAt,
    area.nextAction,
    area.nextActionDate,
    area.observations.replace(/\n/g, '\\n'),
    area.attachments.join('|'),
    area.checklist.visitaTecnica,
    area.checklist.levantamentoDocumental,
    area.checklist.propostaApresentada,
    area.checklist.aprovacaoGestor
  ]);

  return [headers, ...csvData]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');
};

export const exportHistoryToCSV = (history: HistoryEntry[]): string => {
  const headers = [
    'id',
    'areaId',
    'areaName',
    'user',
    'date',
    'previousStatus',
    'newStatus'
  ];

  const csvData = history.map(entry => [
    entry.id,
    entry.areaId,
    entry.areaName,
    entry.user,
    entry.date,
    entry.previousStatus,
    entry.newStatus
  ]);

  return [headers, ...csvData]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');
};

export const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  let i = 0;

  while (i < line.length) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote
        current += '"';
        i += 2;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
        i++;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
      i++;
    } else {
      current += char;
      i++;
    }
  }
  
  result.push(current);
  return result;
};

export const importAreasFromCSV = (csvContent: string): Area[] => {
  const lines = csvContent.trim().split('\n');
  if (lines.length < 2) {
    throw new Error('Arquivo CSV inválido: deve conter pelo menos o cabeçalho e uma linha de dados');
  }

  const headers = parseCSVLine(lines[0]);
  const expectedHeaders = [
    'id', 'name', 'type', 'size', 'broker', 'status', 'pricePerSquareMeter',
    'totalValue', 'createdAt', 'updatedAt', 'nextAction', 'nextActionDate',
    'observations', 'attachments', 'visitaTecnica', 'levantamentoDocumental',
    'propostaApresentada', 'aprovacaoGestor'
  ];

  // Validate headers
  const missingHeaders = expectedHeaders.filter(header => !headers.includes(header));
  if (missingHeaders.length > 0) {
    throw new Error(`Cabeçalhos obrigatórios ausentes: ${missingHeaders.join(', ')}`);
  }

  const areas: Area[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    try {
      const values = parseCSVLine(lines[i]);
      
      if (values.length !== headers.length) {
        throw new Error(`Linha ${i + 1}: número de colunas não confere com o cabeçalho`);
      }

      const getValueByHeader = (header: string): string => {
        const index = headers.indexOf(header);
        return index >= 0 ? values[index] : '';
      };

      const area: Area = {
        id: getValueByHeader('id'),
        name: getValueByHeader('name'),
        type: getValueByHeader('type') as 'Condomínio' | 'Aberto' | 'Logístico',
        size: Number(getValueByHeader('size')),
        broker: getValueByHeader('broker'),
        status: getValueByHeader('status') as 'Interesse' | 'Em Prospecção' | 'Prospectado' | 'Perdido',
        pricePerSquareMeter: Number(getValueByHeader('pricePerSquareMeter')),
        totalValue: Number(getValueByHeader('totalValue')),
        createdAt: getValueByHeader('createdAt'),
        updatedAt: getValueByHeader('updatedAt'),
        nextAction: getValueByHeader('nextAction'),
        nextActionDate: getValueByHeader('nextActionDate'),
        observations: getValueByHeader('observations').replace(/\\n/g, '\n'),
        attachments: getValueByHeader('attachments') ? getValueByHeader('attachments').split('|') : [],
        checklist: {
          visitaTecnica: getValueByHeader('visitaTecnica') === 'true',
          levantamentoDocumental: getValueByHeader('levantamentoDocumental') === 'true',
          propostaApresentada: getValueByHeader('propostaApresentada') === 'true',
          aprovacaoGestor: getValueByHeader('aprovacaoGestor') === 'true'
        }
      };

      // Validate required fields
      if (!area.id || !area.name || !area.type || !area.broker || !area.status) {
        throw new Error(`Linha ${i + 1}: campos obrigatórios ausentes`);
      }

      // Validate types
      if (!['Condomínio', 'Aberto', 'Logístico'].includes(area.type)) {
        throw new Error(`Linha ${i + 1}: tipo inválido "${area.type}"`);
      }

      if (!['Interesse', 'Em Prospecção', 'Prospectado', 'Perdido'].includes(area.status)) {
        throw new Error(`Linha ${i + 1}: status inválido "${area.status}"`);
      }

      if (isNaN(area.size) || area.size <= 0) {
        throw new Error(`Linha ${i + 1}: tamanho inválido`);
      }

      if (isNaN(area.pricePerSquareMeter) || area.pricePerSquareMeter < 0) {
        throw new Error(`Linha ${i + 1}: preço por m² inválido`);
      }

      areas.push(area);
    } catch (error) {
      throw new Error(`Erro na linha ${i + 1}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  return areas;
};

export const importHistoryFromCSV = (csvContent: string): HistoryEntry[] => {
  const lines = csvContent.trim().split('\n');
  if (lines.length < 2) {
    throw new Error('Arquivo CSV inválido: deve conter pelo menos o cabeçalho e uma linha de dados');
  }

  const headers = parseCSVLine(lines[0]);
  const expectedHeaders = ['id', 'areaId', 'areaName', 'user', 'date', 'previousStatus', 'newStatus'];

  // Validate headers
  const missingHeaders = expectedHeaders.filter(header => !headers.includes(header));
  if (missingHeaders.length > 0) {
    throw new Error(`Cabeçalhos obrigatórios ausentes: ${missingHeaders.join(', ')}`);
  }

  const history: HistoryEntry[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    try {
      const values = parseCSVLine(lines[i]);
      
      if (values.length !== headers.length) {
        throw new Error(`Linha ${i + 1}: número de colunas não confere com o cabeçalho`);
      }

      const getValueByHeader = (header: string): string => {
        const index = headers.indexOf(header);
        return index >= 0 ? values[index] : '';
      };

      const entry: HistoryEntry = {
        id: getValueByHeader('id'),
        areaId: getValueByHeader('areaId'),
        areaName: getValueByHeader('areaName'),
        user: getValueByHeader('user'),
        date: getValueByHeader('date'),
        previousStatus: getValueByHeader('previousStatus'),
        newStatus: getValueByHeader('newStatus')
      };

      // Validate required fields
      if (!entry.id || !entry.areaId || !entry.areaName || !entry.user || !entry.date) {
        throw new Error(`Linha ${i + 1}: campos obrigatórios ausentes`);
      }

      history.push(entry);
    } catch (error) {
      throw new Error(`Erro na linha ${i + 1}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  return history;
};

export const downloadCSV = (content: string, filename: string): void => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};