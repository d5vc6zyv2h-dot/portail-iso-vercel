import ResetPortal from "@/components/ResetPortal";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import UserActions from "@/components/UserActions";
import { requirePermission } from "@/lib/authorization";

export default async function UtilisateursPage() {
await requirePermission("utilisateurs");

const utilisateurs = await prisma.user.findMany({
orderBy: {
createdAt: "desc",
},
});

return ( <div className="p-4 sm:p-6 md:p-8">
{/* En-tête */} <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"> <div> <h2 className="text-2xl font-bold text-gray-800 sm:text-3xl">
Gestion des utilisateurs </h2>

      <p className="mt-2 text-sm text-gray-500 sm:text-base">
        Gestion des comptes et des rôles des utilisateurs du portail.
      </p>

	<div className="mt-4">
  	<ResetPortal />
	</div>
    </div>

    <Link
      href="/utilisateurs/nouveau"
      className="w-full rounded-lg bg-slate-900 px-5 py-3 text-center font-medium text-white hover:bg-slate-800 sm:w-auto"
    >
      + Ajouter un utilisateur
    </Link>
  </div>

  {/* Liste */}
  <div className="mt-6 overflow-hidden rounded-xl border bg-white shadow-sm sm:mt-8">
    <div className="border-b p-4 sm:p-6">
      <h3 className="text-lg font-semibold text-gray-800 sm:text-xl">
        Utilisateurs
      </h3>

      <p className="mt-1 text-sm text-gray-500">
        Liste des utilisateurs enregistrés dans le portail.
      </p>
    </div>

    {/* Tableau avec défilement horizontal sur mobile */}
    <div className="overflow-x-auto">
      <table className="min-w-[850px] w-full text-left">
        <thead className="border-b bg-gray-50">
          <tr>
            <th className="px-4 py-4 text-sm font-semibold text-gray-700 sm:px-6">
              Nom
            </th>

            <th className="px-4 py-4 text-sm font-semibold text-gray-700 sm:px-6">
              E-mail
            </th>

            <th className="px-4 py-4 text-sm font-semibold text-gray-700 sm:px-6">
              Rôle
            </th>

            <th className="px-4 py-4 text-sm font-semibold text-gray-700 sm:px-6">
              Date de création
            </th>

            <th className="px-4 py-4 text-sm font-semibold text-gray-700 sm:px-6">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {utilisateurs.map((utilisateur) => (
            <tr
              key={utilisateur.id}
              className="hover:bg-gray-50"
            >
              <td className="px-4 py-4 text-gray-800 sm:px-6">
                {utilisateur.name}
              </td>

              <td className="px-4 py-4 text-gray-600 sm:px-6">
                {utilisateur.email}
              </td>

              <td className="px-4 py-4 sm:px-6">
                <span className="inline-flex whitespace-nowrap rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                  {utilisateur.role}
                </span>
              </td>

              <td className="whitespace-nowrap px-4 py-4 text-gray-600 sm:px-6">
                {new Date(
                  utilisateur.createdAt
                ).toLocaleDateString("fr-FR")}
              </td>

              <td className="px-4 py-4 sm:px-6">
                <UserActions userId={utilisateur.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {utilisateurs.length === 0 && (
      <div className="p-6 text-center text-sm text-gray-500">
        Aucun utilisateur enregistré.
      </div>
    )}
  </div>
</div>

);
}
