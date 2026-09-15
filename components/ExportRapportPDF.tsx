"use client";

type Props = {
  evaluationId: number;
};

export default function ExportRapportPDF({
  evaluationId,
}: Props) {
  function exporterPDF() {
    window.open(
      `/rapports/${evaluationId}/impression`,
      "_blank"
    );
  }

  return (
    <button
      type="button"
      onClick={exporterPDF}
      className="print:hidden rounded-lg bg-slate-800 px-5 py-3 text-sm font-medium text-white hover:bg-slate-700"
    >
      Exporter en PDF
    </button>
  );
}
