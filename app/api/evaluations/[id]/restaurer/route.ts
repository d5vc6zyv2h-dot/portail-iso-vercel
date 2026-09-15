import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { enregistrerAudit } from "@/lib/audit";

export async function POST(
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

    if (session.role !== "Administrateur") {
      return NextResponse.json(
        {
          error:
            "Seul l'administrateur peut restaurer une évaluation.",
        },
        { status: 403 }
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

    if (!evaluation.supprimee) {
      return NextResponse.json(
        {
          error: "Cette évaluation n'est pas dans la corbeille.",
        },
        { status: 400 }
      );
    }

    await prisma.evaluation.update({
      where: {
        id: evaluationId,
      },
      data: {
        supprimee: false,
        supprimeeAt: null,
      },
    });

    await enregistrerAudit(
      session.userId,
      "Restauration d'une évaluation",
      `Restauration de l'évaluation #${evaluationId}.`
    );

    return NextResponse.json({
      success: true,
      message: "Évaluation restaurée avec succès.",
    });
  } catch (error) {
    console.error(
      "ERREUR RESTAURATION EVALUATION :",
      error
    );

    return NextResponse.json(
      {
        error:
          "Une erreur est survenue lors de la restauration de l'évaluation.",
      },
      { status: 500 }
    );
  }
}
