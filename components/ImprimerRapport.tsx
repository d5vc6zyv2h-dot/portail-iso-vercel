"use client";

export default function ImprimerRapport() {
  return (
    <div className="mb-6 print:hidden">
      <button
        type="button"
        onClick={() => window.print()}
        className="rounded-lg bg-slate-800 px-5 py-3 text-sm font-medium text-white hover:bg-slate-700"
      >
        Enregistrer en PDF
      </button>
    </div>
  );
}
