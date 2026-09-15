import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const roles = [
  "Administrateur",
  "Responsable sécurité",
  "Auditeur",
  "Utilisateur",
];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const userId = Number(id);

  if (!Number.isInteger(userId)) {
    return NextResponse.json(
      { error: "Identifiant invalide." },
      { status: 400 }
    );
  }

  const utilisateur = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!utilisateur) {
    return NextResponse.json(
      { error: "Utilisateur introuvable." },
      { status: 404 }
    );
  }

  return NextResponse.json(utilisateur);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();

    if (!session || session.role !== "Administrateur") {
      return NextResponse.json(
        { error: "Accès refusé." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const userId = Number(id);

    if (!Number.isInteger(userId)) {
      return NextResponse.json(
        { error: "Identifiant invalide." },
        { status: 400 }
      );
    }

    const { name, email, role } = await request.json();

    if (!name || !email || !role) {
      return NextResponse.json(
        { error: "Tous les champs sont obligatoires." },
        { status: 400 }
      );
    }

    if (!roles.includes(role)) {
      return NextResponse.json(
        { error: "Rôle invalide." },
        { status: 400 }
      );
    }

    const utilisateur = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!utilisateur) {
      return NextResponse.json(
        { error: "Utilisateur introuvable." },
        { status: 404 }
      );
    }

    const emailExiste = await prisma.user.findFirst({
      where: {
        email,
        NOT: {
          id: userId,
        },
      },
    });

    if (emailExiste) {
      return NextResponse.json(
        { error: "Cette adresse e-mail est déjà utilisée." },
        { status: 409 }
      );
    }

    const utilisateurModifie = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        role,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: utilisateurModifie.id,
        name: utilisateurModifie.name,
        email: utilisateurModifie.email,
        role: utilisateurModifie.role,
      },
    });
  } catch (error) {
    console.error("Erreur modification utilisateur :", error);

    return NextResponse.json(
      { error: "Une erreur est survenue lors de la modification." },
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

    if (!session || session.role !== "Administrateur") {
      return NextResponse.json(
        { error: "Accès refusé." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const userId = Number(id);

    if (!Number.isInteger(userId)) {
      return NextResponse.json(
        { error: "Identifiant invalide." },
        { status: 400 }
      );
    }

    if (session.userId === userId) {
      return NextResponse.json(
        { error: "Vous ne pouvez pas supprimer votre propre compte." },
        { status: 400 }
      );
    }

    const utilisateur = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!utilisateur) {
      return NextResponse.json(
        { error: "Utilisateur introuvable." },
        { status: 404 }
      );
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({
      success: true,
      message: "Utilisateur supprimé avec succès.",
    });
  } catch (error) {
    console.error("Erreur suppression utilisateur :", error);

    return NextResponse.json(
      { error: "Une erreur est survenue lors de la suppression." },
      { status: 500 }
    );
  }
}
