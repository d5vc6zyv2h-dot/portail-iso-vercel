import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export default async function ProfilPage() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  const utilisateur = await prisma.user.findUnique({
    where: {
      id: session.userId,
    },
  });

  if (!utilisateur) {
    return null;
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      {/* En-tête */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 sm:text-3xl">
          Profil
        </h2>

        <p className="mt-2 text-sm text-gray-500 sm:text-base">
          Informations de votre compte.
        </p>
      </div>

      {/* Informations du compte */}
      <div className="mt-6 w-full overflow-hidden rounded-xl border bg-white shadow-sm sm:mt-8">
        <div className="border-b p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-800 sm:text-xl">
            Informations du compte
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-5 p-4 sm:gap-6 sm:p-6 md:grid-cols-2">
          <div>
            <p className="text-sm text-gray-500">
              Nom complet
            </p>

            <p className="mt-1 break-words font-medium text-gray-800">
              {utilisateur.name}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Adresse e-mail
            </p>

            <p className="mt-1 break-all font-medium text-gray-800">
              {utilisateur.email}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Rôle
            </p>

            <span className="mt-1 inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
              {utilisateur.role}
            </span>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Date de création
            </p>

            <p className="mt-1 font-medium text-gray-800">
              {new Date(utilisateur.createdAt).toLocaleDateString(
                "fr-FR"
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
