export type Role =
  | "Administrateur"
  | "Responsable sécurité"
  | "Auditeur"
  | "Utilisateur";

export type Permission =
  | "dashboard"
  | "questionnaire"
  | "risques"
  | "traitements"
  | "utilisateurs"
  | "audit"
  | "rapports"
  | "evaluations";

const permissions: Record<Role, Permission[]> = {
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

export function aPermission(
  role: string,
  permission: Permission
) {
  const permissionsRole = permissions[role as Role];

  if (!permissionsRole) {
    return false;
  }

  return permissionsRole.includes(permission);
}
