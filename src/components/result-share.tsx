import { useRef, useState } from "react";
import { Copy, Check, Download, Share2 } from "lucide-react";

export type ResultData = {
  occurrenceCode: string;
  title: string;
  category: string;
  difficulty: string;
  equipment: string;
  system: string;
  seconds: number;
  actions: number;
  mistakes: number;
  xp: number;
  accuracy: number;
  percentile: number;
  statusLine: string;
};

export function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}min${String(s).padStart(2, "0")}s` : `${s}s`;
}

/** Índice interno determinístico de desempenho; não representa percentil populacional real. */
export function performancePercentile(seconds: number, estimatedMinutes: number, mistakes: number) {
  const target = Math.max(estimatedMinutes, 1) * 60;
  const ratio = seconds / target;
  let p = 96 - (ratio - 0.4) * 70;
  p -= mistakes * 7;
  return Math.max(12, Math.min(97, Math.round(p)));
}

export function statusPhrase(seconds: number, score: number) {
  return `Diagnóstico concluído em ${formatDuration(seconds)} • índice de desempenho técnico ${score}/100`;
}

const CARD_W = 1080;
const CARD_H = 1350;
const PANEL = "#111c31";
const PRIMARY = "#0877bd";
const ORANGE = "#ec7c00";
const TEXT = "#f8fafc";
const MUTED = "#94a3b8";

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines = 3) {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, maxLines);
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function drawCard(canvas: HTMLCanvasElement, data: ResultData) {
  const ctx = canvas.getContext("2d")!;
  canvas.width = CARD_W;
  canvas.height = CARD_H;

  const grad = ctx.createLinearGradient(0, 0, CARD_W, CARD_H);
  grad.addColorStop(0, "#07111f");
  grad.addColorStop(0.58, "#0b1729");
  grad.addColorStop(1, "#10233d");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  ctx.strokeStyle = "rgba(148,163,184,0.06)";
  ctx.lineWidth = 1;
  for (let i = 60; i < CARD_W; i += 60) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, CARD_H);
    ctx.stroke();
  }
  for (let i = 60; i < CARD_H; i += 60) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(CARD_W, i);
    ctx.stroke();
  }

  // Cabeçalho da marca
  ctx.fillStyle = "#ffffff";
  roundRect(ctx, 64, 56, CARD_W - 128, 150, 26);
  ctx.fill();

  try {
    const logo = await loadImage("/academia-eletricista-logo.svg");
    const ratio = logo.width / logo.height || 1.9;
    const h = 92;
    const w = h * ratio;
    ctx.drawImage(logo, 88, 84, w, h);
  } catch {
    ctx.fillStyle = ORANGE;
    ctx.font = "800 42px Inter, system-ui, sans-serif";
    ctx.fillText("AE", 92, 145);
  }

  ctx.fillStyle = "#0f172a";
  ctx.font = "700 34px Inter, system-ui, sans-serif";
  ctx.fillText("TiraDefeito Expert", 310, 116);
  ctx.fillStyle = "#475569";
  ctx.font = "500 21px Inter, system-ui, sans-serif";
  ctx.fillText("By Academia do Eletricista", 310, 151);
  ctx.fillStyle = PRIMARY;
  ctx.font = "600 18px Inter, system-ui, sans-serif";
  ctx.fillText("Diagnóstico em Comandos Elétricos", 310, 180);

  // Identificação
  ctx.fillStyle = ORANGE;
  ctx.font = "700 23px 'JetBrains Mono', ui-monospace, monospace";
  ctx.fillText(`OCORRÊNCIA ${data.occurrenceCode} • CONCLUÍDA`, 72, 286);

  ctx.fillStyle = TEXT;
  ctx.font = "700 50px Inter, system-ui, sans-serif";
  const titleLines = wrap(ctx, data.title, CARD_W - 144, 3);
  titleLines.forEach((line, index) => ctx.fillText(line, 72, 354 + index * 58));

  const detailsY = 354 + titleLines.length * 58 + 18;
  ctx.fillStyle = MUTED;
  ctx.font = "500 22px Inter, system-ui, sans-serif";
  ctx.fillText(`${data.category} • ${data.difficulty}`, 72, detailsY);
  ctx.fillText(data.system, 72, detailsY + 36);
  ctx.fillText(data.equipment, 72, detailsY + 72);

  // Métricas principais
  const metricsY = detailsY + 124;
  const metrics = [
    ["Tempo", formatDuration(data.seconds)],
    ["Precisão", `${data.accuracy}%`],
    ["Ações", String(data.actions)],
    ["Erros", String(data.mistakes)],
  ];
  const gap = 18;
  const bw = (CARD_W - 144 - gap * 3) / 4;
  metrics.forEach(([label, value], index) => {
    const x = 72 + index * (bw + gap);
    ctx.fillStyle = PANEL;
    roundRect(ctx, x, metricsY, bw, 142, 22);
    ctx.fill();
    ctx.strokeStyle = "rgba(148,163,184,0.18)";
    ctx.stroke();

    ctx.fillStyle = MUTED;
    ctx.font = "500 18px Inter, system-ui, sans-serif";
    ctx.fillText(label, x + 20, metricsY + 42);

    ctx.fillStyle = TEXT;
    ctx.font = "700 38px Inter, system-ui, sans-serif";
    ctx.fillText(value, x + 20, metricsY + 98);
  });

  // Desempenho
  const scoreY = metricsY + 180;
  ctx.fillStyle = "rgba(8,119,189,0.15)";
  roundRect(ctx, 72, scoreY, CARD_W - 144, 170, 24);
  ctx.fill();
  ctx.strokeStyle = "rgba(8,119,189,0.55)";
  ctx.stroke();

  ctx.fillStyle = PRIMARY;
  ctx.font = "700 22px Inter, system-ui, sans-serif";
  ctx.fillText("DESEMPENHO TÉCNICO", 104, scoreY + 43);

  ctx.fillStyle = TEXT;
  ctx.font = "700 58px Inter, system-ui, sans-serif";
  ctx.fillText(`${data.percentile}/100`, 104, scoreY + 112);

  ctx.fillStyle = MUTED;
  ctx.font = "500 22px Inter, system-ui, sans-serif";
  ctx.fillText(`XP ganho: +${data.xp}`, 380, scoreY + 92);
  ctx.fillText("Resultado baseado nesta tentativa", 380, scoreY + 126);

  // Mensagem de aprendizado
  const learningY = scoreY + 210;
  ctx.fillStyle = "rgba(236,124,0,0.10)";
  roundRect(ctx, 72, learningY, CARD_W - 144, 180, 24);
  ctx.fill();
  ctx.strokeStyle = "rgba(236,124,0,0.45)";
  ctx.stroke();

  ctx.fillStyle = ORANGE;
  ctx.font = "700 21px Inter, system-ui, sans-serif";
  ctx.fillText("TREINAMENTO CONCLUÍDO", 104, learningY + 44);

  ctx.fillStyle = TEXT;
  ctx.font = "600 29px Inter, system-ui, sans-serif";
  wrap(
    ctx,
    "Ocorrência revisada com relatório de aprendizagem, evidências e raciocínio técnico.",
    CARD_W - 208,
    3,
  ).forEach((line, index) => ctx.fillText(line, 104, learningY + 92 + index * 38));

  ctx.fillStyle = MUTED;
  ctx.font = "500 20px Inter, system-ui, sans-serif";
  ctx.fillText("TiraDefeito Expert • Academia do Eletricista", 72, CARD_H - 76);
  ctx.textAlign = "right";
  ctx.fillText("Treinamento prático em comandos elétricos", CARD_W - 72, CARD_H - 76);
  ctx.textAlign = "left";
}

export function ResultShare({ data, caseUrl }: { data: ResultData; caseUrl: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  async function buildBlob() {
    const canvas = canvasRef.current!;
    await drawCard(canvas, data);
    setPreview(canvas.toDataURL("image/png"));
    return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
  }

  async function share() {
    setBusy(true);
    try {
      const blob = await buildBlob();
      if (!blob) return;
      const file = new File([blob], `tiradefeito-${data.occurrenceCode}.png`, { type: "image/png" });
      const nav = navigator as Navigator & { canShare?: (shareData: ShareData) => boolean };
      if (nav.canShare?.({ files: [file] })) {
        await nav.share({
          files: [file],
          title: "TiraDefeito Expert",
          text: `${data.occurrenceCode} concluída • ${data.accuracy}% de precisão`,
        });
      } else {
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = file.name;
        anchor.click();
        URL.revokeObjectURL(url);
      }
    } catch {
      /* usuário cancelou o compartilhamento */
    } finally {
      setBusy(false);
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(caseUrl);
    } catch {
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={share}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          <Share2 className="size-4" /> {busy ? "Gerando card…" : "Compartilhar resultado"}
        </button>
        <button
          onClick={copyLink}
          className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm transition-colors hover:bg-secondary"
        >
          {copied ? <Check className="size-4 text-success" /> : <Copy className="size-4" />}
          {copied ? "Link copiado" : "Copiar link da ocorrência"}
        </button>
      </div>

      <canvas ref={canvasRef} className="hidden" aria-hidden />

      {preview && (
        <div className="mt-4">
          <p className="text-xs text-muted-foreground">
            Card vertical (1080×1350) com identidade do TiraDefeito Expert.
          </p>
          <img
            src={preview}
            alt={`Card de resultado da ocorrência ${data.occurrenceCode}`}
            className="mt-2 w-full max-w-xs rounded-xl border border-border"
          />
          <a
            href={preview}
            download={`tiradefeito-${data.occurrenceCode}.png`}
            className="mt-2 inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <Download className="size-4" /> Baixar imagem
          </a>
        </div>
      )}
    </div>
  );
}
