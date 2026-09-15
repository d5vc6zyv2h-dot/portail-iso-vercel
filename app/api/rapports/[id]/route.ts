
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { enregistrerAudit } from "@/lib/audit";

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

    const peutSupprimerPourTous =
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

    if (
      !peutSupprimerPourTous &&
      rapport.userId !== session.userId
    ) {
      return NextResponse.json(
        {
          error:
            "Vous n'êtes pas autorisé à supprimer ce rapport.",
        },
        { status: 403 }
      );
    }

    if (rapport.supprimee) {
      return NextResponse.json(
        {
          error: "Ce rapport est déjà dans la corbeille.",
        },
        { status: 400 }
      );
    }

    await prisma.rapport.update({
      where: {
        id: rapportId,
      },
      data: {
        supprimee: true,
        supprimeeAt: new Date(),
      },
    });

    await enregistrerAudit(
      session.userId,
      "Suppression d'un rapport",
      `Rapport #${rapportId} déplacé dans la corbeille.`
    );

    return NextResponse.json({
      success: true,
      message: "Rapport déplacé dans la corbeille.",
    });
  } catch (error) {
    console.error(
      "ERREUR SUPPRESSION RAPPORT :",
      error
    );

    return NextResponse.json(
      {
        error:
          "Une erreur est survenue lors de la suppression du rapport.",
      },
      { status: 500 }
    );
  }
}

