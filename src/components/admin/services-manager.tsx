"use client";

import React, { useState, useEffect } from "react";
import { Building2, Plus, Edit, Trash2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getServices, createService, updateService, deleteService, type Service } from "@/services/services.service";

const ServicesManager = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [newService, setNewService] = useState({ name: "" });
  const [editingService, setEditingService] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ name: string }>({ name: "" });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    const data = await getServices();
    console.log("📋 Servicios cargados en componente:", data);
    setServices(data);
  };

  const addService = async () => {
    if (newService.name) {
      try {
        await createService({
          name: newService.name,
        });
        await loadServices();
        setNewService({ name: "" });
      } catch (error) {
        console.error("Error al crear servicio:", error);
      }
    }
  };

  const handleDeleteService = async (id: string) => {
    console.log("🗑️ Intentando eliminar servicio con ID:", id);
    
    if (!id || id === 'undefined') {
      console.error("❌ ID inválido para eliminar:", id);
      return;
    }
    
    await deleteService(id);
    setServices(prev => prev.filter(s => s.id !== id));
  };

  const handleUpdateService = async (id: string) => {
    try {
      await updateService(id, { name: editValues.name });
      await loadServices();
      setEditingService(null);
      setEditValues({ name: "" });
    } catch (error) {
      console.error("Error al actualizar servicio:", error);
    }
  };

  const startEditing = (service: Service) => {
    setEditingService(service.id);
    setEditValues({ name: service.name });
  };

  const cancelEditing = () => {
    setEditingService(null);
    setEditValues({ name: "" });
  };

  return (
    <div className="space-y-6">
      {/* Agregar nuevo servicio */}
      <Card className="bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="w-5 h-5 text-orange-600" />
            <span>Agregar Nuevo Servicio</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="service-name">Nombre del Servicio</Label>
            <Input
              id="service-name"
              value={newService.name}
              onChange={(e) => setNewService({ name: e.target.value })}
              placeholder="Ej: Data Analytics"
            />
          </div>
          <Button
            onClick={addService}
            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
            disabled={!newService.name}
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Servicio
          </Button>
        </CardContent>
      </Card>

      {/* Lista de servicios */}
      <Card className="bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-orange-600" />
            <span>Servicios Existentes ({services.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {services.length === 0 ? (
              <p className="text-center text-slate-500 py-8">No hay servicios registrados</p>
            ) : (
              services.map((service, index) => (
                <div 
                  key={service.id || `service-${index}`} 
                  className="p-4 border border-slate-200 rounded-xl bg-slate-50"
                >
                  {editingService === service.id ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor={`edit-name-${service.id}`}>Nombre</Label>
                        <Input
                          id={`edit-name-${service.id}`}
                          value={editValues.name}
                          onChange={(e) => setEditValues({ name: e.target.value })}
                          placeholder="Nombre del servicio"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleUpdateService(service.id)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Save className="w-4 h-4 mr-1" />
                          Guardar
                        </Button>
                        <Button
                          onClick={cancelEditing}
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
                        <h4 className="font-semibold text-slate-800">{service.name}</h4>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => startEditing(service)}
                          size="sm"
                          variant="outline"
                          className="border-orange-300 text-orange-600 hover:bg-orange-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteService(service.id)}
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
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServicesManager;