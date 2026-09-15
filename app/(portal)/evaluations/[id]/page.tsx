
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export default async function EvaluationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const { id } = await params;
  const evaluationId = Number(id);

  if (!Number.isInteger(evaluationId)) {
    notFound();
  }

  const evaluation = await prisma.evaluation.findUnique({
    where: {
      id: evaluationId,
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
        orderBy: {
          criticite: "desc",
        },
      },
    },
  });

  if (!evaluation || evaluation.supprimee) {
    notFound();
  }

  const peutVoirToutes =
    session.role === "Administrateur" ||
    session.role === "Auditeur";

  if (
    !peutVoirToutes &&
    evaluation.userId !== session.userId
  ) {
    notFound();
  }

  const lectureSeule =
    session.role === "Administrateur" ||
    session.role === "Auditeur";

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 sm:text-3xl">
            Évaluation n°{evaluation.id}
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Consultation des réponses et résultats de l'évaluation.
          </p>
        </div>

        <Link
          href="/evaluations"
          className="w-fit rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Retour à l'historique
        </Link>
      </div>

      {lectureSeule && (
        <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm font-medium text-blue-800">
            Mode consultation
          </p>

          <p className="mt-1 text-sm text-blue-700">
            Cette évaluation est consultée en lecture seule.
          </p>
        </div>
      )}

      {peutVoirToutes && (
        <div className="mt-6 rounded-xl border bg-white p-5 shadow-sm sm:p-6">
          <h3 className="text-lg font-semibold text-gray-800">
            Utilisateur
          </h3>

          <p className="mt-3 text-sm text-gray-600">
            Nom :{" "}
            <span className="font-medium text-gray-800">
              {evaluation.user.name}
            </span>
          </p>

          <p className="mt-2 text-sm text-gray-600">
            Email :{" "}
            <span className="font-medium text-gray-800">
              {evaluation.user.email}
            </span>
          </p>
        </div>
      )}

      {/* Résumé */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Score moyen
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-800">
            {evaluation.score !== null
              ? evaluation.score.toFixed(2)
              : "-"}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Niveau
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-800">
            {evaluation.niveau || "-"}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Risques identifiés
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-800">
            {evaluation.risques.length}
          </p>
        </div>
      </div>

      {/* Informations */}
      <div className="mt-6 rounded-xl border bg-white p-5 shadow-sm sm:p-6">
        <h3 className="text-lg font-semibold text-gray-800">
          Informations
        </h3>

        <p className="mt-3 text-sm text-gray-600">
          Date :{" "}
          {evaluation.createdAt.toLocaleDateString("fr-FR")}
        </p>

        <p className="mt-2 text-sm text-gray-600">
          Statut :{" "}
          <span className="font-medium">
            {evaluation.statut}
          </span>
        </p>
      </div>

      {/* Réponses */}
      <div className="mt-6 rounded-xl border bg-white shadow-sm">
        <div className="border-b p-5 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-800">
            Réponses au questionnaire
          </h3>
        </div>

        <div className="space-y-4 p-4 sm:p-6">
          {evaluation.reponses.map((reponse, index) => (
            <div
              key={reponse.id}
              className="rounded-lg border border-gray-200 p-4"
            >
              <p className="text-sm font-semibold text-gray-800">
                Question {index + 1}
              </p>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                {reponse.question.texte}
              </p>

              <p className="mt-3 text-sm">
                Réponse :{" "}
                <span className="font-semibold text-gray-800">
                  {reponse.choix || "-"}
                </span>
              </p>

              {reponse.details && (
                <p className="mt-2 text-sm text-gray-500">
                  Précisions : {reponse.details}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Risques */}
      <div className="mt-6 rounded-xl border bg-white shadow-sm">
        <div className="border-b p-5 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-800">
            Risques identifiés
          </h3>
        </div>

        <div className="p-4 sm:p-6">
          {evaluation.risques.length === 0 ? (
            <p className="text-sm text-gray-500">
              Aucun risque identifié pour cette évaluation.
            </p>
          ) : (
            <div className="space-y-4">
              {evaluation.risques.map((risque) => (
                <div
                  key={risque.id}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h4 className="font-semibold text-gray-800">
                      {risque.titre}
                    </h4>

                    <span className="w-fit rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
                      {risque.niveau || "-"}
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-gray-600">
                    Criticité :{" "}
                    <span className="font-semibold">
                      {risque.criticite ?? "-"}
                    </span>
                  </p>

                  <p className="mt-2 text-sm text-gray-500">
                    Probabilité :{" "}
                    {risque.probabilite ?? "-"} / 3
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Impact : {risque.impact ?? "-"} / 3
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

