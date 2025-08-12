import { Area } from '../types';

export const sampleData: Area[] = [
  {
    id: '1',
    name: 'Residencial Villa Marina',
    type: 'Condomínio',
    location: 'Bairro Marina, Zona Sul',
    size: 150000,
    areaSize: '15 hectares',
    broker: 'Carlos Silva',
    status: 'Em Prospecção',
    pricePerSquareMeter: 850,
    totalValue: 127500000,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    nextAction: 'Agendar reunião com proprietário para negociação de preço',
    nextActionDate: '2024-01-25',
    observations: 'Terreno bem localizado, próximo ao shopping e com boa infraestrutura. Proprietário demonstrou interesse na proposta inicial.',
    attachments: [],
    checklist: {
      visitaTecnica: true,
      levantamentoDocumental: true,
      propostaApresentada: false,
      aprovacaoGestor: false
    }
  },
  {
    id: '2',
    name: 'Loteamento Industrial Logístico Norte',
    type: 'Logístico',
    location: 'Distrito Industrial Norte',
    size: 280000,
    areaSize: '28 hectares',
    broker: 'Ana Costa',
    status: 'Prospectado',
    pricePerSquareMeter: 320,
    totalValue: 89600000,
    createdAt: '2024-01-10T08:30:00Z',
    updatedAt: '2024-01-22T16:45:00Z',
    nextAction: 'Aguardar assinatura do contrato preliminar',
    nextActionDate: '2024-01-30',
    observations: 'Negócio fechado com sucesso! Proprietário aceitou nossa proposta. Documentação em ordem e pronta para prosseguir.',
    attachments: [],
    checklist: {
      visitaTecnica: true,
      levantamentoDocumental: true,
      propostaApresentada: true,
      aprovacaoGestor: true
    }
  },
  {
    id: '3',
    name: 'Bairro Planejado Horizonte Verde',
    type: 'Aberto',
    location: 'Região Metropolitana Oeste',
    size: 450000,
    areaSize: '45 hectares',
    broker: 'Roberto Oliveira',
    status: 'Interesse',
    pricePerSquareMeter: 650,
    totalValue: 292500000,
    createdAt: '2024-01-18T11:15:00Z',
    updatedAt: '2024-01-18T11:15:00Z',
    nextAction: 'Realizar primeira visita técnica para avaliação do terreno',
    nextActionDate: '2024-01-26',
    observations: 'Lead qualificado via indicação. Proprietário possui outros terrenos na região e pode ser um parceiro estratégico.',
    attachments: [],
    checklist: {
      visitaTecnica: false,
      levantamentoDocumental: false,
      propostaApresentada: false,
      aprovacaoGestor: false
    }
  },
  {
    id: '4',
    name: 'Condomínio Residencial Bosque das Palmeiras',
    type: 'Condomínio',
    location: 'Bairro Bosque das Palmeiras',
    size: 95000,
    areaSize: '9,5 hectares',
    broker: 'Marina Santos',
    status: 'Perdido',
    pricePerSquareMeter: 1200,
    totalValue: 114000000,
    createdAt: '2024-01-05T09:20:00Z',
    updatedAt: '2024-01-21T13:10:00Z',
    nextAction: 'Arquivar processo - proprietário optou por outro investidor',
    nextActionDate: '2024-01-21',
    observations: 'Infelizmente perdemos a oportunidade. Proprietário escolheu proposta concorrente com valor 15% superior. Manter contato para futuras oportunidades.',
    attachments: [],
    checklist: {
      visitaTecnica: true,
      levantamentoDocumental: true,
      propostaApresentada: true,
      aprovacaoGestor: false
    }
  }
];