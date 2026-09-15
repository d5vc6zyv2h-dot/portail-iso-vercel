"use client";

import Link from "next/link";
import { useState } from "react";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          remember,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erreur de connexion.");
        return;
      }

      router.push(data.redirect || "/dashboard");
      router.refresh();
    } catch {
      setError("Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* En-tête */}
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">

          <Link href="/" className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-slate-800" />

            <span className="font-bold text-xl text-slate-800">
              Portail ISO 27001
            </span>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-2 text-gray-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </Link>

        </div>
      </header>

      {/* Connexion */}
      <main className="flex justify-center px-6 py-16">

        <div className="w-full max-w-md">

          <div className="bg-white border rounded-xl p-8 shadow-sm">

            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-800">
                Se connecter
              </h1>

              <p className="text-gray-500 mt-2">
                Accédez à votre espace du portail ISO 27001.
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Adresse e-mail
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-slate-700 focus:ring-1 focus:ring-slate-700"
                  placeholder="exemple@email.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Mot de passe
                </label>

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-slate-700 focus:ring-1 focus:ring-slate-700"
                  placeholder="Votre mot de passe"
                />
              </div>

              <div className="flex items-center justify-between">

                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(event) => setRemember(event.target.checked)}
                    className="rounded border-gray-300"
                  />

                  Se souvenir de moi
                </label>

                <Link
                  href="#"
                  className="text-sm text-slate-700 hover:underline"
                >
                  Mot de passe oublié ?
                </Link>

              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-slate-900 px-5 py-3 font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Connexion..." : "Se connecter"}
              </button>

            </form>

          </div>

        </div>

      </main>

    </div>
  );
}
