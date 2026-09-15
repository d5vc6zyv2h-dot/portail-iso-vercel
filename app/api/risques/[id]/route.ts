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

    if (
      session.role !== "Administrateur" &&
      session.role !== "Responsable sécurité"
    ) {
      return NextResponse.json(
        {
          error:
            "Vous n'êtes pas autorisé à modifier une analyse des risques.",
        },
        { status: 403 }
      );
    }

    const { id } = await params;
    const risqueId = Number(id);

    if (!Number.isInteger(risqueId)) {
      return NextResponse.json(
        { error: "Identifiant du risque invalide." },
        { status: 400 }
      );
    }

    const body = await request.json();

    const probabilite = Number(body.probabilite);
    const impact = Number(body.impact);

    if (
      ![1, 2, 3].includes(probabilite) ||
      ![1, 2, 3].includes(impact)
    ) {
      return NextResponse.json(
        {
          error:
            "La probabilité et l'impact doivent être compris entre 1 et 3.",
        },
        { status: 400 }
      );
    }

    const risque = await prisma.risque.findUnique({
      where: {
        id: risqueId,
      },
    });

    if (!risque) {
      return NextResponse.json(
        { error: "Risque introuvable." },
        { status: 404 }
      );
    }

    const criticite = probabilite * impact;

    let niveau = "Faible";

    if (criticite >= 3 && criticite <= 4) {
      niveau = "Moyen";
    }

    if (criticite >= 6) {
      niveau = "Élevé";
    }

    const risqueModifie = await prisma.risque.update({
      where: {
        id: risqueId,
      },
      data: {
        probabilite,
        impact,
        criticite,
        niveau,
      },
    });

    if (body.journaliserAudit === true) {
      await enregistrerAudit(
        session.userId,
        "Analyse des risques enregistrée",
        `Enregistrement de l'analyse des risques de l'évaluation #${risque.evaluationId}.`,
        body.detailsAudit || `Risque #${risqueId} analysé.`
      );
    }

    return NextResponse.json({
      success: true,
      risque: risqueModifie,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Une erreur est survenue lors de la modification du risque.",
      },
      { status: 500 }
    );
  }
}
