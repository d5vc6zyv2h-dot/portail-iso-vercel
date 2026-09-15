"use client";

import { useMemo, useState } from "react";
import AuditLogRow from "@/components/AuditLogRow";

type AuditLog = {
  id: number;
  action: string;
  description: string;
  details: string | null;
  signature: string;
  createdAt: string;
  userName: string;
};

type Props = {
  logs: AuditLog[];
};

export default function AuditLogTable({
  logs,
}: Props) {
  const [ordre, setOrdre] = useState<
    "recent" | "ancien"
  >("recent");

  const logsTries = useMemo(() => {
    return [...logs].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();

      return ordre === "recent"
        ? dateB - dateA
        : dateA - dateB;
    });
  }, [logs, ordre]);

  return (
    <div className="mt-8 rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Activités récentes
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Cliquez sur une activité pour afficher ses détails.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label
            htmlFor="ordre-audit"
            className="text-sm font-medium text-gray-600"
          >
            Trier :
          </label>

          <select
            id="ordre-audit"
            value={ordre}
            onChange={(event) =>
              setOrdre(
                event.target.value as
                  | "recent"
                  | "ancien"
              )
            }
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
          >
            <option value="recent">
              Plus récent
            </option>

            <option value="ancien">
              Plus ancien
            </option>
          </select>
        </div>
      </div>

      {logsTries.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-sm text-gray-500">
            Aucun événement enregistré dans le journal
            d’audit.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-4 font-semibold text-gray-700">
                  Utilisateur
                </th>

                <th className="px-5 py-4 font-semibold text-gray-700">
                  Action
                </th>

                <th className="px-5 py-4 font-semibold text-gray-700">
                  Description
                </th>

                <th className="px-5 py-4 font-semibold text-gray-700">
                  Date
                </th>

                <th className="px-5 py-4 font-semibold text-gray-700">
                  Détails
                </th>
              </tr>
            </thead>

            <tbody>
              {logsTries.map((log) => (
                <AuditLogRow
                  key={log.id}
                  log={log}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
