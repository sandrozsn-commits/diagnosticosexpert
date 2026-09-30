import { useRef, useState } from "react";
import { Copy, Check, Download, Share2 } from "lucide-react";

export type ResultData = {
  occurrenceCode: string;
  title: string;
  system: string;
  seconds: number;
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

const CARD = 1080;
const BG = "#0b1220";
const PANEL = "#111c31";
const PRIMARY = "#3b82f6";
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
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else line = test;
  }
  if (line) lines.push(line);
  return lines.slice(0, maxLines);
}

function drawCard(canvas: HTMLCanvasElement, data: ResultData) {
  const ctx = canvas.getContext("2d")!;
  canvas.width = CARD;
  canvas.height = CARD;

  const grad = ctx.createLinearGradient(0, 0, CARD, CARD);
  grad.addColorStop(0, "#0b1220");
  grad.addColorStop(0.55, "#0e1a2f");
  grad.addColorStop(1, "#132446");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CARD, CARD);

  // grade técnica de fundo
  ctx.strokeStyle = "rgba(148,163,184,0.07)";
  ctx.lineWidth = 1;
  for (let i = 60; i < CARD; i += 60) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, CARD);
    ctx.moveTo(0, i);
    ctx.lineTo(CARD, i);
    ctx.stroke();
  }

  // marca
  ctx.fillStyle = PRIMARY;
  roundRect(ctx, 80, 80, 72, 72, 18);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.moveTo(126, 96);
  ctx.lineTo(100, 122);
  ctx.lineTo(114, 122);
  ctx.lineTo(106, 138);
  ctx.lineTo(132, 110);
  ctx.lineTo(118, 110);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = TEXT;
  ctx.font = "600 34px Inter, system-ui, sans-serif";
  ctx.fillText("Laboratório de Diagnóstico", 172, 116);
  ctx.fillStyle = MUTED;
  ctx.font = "400 24px Inter, system-ui, sans-serif";
  ctx.fillText("Comandos Elétricos Industriais", 172, 150);

  // ocorrência
  ctx.fillStyle = PRIMARY;
  ctx.font = "600 24px 'JetBrains Mono', ui-monospace, monospace";
  ctx.fillText(`OCORRÊNCIA ${data.occurrenceCode} • ENCERRADA`, 80, 262);

  ctx.fillStyle = TEXT;
  ctx.font = "700 54px Inter, system-ui, sans-serif";
  wrap(ctx, data.title, CARD - 160, 3).forEach((l, i) => ctx.fillText(l, 80, 336 + i * 64));

  ctx.fillStyle = MUTED;
  ctx.font = "400 26px Inter, system-ui, sans-serif";
  ctx.fillText(data.system, 80, 540);

  // métricas
  const metrics = [
    ["Tempo total", formatDuration(data.seconds)],
    ["Erros", String(data.mistakes)],
    ["XP ganho", `+${data.xp}`],
  ];
  const bw = (CARD - 160 - 40) / 3;
  metrics.forEach(([label, value], i) => {
    const x = 80 + i * (bw + 20);
    ctx.fillStyle = PANEL;
    roundRect(ctx, x, 580, bw, 160, 24);
    ctx.fill();
    ctx.strokeStyle = "rgba(148,163,184,0.18)";
    ctx.stroke();
    ctx.fillStyle = MUTED;
    ctx.font = "500 22px Inter, system-ui, sans-serif";
    ctx.fillText(label, x + 26, 626);
    ctx.fillStyle = i === 2 ? PRIMARY : TEXT;
    ctx.font = "700 52px Inter, system-ui, sans-serif";
    ctx.fillText(value, x + 26, 700);
  });

  // frase de status
  ctx.fillStyle = "rgba(59,130,246,0.12)";
  roundRect(ctx, 80, 780, CARD - 160, 160, 24);
  ctx.fill();
  ctx.strokeStyle = "rgba(59,130,246,0.4)";
  ctx.stroke();
  ctx.fillStyle = TEXT;
  ctx.font = "600 34px Inter, system-ui, sans-serif";
  wrap(ctx, data.statusLine, CARD - 220, 3).forEach((l, i) => ctx.fillText(l, 116, 836 + i * 46));

  ctx.fillStyle = MUTED;
  ctx.font = "400 24px Inter, system-ui, sans-serif";
  ctx.fillText(`Precisão ${data.accuracy}% • diagnóstico em comandos elétricos`, 80, 1000);
}

export function ResultShare({ data, caseUrl }: { data: ResultData; caseUrl: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  async function buildBlob() {
    const canvas = canvasRef.current!;
    drawCard(canvas, data);
    setPreview(canvas.toDataURL("image/png"));
    return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
  }

  async function share() {
    setBusy(true);
    try {
      const blob = await buildBlob();
      if (!blob) return;
      const file = new File([blob], `ocorrencia-${data.occurrenceCode}.png`, { type: "image/png" });
      const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
      if (nav.canShare?.({ files: [file] })) {
        await nav.share({ files: [file], title: "Laboratório de Diagnóstico", text: data.statusLine });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = file.name;
        a.click();
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
          <Share2 className="size-4" /> Compartilhar resultado
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
            Card quadrado (1080×1080) pronto para Instagram e Status do WhatsApp.
          </p>
          <img
            src={preview}
            alt={`Card de resultado da ocorrência ${data.occurrenceCode}`}
            className="mt-2 w-full max-w-xs rounded-xl border border-border"
          />
          <a
            href={preview}
            download={`ocorrencia-${data.occurrenceCode}.png`}
            className="mt-2 inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <Download className="size-4" /> Baixar imagem
          </a>
        </div>
      )}
    </div>
  );
}
