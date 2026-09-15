
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import RapportActions from "@/components/RapportActions";
import { requirePermission } from "@/lib/authorization";

export default async function RapportsPage() {
  const session = await requirePermission("rapports");

  const peutVoirTous =
    session.role === "Administrateur" ||
    session.role === "Responsable sécurité" ||
    session.role === "Auditeur";

  const evaluations = await prisma.evaluation.findMany({
    where: {
      ...(peutVoirTous
        ? {}
        : {
            userId: session.userId,
          }),
      supprimee: false,
      statut: "terminee",
    },
    include: {
      user: true,
      rapport: true,
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

  const evaluationsVisibles = evaluations.filter(
    (evaluation) =>
      !evaluation.rapport || !evaluation.rapport.supprimee
  );

  const estAuditeur = session.role === "Auditeur";

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 sm:text-3xl">
            Rapports
          </h2>

          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Consultation et export des rapports d'analyse des risques.
          </p>
        </div>

        {session.role === "Administrateur" && (
          <Link
            href="/rapports/supprimes"
            className="inline-flex w-fit rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Rapports supprimés
          </Link>
        )}
      </div>

      {estAuditeur && (
        <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm font-medium text-blue-800">
            Mode consultation
          </p>

          <p className="mt-1 text-sm text-blue-700">
            Vous pouvez consulter les rapports, mais vous ne pouvez pas les
            générer ou les supprimer.
          </p>
        </div>
      )}

      <div className="mt-6 w-full rounded-xl border bg-white shadow-sm sm:mt-8">
        <div className="border-b p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-800 sm:text-xl">
            Rapports disponibles
          </h3>

          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Les rapports sont générés à partir des évaluations terminées.
          </p>
        </div>

        <div className="p-4 sm:p-6">
          {evaluationsVisibles.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center sm:p-8">
              <p className="text-sm text-gray-500 sm:text-base">
                Aucun rapport disponible pour le moment.
              </p>

              {!estAuditeur && (
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
              {evaluationsVisibles.map((evaluation) => (
                <div
                  key={evaluation.id}
                  className="rounded-xl border border-gray-200 p-4 sm:p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        Rapport de l'évaluation n°{evaluation.id}
                      </h4>

                      <p className="mt-1 text-sm text-gray-500">
                        Évaluation réalisée le{" "}
                        {evaluation.createdAt.toLocaleDateString("fr-FR")}
                      </p>

                      {peutVoirTous && (
                        <p className="mt-1 text-sm text-gray-500">
                          Utilisateur :{" "}
                          <span className="font-medium text-gray-700">
                            {evaluation.user.name}
                          </span>
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
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

                  <RapportActions
                    rapportId={evaluation.rapport?.id ?? 0}
                    evaluationId={evaluation.id}
                    supprimee={false}
                    genere={evaluation.rapport !== null}
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

