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
      { rel: "icon", type: "image/svg+xml", href: "/favicon-uploaded.svg?v=20261009-3" },
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
