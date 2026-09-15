"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RisqueCard from "@/components/RisqueCard";

type Risque = {
  id: number;
  titre: string;
  description: string | null;
  vulnerabilite: string | null;
  consequence: string | null;
  probabilite: number | null;
  impact: number | null;
  criticite: number | null;
  niveau: string | null;
  statut: string;
  question: {
    texte: string;
  } | null;
  evaluation: {
    id: number;
  };
  reponse: {
    choix: string | null;
    details: string | null;
  } | null;
};

type Props = {
  risques: Risque[];
  role: string;
};

export default function AnalyseRisquesForm({
  risques,
  role,
}: Props) {
  const router = useRouter();

  const lectureSeule = role === "Auditeur";
  const peutModifier =
    role === "Administrateur" ||
    role === "Responsable sécurité";

  const [valeurs, setValeurs] = useState<
    Record<
      number,
      {
        probabilite: number | null;
        impact: number | null;
      }
    >
  >(
    Object.fromEntries(
      risques.map((risque) => [
        risque.id,
        {
          probabilite: risque.probabilite,
          impact: risque.impact,
        },
      ])
    )
  );

  const [modification, setModification] = useState(
    risques.some(
      (risque) =>
        risque.probabilite === null ||
        risque.impact === null
    )
  );

  const [enregistrement, setEnregistrement] =
    useState(false);

  const [message, setMessage] = useState("");
  const [erreur, setErreur] = useState("");

  const tousDefinis = risques.every((risque) => {
    const valeur = valeurs[risque.id];

    return (
      valeur !== undefined &&
      valeur.probabilite !== null &&
      valeur.impact !== null
    );
  });

  function changerProbabilite(
    risqueId: number,
    value: number | null
  ) {
    if (!peutModifier) {
      return;
    }

    setValeurs((anciennes) => ({
      ...anciennes,
      [risqueId]: {
        ...anciennes[risqueId],
        probabilite: value,
      },
    }));

    setMessage("");
    setErreur("");
  }

  function changerImpact(
    risqueId: number,
    value: number | null
  ) {
    if (!peutModifier) {
      return;
    }

    setValeurs((anciennes) => ({
      ...anciennes,
      [risqueId]: {
        ...anciennes[risqueId],
        impact: value,
      },
    }));

    setMessage("");
    setErreur("");
  }

  async function enregistrerTout() {
    if (!peutModifier) {
      return;
    }

    if (!tousDefinis) {
      setErreur(
        "Veuillez définir la probabilité et l’impact de chaque risque."
      );
      return;
    }

    setEnregistrement(true);
    setMessage("");
    setErreur("");

    try {
      const detailsRisques = risques
        .map((risque, index) => {
          const valeur = valeurs[risque.id];

          const probabilite = valeur.probabilite as number;
          const impact = valeur.impact as number;
          const criticite = probabilite * impact;

          let niveau = "Faible";

          if (criticite >= 3 && criticite <= 4) {
            niveau = "Moyen";
          }

          if (criticite >= 6) {
            niveau = "Élevé";
          }

          return [
            `Risque ${index + 1} : ${risque.titre}`,
            `Probabilité : ${probabilite}/3`,
            `Impact : ${impact}/3`,
            `Criticité : ${criticite}`,
            `Niveau : ${niveau}`,
          ].join("\n");
        })
        .join("\n\n");

      for (let index = 0; index < risques.length; index++) {
        const risque = risques[index];
        const valeur = valeurs[risque.id];

        const estDernier =
          index === risques.length - 1;

        const response = await fetch(
          `/api/risques/${risque.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              probabilite: valeur.probabilite,
              impact: valeur.impact,
              journaliserAudit: estDernier,
              detailsAudit: estDernier
                ? detailsRisques
                : "",
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Impossible d'enregistrer un risque."
          );
        }
      }

      setModification(false);

      setMessage(
        "L’analyse des risques a été enregistrée avec succès."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      router.refresh();
    } catch (error) {
      setErreur(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de l’enregistrement."
      );
    } finally {
      setEnregistrement(false);
    }
  }

  function modifierTout() {
    if (!peutModifier) {
      return;
    }

    setModification(true);
    setMessage("");
    setErreur("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <div>
      {lectureSeule && (
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm font-medium text-blue-800">
            Mode consultation
          </p>

          <p className="mt-1 text-sm text-blue-700">
            Vous consultez l’analyse des risques en
            lecture seule. Aucune modification n’est
            autorisée pour votre rôle.
          </p>
        </div>
      )}

      <div className="space-y-5">
        {risques.map((risque) => (
          <RisqueCard
            key={risque.id}
            risque={risque}
            probabilite={
              valeurs[risque.id]?.probabilite ?? null
            }
            impact={
              valeurs[risque.id]?.impact ?? null
            }
            modification={
              peutModifier && modification
            }
            onProbabiliteChange={(value) =>
              changerProbabilite(
                risque.id,
                value
              )
            }
            onImpactChange={(value) =>
              changerImpact(
                risque.id,
                value
              )
            }
          />
        ))}
      </div>

      {peutModifier && (
        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <h3 className="text-lg font-semibold text-gray-800">
            Enregistrement de l’analyse
          </h3>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Définissez la probabilité et l’impact de
            chaque risque avant d’enregistrer
            l’analyse.
          </p>

          {erreur && (
            <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {erreur}
            </p>
          )}

          {message && (
            <p className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
              {message}
            </p>
          )}

          {!tousDefinis && modification && (
            <p className="mt-4 text-sm text-orange-600">
              Tous les risques doivent être évalués
              avant l’enregistrement.
            </p>
          )}

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={enregistrerTout}
              disabled={
                !tousDefinis ||
                !modification ||
                enregistrement
              }
              className={`rounded-lg px-5 py-3 text-sm font-medium text-white ${
                tousDefinis &&
                modification &&
                !enregistrement
                  ? "bg-slate-800 hover:bg-slate-700"
                  : "cursor-not-allowed bg-gray-400"
              }`}
            >
              {enregistrement
                ? "Enregistrement..."
                : "Enregistrer l’analyse"}
            </button>

            <button
              type="button"
              onClick={modifierTout}
              disabled={
                modification ||
                enregistrement
              }
              className={`rounded-lg border px-5 py-3 text-sm font-medium ${
                !modification &&
                !enregistrement
                  ? "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  : "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
              }`}
            >
              Modifier
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
