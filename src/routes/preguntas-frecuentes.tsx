import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { pageHead } from "@/components/site-shell";
import { buildWhatsAppUrl, WHATSAPP_DISPLAY } from "@/lib/quote";

export const Route = createFileRoute("/preguntas-frecuentes")({
  head: () =>
    pageHead(
      "Preguntas frecuentes sobre tu 7% y Planes de Salud",
      "Resuelve tus dudas sobre qué pasa cuando sube tu sueldo y tu 7% legal, cómo comparar planes de salud y cómo funciona nuestra asesoría 100% gratuita.",
    ),
  component: Page,
});

const faqs = [
  [
    "¿Qué pasa con mi plan de salud cuando sube mi sueldo y aumenta mi 7% legal?",
    "En Chile, tu cotización legal obligatoria corresponde al 7% de tu renta imponible (hasta el tope legal vigente). Cuando aumenta tu sueldo, ese 7% sube automáticamente en pesos, pero tu plan de salud no mejora sus coberturas por sí solo. Evaluar tu plan con asesoría gratuita te permite aprovechar ese nuevo presupuesto para acceder a mejores bonificaciones y clínicas.",
  ],
  [
    "¿La asesoría es realmente 100% gratuita y sin compromiso?",
    "Sí, nuestra asesoría es 100% gratuita para ti, de principio a fin. No tiene ningún costo adicional ni te obliga a cambiarte de plan. Nuestro objetivo es presentarte opciones claras según tu presupuesto y necesidades reales para que decidas con total tranquilidad.",
  ],
  [
    "¿Cómo puedo solicitar asesoría rápida por WhatsApp?",
    `Puedes escribirnos directamente al ${WHATSAPP_DISPLAY} haciendo clic en cualquiera de los botones de WhatsApp del sitio, o completar el formulario con tu nombre, teléfono, renta aproximada, cargas y duda principal para abrir el chat con tu resumen listo.`,
  ],
  [
    "¿Cómo influyen mis cargas familiares y la Tabla de Factores en el valor del plan?",
    "El valor total de un plan se calcula combinando el precio base en UF, el factor etario correspondiente a cada beneficiario según la Tabla de Factores oficial vigente y el valor GES por persona. En nuestra asesoría revisamos el costo total real para tu grupo familiar completo.",
  ],
  [
    "¿Qué diferencia hay entre un plan preferente, libre elección y cerrado?",
    "Un plan con red preferente ofrece bonificaciones destacadas en clínicas específicas; un plan de libre elección te permite atenderte en cualquier clínica o centro médico según los topes del arancel; y un plan cerrado concentra su cobertura en prestadores determinados a un valor generalmente más acotado. Te ayudamos a elegir según dónde te atiendes tú y tu familia.",
  ],
  [
    "¿Los valores del simulador web son ofertas definitivas?",
    "No. El simulador web utiliza escenarios ilustrativos para ayudarte a estimar tu 7% mensual y comparar niveles de cobertura referenciales. Durante la asesoría gratuita te entregamos comparativas reales con planes vigentes, redes clínicas y condiciones oficiales.",
  ],
];

function Page() {
  const waHref = buildWhatsAppUrl(
    "Hola, leí las preguntas frecuentes y tengo una consulta para optimizar mi plan de salud con asesoría gratuita.",
  );

  return (
    <>
      <section className="page-heading">
        <div className="site-container">
          <span className="eyebrow-pill mb-4">
            <Sparkles size={13} /> INFORMACIÓN CLARA Y TRANSPARENTE
          </span>
          <h1>Tus preguntas sobre el 7% y planes de salud, respondidas sin letra chica.</h1>
          <p className="section-subtitle max-w-2xl">
            Todo lo que necesitas saber antes de elegir o actualizar tu plan de salud con nuestra
            asesoría independiente 100% gratuita.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="site-container max-w-4xl">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map(([q, a], i) => (
              <AccordionItem
                value={String(i)}
                key={q}
                className="border border-[#12056E]/15 rounded-2xl px-6 bg-white shadow-xs"
              >
                <AccordionTrigger className="text-left py-5 text-sm sm:text-base font-extrabold text-[#12056E] hover:text-[#E91E8C]">
                  {q}
                </AccordionTrigger>
                <AccordionContent className="text-[#0A033C]/80 text-xs sm:text-sm leading-7 pb-5">
                  {a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="rounded-3xl bg-gradient-to-br from-[#12056E] to-[#1B0994] text-white p-8 md:p-10 text-center mt-12 shadow-xl">
            <span className="eyebrow-pill mb-3">¿TE QUEDÓ ALGUNA DUDA?</span>
            <h2 className="text-2xl font-extrabold mt-2">
              Resolvemos tu caso directamente por WhatsApp
            </h2>
            <p className="text-xs sm:text-sm text-white/85 mt-2 max-w-xl mx-auto leading-6">
              Escríbenos al <strong className="text-[#F01E8E]">{WHATSAPP_DISPLAY}</strong> o
              solicita tu evaluación gratuita para comparar opciones reales con tu presupuesto.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <a href={waHref} target="_blank" rel="noreferrer" className="btn-magenta !text-xs">
                <MessageCircle size={16} />
                Preguntar por WhatsApp ({WHATSAPP_DISPLAY})
              </a>
              <Link to="/asesoria" className="btn-white-outline !text-xs">
                Ir al formulario de asesoría <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
