import SelectEvaluation from "@/components/SelectEvaluation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AnalyseRisquesForm from "@/components/AnalyseRisquesForm";
import { requirePermission } from "@/lib/authorization";

export default async function RisquesPage({
  searchParams,
}: {
  searchParams: Promise<{ evaluation?: string }>;
}) {
  const session = await requirePermission("risques");

  const params = await searchParams;
  const evaluationParam = Number(params.evaluation);

  const peutVoirToutes =
    session.role === "Administrateur" ||
    session.role === "Responsable sécurité" ||
    session.role === "Auditeur";

  const evaluations = peutVoirToutes
    ? await prisma.evaluation.findMany({
        where: {
          supprimee: false,
          statut: "terminee",
        },
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    : [];

  let evaluationId = Number.isInteger(evaluationParam)
    ? evaluationParam
    : null;

  if (!evaluationId && evaluations.length > 0) {
    evaluationId = evaluations[0].id;
  }

  if (!evaluationId) {
    return (
      <div className="min-h-screen bg-white p-4 sm:p-6 md:p-8">
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
          <h2 className="text-xl font-bold text-gray-800">
            Aucune évaluation disponible
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Veuillez d'abord terminer une évaluation avant de consulter
            l'analyse des risques.
          </p>

          {session.role === "Administrateur" && (
            <Link
              href="/questionnaire"
              className="mt-5 inline-block rounded-lg bg-slate-800 px-5 py-3 text-sm font-medium text-white hover:bg-slate-700"
            >
              Aller au questionnaire
            </Link>
          )}
        </div>
      </div>
    );
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
        include: {
          question: true,
          evaluation: true,
        },
        orderBy: {
          id: "asc",
        },
      },
    },
  });

  if (!evaluation || evaluation.supprimee) {
    return (
      <div className="min-h-screen bg-white p-4 sm:p-6 md:p-8">
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
          <h2 className="text-xl font-bold text-gray-800">
            Évaluation introuvable
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Cette évaluation n'existe plus ou n'est pas disponible.
          </p>

          <Link
            href="/risques"
            className="mt-5 inline-block rounded-lg bg-slate-800 px-5 py-3 text-sm font-medium text-white hover:bg-slate-700"
          >
            Retour aux analyses
          </Link>
        </div>
      </div>
    );
  }

  if (!peutVoirToutes && evaluation.userId !== session.userId) {
    return (
      <div className="min-h-screen bg-white p-4 sm:p-6 md:p-8">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <h2 className="text-xl font-bold text-red-800">
            Accès refusé
          </h2>

          <p className="mt-2 text-sm text-red-700">
            Vous n'êtes pas autorisé à consulter cette évaluation.
          </p>
        </div>
      </div>
    );
  }

  const risquesParQuestion = new Map(
    evaluation.risques.map((risque) => [
      risque.questionId,
      risque,
    ])
  );

  const risquesAAnalyser = evaluation.reponses
    .filter((reponse) => reponse.choix !== "Oui")
    .map((reponse) => {
      const risque = risquesParQuestion.get(reponse.questionId);

      if (!risque) {
        return null;
      }

      return {
        ...risque,
        reponse: {
          choix: reponse.choix,
          details: reponse.details,
        },
      };
    })
    .filter(
      (risque): risque is NonNullable<typeof risque> =>
        risque !== null
    );

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 md:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 sm:text-3xl">
            Analyse des risques
          </h2>

          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Analyse des risques identifiés à partir des réponses de
            l'évaluation.
          </p>
        </div>

        <Link
          href="/traitements"
          className="inline-block w-fit rounded-lg bg-slate-800 px-5 py-3 text-center text-sm font-medium text-white hover:bg-slate-700"
        >
          Continuer vers le plan de traitement →
        </Link>
      </div>

      {peutVoirToutes && evaluations.length > 0 && (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <h3 className="text-lg font-semibold text-gray-800">
            Évaluation consultée
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            Sélectionnez l'évaluation dont vous souhaitez consulter
            l'analyse des risques.
          </p>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <SelectEvaluation
              evaluations={evaluations}
              selectedId={evaluation.id}
              destination="risques"
            />
          </div>
        </div>
      )}

      {session.role === "Auditeur" && (
        <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm font-medium text-blue-800">
            Mode consultation
          </p>

          <p className="mt-1 text-sm text-blue-700">
            Vous consultez l'analyse des risques en lecture seule.
            Aucune modification n'est autorisée pour votre rôle.
          </p>
        </div>
      )}

      {peutVoirToutes && (
        <div className="mt-6 rounded-xl border bg-white p-5 shadow-sm sm:p-6">
          <h3 className="text-lg font-semibold text-gray-800">
            Informations sur l'évaluation
          </h3>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs text-gray-500">
                Évaluation
              </p>

              <p className="mt-1 font-semibold text-gray-800">
                #{evaluation.id}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Utilisateur
              </p>

              <p className="mt-1 font-semibold text-gray-800">
                {evaluation.user?.name ?? "Utilisateur supprimé"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Date
              </p>

              <p className="mt-1 font-semibold text-gray-800">                  	 {evaluation.createdAt.toLocaleDateString("fr-FR")} à{" "}
               {evaluation.createdAt.toLocaleTimeString("fr-FR", {
 		 hour: "2-digit",
  		 minute: "2-digit",
		})}
              </p>
            </div>
          </div>
        </div>
      )}

      {risquesAAnalyser.length === 0 ? (
        <div className="mt-8 rounded-xl border border-green-200 bg-green-50 p-6">
          <h3 className="text-lg font-semibold text-green-800">
            Aucun risque à analyser
          </h3>

          <p className="mt-2 text-sm leading-6 text-green-700">
            Toutes les mesures de sécurité évaluées sont considérées comme
            appliquées.
          </p>
        </div>
      ) : (
        <div className="mt-8">
          <AnalyseRisquesForm
            risques={risquesAAnalyser}
            role={session.role}
          />
        </div>
      )}
    </div>
  );
}
