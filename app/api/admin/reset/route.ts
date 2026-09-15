import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { hashPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session || session.role !== "Administrateur") {
      return NextResponse.json(
        { error: "Accès refusé." },
        { status: 403 }
      );
    }

    const { secret, name, email, password } = await request.json();

    if (!secret || secret !== process.env.RESET_SECRET) {
      return NextResponse.json(
        { error: "Mot de passe maître incorrect." },
        { status: 401 }
      );
    }

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Les informations du nouvel administrateur sont obligatoires." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins 8 caractères." },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);

    await prisma.$transaction(async (tx) => {
      await tx.reponse.deleteMany();
      await tx.mesure.deleteMany();
      await tx.risque.deleteMany();
      await tx.rapport.deleteMany();
      await tx.evaluationQuestion.deleteMany();
      await tx.evaluation.deleteMany();
      await tx.auditLog.deleteMany();

      await tx.user.deleteMany();

      await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: "Administrateur",
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Le portail a été réinitialisé avec succès.",
    });
  } catch (error) {
    console.error("Erreur réinitialisation :", error);

    return NextResponse.json(
      { error: "La réinitialisation a échoué." },
      { status: 500 }
    );
  }
}
