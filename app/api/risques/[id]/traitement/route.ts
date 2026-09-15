
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

    const peutModifier =
      session.role === "Administrateur" ||
      session.role === "Responsable sécurité";

    if (!peutModifier) {
      return NextResponse.json(
        {
          error:
            "Vous n'êtes pas autorisé à modifier le plan de traitement.",
        },
        { status: 403 }
      );
    }

    const { id } = await params;
    const risqueId = Number(id);

    if (!Number.isInteger(risqueId)) {
      return NextResponse.json(
        {
          error: "Identifiant du risque invalide.",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const {
      type,
      description,
      responsable,
      priorite,
      echeance,
      statut,
    } = body;

    if (
      !type ||
      !description ||
      !responsable ||
      !priorite ||
      !echeance ||
      !statut
    ) {
      return NextResponse.json(
        {
          error:
            "Tous les champs du plan de traitement sont obligatoires.",
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
        {
          error: "Risque introuvable.",
        },
        { status: 404 }
      );
    }

    const evaluation = await prisma.evaluation.findUnique({
      where: {
        id: risque.evaluationId,
      },
    });

    if (!evaluation || evaluation.supprimee) {
      return NextResponse.json(
        {
          error:
            "Cette évaluation n'est plus disponible.",
        },
        { status: 404 }
      );
    }

    const dateEcheance = new Date(echeance);

    if (Number.isNaN(dateEcheance.getTime())) {
      return NextResponse.json(
        {
          error: "La date d'échéance est invalide.",
        },
        { status: 400 }
      );
    }

    const mesureExistante =
      await prisma.mesure.findFirst({
        where: {
          risqueId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    let mesure;

    if (mesureExistante) {
      mesure = await prisma.mesure.update({
        where: {
          id: mesureExistante.id,
        },
        data: {
          type,
          description,
          responsable,
          priorite,
          echeance: dateEcheance,
          statut,
        },
      });
    } else {
      mesure = await prisma.mesure.create({
        data: {
          risqueId,
          type,
          description,
          responsable,
          priorite,
          echeance: dateEcheance,
          statut,
        },
      });
    }

    await enregistrerAudit(
      session.userId,
      mesureExistante
        ? "Modification du plan de traitement"
        : "Création du plan de traitement",
      `Plan de traitement ${
        mesureExistante ? "modifié" : "créé"
      } pour le risque #${risqueId}, évaluation #${risque.evaluationId}.`,
      [
        `Risque : ${risque.titre}`,
        `Type : ${type}`,
        `Description : ${description}`,
        `Responsable : ${responsable}`,
        `Priorité : ${priorite}`,
        `Échéance : ${dateEcheance.toLocaleDateString("fr-FR")}`,
        `Statut : ${statut}`,
      ].join("\n")
    );

    return NextResponse.json({
      success: true,
      mesure,
      message:
        "Plan de traitement enregistré avec succès.",
    });
  } catch (error) {
    console.error(
      "ERREUR PLAN DE TRAITEMENT :",
      error
    );

    return NextResponse.json(
      {
        error:
          "Une erreur est survenue lors de l'enregistrement du plan de traitement.",
      },
      { status: 500 }
    );
  }
}

