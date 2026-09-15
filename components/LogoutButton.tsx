"use client";

import { LogOut } from "lucide-react";

export default function LogoutButton() {
  async function handleLogout() {
    await fetch("/api/logout", {
      method: "POST",
    });

    window.location.href = "/login";
  }

  return (
    <button
      onClick={handleLogout}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-600"
    >
      <LogOut className="w-5 h-5" />
      Déconnexion
    </button>
  );
}
