"use client";

import { useState } from "react";

type AuditLogRowProps = {
  log: {
    id: number;
    action: string;
    description: string;
    details: string | null;
    signature: string;
    createdAt: string;
    userName: string;
  };
};

export default function AuditLogRow({
  log,
}: AuditLogRowProps) {
  const [ouvert, setOuvert] = useState(false);

  return (
    <>
      <tr
        onClick={() => setOuvert(!ouvert)}
        className="cursor-pointer border-t border-gray-200 transition hover:bg-gray-50"
      >
        <td className="whitespace-nowrap px-5 py-4 font-medium text-gray-800">
          {log.userName}
        </td>

        <td className="whitespace-nowrap px-5 py-4 text-gray-700">
          {log.action}
        </td>

        <td className="min-w-[250px] px-5 py-4 text-gray-600">
          {log.description}
        </td>

        <td className="whitespace-nowrap px-5 py-4 text-gray-600">
          {new Date(log.createdAt).toLocaleString("fr-FR")}
        </td>

        <td className="px-5 py-4">
          <span className="text-sm font-medium text-slate-700">
            {ouvert ? "Masquer" : "Voir"}
          </span>
        </td>
      </tr>

      {ouvert && (
        <tr className="bg-gray-50">
          <td colSpan={5} className="px-5 py-5">
            <div className="rounded-lg border border-gray-200 bg-white p-5">
              <h4 className="font-semibold text-gray-800">
                Détails de l'activité
              </h4>

              {log.details ? (
                <pre className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-gray-600">
                  {log.details}
                </pre>
              ) : (
                <p className="mt-3 text-sm text-gray-500">
                  Aucun détail supplémentaire pour cette activité.
                </p>
              )}

              <div className="mt-5">
                <p className="text-sm font-semibold text-gray-700">
                  Signature cryptographique
                </p>

                <code className="mt-2 block break-all rounded-lg bg-gray-100 p-3 text-xs text-gray-600">
                  {log.signature}
                </code>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

