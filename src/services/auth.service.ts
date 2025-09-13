// services/auth-service.ts
"use server";

import { buildUrl, ENDPOINTS } from "./api.config";

type UpsertResponse = { user_id: string; is_new: boolean };

// Login para colaboradores
export async function upsertColaboradorWithGoogleIdToken(params: { idToken: string }) {
    const url = buildUrl(ENDPOINTS.AUTH_GOOGLE_COLABORADOR);
    return await doUpsert(url, params.idToken);
}

// Login para analistas
export async function upsertAnalistaWithGoogleIdToken(params: { idToken: string }) {
    const url = buildUrl(ENDPOINTS.AUTH_GOOGLE_ANALISTA);
    return await doUpsert(url, params.idToken);
}

async function doUpsert(url: string, idToken: string) {
    const resp = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_token: idToken }),
    });

    if (!resp.ok) {
        let detail = "";
        try {
            const errorData = await resp.json();
            detail = JSON.stringify(errorData);
        } catch {}
        throw new Error(`Backend upsert failed: ${resp.status} ${detail}`);
    }

    return (await resp.json()) as UpsertResponse;
}
