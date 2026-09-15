
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import RapportActions from "@/components/RapportActions";
import { redirect } from "next/navigation";

export default async function RapportsSupprimesPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role !== "Administrateur") {
    redirect("/dashboard");
  }

  const rapports = await prisma.rapport.findMany({
    where: {
      supprimee: true,
    },
    include: {
      evaluation: true,
      user: true,
    },
    orderBy: {
      supprimeeAt: "desc",
    },
  });

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 sm:text-3xl">
            Rapports supprimés
          </h2>

          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Rapports déplacés dans la corbeille.
          </p>
        </div>

        <Link
          href="/rapports"
          className="inline-flex w-fit rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Retour aux rapports
        </Link>
      </div>

      <div className="mt-6 w-full rounded-xl border bg-white shadow-sm sm:mt-8">
        <div className="border-b p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-800 sm:text-xl">
            Corbeille des rapports
          </h3>
        </div>

        <div className="p-4 sm:p-6">
          {rapports.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center sm:p-8">
              <p className="text-sm text-gray-500 sm:text-base">
                Aucun rapport supprimé.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {rapports.map((rapport) => (
                <div
                  key={rapport.id}
                  className="rounded-xl border border-gray-200 p-4 sm:p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        Rapport de l'évaluation n°
                        {rapport.evaluationId}
                      </h4>

                      <p className="mt-1 text-sm text-gray-500">
                        Utilisateur :{" "}
                        {rapport.user?.name ?? "Utilisateur supprimé"}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        Supprimé le{" "}
                        {rapport.supprimeeAt
                          ? rapport.supprimeeAt.toLocaleDateString(
                              "fr-FR"
                            )
                          : "-"}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-gray-50 p-3">
                        <p className="text-xs text-gray-500">
                          Score
                        </p>

                        <p className="mt-1 font-semibold text-gray-800">
                          {rapport.evaluation.score !== null
                            ? rapport.evaluation.score.toFixed(2)
                            : "-"}
                        </p>
                      </div>

                      <div className="rounded-lg bg-gray-50 p-3">
                        <p className="text-xs text-gray-500">
                          Niveau
                        </p>

                        <p className="mt-1 font-semibold text-gray-800">
                          {rapport.evaluation.niveau || "-"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <RapportActions
                    rapportId={rapport.id}
                    evaluationId={rapport.evaluationId}
                    supprimee={true}
                    genere={true}
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

