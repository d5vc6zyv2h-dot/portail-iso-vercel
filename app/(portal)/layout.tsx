import SidebarLink from "@/components/SidebarLink";
import LogoutButton from "@/components/LogoutButton";
import MobileSidebar from "@/components/MobileSidebar";
import { getSession } from "@/lib/session";
import { aPermission } from "@/lib/permissions";

import {
  Home,
  ClipboardList,
  AlertTriangle,
  Wrench,
  Users,
  ScrollText,
  FileText,
  Settings,
  ShieldCheck,
  History,
} from "lucide-react";

export default async function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  const role = session?.role || "";

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar PC */}
      <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col bg-slate-900 text-white md:flex">
        {/* Logo */}
        <div className="border-b border-slate-700 p-5">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6" />

            <span className="font-semibold">
              Portail ISO 27001
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 overflow-y-auto p-4">
          {aPermission(role, "dashboard") && (
            <SidebarLink href="/dashboard">
              <Home className="h-5 w-5" />
              Tableau de bord
            </SidebarLink>
          )}

          {aPermission(role, "questionnaire") && (
            <SidebarLink href="/questionnaire">
              <ClipboardList className="h-5 w-5" />
              Questionnaire ISO
            </SidebarLink>
          )}

          {aPermission(role, "evaluations") && (
            <SidebarLink href="/evaluations">
              <History className="h-5 w-5" />
              Historique des évaluations
            </SidebarLink>
          )}

          {aPermission(role, "risques") && (
            <SidebarLink href="/risques">
              <AlertTriangle className="h-5 w-5" />
              Analyse des risques
            </SidebarLink>
          )}

          {aPermission(role, "traitements") && (
            <SidebarLink href="/traitements">
              <Wrench className="h-5 w-5" />
              Plan de traitement
            </SidebarLink>
          )}

          {aPermission(role, "utilisateurs") && (
            <SidebarLink href="/utilisateurs">
              <Users className="h-5 w-5" />
              Gestion des utilisateurs
            </SidebarLink>
          )}

          {aPermission(role, "audit") && (
            <SidebarLink href="/audit">
              <ScrollText className="h-5 w-5" />
              Journal d'audit
            </SidebarLink>
          )}

          {aPermission(role, "rapports") && (
            <SidebarLink href="/rapports">
              <FileText className="h-5 w-5" />
              Rapports
            </SidebarLink>
          )}

          <SidebarLink href="/profil">
            <Settings className="h-5 w-5" />
            Profil
          </SidebarLink>
        </nav>

        {/* Déconnexion */}
        <div className="border-t border-slate-700 p-4">
          <LogoutButton />
        </div>
      </aside>

      {/* Sidebar mobile */}
      <MobileSidebar role={role} />

      {/* Contenu principal */}
      <main className="min-h-screen md:ml-64">
        <div className="h-16 md:hidden" />

        {children}
      </main>
    </div>
  );
}
