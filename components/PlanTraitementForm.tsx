
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
  mesures: Mesure[];
};

type Mesure = {
  id: number;
  type: string;
  description: string;
  responsable: string | null;
  priorite: string | null;
  echeance: Date | string | null;
  statut: string;
};

type Props = {
  risques: Risque[];
  role: string;
};

type Traitement = {
  type: string;
  description: string;
  responsable: string;
  priorite: string;
  echeance: string;
  statut: string;
};

export default function PlanTraitementForm({
  risques,
  role,
}: Props) {
  const router = useRouter();

  const lectureSeule = role === "Auditeur";

  const peutModifier =
    role === "Administrateur" ||
    role === "Responsable sécurité";

  const [traitements, setTraitements] = useState<
    Record<number, Traitement>
  >(
    Object.fromEntries(
      risques.map((risque) => {
        const mesure = risque.mesures[0];

        return [
          risque.id,
          {
            type: mesure?.type || "",
            description: mesure?.description || "",
            responsable: mesure?.responsable || "",
            priorite: mesure?.priorite || "",
            echeance: mesure?.echeance
              ? new Date(mesure.echeance)
                  .toISOString()
                  .slice(0, 10)
              : "",
            statut:
              mesure?.statut ||
              "À mettre en œuvre",
          },
        ];
      })
    )
  );

  const [modification, setModification] = useState(
    risques.some(
      (risque) => risque.mesures.length === 0
    )
  );

  const [enregistrement, setEnregistrement] =
    useState(false);

  const [message, setMessage] = useState("");
  const [erreur, setErreur] = useState("");

  const tousComplets = risques.every((risque) => {
    const traitement = traitements[risque.id];

    return (
      traitement &&
      traitement.type !== "" &&
      traitement.description.trim() !== "" &&
      traitement.responsable.trim() !== "" &&
      traitement.priorite !== "" &&
      traitement.echeance !== "" &&
      traitement.statut !== ""
    );
  });

  function modifierTraitement(
    risqueId: number,
    champ: keyof Traitement,
    valeur: string
  ) {
    if (!peutModifier) {
      return;
    }

    setTraitements((anciens) => ({
      ...anciens,
      [risqueId]: {
        ...anciens[risqueId],
        [champ]: valeur,
      },
    }));

    setMessage("");
    setErreur("");
  }

  async function enregistrerTout() {
    if (!peutModifier) {
      return;
    }

    if (!tousComplets) {
      setErreur(
        "Veuillez compléter le traitement de chaque risque avant d'enregistrer."
      );
      return;
    }

    setEnregistrement(true);
    setMessage("");
    setErreur("");

    try {
      for (const risque of risques) {
        const traitement = traitements[risque.id];

        const response = await fetch(
          `/api/risques/${risque.id}/traitement`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              type: traitement.type,
              description: traitement.description,
              responsable: traitement.responsable,
              priorite: traitement.priorite,
              echeance: traitement.echeance,
              statut: traitement.statut,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Impossible d'enregistrer le traitement."
          );
        }
      }

      setModification(false);

      setMessage(
        "Le plan de traitement a été enregistré avec succès."
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
          : "Une erreur est survenue lors de l'enregistrement."
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
            Vous consultez le plan de traitement en lecture seule.
            Aucune modification n'est autorisée pour votre rôle.
          </p>
        </div>
      )}

      <div className="space-y-6">
        {risques.map((risque) => {
          const traitement = traitements[risque.id];

          const risqueTraite =
            risque.mesures.length > 0;

          return (
            <div
              key={risque.id}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6"
            >
              <div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {risque.titre}
                    </h3>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                        Criticité : {risque.criticite ?? "-"}
                      </span>

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                        Niveau : {risque.niveau || "À analyser"}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${
                      risqueTraite
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {risqueTraite
                      ? "Traitement défini"
                      : "À traiter"}
                  </span>
                </div>
              </div>

              <div className="mt-5 rounded-lg bg-gray-50 p-4">
                <p className="text-sm font-medium text-gray-700">
                  Risque identifié
                </p>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {risque.description ||
                    "Aucune description disponible."}
                </p>

                {risque.vulnerabilite && (
                  <>
                    <p className="mt-4 text-sm font-medium text-gray-700">
                      Vulnérabilité
                    </p>

                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      {risque.vulnerabilite}
                    </p>
                  </>
                )}

                {risque.consequence && (
                  <>
                    <p className="mt-4 text-sm font-medium text-gray-700">
                      Conséquence
                    </p>

                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      {risque.consequence}
                    </p>
                  </>
                )}
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor={`type-${risque.id}`}
                    className="text-sm font-medium text-gray-700"
                  >
                    Type de traitement
                  </label>

                  <select
                    id={`type-${risque.id}`}
                    value={traitement.type}
                    disabled={!peutModifier || !modification}
                    onChange={(e) =>
                      modifierTraitement(
                        risque.id,
                        "type",
                        e.target.value
                      )
                    }
                    className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100"
                  >
                    <option value="">Sélectionner</option>
                    <option value="Réduire">Réduire</option>
                    <option value="Éviter">Éviter</option>
                    <option value="Transférer">
                      Transférer
                    </option>
                    <option value="Accepter">Accepter</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor={`priorite-${risque.id}`}
                    className="text-sm font-medium text-gray-700"
                  >
                    Priorité
                  </label>

                  <select
                    id={`priorite-${risque.id}`}
                    value={traitement.priorite}
                    disabled={!peutModifier || !modification}
                    onChange={(e) =>
                      modifierTraitement(
                        risque.id,
                        "priorite",
                        e.target.value
                      )
                    }
                    className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100"
                  >
                    <option value="">Sélectionner</option>
                    <option value="Faible">Faible</option>
                    <option value="Moyenne">Moyenne</option>
                    <option value="Élevée">Élevée</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor={`responsable-${risque.id}`}
                    className="text-sm font-medium text-gray-700"
                  >
                    Responsable
                  </label>

                  <input
                    id={`responsable-${risque.id}`}
                    type="text"
                    value={traitement.responsable}
                    disabled={!peutModifier || !modification}
                    onChange={(e) =>
                      modifierTraitement(
                        risque.id,
                        "responsable",
                        e.target.value
                      )
                    }
                    placeholder="Nom du responsable"
                    className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor={`echeance-${risque.id}`}
                    className="text-sm font-medium text-gray-700"
                  >
                    Échéance
                  </label>

                  <input
                    id={`echeance-${risque.id}`}
                    type="date"
                    value={traitement.echeance}
                    disabled={!peutModifier || !modification}
                    onChange={(e) =>
                      modifierTraitement(
                        risque.id,
                        "echeance",
                        e.target.value
                      )
                    }
                    className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor={`description-${risque.id}`}
                    className="text-sm font-medium text-gray-700"
                  >
                    Mesure de sécurité à mettre en place
                  </label>

                  <textarea
                    id={`description-${risque.id}`}
                    rows={4}
                    value={traitement.description}
                    disabled={!peutModifier || !modification}
                    onChange={(e) =>
                      modifierTraitement(
                        risque.id,
                        "description",
                        e.target.value
                      )
                    }
                    placeholder="Décrivez l'action ou la mesure à mettre en place..."
                    className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor={`statut-${risque.id}`}
                    className="text-sm font-medium text-gray-700"
                  >
                    Statut
                  </label>

                  <select
                    id={`statut-${risque.id}`}
                    value={traitement.statut}
                    disabled={!peutModifier || !modification}
                    onChange={(e) =>
                      modifierTraitement(
                        risque.id,
                        "statut",
                        e.target.value
                      )
                    }
                    className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100"
                  >
                    <option value="À mettre en œuvre">
                      À mettre en œuvre
                    </option>

                    <option value="En cours">
                      En cours
                    </option>

                    <option value="Terminé">
                      Terminé
                    </option>
                  </select>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {peutModifier && (
        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <h3 className="text-lg font-semibold text-gray-800">
            Enregistrement du plan de traitement
          </h3>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Complétez le traitement de chaque risque avant
            d'enregistrer le plan.
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

          {!tousComplets && modification && (
            <p className="mt-4 text-sm text-orange-600">
              Tous les champs obligatoires doivent être complétés.
            </p>
          )}

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={enregistrerTout}
              disabled={
                !tousComplets ||
                !modification ||
                enregistrement
              }
              className={`rounded-lg px-5 py-3 text-sm font-medium text-white ${
                tousComplets &&
                modification &&
                !enregistrement
                  ? "bg-slate-800 hover:bg-slate-700"
                  : "cursor-not-allowed bg-gray-400"
              }`}
            >
              {enregistrement
                ? "Enregistrement..."
                : "Enregistrer le plan"}
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

