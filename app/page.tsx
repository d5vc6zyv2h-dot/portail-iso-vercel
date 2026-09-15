import Link from "next/link";
import {
  ShieldCheck,
  ClipboardList,
  AlertTriangle,
  Wrench,
  FileText,
  ArrowRight,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100">

      {/* En-tête */}
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">

          <Link href="/" className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-slate-800" />

            <span className="font-bold text-xl text-slate-800">
              Portail ISO 27001
            </span>
          </Link>

          <nav className="flex items-center gap-6">

            <Link
              href="/aide"
              className="text-gray-600 hover:text-slate-900"
            >
              Aide
            </Link>

            <Link
              href="/contact"
              className="text-gray-600 hover:text-slate-900"
            >
              Contact
            </Link>

            <Link
              href="/login"
              className="bg-slate-900 text-white px-5 py-2.5 rounded-lg hover:bg-slate-800"
            >
              Se connecter
            </Link>

          </nav>
        </div>
      </header>

      {/* Présentation */}
      <main>

        <section className="max-w-6xl mx-auto px-6 py-20">

          <div className="max-w-3xl">

            <p className="text-sm font-semibold text-slate-600 mb-4">
              SÉCURITÉ DE L'INFORMATION
            </p>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
              Portail web d'analyse des risques selon ISO 27001
            </h1>

            <p className="text-lg text-gray-600 leading-8 mt-6">
              Une plateforme permettant aux organisations d'identifier,
              d'évaluer et de traiter leurs risques liés à la sécurité
              de l'information.
            </p>

            <div className="mt-8 flex items-center gap-4">

              <Link
                href="/login"
                className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-800"
              >
                Accéder au portail
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/aide"
                className="px-6 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              >
                En savoir plus
              </Link>

            </div>

          </div>

        </section>

        {/* Fonctionnement */}
        <section className="bg-white border-y">

          <div className="max-w-6xl mx-auto px-6 py-16">

            <div className="text-center mb-10">

              <h2 className="text-2xl font-bold text-gray-800">
                Comment fonctionne le portail ?
              </h2>

              <p className="text-gray-500 mt-2">
                Un processus simple pour analyser et gérer les risques.
              </p>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

              <div className="border rounded-xl p-6">
                <ClipboardList className="w-8 h-8 text-slate-700 mb-4" />

                <h3 className="font-semibold text-gray-800 mb-2">
                  Questionnaire
                </h3>

                <p className="text-sm text-gray-500 leading-6">
                  Collecte des informations nécessaires à l'évaluation
                  de la sécurité.
                </p>
              </div>

              <div className="border rounded-xl p-6">
                <AlertTriangle className="w-8 h-8 text-slate-700 mb-4" />

                <h3 className="font-semibold text-gray-800 mb-2">
                  Analyse
                </h3>

                <p className="text-sm text-gray-500 leading-6">
                  Identification des risques et calcul de leur criticité.
                </p>
              </div>

              <div className="border rounded-xl p-6">
                <Wrench className="w-8 h-8 text-slate-700 mb-4" />

                <h3 className="font-semibold text-gray-800 mb-2">
                  Traitement
                </h3>

                <p className="text-sm text-gray-500 leading-6">
                  Définition des mesures permettant de réduire les risques.
                </p>
              </div>

              <div className="border rounded-xl p-6">
                <FileText className="w-8 h-8 text-slate-700 mb-4" />

                <h3 className="font-semibold text-gray-800 mb-2">
                  Rapport
                </h3>

                <p className="text-sm text-gray-500 leading-6">
                  Génération d'un rapport permettant de suivre les résultats.
                </p>
              </div>

            </div>

          </div>

        </section>

        {/* Sécurité */}
        <section className="max-w-6xl mx-auto px-6 py-16">

          <div className="bg-slate-900 text-white rounded-2xl p-10">

            <div className="max-w-3xl">

              <h2 className="text-2xl font-bold">
                Une approche orientée sécurité
              </h2>

              <p className="text-slate-300 leading-7 mt-4">
                Le portail intègre une gestion des rôles et des
                permissions, un journal d'audit et des mécanismes
                cryptographiques permettant de garantir l'intégrité
                des activités enregistrées.
              </p>

            </div>

          </div>

        </section>

      </main>

      {/* Pied de page */}
      <footer className="bg-white border-t">

        <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">

          <p className="text-sm text-gray-500">
            © 2026 Portail ISO 27001
          </p>

          <div className="flex gap-5 text-sm">

            <Link
              href="/aide"
              className="text-gray-500 hover:text-gray-800"
            >
              Aide
            </Link>

            <Link
              href="/contact"
              className="text-gray-500 hover:text-gray-800"
            >
              Contact
            </Link>

          </div>

        </div>

      </footer>

    </div>
  );
}
