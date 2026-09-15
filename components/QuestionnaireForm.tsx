"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

type Question = {
  id: number;
  texte: string;
  categorie: string;
};

type QuestionnaireProps = {
  questions: Question[];
};

export default function QuestionnaireForm({
  questions,
}: QuestionnaireProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [evaluationCommencee, setEvaluationCommencee] =
    useState(false);

  const [evaluationId, setEvaluationId] =
    useState<number | null>(null);

  const [reponses, setReponses] =
    useState<Record<number, string>>({});

  const [details, setDetails] =
    useState<Record<number, string>>({});

  const [enregistrement, setEnregistrement] =
    useState(false);

  const [demarrage, setDemarrage] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [erreur, setErreur] =
    useState("");

  const [resultat, setResultat] = useState<{
    evaluationId: number;
    score: number;
    niveau: string;
    nombreRisques: number;
  } | null>(null);

  const [modeModification, setModeModification] =
    useState(false);

  async function nouvelleEvaluation() {
    setDemarrage(true);
    setErreur("");
    setMessage("");

    try {
      const response = await fetch(
        "/api/evaluations/nouvelle",
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setErreur(
          data.error ||
            "Impossible de créer une nouvelle évaluation."
        );
        return;
      }

      setEvaluationId(data.evaluationId);

      setReponses({});
      setDetails({});

      setResultat(null);
      setModeModification(false);

      setEvaluationCommencee(true);

      setMessage(
        "Nouvelle évaluation créée. Vous pouvez maintenant répondre aux questions."
      );
    } catch {
      setErreur(
        "Impossible de contacter le serveur."
      );
    } finally {
      setDemarrage(false);
    }
  }

  useEffect(() => {
    if (
      searchParams.get("nouvelle") === "1" &&
      !evaluationCommencee &&
      !demarrage
    ) {
      nouvelleEvaluation();
    }
  }, [searchParams]);

  function choisirReponse(
    questionId: number,
    reponse: string
  ) {
    setReponses((anciennes) => ({
      ...anciennes,
      [questionId]: reponse,
    }));
  }

  function modifierDetails(
    questionId: number,
    texte: string
  ) {
    setDetails((anciens) => ({
      ...anciens,
      [questionId]: texte,
    }));
  }

  const nombreReponses =
    Object.keys(reponses).length;

  const nombreRestant =
    questions.length - nombreReponses;

  const complet =
    nombreReponses === questions.length;

  async function enregistrerEvaluation() {
    if (!evaluationId) {
      setErreur(
        "Veuillez d'abord commencer une nouvelle évaluation."
      );
      return;
    }

    if (!complet) {
      setErreur(
        "Il reste " +
          nombreRestant +
          " question" +
          (nombreRestant > 1 ? "s" : "") +
          " à répondre."
      );
      return;
    }

    setEnregistrement(true);
    setErreur("");
    setMessage("");

    try {
      const donnees = questions.map(
        (question, index) => ({
          questionId: question.id,
          choix: reponses[question.id],
          details:
            details[question.id] || "",
          ordre: index + 1,
        })
      );

      const modification =
        resultat !== null &&
        modeModification;

      const url = modification
        ? `/api/evaluations/${resultat.evaluationId}`
        : `/api/evaluations/${evaluationId}`;

      const response = await fetch(
        url,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            reponses: donnees,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        setErreur(
          data.error ||
            "Une erreur est survenue."
        );
        return;
      }

      const idEvaluation =
        data.evaluationId ||
        evaluationId;

      const analyseResponse =
        await fetch(
          `/api/evaluations/${idEvaluation}/risques`,
          {
            method: "POST",
          }
        );

      const analyseData =
        await analyseResponse.json();

      if (!analyseResponse.ok) {
        setErreur(
          analyseData.error ||
            "L'évaluation est enregistrée, mais l'analyse des risques a échoué."
        );
        return;
      }

      setResultat({
        evaluationId:
          idEvaluation,
        score: data.score,
        niveau: data.niveau,
        nombreRisques:
          analyseData.nombreRisques,
      });

      setModeModification(false);

      setMessage(
        modification
          ? "Vos réponses ont été modifiées et les risques ont été recalculés."
          : "Votre évaluation a été enregistrée et analysée avec succès."
      );
    } catch {
      setErreur(
        "Impossible de contacter le serveur."
      );
    } finally {
      setEnregistrement(false);
    }
  }

  function modifierEvaluation() {
    setModeModification(true);
    setMessage("");
    setErreur("");
  }

  if (!evaluationCommencee) {
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center sm:p-8">
          <h3 className="text-xl font-bold text-gray-800">
            Nouvelle évaluation
          </h3>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-500">
            Vous devez commencer une nouvelle
            évaluation avant de pouvoir répondre
            au questionnaire.
          </p>

          {erreur && (
            <p className="mx-auto mt-4 max-w-xl rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {erreur}
            </p>
          )}

          <button
            type="button"
            onClick={nouvelleEvaluation}
            disabled={demarrage}
            className={`mt-5 rounded-lg px-6 py-3 text-sm font-medium text-white ${
              demarrage
                ? "cursor-not-allowed bg-gray-400"
                : "bg-slate-800 hover:bg-slate-700"
            }`}
          >
            {demarrage
              ? "Création..."
              : "Commencer une nouvelle évaluation"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-slate-50 p-4">
        <p className="text-sm text-gray-600">
          Répondez à toutes les questions avant
          d'enregistrer l'évaluation.
        </p>
      </div>

      {questions.map(
        (question, index) => (
          <div
            key={question.id}
            className={`rounded-xl border p-4 sm:p-5 ${
              resultat &&
              !modeModification
                ? "border-gray-200 bg-gray-50"
                : "border-gray-200"
            }`}
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
              <span className="font-semibold text-gray-700">
                Question {index + 1}
              </span>

              <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                {question.categorie}
              </span>
            </div>

            <p className="mt-3 text-sm leading-6 text-gray-800 sm:text-base">
              {question.texte}
            </p>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                "Oui",
                "Partiellement",
                "Non",
              ].map((choix) => (
                <label
                  key={choix}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 ${
                    reponses[
                      question.id
                    ] === choix
                      ? "border-slate-700 bg-slate-100"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={choix}
                    checked={
                      reponses[
                        question.id
                      ] === choix
                    }
                    onChange={() =>
                      choisirReponse(
                        question.id,
                        choix
                      )
                    }
                    disabled={
                      resultat !== null &&
                      !modeModification
                    }
                    className="h-4 w-4"
                  />

                  <span className="text-sm font-medium text-gray-700">
                    {choix}
                  </span>
                </label>
              ))}
            </div>

            <div className="mt-4">
              <label
                htmlFor={`details-${question.id}`}
                className="text-sm font-medium text-gray-700"
              >
                Précisions / observations
              </label>

              <textarea
                id={`details-${question.id}`}
                rows={3}
                value={
                  details[
                    question.id
                  ] || ""
                }
                onChange={(e) =>
                  modifierDetails(
                    question.id,
                    e.target.value
                  )
                }
                disabled={
                  resultat !== null &&
                  !modeModification
                }
                placeholder="Ajoutez une précision si nécessaire..."
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 disabled:bg-gray-100"
              />
            </div>
          </div>
        )
      )}

      {resultat &&
        !modeModification && (
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h3 className="text-xl font-bold text-gray-800">
              Résultat de l'évaluation
            </h3>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-500">
                  Score moyen
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-800">
                  {resultat.score.toFixed(2)}
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-500">
                  Niveau
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-800">
                  {resultat.niveau}
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-500">
                  Risques identifiés
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-800">
                  {resultat.nombreRisques}
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-lg bg-green-50 p-4">
              <p className="text-sm font-medium text-green-800">
                Conclusion
              </p>

              <p className="mt-2 text-sm leading-6 text-green-700">
                {resultat.niveau ===
                "Faible"
                  ? "Les mesures de sécurité évaluées présentent globalement un niveau satisfaisant."
                  : resultat.niveau ===
                      "Moyen"
                    ? "L'évaluation révèle plusieurs mesures de sécurité qui nécessitent des améliorations."
                    : "L'évaluation révèle plusieurs faiblesses importantes qui nécessitent des actions prioritaires."}
              </p>
            </div>

            {message && (
              <p className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                {message}
              </p>
            )}

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={modifierEvaluation}
                className="rounded-lg bg-slate-800 px-5 py-3 text-sm font-medium text-white hover:bg-slate-700"
              >
                Modifier mes réponses
              </button>

              <button
                type="button"
                onClick={nouvelleEvaluation}
                disabled={demarrage}
                className="rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {demarrage
                  ? "Création..."
                  : "Nouvelle évaluation"}
              </button>

              <button
                type="button"
                onClick={() =>
                  router.push(
                    `/risques?evaluation=${resultat.evaluationId}`
                  )
                }
                className="rounded-lg bg-slate-700 px-5 py-3 text-sm font-medium text-white hover:bg-slate-600"
              >
                Voir l'analyse des risques →
              </button>
            </div>
          </div>
        )}

      {(!resultat ||
        modeModification) && (
        <div className="border-t pt-5">
          {!complet && (
            <p className="mb-3 text-sm text-orange-600">
              Il reste{" "}
              {nombreRestant} question
              {nombreRestant > 1
                ? "s"
                : ""}{" "}
              à répondre.
            </p>
          )}

          {complet && (
            <p className="mb-3 text-sm text-green-600">
              Toutes les questions ont été
              répondues.
            </p>
          )}

          {erreur && (
            <p className="mb-3 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {erreur}
            </p>
          )}

          {message && (
            <p className="mb-3 rounded-lg bg-green-50 p-3 text-sm text-green-700">
              {message}
            </p>
          )}

          <button
            type="button"
            onClick={enregistrerEvaluation}
            disabled={
              !complet ||
              enregistrement
            }
            className={`w-full rounded-lg px-5 py-3 text-sm font-medium text-white sm:w-auto ${
              complet &&
              !enregistrement
                ? "bg-slate-800 hover:bg-slate-700"
                : "cursor-not-allowed bg-gray-400"
            }`}
          >
            {enregistrement
              ? "Analyse en cours..."
              : modeModification
                ? "Enregistrer les modifications"
                : "Enregistrer l'évaluation"}
          </button>
        </div>
      )}
    </div>
  );
}
