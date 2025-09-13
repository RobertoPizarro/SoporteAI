// services/auth-service.ts
"use server";

import { API_CONFIG, buildUrl, ENDPOINTS } from "./api.config";

type UpsertResponse = { user_id: string; is_new: boolean };

export async function upsertUserWithGoogleIdToken(params: { idToken: string }) {
  const url = buildUrl(ENDPOINTS.AUTH_GOOGLE_COLABORADOR);
  
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id_token: params.idToken }),
    cache: "no-store",
  });

  if (!resp.ok) {
    // aquí caerán los 401/403/etc que aplique el backend (incluida la whitelist)
    let detail = "";
    try { 
      const errorData = await resp.json();
      detail = JSON.stringify(errorData);
    } catch (parseError) {
      // Error parsing response
    }
    throw new Error(`Backend upsert failed: ${resp.status} ${detail}`);
  }

  return (await resp.json()) as UpsertResponse;
}
