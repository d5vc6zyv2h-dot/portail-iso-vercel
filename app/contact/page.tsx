import Link from "next/link";
import { ShieldCheck, ArrowLeft, Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
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
      <main className="max-w-6xl mx-auto px-6 py-12">

        {/* Présentation */}
        <section className="text-center max-w-3xl mx-auto mb-12">

          <ShieldCheck className="w-12 h-12 mx-auto text-slate-700 mb-4" />

          <h1 className="text-3xl font-bold text-gray-800">
            À propos de notre équipe
          </h1>

          <p className="text-gray-600 leading-7 mt-4">
            Nous sommes une équipe d'étudiants en informatique qui développe
            une solution web dédiée à l'analyse et à la gestion des risques
            liés à la sécurité de l'information.
          </p>

          <p className="text-gray-600 leading-7 mt-3">
            Notre objectif est de proposer un portail simple permettant aux
            organisations d'identifier leurs risques, d'évaluer leur
            criticité, de définir des mesures de traitement et de suivre
            leurs activités de sécurité conformément aux principes de
            l'ISO 27001.
          </p>

        </section>

        {/* Informations + formulaire */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Informations */}
          <section className="bg-white rounded-xl border p-7">

            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Nous contacter
            </h2>

            <div className="space-y-6">

              <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 text-slate-700 mt-1" />
                <div>
                  <p className="font-medium text-gray-800">
                    E-mail
                  </p>
                  <p className="text-gray-500">
                    contact@portail-iso27001.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="w-5 h-5 text-slate-700 mt-1" />
                <div>
                  <p className="font-medium text-gray-800">
                    Téléphone
                  </p>
                  <p className="text-gray-500">
                    +243 XX XXX XX XX
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-slate-700 mt-1" />
                <div>
                  <p className="font-medium text-gray-800">
                    Localisation
                  </p>
                  <p className="text-gray-500">
                    Kinshasa, République démocratique du Congo
                  </p>
                </div>
              </div>

            </div>

            <div className="mt-8 pt-6 border-t">
              <p className="text-sm text-gray-500 leading-6">
                Vous souhaitez en savoir plus sur le portail, son
                fonctionnement ou son utilisation dans votre organisation ?
                N'hésitez pas à nous contacter.
              </p>
            </div>

          </section>

          {/* Formulaire */}
          <section className="bg-white rounded-xl border p-7">

            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Envoyer une demande
            </h2>

            <form className="space-y-5">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de l'organisation
                </label>

                <input
                  type="text"
                  placeholder="Nom de votre organisation"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse e-mail
                </label>

                <input
                  type="email"
                  placeholder="exemple@organisation.com"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Votre demande
                </label>

                <textarea
                  rows={5}
                  placeholder="Décrivez votre demande..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-slate-700"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-slate-800"
              >
                Envoyer la demande
              </button>

            </form>

          </section>

        </div>

        {/* Liens */}
        <div className="text-center mt-10">

          <p className="text-gray-500 mb-3">
            Besoin d'aide pour comprendre le fonctionnement du portail ?
          </p>

          <Link
            href="/aide"
            className="text-slate-800 font-medium hover:underline"
          >
            Consulter la page d'aide
          </Link>

        </div>

      </main>

    </div>
  );
}

