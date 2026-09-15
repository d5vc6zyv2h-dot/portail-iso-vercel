import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

const roles = [
  "Administrateur",
  "Responsable sécurité",
  "Auditeur",
  "Utilisateur",
];

export async function POST(request: Request) {
  try {
    const { name, email, password, role } = await request.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Tous les champs sont obligatoires." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins 8 caractères." },
        { status: 400 }
      );
    }

    if (!roles.includes(role)) {
      return NextResponse.json(
        { error: "Rôle invalide." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Cette adresse e-mail est déjà utilisée." },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    return NextResponse.json({
      success: true,
      redirect: "/utilisateurs",
    });
  } catch (error) {
    console.error("Erreur création utilisateur :", error);

    return NextResponse.json(
      { error: "Une erreur est survenue lors de la création." },
      { status: 500 }
    );
  }
}
