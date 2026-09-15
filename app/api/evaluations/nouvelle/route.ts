import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { enregistrerAudit } from "@/lib/audit";

export async function POST() {
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

    const evaluation = await prisma.evaluation.create({
      data: {
        userId: session.userId,
        statut: "en_cours",
      },
    });

    await enregistrerAudit(
      session.userId,
      "Création d'une évaluation",
      `Création de l'évaluation #${evaluation.id}`
    );

    const response = NextResponse.json({
      success: true,
      evaluationId: evaluation.id,
    });

    response.cookies.set(
      "activeEvaluationId",
      String(evaluation.id),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      }
    );

    return response;
  } catch (error) {
    console.error(
      "ERREUR NOUVELLE EVALUATION :",
      error
    );

    return NextResponse.json(
      {
        error: "Impossible de créer une nouvelle évaluation.",
      },
      { status: 500 }
    );
  }
}
