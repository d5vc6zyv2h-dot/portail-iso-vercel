import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { aPermission, type Permission } from "@/lib/permissions";

export async function requirePermission(
  permission: Permission
) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (!aPermission(session.role, permission)) {
    redirect("/dashboard");
  }

  return session;
}
