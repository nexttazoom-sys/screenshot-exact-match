import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, MessageCircle } from "lucide-react";
import { Benefits } from "@/components/benefits";
import { pageHead } from "@/components/site-shell";
import { buildWhatsAppUrl, WHATSAPP_DISPLAY } from "@/lib/quote";

export const Route = createFileRoute("/beneficios")({
  head: () =>
    pageHead(
      "Comparador de Planes y Beneficios de cada Isapre",
      "Compara planes de salud lado a lado y conoce los beneficios de Colmena, Banmédica, Consalud, CruzBlanca, Nueva Masvida, Vida Tres y Esencial.",
    ),
  component: Page,
});

function Page() {
  const waHref = buildWhatsAppUrl(
    "Hola, estoy viendo el comparador de Isapres y quiero asesoría gratuita para elegir la mejor opción para mi familia.",
  );

  return (
    <>
      <section className="page-heading">
        <div className="site-container">
          <span className="eyebrow-pill mb-4">
            <Sparkles size={13} /> COMPARADOR E INFORMACIÓN CLARA
          </span>
          <h1>Compara planes y conoce los beneficios de cada Isapre.</h1>
          <p className="section-subtitle max-w-2xl">
            Revisa lado a lado qué tipo de cobertura se adapta mejor a tu hogar y descubre las
            fortalezas de cada Isapre en Chile para aprovechar al máximo tu 7%.
          </p>
          <div className="mt-6">
            <a href={waHref} target="_blank" rel="noreferrer" className="btn-magenta !text-xs">
              <MessageCircle size={16} />
              Pedir comparativa por WhatsApp ({WHATSAPP_DISPLAY})
            </a>
          </div>
        </div>
      </section>
      <Benefits full />
    </>
  );
}
