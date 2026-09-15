import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth";
import { createSession } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email et mot de passe requis." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect." },
        { status: 401 }
      );
    }

    const passwordCorrect = await verifyPassword(password, user.password);

    if (!passwordCorrect) {
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect." },
        { status: 401 }
      );
    }

    await createSession(user.id, user.role);

    return NextResponse.json({
      success: true,
      redirect: "/dashboard",
    });
  } catch (error) {
    console.error("Erreur de connexion :", error);

    return NextResponse.json(
      { error: "Une erreur est survenue lors de la connexion." },
      { status: 500 }
    );
  }
}
