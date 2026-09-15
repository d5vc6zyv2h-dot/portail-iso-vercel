
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const raw = process.env.DATABASE_URL;

    if (!raw) {
      return NextResponse.json({
        databaseUrlPresent: false,
        message: "DATABASE_URL n'est pas disponible.",
      });
    }

    const url = new URL(raw);

    return NextResponse.json({
      databaseUrlPresent: true,
      protocol: url.protocol,
      host: url.hostname,
      port: url.port,
      database: url.pathname.replace(/^\//, ""),
      usernamePresent: Boolean(url.username),
      passwordPresent: Boolean(url.password),
      sslAccept: url.searchParams.get("sslaccept"),
    });
  } catch (error) {
    return NextResponse.json({
      databaseUrlPresent: true,
      validUrl: false,
      error: error instanceof Error ? error.message : "URL invalide",
    });
  }
}

