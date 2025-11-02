"use client";

import React, { useState, useEffect } from "react";
import { UserCog, Plus, Edit, Trash2, Save, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  getAnalysts, 
  createAnalyst, 
  updateAnalyst, 
  deleteAnalyst, 
  type Analyst 
} from "@/services/analysts.service";

const AnalystsManager = () => {
  const [analysts, setAnalysts] = useState<Analyst[]>([]);
  const [newAnalyst, setNewAnalyst] = useState({ name: "", email: "", level: 1 });
  const [editingAnalyst, setEditingAnalyst] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<{ name: string; email: string; level: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  function getLevels(): { value: number; label: string }[] {
  return [
    { value: 1, label: "1 - Junior" },
    { value: 2, label: "2 - Senior" },
    { value: 3, label: "3 - Expert" },
    { value: 4, label: "4 - Master" }
  ];
}

  // Cargar analistas al montar el componente
  useEffect(() => {
    loadAnalysts();
  }, []);

  const loadAnalysts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAnalysts();
      setAnalysts(data);
    } catch (err) {
      setError('Error al cargar los analistas');
      console.error('Error loading analysts:', err);
    } finally {
      setLoading(false);
    }
  };

  const addAnalyst = async () => {
    if (newAnalyst.name && newAnalyst.email) {
      try {
        setActionLoading('create');
        const createdAnalyst = await createAnalyst({
          name: newAnalyst.name,
          email: newAnalyst.email,
          level: newAnalyst.level,
        });
        
        setAnalysts(prev => [...prev, createdAnalyst]);
        setNewAnalyst({ name: "", email: "", level: 1 });
      } catch (err) {
        setError('Error al crear el analista');
        console.error('Error creating analyst:', err);
      } finally {
        setActionLoading(null);
      }
    }
  };

  const handleDeleteAnalyst = async (id: string) => {
    try {
      setActionLoading(id);
      await deleteAnalyst(id);
      setAnalysts(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      setError('Error al eliminar el analista');
      console.error('Error deleting analyst:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const startEditing = (analyst: Analyst) => {
    setEditingAnalyst(analyst.id);
    setEditingData({
      name: analyst.name,
      email: analyst.email,
      level: analyst.level
    });
  };

  const cancelEditing = () => {
    setEditingAnalyst(null);
    setEditingData(null);
  };

  const handleUpdateAnalyst = async (id: string) => {
    if (!editingData) return;
    
    try {
      setActionLoading(id);
      const updatedAnalyst = await updateAnalyst(id, editingData);
      
      setAnalysts(prev => prev.map(a => 
        a.id === id ? updatedAnalyst : a
      ));
      setEditingAnalyst(null);
      setEditingData(null);
    } catch (err) {
      setError('Error al actualizar el analista');
      console.error('Error updating analyst:', err);
    } finally {
      setActionLoading(null);
    }
  };

  // Estado de loading inicial
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange-600 mx-auto mb-4" />
          <p className="text-slate-600">Cargando analistas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span className="text-red-700 font-medium">{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Agregar nuevo analista 
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
            disabled={!newAnalyst.name || !newAnalyst.email || actionLoading === 'create'}
          >
            {actionLoading === 'create' ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creando...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Crear Analista
              </>
            )}
          </Button>
        </CardContent>
      </Card>*/}

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
                {editingAnalyst === analyst.id && editingData ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        value={editingData.name}
                        onChange={(e) => setEditingData({ ...editingData, name: e.target.value })}
                        placeholder="Nombre completo"
                      />
                      <Input
                        value={editingData.email}
                        onChange={(e) => setEditingData({ ...editingData, email: e.target.value })}
                        placeholder="Email"
                      />
                      <select
                        value={editingData.level}
                        onChange={(e) => setEditingData({ ...editingData, level: parseInt(e.target.value) })}
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
                        onClick={() => handleUpdateAnalyst(analyst.id)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        disabled={actionLoading === analyst.id}
                      >
                        {actionLoading === analyst.id ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                            Guardando...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-1" />
                            Guardar
                          </>
                        )}
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
                          {(() => {
                            const levels = getLevels();
                            const levelObj = levels.find((l: { value: number; label: string }) => l.value === analyst.level);
                            return levelObj ? levelObj.label : `Nivel ${analyst.level}`;
                          })()}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => startEditing(analyst)}
                        size="sm"
                        variant="outline"
                        className="border-orange-300 text-orange-600 hover:bg-orange-50"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteAnalyst(analyst.id)}
                        size="sm"
                        variant="outline"
                        className="border-red-300 text-red-600 hover:bg-red-50"
                        disabled={actionLoading === analyst.id}
                      >
                        {actionLoading === analyst.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
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