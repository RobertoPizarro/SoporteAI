// services/auth-service.ts
"use server";

type UpsertResponse = { user_id: string; is_new: boolean };

export async function upsertUserWithGoogleIdToken(params: { idToken: string }) {
  const resp = await fetch(`${process.env.BACKEND_URL}/auth/google/upsert`, {
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
    try { detail = JSON.stringify(await resp.json()); } catch {}
    throw new Error(`Backend upsert failed: ${resp.status} ${detail}`);
  }

  return (await resp.json()) as UpsertResponse;
}
