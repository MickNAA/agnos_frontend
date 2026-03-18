import { Server as IOServer } from "socket.io";
import { NextApiRequest, NextApiResponse } from "next";
import { Server as NetServer } from "http";
import { Socket } from "net";

export type NextApiResponseWithSocket = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io?: IOServer;
    };
  };
};

const sessions = new Map<string, any>();

export default function handler(req: NextApiRequest, res: NextApiResponseWithSocket) {
  if (!res.socket.server.io) {
    console.log("Initialising Socket.IO server...");

    const io = new IOServer(res.socket.server, {
      path: "/api/socket",
      addTrailingSlash: false,
      cors: { origin: "*" },
    });

    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log(`Client connected: ${socket.id}`);

      socket.on("join-session", (sessionId: string) => {
        socket.join(`session:${sessionId}`);
        console.log(`Patient joined session ${sessionId}`);
      });

      socket.on("join-staff", () => {
        socket.join("staff");
        socket.emit("session-list", Array.from(sessions.values()));
        console.log(`Staff joined: ${socket.id}`);
      });

      socket.on("form-update", (payload: any) => {
        sessions.set(payload.sessionId, { ...payload, status: "filling" });
        io.to("staff").emit("form-update", sessions.get(payload.sessionId));
      });

      socket.on("form-submit", (payload: any) => {
        sessions.set(payload.sessionId, { ...payload, status: "submitted" });
        io.to("staff").emit("form-submit", sessions.get(payload.sessionId));
      });

      socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
      });
    });
  }

  res.end();
}
