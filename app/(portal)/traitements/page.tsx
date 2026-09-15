
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PlanTraitementForm from "@/components/PlanTraitementForm";
import SelectEvaluation from "@/components/SelectEvaluation";
import { requirePermission } from "@/lib/authorization";

export default async function TraitementsPage({
  searchParams,
}: {
  searchParams: Promise<{
    evaluation?: string;
  }>;
}) {
  const session = await requirePermission("traitements");

  const params = await searchParams;

  const evaluationId = Number(params.evaluation);

  const peutVoirToutes =
    session.role === "Administrateur" ||
    session.role === "Responsable sécurité" ||
    session.role === "Auditeur";

  const evaluations = await prisma.evaluation.findMany({
    where: {
      statut: "terminee",
      supprimee: false,
      ...(peutVoirToutes
        ? {}
        : {
            userId: session.userId,
          }),
    },
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (evaluations.length === 0) {
    return (
      <div className="min-h-screen bg-white p-4 sm:p-6 md:p-8">
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
          <h2 className="text-xl font-bold text-gray-800">
            Aucune évaluation disponible
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Vous devez d'abord terminer une évaluation avant de
            consulter son plan de traitement.
          </p>

          {session.role === "Administrateur" ||
          session.role === "Utilisateur" ? (
            <Link
              href="/questionnaire"
              className="mt-5 inline-block rounded-lg bg-slate-800 px-5 py-3 text-sm font-medium text-white hover:bg-slate-700"
            >
              Aller au questionnaire
            </Link>
          ) : (
            <Link
              href="/risques"
              className="mt-5 inline-block rounded-lg bg-slate-800 px-5 py-3 text-sm font-medium text-white hover:bg-slate-700"
            >
              Aller à l'analyse des risques
            </Link>
          )}
        </div>
      </div>
    );
  }

  let evaluation;

  if (
    Number.isInteger(evaluationId) &&
    evaluationId > 0
  ) {
    evaluation = evaluations.find(
      (item) => item.id === evaluationId
    );
  }

  if (!evaluation) {
    evaluation = evaluations[0];
  }

  const risques = await prisma.risque.findMany({
    where: {
      evaluationId: evaluation.id,
      probabilite: {
        not: null,
      },
      impact: {
        not: null,
      },
      ...(peutVoirToutes
        ? {}
        : {
            userId: session.userId,
          }),
    },
    include: {
      mesures: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
    orderBy: {
      criticite: "desc",
    },
  });

  const risquesTries = [...risques].sort((a, b) => {
    const aTraite = a.mesures.length > 0;
    const bTraite = b.mesures.length > 0;

    if (aTraite !== bTraite) {
      return aTraite ? 1 : -1;
    }

    return (
      (b.criticite ?? 0) -
      (a.criticite ?? 0)
    );
  });

  const risquesNonTraites = risques.filter(
    (risque) => risque.mesures.length === 0
  );

  const risquesTraites = risques.filter(
    (risque) => risque.mesures.length > 0
  );

  const peutModifier =
    session.role === "Administrateur" ||
    session.role === "Responsable sécurité";

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 md:p-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 sm:text-3xl">
          Plan de traitement
        </h2>

        <p className="mt-2 text-sm text-gray-500 sm:text-base">
          Définissez les actions à mettre en place pour traiter
          les risques identifiés.
        </p>
      </div>

      {session.role === "Auditeur" && (
        <div className="mt-5 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm font-medium text-blue-800">
            Mode consultation
          </p>

          <p className="mt-1 text-sm text-blue-700">
            Vous consultez les plans de traitement en lecture seule.
          </p>
        </div>
      )}

      {evaluations.length > 1 && (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-800">
            Sélectionner une évaluation
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Choisissez l'évaluation dont vous souhaitez consulter
            le plan de traitement.
          </p>

          <div className="mt-4">
            <SelectEvaluation
              evaluations={evaluations}
              selectedId={evaluation.id}
	      destination="traitements"
            />
          </div>
        </div>
      )}

      <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
        <p className="text-sm font-medium text-gray-700">
          Évaluation sélectionnée
        </p>

        <p className="mt-1 text-lg font-semibold text-gray-800">
          Évaluation #{evaluation.id}
        </p>

        {peutVoirToutes && (
          <p className="mt-1 text-sm text-gray-500">
            Utilisateur : {evaluation.user.name}
          </p>
        )}

        <p className="mt-1 text-sm text-gray-500">
          Date :{" "}
          {evaluation.createdAt.toLocaleDateString("fr-FR")}
        </p>
      </div>

      <div className="mt-5">
        <Link
          href={`/risques?evaluation=${evaluation.id}`}
          className="inline-block rounded-lg border border-gray-300 bg-white px-5 py-3 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          ← Retour à l'analyse des risques
        </Link>
      </div>

      {risques.length === 0 ? (
        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800">
            Aucun risque à traiter
          </h3>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Cette évaluation ne contient aucun risque disponible
            pour le plan de traitement.
          </p>

          <Link
            href={`/risques?evaluation=${evaluation.id}`}
            className="mt-5 inline-block rounded-lg bg-slate-800 px-5 py-3 text-sm font-medium text-white hover:bg-slate-700"
          >
            Aller à l'analyse des risques
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-8 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <h3 className="text-lg font-semibold text-gray-800">
              État du traitement
            </h3>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-orange-50 p-4">
                <p className="text-sm font-medium text-orange-700">
                  Risques restant à traiter
                </p>

                <p className="mt-1 text-2xl font-bold text-orange-800">
                  {risquesNonTraites.length}
                </p>
              </div>

              <div className="rounded-lg bg-green-50 p-4">
                <p className="text-sm font-medium text-green-700">
                  Risques déjà traités
                </p>

                <p className="mt-1 text-2xl font-bold text-green-800">
                  {risquesTraites.length}
                </p>
              </div>
            </div>

            {risquesNonTraites.length > 0 ? (
              <p className="mt-4 text-sm leading-6 text-gray-600">
                Les risques qui nécessitent encore un traitement
                sont affichés en premier.
              </p>
            ) : (
              <p className="mt-4 text-sm leading-6 text-green-700">
                Tous les risques de cette évaluation disposent déjà
                d'un traitement.
              </p>
            )}
          </div>

          <div className="mt-8">
            <PlanTraitementForm
              risques={risquesTries}
              role={session.role}
            />
          </div>
        </>
      )}
    </div>
  );
}

