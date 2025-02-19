import { NextResponse } from "next/server";
import db, { initDB, cleanup } from "../../../../lib/db";

let initialized = false;

// POST /api/auth
export async function POST(req) {
  try {
    if (!initialized) {
      await initDB();
      initialized = true;
    }

    const { username, password } = await req.json();
    
    if (!username || !password) {
      return NextResponse.json(
        { error: "Informations de connexion invalides" },
        { status: 400 }
      );
    }

    try {
      const user = await db.get(username);

      if (user.blocked) {
        return NextResponse.json(
          { error: "Ce compte a été bloqué." },
          { status: 403 }
        );
      }

      if (user.password !== password) {
        return NextResponse.json(
          { error: "Informations de connexion invalides" },
          { status: 401 }
        );
      }

      return NextResponse.json({
        message: "Login successful",
        user: { username }
      });

    } catch (error) {
      return NextResponse.json(
        { error: "Informations de connexion invalides" },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Global error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await cleanup();
  }
}