import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect } from "react";

import { Header, Footer } from "@/components/site-shell";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-[#12056E]">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Página no encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          La página que buscas no existe o fue movida.
        </p>
        <div className="mt-6">
          <Link to="/" className="btn-magenta">
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  const router = useRouter();
  useEffect(() => {
    console.error("[AppErrorBoundary]", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          No pudimos cargar esta página
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Ocurrió un inconveniente temporal. Puedes intentar nuevamente o volver al inicio.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="btn-magenta !py-2 !px-4 !text-xs"
          >
            Reintentar
          </button>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full border border-input bg-background px-4 py-2 text-xs font-bold text-foreground transition-colors hover:bg-accent"
          >
            Ir al inicio
          </Link>
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
      { title: "Victoria Yañez Asesorías | Asesoría Independiente en Salud 100% Gratuita" },
      {
        name: "description",
        content:
          "Victoria Yañez Asesorías: asesoría independiente 100% gratuita para elegir y optimizar tu plan de salud en Chile. Si sube tu sueldo, sube tu 7%: obtén la mejor cobertura por tu presupuesto. WhatsApp +56 9 4000 9671.",
      },
      { property: "og:title", content: "Victoria Yañez Asesorías | Planes de Salud e Isapres" },
      {
        property: "og:description",
        content:
          "Optimiza tu 7% legal de salud y consigue la mejor cobertura posible para ti y tu familia. Contacto directo +56 9 4000 9671.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#12056E" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "./favicon.svg" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "./favicon-32x32.png" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "./favicon-16x16.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "./apple-touch-icon.png" },
      { rel: "manifest", href: "./site.webmanifest" },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <HeadContent />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </QueryClientProvider>
  );
}
