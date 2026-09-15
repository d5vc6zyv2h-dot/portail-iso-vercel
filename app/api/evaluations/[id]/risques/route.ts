import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Vous devez être connecté." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const evaluationId = Number(id);

    if (!Number.isInteger(evaluationId)) {
      return NextResponse.json(
        { error: "Identifiant d'évaluation invalide." },
        { status: 400 }
      );
    }

    const evaluation = await prisma.evaluation.findUnique({
      where: {
        id: evaluationId,
      },
      include: {
        reponses: {
          include: {
            question: true,
          },
        },
      },
    });

    if (!evaluation) {
      return NextResponse.json(
        { error: "Évaluation introuvable." },
        { status: 404 }
      );
    }

    if (evaluation.userId !== session.userId) {
      return NextResponse.json(
        {
          error:
            "Vous n'êtes pas autorisé à analyser cette évaluation.",
        },
        { status: 403 }
      );
    }

    await prisma.risque.deleteMany({
      where: {
        evaluationId,
      },
    });

    const risques = [];

    for (const reponse of evaluation.reponses) {
      if (reponse.choix === "Oui") {
        continue;
      }

      const description =
        reponse.choix === "Non"
          ? "La mesure de sécurité n'est pas appliquée."
          : "La mesure de sécurité n'est que partiellement appliquée.";

      const vulnerabilite =
        reponse.details ||
        "Absence ou insuffisance de la mesure de sécurité identifiée.";

      const consequence =
        reponse.choix === "Non"
          ? "Cette faiblesse peut exposer l'organisation à un risque important pour la sécurité de l'information."
          : "Cette faiblesse peut réduire le niveau de protection des informations et augmenter le risque de sécurité.";

      risques.push({
        evaluationId,
        userId: session.userId,
        questionId: reponse.questionId,
        titre: reponse.question.texte,
        description,
        vulnerabilite,
        consequence,
        probabilite: null,
        impact: null,
        criticite: null,
        niveau: null,
        statut: "À analyser",
      });
    }

    if (risques.length > 0) {
      await prisma.risque.createMany({
        data: risques,
      });
    }

    return NextResponse.json({
      success: true,
      nombreRisques: risques.length,
      message:
        risques.length === 0
          ? "Aucun risque n'a été identifié."
          : `${risques.length} risque(s) identifié(s).`,
    });
  } catch (error) {
    console.error("ERREUR ANALYSE DES RISQUES :", error);

    return NextResponse.json(
      {
        error:
          "Une erreur est survenue lors de l'analyse des risques.",
      },
      { status: 500 }
    );
  }
}
