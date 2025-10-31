"use server";

import { apiRequest, ENDPOINTS } from "./api.config";

export interface Analyst {
  id: string;
  name: string;
  email: string;
  level: number;
}

// Datos de fallback cuando no existe el endpoint
const FALLBACK_ANALYSTS: Analyst[] = [
  { id: "1", name: "Juan Pérez", email: "juan.perez@analytics.com", level: 2 },
  { id: "2", name: "María García", email: "maria.garcia@analytics.com", level: 3 },
  { id: "3", name: "Carlos López", email: "carlos.lopez@analytics.com", level: 1 },
];

// Clave para almacenamiento local temporal
const STORAGE_KEY = 'admin_analysts';

// Obtener todos los analistas
export async function getAnalysts(): Promise<Analyst[]> {
  try {
    // TODO: Implementar cuando el endpoint esté disponible
    // const data = await apiRequest(ENDPOINTS.ADMIN_ANALYSTS, {
    //   method: "GET",
    //   credentials: "include"
    // });
    // return data;

    // Fallback: usar localStorage con datos por defecto
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      
      // Si no hay datos guardados, usar el fallback
      localStorage.setItem(STORAGE_KEY, JSON.stringify(FALLBACK_ANALYSTS));
    }
    
    return FALLBACK_ANALYSTS;
    
  } catch (error) {
    console.warn('Error loading analysts, using fallback:', error);
    return FALLBACK_ANALYSTS;
  }
}

// Crear un nuevo analista
export async function createAnalyst(analyst: Omit<Analyst, 'id'>): Promise<Analyst> {
  try {
    // TODO: Implementar cuando el endpoint esté disponible
    // const data = await apiRequest(ENDPOINTS.ADMIN_ANALYSTS, {
    //   method: "POST",
    //   credentials: "include",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(analyst)
    // });
    // return data;

    // Fallback: usar localStorage
    const analysts = await getAnalysts();
    const newAnalyst: Analyst = {
      id: Date.now().toString(),
      ...analyst
    };
    
    const updatedAnalysts = [...analysts, newAnalyst];
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAnalysts));
    }
    
    return newAnalyst;
    
  } catch (error) {
    console.error('Error creating analyst:', error);
    throw new Error('Error al crear el analista');
  }
}

// Actualizar un analista existente
export async function updateAnalyst(id: string, updates: Partial<Omit<Analyst, 'id'>>): Promise<Analyst> {
  try {
    // TODO: Implementar cuando el endpoint esté disponible
    // const data = await apiRequest(`${ENDPOINTS.ADMIN_ANALYSTS}/${id}`, {
    //   method: "PATCH",
    //   credentials: "include",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(updates)
    // });
    // return data;

    // Fallback: usar localStorage
    const analysts = await getAnalysts();
    const updatedAnalysts = analysts.map(analyst => 
      analyst.id === id ? { ...analyst, ...updates } : analyst
    );
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAnalysts));
    }
    
    const updatedAnalyst = updatedAnalysts.find(a => a.id === id);
    if (!updatedAnalyst) {
      throw new Error('Analista no encontrado después de la actualización');
    }
    
    return updatedAnalyst;
    
  } catch (error) {
    console.error('Error updating analyst:', error);
    throw new Error('Error al actualizar el analista');
  }
}

// Eliminar un analista
export async function deleteAnalyst(id: string): Promise<boolean> {
  try {
    // TODO: Implementar cuando el endpoint esté disponible
    // await apiRequest(`${ENDPOINTS.ADMIN_ANALYSTS}/${id}`, {
    //   method: "DELETE",
    //   credentials: "include"
    // });
    // return true;

    // Fallback: usar localStorage
    const analysts = await getAnalysts();
    const updatedAnalysts = analysts.filter(analyst => analyst.id !== id);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAnalysts));
    }
    
    return true;
    
  } catch (error) {
    console.error('Error deleting analyst:', error);
    throw new Error('Error al eliminar el analista');
  }
}


