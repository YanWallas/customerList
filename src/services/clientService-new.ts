import type { Client } from '../types';

const CLIENTS_KEY = 'clients';

// Dados de exemplo para popular a lista se estiver vazia
const mockClients: Client[] = [
  { id: '1', name: 'Empresa de Tecnologia Exemplo Ltda', cpfCnpj: '12.345.678/0001-90', phone: '(11) 98765-4321', email: 'contato@tecnologiaexemplo.com' },
  { id: '2', name: 'João da Silva', cpfCnpj: '123.456.789-00', phone: '(21) 99999-8888', email: 'joao.silva@email.com' },
  { id: '3', name: 'Maria Oliveira', cpfCnpj: '987.654.321-11', phone: '(31) 98888-7777', email: 'maria.oliveira@email.com' },
  { id: '4', name: 'Consultoria Financeira ABC', cpfCnpj: '98.765.432/0001-10', phone: '(41) 97777-6666', email: 'financeiro@consultoriaabc.com' },
];

// Funções auxiliares para ler e escrever no localStorage, evitando repetição.
const _getClientsFromStorage = (): Client[] => {
  const clientsStr = localStorage.getItem(CLIENTS_KEY);
  return clientsStr ? JSON.parse(clientsStr) : [];
};

const _saveClientsToStorage = (clients: Client[]): void => {
  localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
};

const initializeClients = () => {
  const clients = _getClientsFromStorage();
  if (clients.length === 0) {
    _saveClientsToStorage(mockClients);
  }
};
initializeClients();

export const clientsService = {
  getClients: (): Client[] => {
    return _getClientsFromStorage();
  },
  
  createClient: (client: Omit<Client, 'id'>): Client => {
    const clients = _getClientsFromStorage();
    const newClient: Client = {
      ...client,
      id: Date.now().toString()
    };
    
    clients.push(newClient);
    _saveClientsToStorage(clients);
    return newClient;
  },
  
  updateClient: (id: string, clientData: Omit<Client, 'id'>): Client => {
    const clients = _getClientsFromStorage();
    const index = clients.findIndex(client => client.id === id);
    
    if (index === -1) {
      throw new Error('Cliente não encontrado');
    }
    
    const updatedClient = { ...clientData, id };
    clients[index] = updatedClient;
    _saveClientsToStorage(clients);
    return updatedClient;
  },
  
  deleteClient: (id: string): void => {
    const clients = _getClientsFromStorage();
    const filteredClients = clients.filter(client => client.id !== id);
    _saveClientsToStorage(filteredClients);
  },
  
  getClientById: (id: string): Client | undefined => {
    const clients = _getClientsFromStorage();
    return clients.find(client => client.id === id);
  }
};