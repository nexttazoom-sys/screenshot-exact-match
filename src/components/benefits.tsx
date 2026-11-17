import {
  Building2,
  HeartPulse,
  ShieldPlus,
  TrendingUp,
  Users,
  MessageCircle,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { buildWhatsAppUrl, WHATSAPP_DISPLAY } from "@/lib/quote";

const benefits = [
  {
    icon: TrendingUp,
    title: "Optimización real de tu 7% legal",
    text: "Si subió tu sueldo, tu 7% obligatorio también subió. Analizamos ese nuevo monto para que se traduzca en mejor cobertura real y no en pagar de más por el mismo plan antiguo.",
    tag: "Máxima cobertura por tu presupuesto",
    accent: true,
  },
  {
    icon: Building2,
    title: "Comparación imparcial de clínicas y redes",
    text: "Revisamos alternativas preferentes, libre elección y cerradas según las clínicas y centros médicos donde tú y tu familia realmente se atienden.",
    tag: "Santiago y todas las regiones",
    accent: false,
  },
  {
    icon: HeartPulse,
    title: "Mejor cobertura hospitalaria y ambulatoria",
    text: "Buscamos el equilibrio ideal entre consultas, exámenes, urgencias, maternidad y hospitalización, cuidando los topes de bonificación.",
    tag: "Sin letra chica ni sorpresas",
    accent: false,
  },
  {
    icon: Users,
    title: "Evaluación para ti y tus cargas familiares",
    text: "Estudiamos cómo impacta la Tabla de Factores y el valor GES en tu grupo familiar para proteger a quienes más quieres con un presupuesto bien ajustado.",
    tag: "Planes individuales y familiares",
    accent: false,
  },
  {
    icon: MessageCircle,
    title: "Atención ágil y directa por WhatsApp",
    text: `Resolvemos tus dudas de forma humana, rápida y sin tecnicismos directamente en el ${WHATSAPP_DISPLAY}, en el horario que más te acomode.`,
    tag: `Contacto directo ${WHATSAPP_DISPLAY}`,
    accent: true,
  },
  {
    icon: ShieldPlus,
    title: "Acompañamiento 100% gratuito y continuo",
    text: "Te orientamos antes, durante y después de elegir tu plan, incluyendo el entendimiento de garantías GES, cobertura catastrófica CAEC y plazos.",
    tag: "Asesoría sin costo para ti",
    accent: false,
  },
];

export function Benefits({ full = false }: { full?: boolean }) {
  const waHref = buildWhatsAppUrl(
    "Hola, quiero asesoría independiente 100% gratuita para revisar mi 7% y conseguir la mejor cobertura posible.",
  );

  return (
    <section className="section">
      <div className="site-container">
        <div className="text-center max-w-3xl mx-auto">
          <p className="eyebrow">POR QUÉ ASESORARTE CON NOSOTROS</p>
          <h2 className="section-title mt-3">
            Una asesoría independiente pensada para ti,{" "}
            <span className="text-[#E91E8C]">100% gratuita.</span>
          </h2>
          <p className="section-subtitle">
            Cada persona y familia tiene una realidad distinta. Nuestro objetivo es que obtengas la{" "}
            <strong>mejor cobertura posible por tu presupuesto</strong>, especialmente cuando sube
            tu renta y aumenta tu 7% legal.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-11">
          {benefits.map((b) => (
            <article
              key={b.title}
              className={`benefit-card flex flex-col justify-between ${
                b.accent ? "border-[#E91E8C]/35 bg-[#F6F5FF]/60" : ""
              }`}
            >
              <div>
                <span className={`icon-tile ${b.accent ? "icon-tile-magenta" : ""}`}>
                  <b.icon size={24} />
                </span>
                <h3 className="font-extrabold text-base text-[#0A033C] mt-5">{b.title}</h3>
                <p className="text-[#0A033C]/80 text-xs leading-6 mt-3">{b.text}</p>
              </div>
              <p className="text-[#12056E] font-extrabold text-xs flex items-center gap-2 mt-6 pt-4 border-t border-border">
                <span className="h-2 w-2 rounded-full bg-[#E91E8C]" />
                {b.tag}
              </p>
            </article>
          ))}
        </div>

        {full && (
          <div className="mt-14 space-y-10">
            <div className="rounded-3xl bg-gradient-to-br from-[#12056E] to-[#1B0994] text-white p-7 md:p-11 shadow-xl">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <span className="eyebrow-pill">EL SECRETO DE TU 7% DE SALUD</span>
                  <h3 className="text-2xl md:text-3xl font-extrabold mt-4 leading-tight">
                    Si sube tu sueldo, sube tu 7%… pero tu plan no mejora solo.
                  </h3>
                  <p className="text-white/85 text-sm leading-7 mt-4">
                    En Chile, tu cotización obligatoria de salud corresponde al 7% de tu renta
                    imponible (hasta el tope legal). Cuando recibes un aumento de sueldo o cambias a
                    un mejor trabajo, tu descuento del 7% sube automáticamente mes a mes. Sin
                    embargo, si mantienes un plan antiguo o mal ajustado, podrías estar aportando
                    más dinero sin recibir mejores bonificaciones ni acceso a mejores clínicas.
                  </p>
                </div>

                <div className="grid gap-4">
                  <div className="bg-white/10 border border-white/20 rounded-2xl p-5">
                    <p className="text-xs font-extrabold uppercase tracking-wider text-[#F01E8E] flex items-center gap-2">
                      <AlertCircle size={16} /> Sin revisar tu plan de salud
                    </p>
                    <p className="text-xs text-white/90 leading-6 mt-2">
                      Tu 7% sube con tu sueldo, pero conservas los mismos topes antiguos, la misma
                      red limitada o un plan desactualizado frente a las necesidades actuales de tu
                      familia.
                    </p>
                  </div>

                  <div className="bg-white text-[#0A033C] rounded-2xl p-5 border-l-6 border-[#E91E8C] shadow-lg">
                    <p className="text-xs font-extrabold uppercase tracking-wider text-[#12056E] flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-[#E91E8C]" /> Con nuestra Asesoría
                      100% Gratuita
                    </p>
                    <p className="text-xs text-[#0A033C]/85 leading-6 mt-2">
                      Evaluamos tu nuevo 7% y comparamos opciones para que cada peso de tu
                      cotización se convierta en la{" "}
                      <strong>mejor cobertura hospitalaria, ambulatoria y clínica posible</strong>.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
                <p className="text-xs text-white/85">
                  ¿Quieres saber qué cobertura real puedes alcanzar hoy con tu 7%? Escríbenos al{" "}
                  <strong className="text-[#F01E8E]">{WHATSAPP_DISPLAY}</strong>.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-magenta !text-xs"
                  >
                    <MessageCircle size={16} />
                    Hablar por WhatsApp ({WHATSAPP_DISPLAY})
                  </a>
                  <Link to="/" className="btn-white-outline !text-xs">
                    Simular mi 7% ahora <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
