"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Home,
  ClipboardList,
  AlertTriangle,
  Wrench,
  Users,
  ScrollText,
  FileText,
  Settings,
  History,
  LogOut,
} from "lucide-react";

type Props = {
  role: string;
};

type Permission =
  | "dashboard"
  | "questionnaire"
  | "risques"
  | "traitements"
  | "utilisateurs"
  | "audit"
  | "rapports"
  | "evaluations";

const permissions: Record<string, Permission[]> = {
  Administrateur: [
    "dashboard",
    "questionnaire",
    "risques",
    "traitements",
    "utilisateurs",
    "audit",
    "rapports",
    "evaluations",
  ],

  "Responsable sécurité": [
    "dashboard",
    "risques",
    "traitements",
    "rapports",
  ],

  Auditeur: [
    "dashboard",
    "risques",
    "traitements",
    "audit",
    "rapports",
    "evaluations",
  ],

  Utilisateur: [
    "dashboard",
    "questionnaire",
    "rapports",
    "evaluations",
  ],
};

export default function MobileSidebar({
  role,
}: Props) {
  const [open, setOpen] = useState(false);

  const aPermission = (permission: Permission) => {
    return permissions[role]?.includes(permission) ?? false;
  };

  const links = [
    {
      href: "/dashboard",
      label: "Tableau de bord",
      icon: Home,
      permission: "dashboard" as Permission,
    },
    {
      href: "/questionnaire",
      label: "Questionnaire ISO",
      icon: ClipboardList,
      permission: "questionnaire" as Permission,
    },
    {
      href: "/evaluations",
      label: "Historique des évaluations",
      icon: History,
      permission: "evaluations" as Permission,
    },
    {
      href: "/risques",
      label: "Analyse des risques",
      icon: AlertTriangle,
      permission: "risques" as Permission,
    },
    {
      href: "/traitements",
      label: "Plan de traitement",
      icon: Wrench,
      permission: "traitements" as Permission,
    },
    {
      href: "/utilisateurs",
      label: "Gestion des utilisateurs",
      icon: Users,
      permission: "utilisateurs" as Permission,
    },
    {
      href: "/audit",
      label: "Journal d'audit",
      icon: ScrollText,
      permission: "audit" as Permission,
    },
    {
      href: "/rapports",
      label: "Rapports",
      icon: FileText,
      permission: "rapports" as Permission,
    },
    {
      href: "/profil",
      label: "Profil",
      icon: Settings,
      permission: null,
    },
  ];

  async function handleLogout() {
    await fetch("/api/logout", {
      method: "POST",
    });

    window.location.href = "/login";
  }

  return (
    <>
      {/* Bouton menu mobile */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-40 rounded-lg bg-slate-900 p-3 text-white shadow-lg md:hidden"
        aria-label="Ouvrir le menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Fond sombre */}
      {open && (
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          aria-label="Fermer le menu"
        />
      )}

      {/* Sidebar mobile */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col bg-slate-900 text-white shadow-xl transition-transform duration-300 md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* En-tête */}
        <div className="flex items-center justify-between border-b border-slate-700 p-5">
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="font-semibold"
          >
            🔐 Portail ISO 27001
          </Link>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-lg p-2 hover:bg-slate-800"
            aria-label="Fermer le menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 overflow-y-auto p-4">
          {links
            .filter(
              (link) =>
                link.permission === null ||
                aPermission(link.permission)
            )
            .map((link) => {
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  <Icon className="h-5 w-5" />
                  {link.label}
                </Link>
              );
            })}
        </nav>

        {/* Déconnexion */}
        <div className="border-t border-slate-700 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-slate-300 hover:bg-red-600 hover:text-white"
          >
            <LogOut className="h-5 w-5" />
            Déconnexion
          </button>
        </div>
      </aside>
    </>
  );
}
