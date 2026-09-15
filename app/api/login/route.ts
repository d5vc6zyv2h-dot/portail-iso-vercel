
import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import { verifyPassword } from "@/lib/auth";
import { createSession } from "@/lib/session";

export async function POST(request: Request) {
  let connection;

  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email et mot de passe requis." },
        { status: 400 }
      );
    }

    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      throw new Error("DATABASE_URL n'est pas définie.");
    }

    const url = new URL(databaseUrl);

    connection = await mysql.createConnection({
      host: url.hostname,
      port: Number(url.port) || 4000,
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      database: url.pathname.replace(/^\//, ""),
      ssl: {
        rejectUnauthorized: true,
      },
    });

    const [rows] = await connection.execute(
      "SELECT id, name, email, password, role FROM User WHERE email = ? LIMIT 1",
      [email]
    );

    const users = rows as Array<{
      id: number;
      name: string;
      email: string;
      password: string;
      role: string;
    }>;

    const user = users[0];

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
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

