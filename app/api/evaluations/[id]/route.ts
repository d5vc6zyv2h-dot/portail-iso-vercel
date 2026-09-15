import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { enregistrerAudit } from "@/lib/audit";

export async function PUT(
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

    const body = await request.json();
    const reponses = body.reponses;

    if (!Array.isArray(reponses) || reponses.length === 0) {
      return NextResponse.json(
        { error: "Aucune réponse reçue." },
        { status: 400 }
      );
    }

    const evaluation = await prisma.evaluation.findUnique({
      where: {
        id: evaluationId,
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
            "Vous n'êtes pas autorisé à modifier cette évaluation.",
        },
        { status: 403 }
      );
    }

    if (evaluation.supprimee) {
      return NextResponse.json(
        {
          error:
            "Cette évaluation se trouve dans la corbeille. Restaurez-la avant de la modifier.",
        },
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
      if (!Object.hasOwn(scores, reponse.choix)) {
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

    const conclusion =
      niveau === "Faible"
        ? "Les mesures de sécurité évaluées présentent globalement un niveau satisfaisant."
        : niveau === "Moyen"
          ? "L'évaluation révèle plusieurs mesures de sécurité qui nécessitent des améliorations."
          : "L'évaluation révèle plusieurs faiblesses importantes qui nécessitent des actions prioritaires.";

    await prisma.$transaction(async (tx) => {
      await tx.evaluation.update({
        where: {
          id: evaluationId,
        },
        data: {
          score: scoreMoyen,
          niveau,
          conclusion,
          statut: "terminee",
        },
      });

      await tx.reponse.deleteMany({
        where: {
          evaluationId,
        },
      });

      await tx.evaluationQuestion.deleteMany({
        where: {
          evaluationId,
        },
      });

      await tx.evaluationQuestion.createMany({
        data: reponses.map(
          (reponse: {
            questionId: number;
            ordre: number;
          }) => ({
            evaluationId,
            questionId: reponse.questionId,
            ordre: reponse.ordre,
          })
        ),
      });

      await tx.reponse.createMany({
        data: reponses.map(
          (reponse: {
            questionId: number;
            choix: string;
            details?: string;
          }) => ({
            evaluationId,
            questionId: reponse.questionId,
            choix: reponse.choix,
            details: reponse.details || null,
            score: scores[reponse.choix],
          })
        ),
      });
    });

    await enregistrerAudit(
      session.userId,
      "Enregistrement d'une évaluation",
      `Enregistrement de l'évaluation #${evaluationId} avec le niveau ${niveau}.`
    );

    return NextResponse.json({
      success: true,
      evaluationId,
      score: scoreMoyen,
      niveau,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Une erreur est survenue lors de la modification.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        {
          error: "Vous devez être connecté.",
        },
        { status: 401 }
      );
    }

    const { id } = await params;
    const evaluationId = Number(id);

    if (!Number.isInteger(evaluationId)) {
      return NextResponse.json(
        {
          error: "Identifiant de l'évaluation invalide.",
        },
        { status: 400 }
      );
    }

    const evaluation = await prisma.evaluation.findUnique({
      where: {
        id: evaluationId,
      },
    });

    if (!evaluation) {
      return NextResponse.json(
        {
          error: "Évaluation introuvable.",
        },
        { status: 404 }
      );
    }

    const peutSupprimerPourTous =
      session.role === "Administrateur";

    if (
      !peutSupprimerPourTous &&
      evaluation.userId !== session.userId
    ) {
      return NextResponse.json(
        {
          error:
            "Vous n'êtes pas autorisé à supprimer cette évaluation.",
        },
        { status: 403 }
      );
    }

    if (session.role === "Auditeur") {
      return NextResponse.json(
        {
          error:
            "Les auditeurs peuvent uniquement consulter les évaluations.",
        },
        { status: 403 }
      );
    }

    if (evaluation.supprimee) {
      return NextResponse.json(
        {
          error: "Cette évaluation est déjà dans la corbeille.",
        },
        { status: 400 }
      );
    }

    await prisma.evaluation.update({
      where: {
        id: evaluationId,
      },
      data: {
        supprimee: true,
        supprimeeAt: new Date(),
      },
    });

    await enregistrerAudit(
      session.userId,
      "Suppression d'une évaluation",
      `Évaluation #${evaluationId} déplacée dans la corbeille.`
    );

    return NextResponse.json({
      success: true,
      message: "Évaluation déplacée dans la corbeille.",
    });
  } catch (error) {
    console.error("ERREUR SUPPRESSION EVALUATION :", error);

    return NextResponse.json(
      {
        error:
          "Une erreur est survenue lors de la suppression de l'évaluation.",
      },
      { status: 500 }
    );
  }
}
