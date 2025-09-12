// services/auth-service.ts
"use server";

import { API_CONFIG, buildUrl, ENDPOINTS } from "./api.config";

type UpsertResponse = { user_id: string; is_new: boolean };

export async function upsertUserWithGoogleIdToken(params: { idToken: string }) {
  const url = buildUrl(ENDPOINTS.AUTH_GOOGLE_UPSERT);
  
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Internal-Auth": process.env.INTERNAL_SHARED_SECRET as string,
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
