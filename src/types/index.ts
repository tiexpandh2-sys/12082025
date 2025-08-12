export interface Area {
  id: string;
  name: string;
  type: 'Condomínio' | 'Aberto' | 'Logístico';
  size: number; // m²
  broker: string;
  status: 'Interesse' | 'Em Prospecção' | 'Prospectado' | 'Perdido';
  pricePerSquareMeter: number;
  totalValue: number;
  createdAt: string;
  updatedAt: string;
  nextAction: string;
  nextActionDate: string;
  observations: string;
  attachments: string[];
  checklist: {
    visitaTecnica: boolean;
    levantamentoDocumental: boolean;
    propostaApresentada: boolean;
    aprovacaoGestor: boolean;
  };
}

export interface HistoryEntry {
  id: string;
  areaId: string;
  areaName: string;
  user: string;
  date: string;
  previousStatus: string;
  newStatus: string;
}