import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Central de Ocorrências — Diagnóstico em Comandos Elétricos" },
      { name: "description", content: "Assuma chamados técnicos reais de manutenção industrial e desenvolva seu raciocínio de diagnóstico em comandos elétricos." },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "Central de Ocorrências — Diagnóstico em Comandos Elétricos" },
      { property: "og:description", content: "Assuma chamados técnicos reais de manutenção industrial e desenvolva seu raciocínio de diagnóstico em comandos elétricos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "Central de Ocorrências — Diagnóstico em Comandos Elétricos" },
      { name: "twitter:description", content: "Assuma chamados técnicos reais de manutenção industrial e desenvolva seu raciocínio de diagnóstico em comandos elétricos." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/17a0fee7-e470-4f92-9939-74629ca290cd/id-preview-d90648cc--89691bfa-9e6e-4b9d-bfb6-c8d94d9599c2.lovable.app-1785258847726.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/17a0fee7-e470-4f92-9939-74629ca290cd/id-preview-d90648cc--89691bfa-9e6e-4b9d-bfb6-c8d94d9599c2.lovable.app-1785258847726.png" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon-uploaded.svg?v=20261009-2" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "data:image/png;base64,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", type: "image/png" },
    ],

  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function LovableBadgeGuard() {
  useEffect(() => {
    const removeLovableBadge = () => {
      const candidates = document.querySelectorAll<HTMLElement>(
        '#lovable-badge, [data-lovable-badge], [class*="lovable-badge"], a[href*="lovable.dev"], a[href*="lovable.app"]',
      );

      candidates.forEach((element) => {
        const text = (element.textContent || "").toLowerCase();
        const aria = (element.getAttribute("aria-label") || "").toLowerCase();
        const id = (element.id || "").toLowerCase();
        const className = (element.getAttribute("class") || "").toLowerCase();

        const isLovableBadge =
          id.includes("lovable-badge") ||
          className.includes("lovable-badge") ||
          text.includes("made with lovable") ||
          text.includes("feito com lovable") ||
          aria.includes("made with lovable") ||
          aria.includes("feito com lovable");

        if (isLovableBadge) element.remove();
      });
    };

    removeLovableBadge();

    const observer = new MutationObserver(removeLovableBadge);
    observer.observe(document.documentElement, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return null;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <LovableBadgeGuard />
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
