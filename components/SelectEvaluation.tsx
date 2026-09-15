
"use client";

type Evaluation = {
  id: number;
  user: {
    name: string;
  } | null;
  createdAt: Date;
};

type Props = {
  evaluations: Evaluation[];
  selectedId: number;
  destination: "risques" | "traitements";
};

export default function SelectEvaluation({
  evaluations,
  selectedId,
  destination,
}: Props) {
  return (
    <select
      value={String(selectedId)}
      onChange={(event) => {
        window.location.href =
          `/${destination}?evaluation=${event.target.value}`;
      }}
      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 sm:max-w-xl"
    >
      {evaluations.map((evaluation) => (
        <option
          key={evaluation.id}
          value={evaluation.id}
        >
          Évaluation #{evaluation.id} —{" "}
          {evaluation.user?.name ?? "Utilisateur supprimé"} —{" "}
          {evaluation.createdAt.toLocaleDateString("fr-FR")}
        </option>
      ))}
    </select>
  );
}

