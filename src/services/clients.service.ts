// src/services/clients.service.ts

export interface Client {
  id: string;
  name: string;
  email: string;
}

const STORAGE_KEY = 'admin_clients';
const FALLBACK_CLIENTS: Client[] = [
  { id: "1", name: "Entel", email: "contacto@entel.com" },
  { id: "2", name: "Claro", email: "soporte@claro.com" },
  { id: "3", name: "BCP", email: "analytics@bcp.com.pe" },
  { id: "4", name: "Movistar", email: "datos@movistar.com" },
];

export async function getClients(): Promise<Client[]> {
  // TODO: Implementar API cuando esté disponible
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(FALLBACK_CLIENTS));
  }
  return FALLBACK_CLIENTS;
}

export async function createClient(client: Omit<Client, 'id'>): Promise<Client> {
  const clients = await getClients();
  const newClient: Client = {
    id: Date.now().toString(),
    ...client
  };
  const updatedClients = [...clients, newClient];
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedClients));
  }
  return newClient;
}

export async function updateClient(id: string, updates: Partial<Omit<Client, 'id'>>): Promise<Client> {
  const clients = await getClients();
  const updatedClients = clients.map(client =>
    client.id === id ? { ...client, ...updates } : client
  );
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedClients));
  }
  const updatedClient = updatedClients.find(c => c.id === id);
  if (!updatedClient) throw new Error('Cliente no encontrado después de la actualización');
  return updatedClient;
}

export async function deleteClient(id: string): Promise<boolean> {
  const clients = await getClients();
  const updatedClients = clients.filter(client => client.id !== id);
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedClients));
  }
  return true;
}
