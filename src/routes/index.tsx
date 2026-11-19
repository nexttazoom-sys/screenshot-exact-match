import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  Check,
  ShieldCheck,
  Heart,
  LockKeyhole,
  Clock3,
  BadgeCheck,
  MessageCircle,
  Sparkles,
  TrendingUp,
  PhoneCall,
  Star,
  SlidersHorizontal,
} from "lucide-react";
import family from "@/assets/familia-salud.jpg";
import { Benefits } from "@/components/benefits";
import { QuoteFields, QuoteWizard } from "@/components/quote-wizard";
import { LeadForm } from "@/components/lead-form";
import {
  buildAdvisoryWhatsAppUrl,
  buildWhatsAppUrl,
  defaultQuote,
  money,
  quoteSchema,
  WHATSAPP_DISPLAY,
} from "@/lib/quote";
import { pageHead, VictoriaYanezLogo } from "@/components/site-shell";

export const Route = createFileRoute("/")({
  head: () =>
    pageHead(
      "Asesoría Independiente 100% Gratuita en Planes de Salud",
      "Victoria Yañez Asesorías: protege a tu familia y optimiza tu 7% de salud en Chile. Compara Banmédica, CruzBlanca, Nueva Masvida, Colmena, Consalud, Vida Tres y Esencial gratis.",
    ),
  component: Index,
});

const processSteps = [
  {
    n: "1",
    title: "Conversemos sobre tu familia",
    text: `Cuéntanos por formulario o WhatsApp (${WHATSAPP_DISPLAY}) quiénes integran tu hogar y en qué clínicas prefieren atenderse.`,
  },
  {
    n: "2",
    title: "Revisamos cómo rinde tu 7%",
    text: "Calculamos tu cotización legal actual para ver si un aumento de sueldo te permite acceder a un plan superior sin pagar de más.",
  },
  {
    n: "3",
    title: "Comparamos todas las Isapres",
    text: "Contrastamos lado a lado las mejores opciones en Colmena, Banmédica, Consalud, CruzBlanca, Nueva Masvida, Vida Tres y Esencial.",
  },
  {
    n: "4",
    title: "Eliges con calma y respaldo gratuito",
    text: "Te explicamos cada alternativa en simple y te acompañamos sin costo en todo el proceso.",
  },
];

const testimonials = [
  {
    initials: "MJ",
    name: "María José R.",
    profile: "Mamá de 2 niños · Santiago",
    quote:
      "Buscábamos buena cobertura pediátrica sin descuidar el presupuesto de la casa. Nos mostraron cómo nuestro 7% alcanzaba para una clínica mucho mejor.",
  },
  {
    initials: "RP",
    name: "Rodrigo P.",
    profile: "Actualizó su plan tras ascenso",
    quote:
      "Me había subido el sueldo y seguía con un plan antiguo. En una tarde por WhatsApp comparamos opciones y mejoré mi cobertura hospitalaria sin pagar extra.",
  },
  {
    initials: "CV",
    name: "Carolina y Tomás",
    profile: "Plan familiar en región",
    quote:
      "Trato súper humano, cálido y claro. Nos explicaron las diferencias entre cada Isapre en nuestra región y resolvieron todas nuestras dudas gratis.",
  },
];

function Index() {
  const [q, setQ] = useState(defaultQuote);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [version, setVersion] = useState(0);

  const start = (e: FormEvent) => {
    e.preventDefault();
    if (!quoteSchema.safeParse(q).success) {
      setError("Revisa tu renta (desde $100.000) y edad (18 a 100 años) para continuar.");
      return;
    }
    setError("");
    setVersion(version + 1);
    setOpen(true);
  };

  const heroWaHref = buildWhatsAppUrl(
    "Hola, vi su página web y me gustaría recibir asesoría gratuita para elegir o mejorar el plan de salud de mi familia.",
  );

  const quickQuoteWaHref = buildAdvisoryWhatsAppUrl({
    salary: q.salary,
    dependents: q.dependents,
    region: q.region,
    main_question: `Quiero evaluar qué cobertura familiar puedo obtener con mi 7% estimado de ${money(Math.round(q.salary * 0.07))}/mes`,
  });

  return (
    <>
      {/* ===================== HERO FAMILIAR CON FOTO PROTAGONISTA ===================== */}
      <section className="hero">
        <div className="site-container hero-grid">
          <div>
            <span className="eyebrow-pill">
              <Sparkles size={14} /> ASESORÍA INDEPENDIENTE · 100% GRATUITA
            </span>

            <h1>
              Protege la salud de tu familia con un plan que <span>sí aproveche tu 7%.</span>
            </h1>

            <p className="hero-description">
              Te acompañamos con cercanía, calidez y <strong>sin ningún costo</strong> a comparar
              todas las Isapres de Chile, cuidando tanto el bienestar de quienes más quieres como el
              presupuesto de tu hogar.
            </p>

            {/* Gancho de valor claro y conciso */}
            <div className="hook-bubble">
              <span className="hook-bubble-badge">CONSEJO PARA TU PRESUPUESTO FAMILIAR</span>
              <p className="text-sm sm:text-[15px] font-extrabold text-[#12056E] leading-snug">
                Si subió tu sueldo, tu 7% legal aumentó automáticamente, pero{" "}
                <span className="text-[#E91E8C] underline">
                  tu plan no mejora su cobertura por sí solo
                </span>
                .
              </p>
              <p className="text-xs text-[#0A033C]/80 mt-1.5 leading-5">
                Revisamos gratis si con lo que ya cotizas hoy puedes acceder a mejores clínicas y
                mayor bonificación para ti y tus cargas.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              <a href={heroWaHref} target="_blank" rel="noreferrer" className="btn-magenta">
                <MessageCircle size={18} />
                Hablar con un Asesor ({WHATSAPP_DISPLAY})
              </a>
              <a href="#comparador" className="btn-white-outline">
                <SlidersHorizontal size={16} />
                Comparar Planes e Isapres
              </a>
            </div>

            <div className="flex flex-wrap gap-2.5 mt-5">
              {[
                "Comparamos las 7 Isapres",
                "100% gratis y sin compromiso",
                "Atención humana y cercana",
              ].map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-1.5 bg-white/12 border border-white/25 text-white text-[11px] font-bold px-3.5 py-1.5 rounded-full"
                >
                  <Check size={13} className="text-[#F01E8E]" /> {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Fotografía de la familia con rol protagonista y encuadre cálido */}
          <div className="hero-family-showcase">
            <div className="hero-photo-wrapper">
              <img
                src={family}
                className="hero-photo-frame"
                width={1536}
                height={1024}
                alt="Familia disfrutando un momento juntos en un parque de Santiago"
                fetchPriority="high"
              />
              <div className="hero-photo-gradient" />

              <div className="hero-photo-caption">
                <div className="flex items-center gap-2.5">
                  <span className="icon-tile icon-tile-magenta !w-10 !h-10 shrink-0">
                    <Heart size={20} />
                  </span>
                  <div>
                    <p className="font-extrabold text-white text-xs sm:text-sm leading-tight">
                      El bienestar de tu hogar, en buenas manos
                    </p>
                    <p className="text-white/85 text-[11px]">
                      Planes individuales, maternidad y familia en todo Chile
                    </p>
                  </div>
                </div>
                <span className="bg-white text-[#12056E] text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                  100% Gratuita
                </span>
              </div>
            </div>

            <div className="hero-letter-box">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <VictoriaYanezLogo size={42} />
                  <div>
                    <p className="text-xs font-extrabold text-[#12056E]">
                      Victoria Yañez Asesorías · Orientación cercana y pensada en tu familia
                    </p>
                    <p className="text-[11px] text-[#0A033C]/75">
                      Resolvemos tus dudas paso a paso por WhatsApp o teléfono.
                    </p>
                  </div>
                </div>
                <a
                  href={heroWaHref}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-extrabold text-[#E91E8C] hover:underline inline-flex items-center gap-1"
                >
                  <PhoneCall size={13} /> {WHATSAPP_DISPLAY}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== BARRA DE CONFIANZA ===================== */}
      <div className="trust-bar-indigo">
        <div className="site-container">
          <div className="trust-strip">
            <span>
              <ShieldCheck /> Asesoría Independiente 100% Gratuita
            </span>
            <span>
              <TrendingUp /> Optimización del 7% familiar
            </span>
            <span>
              <Heart /> Comparativa de las 7 Isapres
            </span>
            <span>
              <BadgeCheck /> WhatsApp directo {WHATSAPP_DISPLAY}
            </span>
          </div>
        </div>
      </div>

      {/* ===================== SIMULADOR RÁPIDO DE 7% ===================== */}
      <section className="site-container">
        <div className="quote-panel">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#E91E8C]">
                SIMULADOR RÁPIDO DE PRESUPUESTO
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#12056E] mt-0.5">
                Calcula tu 7% mensual y descubre a qué nivel de plan puedes acceder
              </h2>
            </div>
            <span className="text-xs font-bold text-[#12056E] bg-[#F6F5FF] border border-[#12056E]/15 px-3.5 py-1.5 rounded-full flex gap-2 items-center">
              <Clock3 size={14} className="text-[#E91E8C]" /> Tu 7% estimado:{" "}
              <strong className="text-[#E91E8C]">{money(Math.round(q.salary * 0.07))}/mes</strong>
            </span>
          </div>

          <form onSubmit={start}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.15fr_.65fr_.85fr_1.2fr_auto] gap-4 items-end">
              <QuoteFields compact value={q} onChange={setQ} />
              <button
                type="submit"
                className="btn-magenta h-[46px] !px-5 !text-xs whitespace-nowrap"
              >
                Ver escenarios en UF <ArrowRight size={15} />
              </button>
            </div>

            {error && (
              <p role="alert" className="text-destructive text-xs font-semibold mt-3">
                {error}
              </p>
            )}

            <div className="mt-4 pt-3 border-t border-border flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#0A033C]/75">
              <span className="flex items-center gap-1.5">
                <LockKeyhole size={13} className="text-[#12056E]" />
                Cálculo inmediato y confidencial para orientar el presupuesto de tu hogar.
              </span>
              <a
                href={quickQuoteWaHref}
                target="_blank"
                rel="noreferrer"
                className="font-extrabold text-[#E91E8C] hover:underline inline-flex items-center gap-1"
              >
                <MessageCircle size={13} /> Enviar mi 7% directo por WhatsApp ({WHATSAPP_DISPLAY})
              </a>
            </div>
          </form>
        </div>
      </section>

      {/* ===================== PILARES + COMPARADOR INTERACTIVO + BENEFICIOS DE CADA ISAPRE ===================== */}
      <Benefits />

      {/* ===================== CÓMO TE ACOMPAÑAMOS + TESTIMONIOS FAMILIARES ===================== */}
      <section className="section bg-[#F6F5FF]">
        <div className="site-container grid lg:grid-cols-[0.95fr_1.05fr] gap-12 items-start">
          <div>
            <p className="eyebrow">PASO A PASO SIN COMPLICACIONES</p>
            <h2 className="section-title mt-2">
              Elegir bien para tu familia es <span className="text-[#E91E8C]">así de simple</span>
            </h2>
            <p className="section-subtitle mb-7">
              Nos encargamos de comparar tablas, topes y redes clínicas por ti, para que decidas con
              información clara y sin presiones.
            </p>

            <div>
              {processSteps.map((s) => (
                <div key={s.n} className="timeline-step">
                  <div className="timeline-dot-col">
                    <div className="timeline-dot">{s.n}</div>
                    <div className="timeline-line" />
                  </div>
                  <div className="pt-1">
                    <h3 className="font-extrabold text-base text-[#12056E]">{s.title}</h3>
                    <p className="text-xs sm:text-sm text-[#0A033C]/80 mt-1 leading-6">{s.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="eyebrow">CONFIANZA Y CERCANÍA</p>
            <h2 className="section-title mt-2">Familias que ya mejoraron su cobertura</h2>
            <p className="section-subtitle mb-7">
              Experiencias reales de cotizantes que ajustaron su plan de salud a las necesidades de
              su hogar.
            </p>

            <div className="grid gap-4">
              {testimonials.map((t) => (
                <article key={t.name} className="benefit-card !p-5">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-full bg-[#12056E] text-white font-extrabold text-xs flex items-center justify-center border-2 border-[#E91E8C]">
                        {t.initials}
                      </span>
                      <div>
                        <p className="text-xs font-extrabold text-[#12056E]">{t.name}</p>
                        <p className="text-[11px] text-[#0A033C]/70">{t.profile}</p>
                      </div>
                    </div>
                    <div className="flex gap-0.5 text-[#E91E8C]" aria-label="5 de 5 estrellas">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star key={idx} size={13} fill="#E91E8C" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-[#0A033C]/90 italic leading-6">
                    “{t.quote}”
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================== SECCIÓN PRINCIPAL DE ASESORÍA Y FORMULARIO (#cotizar) ===================== */}
      <section id="cotizar" className="section-indigo">
        <div className="site-container grid lg:grid-cols-[0.85fr_1.15fr] gap-12 items-start">
          <div>
            <span className="eyebrow-pill">ORIENTACIÓN GRATUITA Y PERSONALIZADA</span>
            <h2 className="section-title mt-4">
              Conversemos sobre el plan ideal para ti y tu familia
            </h2>
            <p className="section-subtitle">
              Déjanos tus datos básicos o abre directamente nuestro WhatsApp{" "}
              <strong className="text-[#F01E8E]">{WHATSAPP_DISPLAY}</strong> con tu resumen listo.
            </p>

            <ul className="space-y-3.5 mt-6 text-xs sm:text-sm text-white/90">
              <li className="flex items-start gap-2.5">
                <Check size={17} className="text-[#F01E8E] shrink-0 mt-0.5" />
                <span>
                  <strong>Comparativa imparcial:</strong> Evaluamos Colmena, Banmédica, Consalud,
                  CruzBlanca, Nueva Masvida, Vida Tres y Esencial.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check size={17} className="text-[#F01E8E] shrink-0 mt-0.5" />
                <span>
                  <strong>Cuidado del presupuesto familiar:</strong> Buscamos la mayor bonificación
                  posible dentro de tu 7% legal.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check size={17} className="text-[#F01E8E] shrink-0 mt-0.5" />
                <span>
                  <strong>100% gratuito y sin compromiso:</strong> Tú tienes siempre la última
                  palabra.
                </span>
              </li>
            </ul>

            <div className="mt-7 p-5 rounded-2xl bg-white/10 border border-white/20">
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#F01E8E]">
                CANAL DIRECTO DE WHATSAPP
              </p>
              <p className="text-xl font-extrabold text-white mt-1">{WHATSAPP_DISPLAY}</p>
              <p className="text-xs text-white/80 mt-1">
                Atención rápida y cercana para resolver tus dudas en minutos.
              </p>
              <a
                href={heroWaHref}
                target="_blank"
                rel="noreferrer"
                className="btn-magenta mt-4 w-full sm:w-auto !text-xs"
              >
                <MessageCircle size={16} />
                Iniciar chat en WhatsApp
              </a>
            </div>
          </div>

          <div className="bg-white text-[#0A033C] rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#E91E8C]/30">
            <div className="mb-5 pb-4 border-b border-border">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#E91E8C]">
                SOLICITUD RÁPIDA · 100% SIN COSTO
              </span>
              <h3 className="text-xl font-extrabold text-[#12056E] mt-1">
                Recibe tu comparativa personalizada
              </h3>
              <p className="text-xs text-[#0A033C]/75 mt-1">
                Completa tus datos para enviarnos tu caso o abrir el chat de WhatsApp con tu
                resumen.
              </p>
            </div>
            <LeadForm initialSalary={q.salary} initialDependents={q.dependents} />
          </div>
        </div>
      </section>

      <QuoteWizard key={version} open={open} onOpenChange={setOpen} initial={q} />
    </>
  );
}
