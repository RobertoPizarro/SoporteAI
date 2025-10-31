"use client";

import React, { useState } from "react";
import { Building2, Plus, Edit, Trash2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Service {
  id: string;
  name: string;
  description: string;
}

const ServicesManager = () => {
  const [services, setServices] = useState<Service[]>([
    { id: "1", name: "Data Science", description: "Análisis avanzado de datos y machine learning" },
    { id: "2", name: "Big Data", description: "Procesamiento de grandes volúmenes de datos" },
    { id: "3", name: "Geo Solutions", description: "Análisis geoespacial y mapeo" },
    { id: "4", name: "Cloud+Apps", description: "Soluciones en la nube y aplicaciones" },
  ]);
  const [newService, setNewService] = useState({ name: "", description: "" });
  const [editingService, setEditingService] = useState<string | null>(null);

  const addService = () => {
    if (newService.name && newService.description) {
      const service: Service = {
        id: Date.now().toString(),
        name: newService.name,
        description: newService.description,
      };
      setServices([...services, service]);
      setNewService({ name: "", description: "" });
    }
  };

  const deleteService = (id: string) => {
    setServices(services.filter(s => s.id !== id));
  };

  const updateService = (id: string, name: string, description: string) => {
    setServices(services.map(s => 
      s.id === id ? { ...s, name, description } : s
    ));
    setEditingService(null);
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="service-name">Nombre del Servicio</Label>
              <Input
                id="service-name"
                value={newService.name}
                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                placeholder="Ej: Data Analytics"
              />
            </div>
            <div>
              <Label htmlFor="service-desc">Descripción</Label>
              <Input
                id="service-desc"
                value={newService.description}
                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                placeholder="Descripción del servicio"
              />
            </div>
          </div>
          <Button
            onClick={addService}
            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
            disabled={!newService.name || !newService.description}
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
            {services.map((service) => (
              <div key={service.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50">
                {editingService === service.id ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        defaultValue={service.name}
                        onChange={(e) => service.name = e.target.value}
                        placeholder="Nombre del servicio"
                      />
                      <Input
                        defaultValue={service.description}
                        onChange={(e) => service.description = e.target.value}
                        placeholder="Descripción"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => updateService(service.id, service.name, service.description)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Save className="w-4 h-4 mr-1" />
                        Guardar
                      </Button>
                      <Button
                        onClick={() => setEditingService(null)}
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
                      <p className="text-sm text-slate-600">{service.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => setEditingService(service.id)}
                        size="sm"
                        variant="outline"
                        className="border-orange-300 text-orange-600 hover:bg-orange-50"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => deleteService(service.id)}
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

export default ServicesManager;