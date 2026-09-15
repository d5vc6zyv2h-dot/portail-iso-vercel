
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  evaluationId: number;
  supprimee: boolean;
  role?: string;
};

export default function EvaluationActions({
  evaluationId,
  supprimee,
  role,
}: Props) {
  const router = useRouter();

  const [actionEnCours, setActionEnCours] =
    useState(false);

  const [erreur, setErreur] =
    useState("");

  const estAdministrateur =
    role === "Administrateur";

  const estAuditeur =
    role === "Auditeur";

  async function supprimer() {
    const confirmation = window.confirm(
      `Voulez-vous vraiment déplacer l'évaluation n°${evaluationId} dans la corbeille ?`
    );

    if (!confirmation) {
      return;
    }

    setActionEnCours(true);
    setErreur("");

    try {
      const response = await fetch(
        `/api/evaluations/${evaluationId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setErreur(
          data.error ||
            "Impossible de supprimer l'évaluation."
        );
        return;
      }

      router.refresh();
    } catch {
      setErreur(
        "Impossible de contacter le serveur."
      );
    } finally {
      setActionEnCours(false);
    }
  }

  async function restaurer() {
    const confirmation = window.confirm(
      `Voulez-vous restaurer l'évaluation n°${evaluationId} ?`
    );

    if (!confirmation) {
      return;
    }

    setActionEnCours(true);
    setErreur("");

    try {
      const response = await fetch(
        `/api/evaluations/${evaluationId}/restaurer`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setErreur(
          data.error ||
            "Impossible de restaurer l'évaluation."
        );
        return;
      }

      router.refresh();
    } catch {
      setErreur(
        "Impossible de contacter le serveur."
      );
    } finally {
      setActionEnCours(false);
    }
  }

  async function supprimerDefinitivement() {
    const confirmation = window.confirm(
      `ATTENTION : voulez-vous supprimer définitivement l'évaluation n°${evaluationId} ?\n\nCette action est irréversible.`
    );

    if (!confirmation) {
      return;
    }

    setActionEnCours(true);
    setErreur("");

    try {
      const response = await fetch(
        `/api/evaluations/${evaluationId}/definitive`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setErreur(
          data.error ||
            "Impossible de supprimer définitivement l'évaluation."
        );
        return;
      }

      router.refresh();
    } catch {
      setErreur(
        "Impossible de contacter le serveur."
      );
    } finally {
      setActionEnCours(false);
    }
  }

  return (
    <div className="mt-5 border-t pt-4">
      {erreur && (
        <p className="mb-3 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {erreur}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        {!supprimee ? (
          <>
            <Link
              href={`/evaluations/${evaluationId}`}
              className="rounded-lg border border-gray-300 bg-white px-5 py-3 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Consulter
            </Link>

            {!estAuditeur && (
              <button
                type="button"
                onClick={supprimer}
                disabled={actionEnCours}
                className="rounded-lg bg-red-600 px-5 py-3 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {actionEnCours
                  ? "Suppression..."
                  : "Supprimer"}
              </button>
            )}
          </>
        ) : (
          <>
            {estAdministrateur && (
              <>
                <button
                  type="button"
                  onClick={restaurer}
                  disabled={actionEnCours}
                  className="rounded-lg bg-green-600 px-5 py-3 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  {actionEnCours
                    ? "Restauration..."
                    : "Restaurer"}
                </button>

                <button
                  type="button"
                  onClick={supprimerDefinitivement}
                  disabled={actionEnCours}
                  className="rounded-lg bg-red-700 px-5 py-3 text-sm font-medium text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  {actionEnCours
                    ? "Suppression..."
                    : "Supprimer définitivement"}
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
