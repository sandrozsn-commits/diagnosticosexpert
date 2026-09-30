import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { LearningReportView } from "@/components/learning-report";
import { useProgress } from "@/lib/progress";

export const Route = createFileRoute("/_authenticated/relatorio/$resultId")({
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { title: "Relatório de aprendizagem — TiraDefeito Expert" },
      {
        name: "description",
        content: "Revisão técnica de uma ocorrência concluída no TiraDefeito Expert.",
      },
    ],
  }),
  component: LearningReportPage,
});

function LearningReportPage() {
  const { resultId } = Route.useParams();
  const { user } = Route.useRouteContext();
  const { progress } = useProgress(user.id);
  const result = progress.results.find((item) => item.id === resultId);

  return (
    <AppShell>
      <Link
        to="/progresso"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground print:hidden"
      >
        <ArrowLeft className="size-4" />
        Voltar para Progresso
      </Link>

      {!result ? (
        <div className="rounded-xl border border-border p-6 text-sm text-muted-foreground">
          Carregando relatório…
        </div>
      ) : !result.report ? (
        <div className="rounded-xl border border-border p-6">
          <h1 className="text-xl font-semibold">Relatório não disponível</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Esta tentativa foi realizada antes da implantação dos relatórios de aprendizagem.
            Conclua novamente a ocorrência para gerar um relatório completo.
          </p>
        </div>
      ) : (
        <LearningReportView report={result.report} />
      )}
    </AppShell>
  );
}
