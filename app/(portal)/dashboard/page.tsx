import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const nombreUtilisateurs = await prisma.user.count();

  const nombreRisques = await prisma.risque.count({
  where: {
    evaluation: {
      supprimee: false,
      rapport: {
        is: {
          supprimee: false,
        },
      },
    },
  },
});

  const nombreRapports = await prisma.rapport.count({
    where: {
      supprimee: false,
    },
  });

  return (
    <div className="p-4 sm:p-6 md:p-8">
      {/* En-tête */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 sm:text-3xl">
          Tableau de bord
        </h2>

        <p className="mt-2 text-sm text-gray-500 sm:text-base">
          Vue d'ensemble du portail ISO 27001.
        </p>
      </div>

      {/* Cartes */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-2 lg:grid-cols-3">
        {/* Utilisateurs */}
        <div className="rounded-xl border bg-white p-5 shadow-sm sm:p-6">
          <p className="text-sm font-medium text-gray-500">
            Nombre d'utilisateurs
          </p>

          <p className="mt-3 text-3xl font-bold text-gray-800">
            {nombreUtilisateurs}
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Utilisateurs enregistrés
          </p>
        </div>

        {/* Risques */}
        <div className="rounded-xl border bg-white p-5 shadow-sm sm:p-6">
          <p className="text-sm font-medium text-gray-500">
            Nombre de risques
          </p>

          <p className="mt-3 text-3xl font-bold text-gray-800">
            {nombreRisques}
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Risques analysés
          </p>
        </div>

        {/* Rapports */}
        <div className="rounded-xl border bg-white p-5 shadow-sm sm:p-6">
          <p className="text-sm font-medium text-gray-500">
            Nombre de rapports
          </p>

          <p className="mt-3 text-3xl font-bold text-gray-800">
            {nombreRapports}
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Rapports disponibles
          </p>
        </div>
      </div>
    </div>
  );
}
