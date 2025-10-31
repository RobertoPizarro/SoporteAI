"use client";

import React, { useState } from "react";
import { UserCog, Plus, Edit, Trash2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Analyst {
  id: string;
  name: string;
  email: string;
  level: number;
}

const AnalystsManager = () => {
  const [analysts, setAnalysts] = useState<Analyst[]>([
    { id: "1", name: "Juan Pérez", email: "juan.perez@analytics.com", level: 2 },
    { id: "2", name: "María García", email: "maria.garcia@analytics.com", level: 3 },
    { id: "3", name: "Carlos López", email: "carlos.lopez@analytics.com", level: 1 },
  ]);
  const [newAnalyst, setNewAnalyst] = useState({ name: "", email: "", level: 1 });
  const [editingAnalyst, setEditingAnalyst] = useState<string | null>(null);

  const addAnalyst = () => {
    if (newAnalyst.name && newAnalyst.email) {
      const analyst: Analyst = {
        id: Date.now().toString(),
        name: newAnalyst.name,
        email: newAnalyst.email,
        level: newAnalyst.level,
      };
      setAnalysts([...analysts, analyst]);
      setNewAnalyst({ name: "", email: "", level: 1 });
    }
  };

  const deleteAnalyst = (id: string) => {
    setAnalysts(analysts.filter(a => a.id !== id));
  };

  const updateAnalyst = (id: string, name: string, email: string, level: number) => {
    setAnalysts(analysts.map(a => 
      a.id === id ? { ...a, name, email, level } : a
    ));
    setEditingAnalyst(null);
  };

  const getLevelName = (level: number) => {
    const levels = {
      1: "Junior",
      2: "Senior", 
      3: "Expert",
      4: "Master"
    };
    return levels[level as keyof typeof levels] || "Junior";
  };

  return (
    <div className="space-y-6">
      {/* Agregar nuevo analista */}
      <Card className="bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="w-5 h-5 text-orange-600" />
            <span>Crear Nuevo Analista</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="analyst-name">Nombre Completo</Label>
              <Input
                id="analyst-name"
                value={newAnalyst.name}
                onChange={(e) => setNewAnalyst({ ...newAnalyst, name: e.target.value })}
                placeholder="Juan Pérez"
              />
            </div>
            <div>
              <Label htmlFor="analyst-email">Email</Label>
              <Input
                id="analyst-email"
                type="email"
                value={newAnalyst.email}
                onChange={(e) => setNewAnalyst({ ...newAnalyst, email: e.target.value })}
                placeholder="juan@analytics.com"
              />
            </div>
            <div>
              <Label htmlFor="analyst-level">Nivel</Label>
              <select
                id="analyst-level"
                value={newAnalyst.level}
                onChange={(e) => setNewAnalyst({ ...newAnalyst, level: parseInt(e.target.value) })}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
              >
                <option value={1}>1 - Junior</option>
                <option value={2}>2 - Senior</option>
                <option value={3}>3 - Expert</option>
                <option value={4}>4 - Master</option>
              </select>
            </div>
          </div>
          <Button
            onClick={addAnalyst}
            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
            disabled={!newAnalyst.name || !newAnalyst.email}
          >
            <Plus className="w-4 h-4 mr-2" />
            Crear Analista
          </Button>
        </CardContent>
      </Card>

      {/* Lista de analistas */}
      <Card className="bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserCog className="w-5 h-5 text-orange-600" />
            <span>Analistas Existentes ({analysts.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analysts.map((analyst) => (
              <div key={analyst.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50">
                {editingAnalyst === analyst.id ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        defaultValue={analyst.name}
                        onChange={(e) => analyst.name = e.target.value}
                        placeholder="Nombre completo"
                      />
                      <Input
                        defaultValue={analyst.email}
                        onChange={(e) => analyst.email = e.target.value}
                        placeholder="Email"
                      />
                      <select
                        defaultValue={analyst.level}
                        onChange={(e) => analyst.level = parseInt(e.target.value)}
                        className="p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
                      >
                        <option value={1}>1 - Junior</option>
                        <option value={2}>2 - Senior</option>
                        <option value={3}>3 - Expert</option>
                        <option value={4}>4 - Master</option>
                      </select>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => updateAnalyst(analyst.id, analyst.name, analyst.email, analyst.level)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Save className="w-4 h-4 mr-1" />
                        Guardar
                      </Button>
                      <Button
                        onClick={() => setEditingAnalyst(null)}
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
                      <div className="flex items-center space-x-3">
                        <div>
                          <h4 className="font-semibold text-slate-800">{analyst.name}</h4>
                          <p className="text-sm text-slate-600">{analyst.email}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          analyst.level === 1 ? 'bg-blue-100 text-blue-700' :
                          analyst.level === 2 ? 'bg-green-100 text-green-700' :
                          analyst.level === 3 ? 'bg-purple-100 text-purple-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          Nivel {analyst.level} - {getLevelName(analyst.level)}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => setEditingAnalyst(analyst.id)}
                        size="sm"
                        variant="outline"
                        className="border-orange-300 text-orange-600 hover:bg-orange-50"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => deleteAnalyst(analyst.id)}
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

export default AnalystsManager;