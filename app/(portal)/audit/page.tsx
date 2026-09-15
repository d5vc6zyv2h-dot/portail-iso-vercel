import { prisma } from "@/lib/prisma";
import AuditLogTable from "@/components/AuditLogTable";
import { requirePermission } from "@/lib/authorization";

export default async function AuditPage() {
await requirePermission("audit");

const logs = await prisma.auditLog.findMany({
include: {
user: true,
},
orderBy: {
createdAt: "desc",
},
});

const logsFormates = logs.map((log) => ({
id: log.id,
action: log.action,
description: log.description,
details: log.details,
signature: log.signature,
createdAt: log.createdAt.toISOString(),
userName: log.user?.name ?? "Utilisateur supprimé",
}));

return ( <div className="min-h-screen bg-white p-4 sm:p-6 md:p-8"> <div> <h2 className="text-2xl font-bold text-gray-800 sm:text-3xl">
Journal d’audit </h2>

    <p className="mt-2 text-sm text-gray-500 sm:text-base">
      Historique des actions effectuées sur le portail.
    </p>
  </div>

  <AuditLogTable logs={logsFormates} />
</div>

);
}
