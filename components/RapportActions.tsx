
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  rapportId: number;
  evaluationId: number;
  supprimee: boolean;
  genere: boolean;
  role: string;
};

export default function RapportActions({
  rapportId,
  evaluationId,
  supprimee,
  genere,
  role,
}: Props) {
  const router = useRouter();

  const [actionEnCours, setActionEnCours] =
    useState(false);

  const [erreur, setErreur] = useState("");

  const estAuditeur = role === "Auditeur";

  async function genererRapport() {
    if (estAuditeur) {
      return;
    }

    setActionEnCours(true);
    setErreur("");

    try {
      const response = await fetch(
        "/api/rapports/generer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            evaluationId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setErreur(
          data.error ||
            "Impossible de générer le rapport."
        );
        return;
      }

      router.push(`/rapports/${evaluationId}`);
    } catch {
      setErreur(
        "Impossible de contacter le serveur."
      );
    } finally {
      setActionEnCours(false);
    }
  }

  async function supprimerRapport() {
    if (estAuditeur) {
      return;
    }

    const confirmation = window.confirm(
      `Voulez-vous vraiment déplacer le rapport de l'évaluation n°${evaluationId} dans la corbeille ?`
    );

    if (!confirmation) {
      return;
    }

    setActionEnCours(true);
    setErreur("");

    try {
      const response = await fetch(
        `/api/rapports/${rapportId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setErreur(
          data.error ||
            "Impossible de supprimer le rapport."
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

  async function restaurerRapport() {
    if (role !== "Administrateur") {
      return;
    }

    const confirmation = window.confirm(
      `Voulez-vous restaurer le rapport de l'évaluation n°${evaluationId} ?`
    );

    if (!confirmation) {
      return;
    }

    setActionEnCours(true);
    setErreur("");

    try {
      const response = await fetch(
        `/api/rapports/${rapportId}/restaurer`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setErreur(
          data.error ||
            "Impossible de restaurer le rapport."
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
    if (role !== "Administrateur") {
      return;
    }

    const confirmation = window.confirm(
      `ATTENTION : voulez-vous supprimer définitivement le rapport de l'évaluation n°${evaluationId} ?\n\nCette action est irréversible.`
    );

    if (!confirmation) {
      return;
    }

    setActionEnCours(true);
    setErreur("");

    try {
      const response = await fetch(
        `/api/rapports/${rapportId}/definitive`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setErreur(
          data.error ||
            "Impossible de supprimer définitivement le rapport."
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
            {!genere ? (
              !estAuditeur && (
                <button
                  type="button"
                  onClick={genererRapport}
                  disabled={actionEnCours}
                  className="rounded-lg bg-slate-800 px-5 py-3 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  {actionEnCours
                    ? "Génération..."
                    : "Générer le rapport"}
                </button>
              )
            ) : (
              <>
                <Link
                  href={`/rapports/${evaluationId}`}
                  className="rounded-lg border border-gray-300 bg-white px-5 py-3 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Consulter
                </Link>

                {!estAuditeur && (
                  <button
                    type="button"
                    onClick={supprimerRapport}
                    disabled={actionEnCours}
                    className="rounded-lg bg-red-600 px-5 py-3 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                  >
                    {actionEnCours
                      ? "Suppression..."
                      : "Supprimer"}
                  </button>
                )}
              </>
            )}
          </>
        ) : (
          role === "Administrateur" && (
            <>
              <button
                type="button"
                onClick={restaurerRapport}
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
          )
        )}
      </div>
    </div>
  );
}

