"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetPortal() {
  const router = useRouter();

  const [ouvert, setOuvert] = useState(false);
  const [secret, setSecret] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [chargement, setChargement] = useState(false);

  async function handleReset() {
    if (!secret || !name || !email || !password) {
      alert("Tous les champs sont obligatoires.");
      return;
    }

    if (password !== confirmation) {
      alert("Les mots de passe du nouvel administrateur ne correspondent pas.");
      return;
    }

    const confirme = window.confirm(
      "ATTENTION : cette action supprimera TOUS les utilisateurs et toutes les données du portail. Les questions ISO 27001 seront conservées. Voulez-vous vraiment continuer ?"
    );

    if (!confirme) return;

    setChargement(true);

    try {
      const response = await fetch("/api/admin/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          secret,
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "La réinitialisation a échoué.");
        return;
      }

      alert(
        "Réinitialisation réussie. Connectez-vous avec le nouveau compte administrateur."
      );

      router.push("/login");
      router.refresh();
    } catch {
      alert("Une erreur est survenue.");
    } finally {
      setChargement(false);
    }
  }

  if (!ouvert) {
    return (
      <button
        type="button"
        onClick={() => setOuvert(true)}
        className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
      >
        Réinitialiser le portail
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-bold text-gray-900">
          Réinitialiser le portail
        </h2>

        <p className="mt-2 text-sm text-red-600">
          Toutes les données et tous les comptes seront supprimés.
          Les questions ISO 27001 seront conservées.
        </p>

        <div className="mt-5 space-y-3">
          <input
            type="password"
            placeholder="Mot de passe maître"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />

          <input
            type="text"
            placeholder="Nom du nouvel administrateur"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />

          <input
            type="email"
            placeholder="Email du nouvel administrateur"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />

          <input
            type="password"
            placeholder="Mot de passe du nouvel administrateur"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />

          <input
            type="password"
            placeholder="Confirmer le mot de passe"
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setOuvert(false)}
            disabled={chargement}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={chargement}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {chargement ? "Réinitialisation..." : "Réinitialiser"}
          </button>
        </div>
      </div>
    </div>
  );
}
