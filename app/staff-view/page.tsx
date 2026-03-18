"use client";

import { useStaffSocket, PatientSession } from "@/hooks/useSocket";
import { StatusBadge } from "@/components/StatusBadge";

function formatLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase());
}

function PatientCard({ session }: { session: PatientSession }) {
  const { data, status, lastUpdated, sessionId } = session;
  const fields = Object.entries(data).filter(([, v]) => v !== undefined && v !== "");

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="font-semibold text-gray-900">
            {[data.firstName, data.middleName, data.lastName].filter(Boolean).join(" ") || (
              <span className="text-gray-400 italic">No name yet</span>
            )}
          </p>
          <p className="text-xs text-gray-400 mt-0.5 font-mono">{sessionId.slice(0, 8)}…</p>
        </div>
        <StatusBadge status={status} />
      </div>

      {fields.length > 0 ? (
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
          {fields.map(([key, value]) => (
            <div key={key} className="min-w-0">
              <dt className="text-xs text-gray-400 truncate">{formatLabel(key)}</dt>
              <dd className="text-sm text-gray-800 font-medium truncate">{String(value)}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="text-sm text-gray-400 italic">Waiting for input…</p>
      )}

      <p className="text-xs text-gray-300 mt-4 text-right">
        Updated {new Date(lastUpdated).toLocaleTimeString()}
      </p>
    </div>
  );
}

export default function StaffViewPage() {
  const { connected, sessions } = useStaffSocket();

  const filling = sessions.filter((s) => s.status === "filling");
  const submitted = sessions.filter((s) => s.status === "submitted");
  const inactive = sessions.filter((s) => s.status === "inactive");

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Staff Dashboard</h1>
            <p className="text-gray-500 mt-1">Real-time patient intake monitoring</p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className={`h-2.5 w-2.5 rounded-full ${connected ? "bg-green-400 animate-pulse" : "bg-red-400"}`} />
            <span className="text-gray-500">{connected ? "Live" : "Disconnected"}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Filling in", count: filling.length, color: "text-yellow-600 bg-yellow-50" },
            { label: "Submitted", count: submitted.length, color: "text-green-600 bg-green-50" },
            { label: "Total Sessions", count: sessions.length, color: "text-blue-600 bg-blue-50" },
          ].map(({ label, count, color }) => (
            <div key={label} className={`card text-center ${color}`}>
              <p className="text-3xl font-bold">{count}</p>
              <p className="text-sm font-medium mt-1">{label}</p>
            </div>
          ))}
        </div>

        {sessions.length === 0 ? (
          <div className="card text-center py-16 text-gray-400">
            <div className="text-5xl mb-4">👀</div>
            <p className="text-lg font-medium">Waiting for patients…</p>
            <p className="text-sm mt-1">Patient sessions will appear here in real-time</p>
          </div>
        ) : (
          <div className="space-y-8">
            {filling.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-yellow-600 uppercase tracking-wider mb-3">
                  Currently Filling In ({filling.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filling.map((s) => <PatientCard key={s.sessionId} session={s} />)}
                </div>
              </section>
            )}

            {submitted.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-green-600 uppercase tracking-wider mb-3">
                  Submitted ({submitted.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {submitted.map((s) => <PatientCard key={s.sessionId} session={s} />)}
                </div>
              </section>
            )}

            {inactive.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Inactive ({inactive.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {inactive.map((s) => <PatientCard key={s.sessionId} session={s} />)}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
