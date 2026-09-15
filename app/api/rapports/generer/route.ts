
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { enregistrerAudit } from "@/lib/audit";

export async function POST(request: Request) {
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

    const peutGenererPourTous =
      session.role === "Administrateur" ||
      session.role === "Responsable sécurité";

    if (session.role === "Auditeur") {
      return NextResponse.json(
        {
          error:
            "Les auditeurs peuvent uniquement consulter les rapports.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const evaluationId = Number(body.evaluationId);

    if (!Number.isInteger(evaluationId)) {
      return NextResponse.json(
        {
          error: "Identifiant de l'évaluation invalide.",
        },
        { status: 400 }
      );
    }

    const evaluation = await prisma.evaluation.findFirst({
      where: {
        id: evaluationId,
        ...(peutGenererPourTous
          ? {}
          : {
              userId: session.userId,
            }),
        supprimee: false,
        statut: "terminee",
      },
      include: {
        rapport: true,
      },
    });

    if (!evaluation) {
      return NextResponse.json(
        {
          error: "Évaluation introuvable ou non terminée.",
        },
        { status: 404 }
      );
    }

    if (evaluation.rapport) {
      return NextResponse.json(
        {
          error: "Un rapport existe déjà pour cette évaluation.",
          rapportId: evaluation.rapport.id,
        },
        { status: 409 }
      );
    }

    const rapport = await prisma.rapport.create({
      data: {
        evaluationId: evaluation.id,
        userId: evaluation.userId,
        titre: `Rapport de l'évaluation n°${evaluation.id}`,
        conclusion:
          evaluation.conclusion ||
          "Aucune conclusion n'a été enregistrée.",
      },
    });

    await enregistrerAudit(
      session.userId,
      "Génération d'un rapport",
      `Génération du rapport de l'évaluation #${evaluation.id}.`
    );

    return NextResponse.json({
      success: true,
      rapportId: rapport.id,
      message: "Rapport généré avec succès.",
    });
  } catch (error) {
    console.error(
      "ERREUR GENERATION RAPPORT :",
      error
    );

    return NextResponse.json(
      {
        error:
          "Une erreur est survenue lors de la génération du rapport.",
      },
      { status: 500 }
    );
  }
}

