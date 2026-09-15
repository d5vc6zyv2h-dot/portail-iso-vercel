import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Vous devez être connecté." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const reponses = body.reponses;

    if (!Array.isArray(reponses) || reponses.length === 0) {
      return NextResponse.json(
        { error: "Aucune réponse reçue." },
        { status: 400 }
      );
    }

    const questions = await prisma.question.findMany({
      where: {
        active: true,
      },
      select: {
        id: true,
      },
    });

    if (reponses.length !== questions.length) {
      return NextResponse.json(
        {
          error: `Toutes les questions doivent être répondues. ${questions.length} réponses sont attendues.`,
        },
        { status: 400 }
      );
    }

    const scores: Record<string, number> = {
      Oui: 0,
      Partiellement: 2,
      Non: 4,
    };

    let scoreTotal = 0;

    for (const reponse of reponses) {
      if (!scores.hasOwnProperty(reponse.choix)) {
        return NextResponse.json(
          { error: "Une réponse est invalide." },
          { status: 400 }
        );
      }

      scoreTotal += scores[reponse.choix];
    }

    const scoreMoyen = scoreTotal / reponses.length;

    let niveau = "Faible";

    if (scoreMoyen >= 2 && scoreMoyen < 3) {
      niveau = "Moyen";
    }

    if (scoreMoyen >= 3) {
      niveau = "Élevé";
    }

    const evaluation = await prisma.evaluation.create({
      data: {
        userId: session.userId,
        statut: "terminee",
        score: scoreMoyen,
        niveau,
        conclusion:
          niveau === "Faible"
            ? "Les mesures de sécurité évaluées présentent globalement un niveau satisfaisant."
            : niveau === "Moyen"
              ? "L'évaluation révèle plusieurs mesures de sécurité qui nécessitent des améliorations."
              : "L'évaluation révèle plusieurs faiblesses importantes qui nécessitent des actions prioritaires.",
      },
    });

    await prisma.evaluationQuestion.createMany({
      data: reponses.map(
        (reponse: {
          questionId: number;
          ordre: number;
        }) => ({
          evaluationId: evaluation.id,
          questionId: reponse.questionId,
          ordre: reponse.ordre,
        })
      ),
    });

    await prisma.reponse.createMany({
      data: reponses.map(
        (reponse: {
          questionId: number;
          choix: string;
          details?: string;
        }) => ({
          evaluationId: evaluation.id,
          questionId: reponse.questionId,
          choix: reponse.choix,
          details: reponse.details || null,
          score: scores[reponse.choix],
        })
      ),
    });

    return NextResponse.json({
      success: true,
      evaluationId: evaluation.id,
      score: scoreMoyen,
      niveau,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Une erreur est survenue lors de l'enregistrement." },
      { status: 500 }
    );
  }
}
