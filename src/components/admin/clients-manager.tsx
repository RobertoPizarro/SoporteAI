"use client";

import React, { useState, useEffect } from "react";
import { Users, Plus, Edit, Trash2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getClients, createClient, updateClient, deleteClient, type Client } from "@/services/clients.service";

const ClientsManager = () => {
  const [clients, setClients] = useState<Client[]>([]);
  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    const data = await getClients();
    setClients(data);
  };
  const [newClient, setNewClient] = useState({ name: "" });
  const [editingClient, setEditingClient] = useState<string | null>(null);

  const addClient = async () => {
    if (newClient.name) {
      const createdClient = await createClient({
        name: newClient.name,
      });
      setClients(prev => [...prev, createdClient]);
      setNewClient({ name: "" });
    }
  };

  const handleDeleteClient = async (id: string) => {
    await deleteClient(id);
    setClients(prev => prev.filter(c => c.id !== id));
  };

  const handleUpdateClient = async (id: string, name: string) => {
    const updatedClient = await updateClient(id, { name });
    setClients(prev => prev.map(c => c.id === id ? updatedClient : c));
    setEditingClient(null);
  };

  return (
    <div className="space-y-6">
      {/* Agregar nuevo cliente */}
      <Card className="bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="w-5 h-5 text-orange-600" />
            <span>Agregar Nuevo Cliente</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="client-name">Nombre del Cliente</Label>
            <Input
              id="client-name"
              value={newClient.name}
              onChange={(e) => setNewClient({ name: e.target.value })}
              placeholder="Ej: Empresa ABC"
            />
          </div>
          <Button
            onClick={addClient}
            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
            disabled={!newClient.name}
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Cliente
          </Button>
        </CardContent>
      </Card>

      {/* Lista de clientes */}
      <Card className="bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-orange-600" />
            <span>Clientes Existentes ({clients.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {clients.map((client) => (
              <div key={client.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50">
                {editingClient === client.id ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        defaultValue={client.name}
                        onChange={(e) => client.name = e.target.value}
                        placeholder="Nombre del cliente"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleUpdateClient(client.id, client.name)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Save className="w-4 h-4 mr-1" />
                        Guardar
                      </Button>
                      <Button
                        onClick={() => setEditingClient(null)}
                        size="sm"
                        variant="outline"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-slate-800">{client.name}</h4>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => setEditingClient(client.id)}
                        size="sm"
                        variant="outline"
                        className="border-orange-300 text-orange-600 hover:bg-orange-50"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteClient(client.id)}
                        size="sm"
                        variant="outline"
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientsManager;