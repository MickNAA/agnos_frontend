"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { PatientFormData } from "@/lib/validations";

export type FormStatus = "inactive" | "filling" | "submitted";

export interface PatientSession {
  sessionId: string;
  data: Partial<PatientFormData>;
  status: FormStatus;
  lastUpdated: string;
}

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL ?? "";

export function usePatientSocket(sessionId: string) {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      path: "/api/socket",
      transports: ["websocket"],
    });

    socketRef.current = socket;
    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    socket.emit("join-session", sessionId);

    return () => {
      socket.disconnect();
    };
  }, [sessionId]);

  const emitUpdate = useCallback(
    (data: Partial<PatientFormData>, status: FormStatus) => {
      socketRef.current?.emit("form-update", { sessionId, data, status, lastUpdated: new Date().toISOString() });
    },
    [sessionId]
  );

  const emitSubmit = useCallback(
    (data: PatientFormData) => {
      socketRef.current?.emit("form-submit", { sessionId, data, status: "submitted" as FormStatus, lastUpdated: new Date().toISOString() });
    },
    [sessionId]
  );

  return { connected, emitUpdate, emitSubmit };
}

export function useStaffSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [sessions, setSessions] = useState<Map<string, PatientSession>>(new Map());

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      path: "/api/socket",
      transports: ["websocket"],
    });

    socketRef.current = socket;
    socket.on("connect", () => {
      setConnected(true);
      socket.emit("join-staff");
    });
    socket.on("disconnect", () => setConnected(false));

    socket.on("form-update", (session: PatientSession) => {
      setSessions(prev => new Map(prev).set(session.sessionId, session));
    });

    socket.on("form-submit", (session: PatientSession) => {
      setSessions(prev => new Map(prev).set(session.sessionId, { ...session, status: "submitted" }));
    });

    socket.on("session-list", (list: PatientSession[]) => {
      const map = new Map<string, PatientSession>();
      list.forEach(s => map.set(s.sessionId, s));
      setSessions(map);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return { connected, sessions: Array.from(sessions.values()) };
}
