import Link from "next/link";
import { ShieldCheck, ArrowLeft, HelpCircle } from "lucide-react";

export default function AidePage() {
  return (
    <div className="min-h-screen bg-gray-100">

      {/* En-tête public */}
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">

          <Link href="/" className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-slate-800" />
            <span className="font-bold text-xl text-slate-800">
              Portail ISO 27001
            </span>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </Link>

        </div>
      </header>

      {/* Contenu */}
      <main className="max-w-5xl mx-auto px-6 py-12">

        <div className="text-center mb-10">
          <HelpCircle className="w-12 h-12 mx-auto text-slate-700 mb-4" />

          <h1 className="text-3xl font-bold text-gray-800">
            Aide
          </h1>

          <p className="text-gray-500 mt-3">
            Découvrez comment utiliser le Portail ISO 27001.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              À quoi sert le portail ?
            </h2>

            <p className="text-gray-600 leading-7">
              Le Portail ISO 27001 permet d'identifier, d'analyser et
              de traiter les risques liés à la sécurité de l'information
              au sein d'une organisation.
            </p>
          </div>

          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Comment commencer ?
            </h2>

            <p className="text-gray-600 leading-7">
              Créez un compte ou connectez-vous afin d'accéder aux
              fonctionnalités d'analyse des risques et de gestion
              de la sécurité.
            </p>
          </div>

          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Analyse des risques
            </h2>

            <p className="text-gray-600 leading-7">
              Le questionnaire permet de recueillir les informations
              nécessaires pour identifier les risques et calculer leur
              niveau de criticité.
            </p>
          </div>

          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Rapports et suivi
            </h2>

            <p className="text-gray-600 leading-7">
              Les résultats peuvent être consultés et regroupés dans
              des rapports afin de faciliter le suivi des mesures
              de traitement des risques.
            </p>
          </div>

        </div>

        <div className="mt-8 rounded-xl border bg-white p-6 shadow-sm">
  <h3 className="text-lg font-semibold text-gray-800">
    Besoin d'informations supplémentaires ?
  </h3>

  <p className="mt-2 text-sm leading-6 text-gray-600">
    Pour toute question concernant le portail, son utilisation ou
    une demande de démonstration, vous pouvez nous contacter à
    l'adresse suivante :
  </p>

  <a
    href="mailto:jordantshitshi@icloud.com"
    className="mt-4 inline-block font-semibold text-blue-600 hover:underline"
  >
    jordantshitshi@icloud.com
  </a>
</div>

      </main>

    </div>
  );
}
