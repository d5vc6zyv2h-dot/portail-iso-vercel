"use client";

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
  risque: Risque;
  probabilite: number | null;
  impact: number | null;
  modification: boolean;
  onProbabiliteChange: (value: number | null) => void;
  onImpactChange: (value: number | null) => void;
};

export default function RisqueCard({
  risque,
  probabilite,
  impact,
  modification,
  onProbabiliteChange,
  onImpactChange,
}: Props) {
  const criticite =
    probabilite !== null && impact !== null
      ? probabilite * impact
      : null;

  let niveau = "À analyser";

  if (criticite !== null) {
    if (criticite <= 2) {
      niveau = "Faible";
    } else if (criticite <= 4) {
      niveau = "Moyen";
    } else {
      niveau = "Élevé";
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
      <div>
        <h4 className="text-base font-semibold text-gray-800 sm:text-lg">
          {risque.titre}
        </h4>
      </div>

      <div className="mt-5 rounded-lg bg-blue-50 p-4">
        <p className="text-sm font-semibold text-gray-800">
          Question du questionnaire
        </p>

        <p className="mt-2 text-sm leading-6 text-gray-600">
          {risque.question?.texte || risque.titre}
        </p>

        <p className="mt-4 text-sm font-semibold text-gray-800">
          Réponse
        </p>

        <p className="mt-1 text-sm font-medium text-gray-700">
          {risque.reponse?.choix || "-"}
        </p>

        {risque.reponse?.details && (
          <>
            <p className="mt-4 text-sm font-semibold text-gray-800">
              Précisions
            </p>

            <p className="mt-1 text-sm leading-6 text-gray-600">
              {risque.reponse.details}
            </p>
          </>
        )}
      </div>

      {risque.description && (
        <div className="mt-5">
          <p className="text-sm font-medium text-gray-700">
            Analyse du problème
          </p>

          <p className="mt-1 text-sm leading-6 text-gray-500">
            {risque.description}
          </p>
        </div>
      )}

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-sm font-medium text-gray-700">
            Vulnérabilité
          </p>

          <p className="mt-1 text-sm leading-6 text-gray-500">
            {risque.vulnerabilite || "Non renseignée"}
          </p>
        </div>

        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-sm font-medium text-gray-700">
            Conséquence
          </p>

          <p className="mt-1 text-sm leading-6 text-gray-500">
            {risque.consequence || "Non renseignée"}
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border p-4">
          <label
            htmlFor={`probabilite-${risque.id}`}
            className="text-sm font-medium text-gray-700"
          >
            Probabilité
          </label>

          <select
            id={`probabilite-${risque.id}`}
            value={probabilite ?? ""}
            disabled={!modification}
            onChange={(e) =>
              onProbabiliteChange(
                e.target.value === ""
                  ? null
                  : Number(e.target.value)
              )
            }
            className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100 disabled:text-gray-500"
          >
            <option value="">À définir</option>
            <option value={1}>1 - Faible</option>
            <option value={2}>2 - Moyenne</option>
            <option value={3}>3 - Élevée</option>
          </select>
        </div>

        <div className="rounded-lg border p-4">
          <label
            htmlFor={`impact-${risque.id}`}
            className="text-sm font-medium text-gray-700"
          >
            Impact
          </label>

          <select
            id={`impact-${risque.id}`}
            value={impact ?? ""}
            disabled={!modification}
            onChange={(e) =>
              onImpactChange(
                e.target.value === ""
                  ? null
                  : Number(e.target.value)
              )
            }
            className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100 disabled:text-gray-500"
          >
            <option value="">À définir</option>
            <option value={1}>1 - Faible</option>
            <option value={2}>2 - Moyen</option>
            <option value={3}>3 - Élevé</option>
          </select>
        </div>

        <div className="rounded-lg border p-4">
          <p className="text-sm font-medium text-gray-700">
            Criticité
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-800">
            {criticite ?? "-"}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Probabilité × Impact
          </p>

          <p className="mt-2 text-sm font-medium text-gray-700">
            Niveau : {niveau}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm text-gray-500">
          Statut :{" "}
          <span className="font-medium text-gray-700">
            {risque.statut}
          </span>
        </p>
      </div>
    </div>
  );
}
