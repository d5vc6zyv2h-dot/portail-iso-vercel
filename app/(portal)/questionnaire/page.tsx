import { prisma } from "@/lib/prisma";
import QuestionnaireForm from "@/components/QuestionnaireForm";
import { requirePermission } from "@/lib/authorization";

export default async function QuestionnairePage() {
await requirePermission("questionnaire");

const questions = await prisma.question.findMany({
where: {
active: true,
},
orderBy: {
id: "asc",
},
});

return ( <div className="p-4 sm:p-6 md:p-8"> <div> <h2 className="text-2xl font-bold text-gray-800 sm:text-3xl">
Questionnaire ISO 27001 </h2>


    <p className="mt-2 text-sm text-gray-500 sm:text-base">
      Évaluation des mesures de sécurité de l'organisation.
    </p>
  </div>

  <div className="mt-6 w-full rounded-xl border bg-white shadow-sm sm:mt-8">
    <div className="border-b p-4 sm:p-6">
      <h3 className="text-lg font-semibold text-gray-800 sm:text-xl">
        Questions d'évaluation
      </h3>

      <p className="mt-2 text-sm text-gray-500">
        Répondez à toutes les questions avant de valider l'évaluation.
      </p>
    </div>

    <div className="p-4 sm:p-6">
      <QuestionnaireForm questions={questions} />
    </div>
  </div>
</div>

);
}
