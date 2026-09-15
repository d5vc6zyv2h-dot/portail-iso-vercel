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
            "Seul l'administrateur peut restaurer un rapport.",
        },
        { status: 403 }
      );
    }

    const { id } = await params;
    const rapportId = Number(id);

    if (!Number.isInteger(rapportId)) {
      return NextResponse.json(
        {
          error: "Identifiant du rapport invalide.",
        },
        { status: 400 }
      );
    }

    const rapport = await prisma.rapport.findUnique({
      where: {
        id: rapportId,
      },
    });

    if (!rapport) {
      return NextResponse.json(
        {
          error: "Rapport introuvable.",
        },
        { status: 404 }
      );
    }

    if (!rapport.supprimee) {
      return NextResponse.json(
        {
          error: "Ce rapport n'est pas dans la corbeille.",
        },
        { status: 400 }
      );
    }

    await prisma.rapport.update({
      where: {
        id: rapportId,
      },
      data: {
        supprimee: false,
        supprimeeAt: null,
      },
    });

    await enregistrerAudit(
      session.userId,
      "Restauration d'un rapport",
      `Restauration du rapport #${rapportId}.`
    );

    return NextResponse.json({
      success: true,
      message: "Rapport restauré avec succès.",
    });
  } catch (error) {
    console.error(
      "ERREUR RESTAURATION RAPPORT :",
      error
    );

    return NextResponse.json(
      {
        error:
          "Une erreur est survenue lors de la restauration du rapport.",
      },
      { status: 500 }
    );
  }
}
