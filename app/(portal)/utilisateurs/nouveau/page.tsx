"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const roles = [
  "Administrateur",
  "Responsable sécurité",
  "Auditeur",
  "Utilisateur",
];

export default function NouvelUtilisateurPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Utilisateur");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Impossible de créer l'utilisateur.");
        return;
      }

      router.push("/utilisateurs");
      router.refresh();
    } catch {
      setError("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 sm:text-3xl">
          Ajouter un utilisateur
        </h2>

        <p className="mt-2 text-sm text-gray-500 sm:text-base">
          Créer un nouveau compte utilisateur pour le portail.
        </p>
      </div>

      <div className="mt-6 w-full rounded-xl border bg-white shadow-sm sm:mt-8">
        <div className="border-b p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-800 sm:text-xl">
            Informations du compte
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6">
          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Nom complet
              </label>

              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-slate-500 sm:text-base"
                placeholder="Nom complet"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                E-mail
              </label>

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-slate-500 sm:text-base"
                placeholder="exemple@email.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Mot de passe
              </label>

              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={8}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-slate-500 sm:text-base"
                placeholder="Minimum 8 caractères"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Rôle
              </label>

              <select
                value={role}
                onChange={(event) => setRole(event.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500 sm:text-base"
              >
                {roles.map((roleName) => (
                  <option key={roleName} value={roleName}>
                    {roleName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row">
            <button
              type="button"
              onClick={() => router.push("/utilisateurs")}
              className="w-full rounded-lg border border-gray-300 px-5 py-3 text-gray-700 hover:bg-gray-50 sm:w-auto"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-slate-900 px-5 py-3 font-medium text-white hover:bg-slate-800 disabled:opacity-50 sm:w-auto"
            >
              {loading ? "Création..." : "Créer l'utilisateur"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
