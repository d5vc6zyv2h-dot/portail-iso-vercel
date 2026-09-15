import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function ConsulterUtilisateurPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const userId = Number(id);

  if (!Number.isInteger(userId)) {
    notFound();
  }

  const utilisateur = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!utilisateur) {
    notFound();
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      {/* En-tête */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 sm:text-3xl">
          Consulter l'utilisateur
        </h2>

        <p className="mt-2 text-sm text-gray-500 sm:text-base">
          Détails du compte utilisateur.
        </p>
      </div>

      {/* Informations */}
      <div className="mt-6 w-full overflow-hidden rounded-xl border bg-white shadow-sm sm:mt-8">
        <div className="border-b p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-800 sm:text-xl">
            Informations de l'utilisateur
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-5 p-4 sm:gap-6 sm:p-6 md:grid-cols-2">
          <div>
            <p className="text-sm text-gray-500">Nom complet</p>
            <p className="mt-1 break-words font-medium text-gray-800">
              {utilisateur.name}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">E-mail</p>
            <p className="mt-1 break-all font-medium text-gray-800">
              {utilisateur.email}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Rôle</p>
            <span className="mt-1 inline-flex max-w-full rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
              {utilisateur.role}
            </span>
          </div>

          <div>
            <p className="text-sm text-gray-500">Date de création</p>
            <p className="mt-1 font-medium text-gray-800">
              {new Date(utilisateur.createdAt).toLocaleDateString("fr-FR")}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Dernière modification
            </p>
            <p className="mt-1 font-medium text-gray-800">
              {new Date(utilisateur.updatedAt).toLocaleDateString("fr-FR")}
            </p>
          </div>
        </div>

        {/* Boutons */}
        <div className="flex flex-col gap-3 border-t p-4 sm:flex-row sm:p-6">
          <Link
            href="/utilisateurs"
            className="w-full rounded-lg border border-gray-300 px-5 py-3 text-center text-gray-700 hover:bg-gray-50 sm:w-auto"
          >
            Retour
          </Link>

          <Link
            href={`/utilisateurs/${utilisateur.id}/modifier`}
            className="w-full rounded-lg bg-slate-900 px-5 py-3 text-center text-white hover:bg-slate-800 sm:w-auto"
          >
            Modifier
          </Link>
        </div>
      </div>
    </div>
  );
}

