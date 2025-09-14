"use client";
import { ReactNode } from "react";
import { useBackendHandshake } from "@/hooks/use-handshake";

export default function HandshakeClient({ children }: { children: ReactNode }) {
  useBackendHandshake();
  return <>{children}</>;
}