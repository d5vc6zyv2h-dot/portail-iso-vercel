 
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import EvaluationActions from "@/components/EvaluationActions";
import { requirePermission } from "@/lib/authorization";

export default async function EvaluationsPage() {
  const session = await requirePermission("evaluations");

  const peutVoirToutes =
    session.role === "Administrateur" ||
    session.role === "Auditeur";

  const evaluations = await prisma.evaluation.findMany({
    where: {
      supprimee: false,
      ...(peutVoirToutes
        ? {}
        : {
            userId: session.userId,
          }),
    },
    include: {
      user: true,
      _count: {
        select: {
          risques: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const lectureSeule = session.role === "Auditeur";

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 sm:text-3xl">
            Historique des évaluations
          </h2>

          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            {lectureSeule
              ? "Consultez les évaluations réalisées dans le portail."
              : "Consultez les évaluations réalisées précédemment."}
          </p>
        </div>

        {session.role === "Administrateur" && (
          <Link
            href="/evaluations/supprimees"
            className="inline-flex w-fit items-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Évaluations supprimées
          </Link>
        )}
      </div>

      {lectureSeule && (
        <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm font-medium text-blue-800">
            Mode consultation
          </p>

          <p className="mt-1 text-sm text-blue-700">
            Vous pouvez consulter les évaluations, mais aucune modification
            n’est autorisée pour votre rôle.
          </p>
        </div>
      )}

      <div className="mt-6 w-full rounded-xl border bg-white shadow-sm sm:mt-8">
        <div className="border-b p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-800 sm:text-xl">
            {peutVoirToutes
              ? "Évaluations disponibles"
              : "Mes évaluations"}
          </h3>
        </div>

        <div className="p-4 sm:p-6">
          {evaluations.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
              <p className="text-sm text-gray-500">
                Aucune évaluation enregistrée.
              </p>

              {!lectureSeule && (
                <Link
                  href="/questionnaire"
                  className="mt-4 inline-block rounded-lg bg-slate-800 px-5 py-3 text-sm font-medium text-white hover:bg-slate-700"
                >
                  Nouvelle évaluation
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {evaluations.map((evaluation) => (
                <div
                  key={evaluation.id}
                  className="rounded-xl border border-gray-200 p-4 sm:p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        Évaluation n°{evaluation.id}
                      </h4>

                      {peutVoirToutes && (
                        <p className="mt-1 text-sm text-gray-500">
                        ytilisateur :evaluation.user?.name ?? "Utilisateur supprimé"
                        </p>
                      )}

                      <p className="mt-1 text-sm text-gray-500">
                        {evaluation.createdAt.toLocaleDateString(
                          "fr-FR"
                        )}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      <div className="rounded-lg bg-gray-50 p-3">
                        <p className="text-xs text-gray-500">
                          Score
                        </p>

                        <p className="mt-1 font-semibold text-gray-800">
                          {evaluation.score !== null
                            ? evaluation.score.toFixed(2)
                            : "-"}
                        </p>
                      </div>

                      <div className="rounded-lg bg-gray-50 p-3">
                        <p className="text-xs text-gray-500">
                          Niveau
                        </p>

                        <p className="mt-1 font-semibold text-gray-800">
                          {evaluation.niveau || "-"}
                        </p>
                      </div>

                      <div className="rounded-lg bg-gray-50 p-3">
                        <p className="text-xs text-gray-500">
                          Risques
                        </p>

                        <p className="mt-1 font-semibold text-gray-800">
                          {evaluation._count.risques}
                        </p>
                      </div>
                    </div>
                  </div>

                  <EvaluationActions
                    evaluationId={evaluation.id}
                    supprimee={evaluation.supprimee}
		    role={session.role}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

