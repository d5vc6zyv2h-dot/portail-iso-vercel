
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import ImprimerRapport from "@/components/ImprimerRapport";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function RapportImpressionPage({
  params,
}: Props) {
  const session = await getSession();

  if (!session) {
    return null;
  }

  const { id } = await params;
  const evaluationId = Number(id);

  if (!Number.isInteger(evaluationId)) {
    notFound();
  }

  const evaluation = await prisma.evaluation.findFirst({
    where: {
      id: evaluationId,
      ...(session.role === "Administrateur" ||
      session.role === "Responsable sécurité" ||
      session.role === "Auditeur"
        ? {}
        : {
            userId: session.userId,
          }),
      supprimee: false,
      statut: "terminee",
    },
    include: {
      user: true,
      risques: {
        include: {
          mesures: true,
        },
        orderBy: {
          criticite: "desc",
        },
      },
    },
  });

  if (!evaluation) {
    notFound();
  }

  const auditEvaluation = await prisma.auditLog.findFirst({
    where: {
      userId: evaluation.userId,
      description: {
        contains: `#${evaluationId}`,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const risquesEleves = evaluation.risques.filter(
    (risque) => risque.niveau === "Élevé"
  );

  const risquesMoyens = evaluation.risques.filter(
    (risque) => risque.niveau === "Moyen"
  );

  const risquesFaibles = evaluation.risques.filter(
    (risque) => risque.niveau === "Faible"
  );

  const risquesPrioritaires = evaluation.risques
    .filter(
      (risque) =>
        risque.niveau === "Élevé" ||
        risque.criticite !== null
    )
    .slice(0, 8);

  const mesures = evaluation.risques.flatMap((risque) =>
    risque.mesures.map((mesure) => ({
      risque: risque.titre,
      mesure,
    }))
  );

  return (
    <main className="rapport-impression">
      <ImprimerRapport />

      <header className="rapport-header">
        <div>
          <div className="rapport-marque">
            PORTAIL ISO 27001
          </div>

          <h1>Rapport d'évaluation des risques</h1>

          <p className="rapport-sous-titre">
            Synthèse de l'analyse de sécurité de l'information
          </p>
        </div>

        <div className="rapport-reference">
          <div>
            <span>Évaluation</span>
            <strong>#{evaluation.id}</strong>
          </div>

          <div>
            <span>Date</span>
            <strong>
              {evaluation.createdAt.toLocaleDateString(
                "fr-FR"
              )}
            </strong>
          </div>
        </div>
      </header>

      <section className="rapport-section">
        <div className="section-titre">
          <span className="section-numero">01</span>
          <h2>Informations générales</h2>
        </div>

        <div className="info-grid">
          <div className="info-item">
            <span>Évaluation</span>
            <strong>
              Évaluation n°{evaluation.id}
            </strong>
          </div>

          <div className="info-item">
            <span>Utilisateur</span>
            <strong>
              {evaluation.user?.name ?? "Utilisateur supprimé"}
            </strong>
          </div>

          <div className="info-item">
            <span>Date de réalisation</span>
            <strong>
              {evaluation.createdAt.toLocaleDateString(
                "fr-FR"
              )}
            </strong>
          </div>

          <div className="info-item">
            <span>Statut</span>
            <strong>Terminée</strong>
          </div>
        </div>
      </section>

      <section className="rapport-section">
        <div className="section-titre">
          <span className="section-numero">02</span>
          <h2>Synthèse de l'évaluation</h2>
        </div>

        <div className="synthese-grid">
          <div className="synthese-card">
            <span>Score global</span>
            <strong>
              {evaluation.score !== null
                ? evaluation.score.toFixed(2)
                : "—"}
            </strong>
          </div>

          <div className="synthese-card">
            <span>Niveau global</span>
            <strong>
              {evaluation.niveau || "—"}
            </strong>
          </div>

          <div className="synthese-card">
            <span>Risques identifiés</span>
            <strong>
              {evaluation.risques.length}
            </strong>
          </div>

          <div className="synthese-card">
            <span>Risques élevés</span>
            <strong>
              {risquesEleves.length}
            </strong>
          </div>
        </div>

        <div className="constat">
          <h3>Constat général</h3>

          <p>
            L'évaluation a permis d'identifier{" "}
            <strong>
              {evaluation.risques.length}
            </strong>{" "}
            risque(s) affectant la sécurité de
            l'information. Parmi ceux-ci,{" "}
            <strong>{risquesEleves.length}</strong>{" "}
            présente(nt) un niveau élevé,{" "}
            <strong>{risquesMoyens.length}</strong>{" "}
            un niveau moyen et{" "}
            <strong>{risquesFaibles.length}</strong>{" "}
            un niveau faible.
          </p>
        </div>
      </section>

      <section className="rapport-section">
        <div className="section-titre">
          <span className="section-numero">03</span>
          <h2>Risques prioritaires</h2>
        </div>

        {risquesPrioritaires.length === 0 ? (
          <div className="message-vide">
            Aucun risque n'a été identifié.
          </div>
        ) : (
          <table className="rapport-table">
            <thead>
              <tr>
                <th>Risque</th>
                <th>Prob.</th>
                <th>Impact</th>
                <th>Criticité</th>
                <th>Niveau</th>
              </tr>
            </thead>

            <tbody>
              {risquesPrioritaires.map((risque) => (
                <tr key={risque.id}>
                  <td>
                    <strong>{risque.titre}</strong>

                    {risque.description && (
                      <small>
                        {risque.description}
                      </small>
                    )}
                  </td>

                  <td className="centre">
                    {risque.probabilite ?? "—"}
                  </td>

                  <td className="centre">
                    {risque.impact ?? "—"}
                  </td>

                  <td className="centre criticite">
                    {risque.criticite ?? "—"}
                  </td>

                  <td className="centre">
                    {risque.niveau || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="rapport-section">
        <div className="section-titre">
          <span className="section-numero">04</span>
          <h2>Plan de traitement</h2>
        </div>

        {mesures.length === 0 ? (
          <div className="message-vide">
            Aucun plan de traitement n'a été enregistré.
          </div>
        ) : (
          <table className="rapport-table">
            <thead>
              <tr>
                <th>Risque</th>
                <th>Mesure</th>
                <th>Responsable</th>
                <th>Priorité</th>
                <th>Échéance</th>
                <th>Statut</th>
              </tr>
            </thead>

            <tbody>
              {mesures.map(({ risque, mesure }) => (
                <tr key={mesure.id}>
                  <td>
                    <strong>{risque}</strong>
                  </td>

                  <td>{mesure.description}</td>

                  <td>
                    {mesure.responsable || "—"}
                  </td>

                  <td>
                    {mesure.priorite || "—"}
                  </td>

                  <td>
                    {mesure.echeance
                      ? mesure.echeance.toLocaleDateString(
                          "fr-FR"
                        )
                      : "—"}
                  </td>

                  <td>{mesure.statut}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="rapport-section">
        <div className="section-titre">
          <span className="section-numero">05</span>
          <h2>Conclusion</h2>
        </div>

        <div className="conclusion">
          <p>
            {evaluation.conclusion ||
              "Aucune conclusion n'a été enregistrée pour cette évaluation."}
          </p>
        </div>
      </section>

      <section className="rapport-tracabilite">
        <div>
          <strong>Portail ISO 27001</strong>

          <span>
            Rapport généré à partir de l'évaluation #
            {evaluation.id}
          </span>

          <span>
            Réalisée par :{" "}
            {evaluation.user?.name ?? "Utilisateur supprimé"}
          </span>

          <span>
            Date :{" "}
            {evaluation.createdAt.toLocaleDateString(
              "fr-FR"
            )}
          </span>
        </div>

        <div className="signature-rapport">
          <strong>Signature numérique</strong>

          <code>
            {auditEvaluation?.signature ||
              "Signature non disponible"}
          </code>

          <span>
            Document signé automatiquement par le
            Portail ISO 27001.
          </span>
        </div>
      </section>
    </main>
  );
}

