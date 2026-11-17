import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  FileHeart,
  Scale,
  ShieldPlus,
  TrendingUp,
  Check,
  MessageCircle,
  Phone,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeadForm } from "@/components/lead-form";
import { pageHead } from "@/components/site-shell";
import { buildWhatsAppUrl, WHATSAPP_DISPLAY } from "@/lib/quote";

export const Route = createFileRoute("/asesoria")({
  head: () =>
    pageHead(
      "Asesoría Independiente 100% Gratuita",
      "Solicita orientación gratuita sobre cómo optimizar tu 7% legal de salud, tabla de factores, cargas familiares, GES y comparación de planes.",
    ),
  component: Page,
});

const topics = [
  {
    icon: TrendingUp,
    title: "Optimización de tu 7% al subir tu sueldo",
    text: "Cuando sube tu renta imponible, tu cotización legal del 7% aumenta automáticamente. Sin embargo, si no actualizas ni comparas tu plan, sigues con las mismas coberturas antiguas. Te ayudamos a transformar ese 7% en un plan superior ajustado a tu presupuesto.",
  },
  {
    icon: Scale,
    title: "Tabla de Factores y Cargas Familiares",
    text: "El precio final de un plan depende del valor base en UF, los factores aplicables a cada integrante del grupo familiar y el cargo GES. Te explicamos el desglose oficial para que elijas la alternativa más conveniente para ti y tu familia.",
  },
  {
    icon: FileHeart,
    title: "Declaración de Salud y Continuidad",
    text: "Para evaluar un cambio de plan o de institución es fundamental conocer cómo opera la declaración de salud y los plazos legales, cuidando siempre la continuidad de tus coberturas. Por seguridad, no envíes diagnósticos médicos en formularios web.",
  },
  {
    icon: ShieldPlus,
    title: "Redes Clínicas, GES y CAEC",
    text: "Comparamos cómo bonifica cada alternativa en las clínicas de tu preferencia (tanto en atención hospitalaria como ambulatoria) y cómo operan las Garantías Explícitas en Salud (GES) y la Cobertura Adicional para Enfermedades Catastróficas (CAEC).",
  },
];

function Page() {
  const [topic, setTopic] = useState(0);
  const current = topics[topic];
  if (!current) return null;

  const waHref = buildWhatsAppUrl(
    "Hola, estoy en la sección de Asesoría y quiero orientación independiente 100% gratuita para optimizar mi plan de salud.",
  );

  return (
    <>
      <section className="page-heading">
        <div className="site-container">
          <span className="eyebrow-pill mb-4">
            <Sparkles size={13} /> ASESORÍA INDEPENDIENTE · 100% GRATUITA
          </span>
          <h1>
            Una mejor cobertura para tu 7% comienza
            <br className="hidden sm:block" /> con una conversación honesta.
          </h1>
          <p className="section-subtitle max-w-2xl">
            Si subió tu sueldo, cambió tu realidad familiar o sientes que tu plan actual no rinde lo
            que pagas, te orientamos gratis y sin compromiso.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="site-container grid lg:grid-cols-[0.95fr_1.05fr] gap-12 items-start">
          <div>
            <p className="eyebrow">CLARIDAD EN CADA PASO</p>
            <h2 className="section-title mt-2">¿Qué evaluamos en tu asesoría gratuita?</h2>
            <p className="section-subtitle mb-6">
              Selecciona un tema para conocer cómo te ayudamos a tomar una decisión informada:
            </p>

            <div className="flex flex-wrap gap-2">
              {topics.map((t, i) => (
                <Button
                  key={t.title}
                  variant={topic === i ? "default" : "outline"}
                  onClick={() => setTopic(i)}
                  className={`text-xs font-bold ${
                    topic === i
                      ? "bg-[#12056E] hover:bg-[#1B0994] text-white"
                      : "border-[#12056E]/25 text-[#12056E]"
                  }`}
                >
                  <t.icon size={15} className="text-[#E91E8C]" />
                  {t.title}
                </Button>
              ))}
            </div>

            <div className="mt-6 rounded-2xl bg-[#F6F5FF] border-l-6 border-[#E91E8C] p-6">
              <h3 className="font-extrabold text-lg text-[#12056E]">{current.title}</h3>
              <p className="text-sm text-[#0A033C]/85 leading-7 mt-2">{current.text}</p>
            </div>

            <div className="text-xs sm:text-sm space-y-3.5 mt-8">
              {[
                "Asesoría independiente 100% gratuita de principio a fin",
                "Enfocada en obtener la máxima cobertura por tu 7% o presupuesto",
                "Tú eliges el canal y horario de contacto, sin obligación de contratar",
              ].map((t) => (
                <p key={t} className="flex items-center gap-2.5 font-semibold text-[#0A033C]">
                  <Check size={17} className="text-[#E91E8C] shrink-0" />
                  {t}
                </p>
              ))}
            </div>

            <div className="mt-8 rounded-2xl bg-gradient-to-r from-[#12056E] to-[#1B0994] text-white p-6 shadow-lg">
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#F01E8E]">
                ATENCIÓN DIRECTA POR WHATSAPP
              </p>
              <p className="text-xl font-extrabold mt-1 flex items-center gap-2">
                <Phone size={18} className="text-[#F01E8E]" /> {WHATSAPP_DISPLAY}
              </p>
              <p className="text-xs text-white/85 mt-2 leading-5">
                Escríbenos directamente para resolver tus dudas en minutos y evaluar qué planes se
                ajustan mejor a tu 7%.
              </p>
              <a
                href={waHref}
                target="_blank"
                rel="noreferrer"
                className="btn-magenta mt-4 !text-xs"
              >
                <MessageCircle size={16} />
                Hablar ahora por WhatsApp ({WHATSAPP_DISPLAY})
              </a>
            </div>
          </div>

          <div className="border-2 border-[#12056E]/15 rounded-3xl p-6 md:p-8 bg-white shadow-xl">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#E91E8C]">
              SOLICITUD DE EVALUACIÓN PERSONALIZADA
            </span>
            <h2 className="text-2xl font-extrabold text-[#12056E] mt-1 mb-2">
              Hablemos de tu plan ideal
            </h2>
            <p className="text-xs text-[#0A033C]/75 mb-6">
              Completa tus datos básicos o envía tu resumen directamente a nuestro WhatsApp{" "}
              <strong>{WHATSAPP_DISPLAY}</strong>.
            </p>
            <LeadForm />
          </div>
        </div>
      </section>
    </>
  );
}
