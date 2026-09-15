import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import EvaluationActions from "@/components/EvaluationActions";
import { redirect } from "next/navigation";

export default async function EvaluationsSupprimeesPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role !== "Administrateur") {
    redirect("/dashboard");
  }

  const evaluations = await prisma.evaluation.findMany({
    where: {
      supprimee: true,
    },
    include: {
      risques: true,
      user: true,
    },
    orderBy: {
      supprimeeAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 md:p-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 sm:text-3xl">
          Évaluations supprimées
        </h2>

        <p className="mt-2 text-sm text-gray-500 sm:text-base">
          Évaluations déplacées dans la corbeille.
        </p>
      </div>

      {evaluations.length === 0 ? (
        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-gray-500">
            Aucune évaluation supprimée.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-5">
          {evaluations.map((evaluation) => (
            <div
              key={evaluation.id}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Évaluation #{evaluation.id}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                  utilisateur: evaluation.user?.name ?? "Utilisateur supprimé"
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Supprimée le{" "}
                    {evaluation.supprimeeAt
                      ? new Date(
                          evaluation.supprimeeAt
                        ).toLocaleString("fr-FR")
                      : "Date inconnue"}
                  </p>
                </div>

                <span className="w-fit rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700">
                  Dans la corbeille
                </span>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-xs font-medium text-gray-500">
                    Statut
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    {evaluation.statut}
                  </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-xs font-medium text-gray-500">
                    Niveau
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    {evaluation.niveau || "Non défini"}
                  </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-xs font-medium text-gray-500">
                    Risques
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    {evaluation.risques.length}
                  </p>
                </div>
              </div>

              <EvaluationActions
                evaluationId={evaluation.id}
                supprimee={true}
		role={session.role}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
