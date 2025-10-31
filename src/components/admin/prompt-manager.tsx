"use client";

import React, { useState } from "react";
import { MessageSquare, Edit, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PromptManager = () => {
  const [prompt, setPrompt] = useState(`Eres un asistente virtual especializado en analytics. Ayuda a los usuarios con sus consultas sobre servicios de análisis de datos.`);
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageSquare className="w-5 h-5 text-orange-600" />
          <span>Configuración del Prompt del Chatbot</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="prompt" className="text-sm font-medium text-slate-700 mb-2 block">
            Prompt del Sistema
          </Label>
          {isEditingPrompt ? (
            <div className="space-y-4">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full h-32 p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all duration-200"
                placeholder="Escribe el prompt del sistema aquí..."
              />
              <div className="flex space-x-2">
                <Button
                  onClick={() => setIsEditingPrompt(false)}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Guardar
                </Button>
                <Button
                  onClick={() => setIsEditingPrompt(false)}
                  variant="outline"
                  className="border-slate-300 hover:bg-slate-50"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-slate-700 whitespace-pre-wrap">{prompt}</p>
              </div>
              <Button
                onClick={() => setIsEditingPrompt(true)}
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar Prompt
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PromptManager;