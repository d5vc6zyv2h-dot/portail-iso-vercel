import Link from "next/link";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-100">

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

      <main className="max-w-md mx-auto px-6 py-12">

        <div className="bg-white rounded-xl border p-8">

          <div className="text-center mb-8">
            <ShieldCheck className="w-10 h-10 mx-auto text-slate-700 mb-3" />

            <h1 className="text-2xl font-bold text-gray-800">
              Créer un compte
            </h1>

            <p className="text-gray-500 mt-2">
              Créez votre compte pour accéder au portail.
            </p>
          </div>

          <form className="space-y-5">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom complet
              </label>

              <input
                type="text"
                placeholder="Votre nom complet"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-slate-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse e-mail
              </label>

              <input
                type="email"
                placeholder="votre@email.com"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-slate-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>

              <input
                type="password"
                placeholder="Votre mot de passe"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-slate-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmer le mot de passe
              </label>

              <input
                type="password"
                placeholder="Confirmez votre mot de passe"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-slate-700"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-slate-800"
            >
              Créer mon compte
            </button>

          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
              Vous avez déjà un compte ?
            </p>

            <Link
              href="/login"
              className="text-sm font-medium text-slate-800 hover:underline"
            >
              Se connecter
            </Link>
          </div>

        </div>

      </main>

    </div>
  );
}
