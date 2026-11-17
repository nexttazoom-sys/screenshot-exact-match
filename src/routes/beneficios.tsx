import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, MessageCircle } from "lucide-react";
import { Benefits } from "@/components/benefits";
import { pageHead } from "@/components/site-shell";
import { buildWhatsAppUrl, WHATSAPP_DISPLAY } from "@/lib/quote";

export const Route = createFileRoute("/beneficios")({
  head: () =>
    pageHead(
      "Optimiza tu 7% y Coberturas de Salud",
      "Descubre por qué cuando sube tu sueldo y aumenta tu 7% legal conviene evaluar tu plan con asesoría independiente 100% gratuita.",
    ),
  component: Page,
});

function Page() {
  const waHref = buildWhatsAppUrl(
    "Hola, quiero asesoría independiente 100% gratuita para evaluar mis coberturas y aprovechar mejor mi 7%.",
  );

  return (
    <>
      <section className="page-heading">
        <div className="site-container">
          <span className="eyebrow-pill mb-4">
            <Sparkles size={13} /> ASESORÍA INDEPENDIENTE · 100% GRATUITA
          </span>
          <h1>Haz que tu 7% de salud te entregue la mejor cobertura posible.</h1>
          <p className="section-subtitle max-w-2xl">
            Si subió tu sueldo, tu 7% legal también subió. Te ayudamos gratis a revisar redes
            preferentes, bonificaciones hospitalarias y ambulatorias para que tu presupuesto rinda
            al máximo.
          </p>
          <div className="mt-6">
            <a href={waHref} target="_blank" rel="noreferrer" className="btn-magenta !text-xs">
              <MessageCircle size={16} />
              Consultar gratis por WhatsApp ({WHATSAPP_DISPLAY})
            </a>
          </div>
        </div>
      </section>
      <Benefits full />
    </>
  );
}
