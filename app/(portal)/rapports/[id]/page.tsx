
import ExportRapportPDF from "@/components/ExportRapportPDF";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export default async function RapportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();

  if (!session) {
    return null;
  }

  const { id } = await params;
  const evaluationId = Number(id);

  if (!Number.isInteger(evaluationId)) {
    notFound();
  }

  const evaluation = await prisma.evaluation.findFirst({
    where: {
      id: evaluationId,
      ...(session.role === "Administrateur" ||
      session.role === "Responsable sécurité" ||
      session.role === "Auditeur"
        ? {}
        : {
            userId: session.userId,
          }),
      supprimee: false,
      statut: "terminee",
    },
    include: {
      user: true,
      reponses: {
        include: {
          question: true,
        },
        orderBy: {
          questionId: "asc",
        },
      },
      risques: {
        include: {
          question: true,
          mesures: true,
        },
        orderBy: {
          criticite: "desc",
        },
      },
    },
  });

  if (!evaluation) {
    notFound();
  }

  const totalQuestions = evaluation.reponses.length;

  const nombreOui = evaluation.reponses.filter(
    (reponse: { choix: string | null }) => reponse.choix === "Oui"
  ).length;

  const nombrePartiellement = evaluation.reponses.filter(
    (reponse: { choix: string | null }) =>
      reponse.choix === "Partiellement"
  ).length;

  const nombreNon = evaluation.reponses.filter(
    (reponse: { choix: string | null }) => reponse.choix === "Non"
  ).length;

  const risquesEleves = evaluation.risques.filter(
    (risque: { niveau: string | null }) => risque.niveau === "Élevé"
  ).length;

  const risquesMoyens = evaluation.risques.filter(
    (risque: { niveau: string | null }) => risque.niveau === "Moyen"
  ).length;

  const risquesFaibles = evaluation.risques.filter(
    (risque: { niveau: string | null }) => risque.niveau === "Faible"
  ).length;

  const nombreMesures = evaluation.risques.reduce(
    (total: number, risque: { mesures: unknown[] }) =>
      total + risque.mesures.length,
    0
  );

  return (
    <div
      id="rapport-pdf"
      className="p-4 sm:p-6 md:p-8"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 sm:text-3xl">
            Rapport d'évaluation
          </h2>

          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Évaluation n°{evaluation.id}
          </p>

          <div className="mt-4">
            <ExportRapportPDF
              evaluationId={evaluation.id}
            />
          </div>
        </div>

        <Link
          href="/rapports"
          className="print:hidden inline-flex w-fit rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Retour aux rapports
        </Link>
      </div>

      <div className="mt-6 space-y-6 sm:mt-8">
        <section className="rounded-xl border bg-white shadow-sm">
          <div className="border-b p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-800 sm:text-xl">
              1. Informations générales
            </h3>
          </div>

          <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs text-gray-500">
                Évaluation
              </p>

              <p className="mt-1 font-semibold text-gray-800">
                n°{evaluation.id}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs text-gray-500">
                Utilisateur
              </p>

              <p className="mt-1 font-semibold text-gray-800">
                {evaluation.user?.name ?? "Utilisateur supprimé"}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs text-gray-500">
                Date
              </p>

              <p className="mt-1 font-semibold text-gray-800">
                {evaluation.createdAt.toLocaleDateString(
                  "fr-FR"
                )}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs text-gray-500">
                Statut
              </p>

              <p className="mt-1 font-semibold text-gray-800">
                Terminée
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border bg-white shadow-sm">
          <div className="border-b p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-800 sm:text-xl">
              2. Résumé de l'évaluation
            </h3>
          </div>

          <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-5 sm:p-6">
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs text-gray-500">
                Questions
              </p>

              <p className="mt-1 text-xl font-bold text-gray-800">
                {totalQuestions}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs text-gray-500">
                Oui
              </p>

              <p className="mt-1 text-xl font-bold text-gray-800">
                {nombreOui}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs text-gray-500">
                Partiellement
              </p>

              <p className="mt-1 text-xl font-bold text-gray-800">
                {nombrePartiellement}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs text-gray-500">
                Non
              </p>

              <p className="mt-1 text-xl font-bold text-gray-800">
                {nombreNon}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs text-gray-500">
                Score
              </p>

              <p className="mt-1 text-xl font-bold text-gray-800">
                {evaluation.score !== null
                  ? evaluation.score.toFixed(2)
                  : "-"}
              </p>
            </div>
          </div>

          <div className="px-4 pb-4 sm:px-6 sm:pb-6">
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-500">
                Niveau global
              </p>

              <p className="mt-1 text-lg font-bold text-gray-800">
                {evaluation.niveau || "-"}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border bg-white shadow-sm">
          <div className="border-b p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-800 sm:text-xl">
              3. Résultats du questionnaire
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-4 font-semibold text-gray-700 sm:px-6">
                    Catégorie
                  </th>

                  <th className="min-w-[300px] px-4 py-4 font-semibold text-gray-700 sm:px-6">
                    Question
                  </th>

                  <th className="px-4 py-4 font-semibold text-gray-700 sm:px-6">
                    Réponse
                  </th>

                  <th className="px-4 py-4 font-semibold text-gray-700 sm:px-6">
                    Score
                  </th>
                </tr>
              </thead>

              <tbody>
                {evaluation.reponses.map((reponse) => (
                  <tr
                    key={reponse.id}
                    className="border-t border-gray-200"
                  >
                    <td className="px-4 py-4 text-gray-600 sm:px-6">
                      {reponse.question.categorie}
                    </td>

                    <td className="px-4 py-4 text-gray-700 sm:px-6">
                      {reponse.question.texte}
                    </td>

                    <td className="px-4 py-4 font-medium text-gray-800 sm:px-6">
                      {reponse.choix || "-"}
                    </td>

                    <td className="px-4 py-4 text-gray-600 sm:px-6">
                      {reponse.score !== null
                        ? reponse.score
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-xl border bg-white shadow-sm">
          <div className="border-b p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-800 sm:text-xl">
              4. Analyse des risques
            </h3>
          </div>

          <div className="grid gap-4 p-4 sm:grid-cols-3 sm:p-6">
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs text-gray-500">
                Risques élevés
              </p>

              <p className="mt-1 text-xl font-bold text-gray-800">
                {risquesEleves}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs text-gray-500">
                Risques moyens
              </p>

              <p className="mt-1 text-xl font-bold text-gray-800">
                {risquesMoyens}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs text-gray-500">
                Risques faibles
              </p>

              <p className="mt-1 text-xl font-bold text-gray-800">
                {risquesFaibles}
              </p>
            </div>
          </div>

          {evaluation.risques.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-sm text-gray-500">
                Aucun risque enregistré pour cette évaluation.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-4 font-semibold text-gray-700 sm:px-6">
                      Risque
                    </th>

                    <th className="px-4 py-4 font-semibold text-gray-700 sm:px-6">
                      Probabilité
                    </th>

                    <th className="px-4 py-4 font-semibold text-gray-700 sm:px-6">
                      Impact
                    </th>

                    <th className="px-4 py-4 font-semibold text-gray-700 sm:px-6">
                      Criticité
                    </th>

                    <th className="px-4 py-4 font-semibold text-gray-700 sm:px-6">
                      Niveau
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {evaluation.risques.map((risque) => (
                    <tr
                      key={risque.id}
                      className="border-t border-gray-200"
                    >
                      <td className="px-4 py-4 sm:px-6">
                        <p className="font-medium text-gray-800">
                          {risque.titre}
                        </p>

                        {risque.description && (
                          <p className="mt-1 text-sm text-gray-500">
                            {risque.description}
                          </p>
                        )}
                      </td>

                      <td className="px-4 py-4 text-gray-600 sm:px-6">
                        {risque.probabilite ?? "-"}
                      </td>

                      <td className="px-4 py-4 text-gray-600 sm:px-6">
                        {risque.impact ?? "-"}
                      </td>

                      <td className="px-4 py-4 font-semibold text-gray-800 sm:px-6">
                        {risque.criticite ?? "-"}
                      </td>

                      <td className="px-4 py-4 font-medium text-gray-700 sm:px-6">
                        {risque.niveau ?? "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded-xl border bg-white shadow-sm">
          <div className="border-b p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-800 sm:text-xl">
              5. Plan de traitement
            </h3>
          </div>

          <div className="p-4 sm:p-6">
            <p className="mb-5 text-sm text-gray-500">
              {nombreMesures} mesure
              {nombreMesures > 1 ? "s" : ""} de traitement
              enregistrée
              {nombreMesures > 1 ? "s" : ""}.
            </p>

            {nombreMesures === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
                <p className="text-sm text-gray-500">
                  Aucun plan de traitement n'a encore été
                  enregistré.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {evaluation.risques.map((risque) =>
                  risque.mesures.map((mesure) => (
                    <div
                      key={mesure.id}
                      className="rounded-xl border border-gray-200 p-4 sm:p-5"
                    >
                      <h4 className="font-semibold text-gray-800">
                        {risque.titre}
                      </h4>

                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <div>
                          <p className="text-xs text-gray-500">
                            Type de traitement
                          </p>

                          <p className="mt-1 text-sm font-medium text-gray-800">
                            {mesure.type}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500">
                            Responsable
                          </p>

                          <p className="mt-1 text-sm font-medium text-gray-800">
                            {mesure.responsable || "-"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500">
                            Priorité
                          </p>

                          <p className="mt-1 text-sm font-medium text-gray-800">
                            {mesure.priorite || "-"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500">
                            Échéance
                          </p>

                          <p className="mt-1 text-sm font-medium text-gray-800">
                            {mesure.echeance
                              ? mesure.echeance.toLocaleDateString(
                                  "fr-FR"
                                )
                              : "-"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500">
                            Statut
                          </p>

                          <p className="mt-1 text-sm font-medium text-gray-800">
                            {mesure.statut}
                          </p>
                        </div>

                        <div className="sm:col-span-2">
                          <p className="text-xs text-gray-500">
                            Mesure proposée
                          </p>

                          <p className="mt-1 text-sm leading-6 text-gray-700">
                            {mesure.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </section>

        <section className="rounded-xl border bg-white shadow-sm">
          <div className="border-b p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-800 sm:text-xl">
              6. Conclusion
            </h3>
          </div>

          <div className="p-4 sm:p-6">
            <p className="text-sm leading-7 text-gray-700 sm:text-base">
              {evaluation.conclusion ||
                "Aucune conclusion n'a été enregistrée pour cette évaluation."}
            </p>
          </div>
        </section>

        <section className="rounded-xl border bg-white shadow-sm">
          <div className="border-b p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-800 sm:text-xl">
              7. Traçabilité
            </h3>
          </div>

          <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-6">
            <div>
              <p className="text-xs text-gray-500">
                Identifiant de l'évaluation
              </p>

              <p className="mt-1 text-sm font-medium text-gray-800">
                #{evaluation.id}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Généré pour
              </p>

              <p className="mt-1 text-sm font-medium text-gray-800">
                {evaluation.user?.name ?? "Utilisateur supprimé"}
              </p>
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <Link
            href="/rapports"
            className="rounded-lg bg-slate-800 px-5 py-3 text-sm font-medium text-white hover:bg-slate-700"
          >
            Retour aux rapports
          </Link>
        </div>
      </div>
    </div>
  );
}

