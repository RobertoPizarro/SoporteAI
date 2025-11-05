"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, Edit, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getPrompt,
  updatePrompt,
  type PromptContent,
} from "@/services/prompt.service";

const SECTIONS = [
  {
    key: "identidadObjetivos",
    label: "Identidad y Objetivos",
    placeholder: "Define la identidad y objetivos del asistente...",
  },
  {
    key: "reglasComunicacion",
    label: "Reglas de Comunicación",
    placeholder: "Establece las reglas de comunicación...",
  },
  {
    key: "flujoTrabajo",
    label: "Flujo de Trabajo",
    placeholder: "Describe el flujo de trabajo...",
  },
  {
    key: "formatoBusquedas",
    label: "Formato de Búsquedas",
    placeholder: "Define cómo realizar búsquedas...",
  },
  {
    key: "formatoTickets",
    label: "Formato de Tickets",
    placeholder: "Especifica el formato de tickets...",
  },
  {
    key: "plantillaRespuesta",
    label: "Plantilla de Respuesta",
    placeholder: "Define la plantilla de respuestas...",
  },
] as const;

const PromptManager = () => {
  const [promptData, setPromptData] = useState<PromptContent | null>(null);
  const [editedContent, setEditedContent] = useState<PromptContent>({});
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("🚀 PromptManager montado, cargando prompt...");
    loadPrompt();
  }, []);

  const loadPrompt = async () => {
    console.log("📡 Iniciando carga de prompt...");
    setIsLoading(true);
    try {
      const data = await getPrompt();

      setPromptData(data);
      setEditedContent(data);
    } catch (error) {
      console.error("❌ Error al cargar prompt:", error);
    } finally {
      setIsLoading(false);
      console.log("✅ Carga de prompt finalizada");
    }
  };

  const handleStartEditing = () => {
    if (promptData) {
      setEditedContent({ ...promptData });
      setIsEditingPrompt(true);
    }
  };

  const handleSavePrompt = async () => {
    setIsLoading(true);
    try {
      const updated = await updatePrompt(editedContent);
      console.log("✅ Prompt actualizado:", updated);
      setPromptData(updated);
      setIsEditingPrompt(false);
    } catch (error) {
      console.error("Error al actualizar prompt:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEditing = () => {
    if (promptData) {
      setEditedContent({ ...promptData });
    }
    setIsEditingPrompt(false);
  };

  const updateSection = (key: keyof PromptContent, value: string) => {
    setEditedContent((prev) => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-orange-600" />
            <span>Configuración del Prompt del Chatbot</span>
          </div>
          {!isEditingPrompt && (
            <Button
              onClick={handleStartEditing}
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
              disabled={isLoading}
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar Prompt
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {isEditingPrompt ? (
          <div className="space-y-6">
            {SECTIONS.map((section) => (
              <div key={section.key} className="space-y-2">
                <Label
                  htmlFor={section.key}
                  className="text-sm font-medium text-slate-700"
                >
                  {section.label}
                </Label>
                <textarea
                  id={section.key}
                  value={editedContent[section.key] || ""}
                  onChange={(e) => updateSection(section.key, e.target.value)}
                  className="w-full h-24 p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all duration-200"
                  placeholder={section.placeholder}
                  disabled={isLoading}
                />
              </div>
            ))}
            <div className="flex space-x-2 pt-4">
              <Button
                onClick={handleSavePrompt}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                disabled={isLoading}
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? "Guardando..." : "Guardar Cambios"}
              </Button>
              <Button
                onClick={handleCancelEditing}
                variant="outline"
                className="border-slate-300 hover:bg-slate-50"
                disabled={isLoading}
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {SECTIONS.map((section) => {
              const hasKey = promptData && section.key in promptData;
              const value = promptData?.[section.key];
              const isUndefined = value === undefined;

              return (
                <div key={section.key} className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    {section.label}
                  </Label>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 min-h-[80px]">
                    <p className="text-slate-700 whitespace-pre-wrap">
                      {hasKey && !isUndefined ? (
                        value
                      ) : (
                        <span className="text-slate-400 italic">
                          No configurado
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PromptManager;
