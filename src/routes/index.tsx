import { createFileRoute, Link } from "@tanstack/react-router";
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
  CheckCircle2,
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
import { pageHead } from "@/components/site-shell";

export const Route = createFileRoute("/")({
  head: () =>
    pageHead(
      "Asesoría Independiente 100% Gratuita para elegir tu Plan de Salud",
      "Si sube tu sueldo, sube tu 7% de salud, pero eso no garantiza mejor cobertura. Te ayudamos gratis a obtener la mejor cobertura posible por tu presupuesto.",
    ),
  component: Index,
});

const processSteps = [
  {
    n: "1",
    title: "Cuéntanos tu caso en menos de 2 minutos",
    text: `Completa tus datos básicos en el formulario o escríbenos directo por WhatsApp al ${WHATSAPP_DISPLAY}.`,
  },
  {
    n: "2",
    title: "Analizamos tu 7% legal y tu presupuesto",
    text: "Evaluamos cuánto estás cotizando hoy (especialmente si subió tu sueldo) y si tienes cargas familiares.",
  },
  {
    n: "3",
    title: "Comparamos planes y redes clínicas",
    text: "Buscamos entre las alternativas disponibles aquellas que entreguen mayor bonificación hospitalaria y ambulatoria en tus clínicas preferidas.",
  },
  {
    n: "4",
    title: "Recibes una propuesta clara y sin letra chica",
    text: "Te explicamos en lenguaje simple qué cubre cada opción, cómo operan los topes y cuánto ahorrarías o mejorarías.",
  },
  {
    n: "5",
    title: "Te acompañamos gratis de principio a fin",
    text: "Tú decides con total libertad y sin presiones. Nuestro acompañamiento es 100% gratuito antes, durante y después.",
  },
];

const testimonials = [
  {
    initials: "MJ",
    name: "María José R.",
    profile: "Subió su sueldo · 2 cargas familiares",
    quote:
      "Me habían subido el sueldo dos veces y mi 7% era mucho más alto, pero seguía con un plan antiguo. Con la asesoría gratuita pasé a un plan con mucha mejor cobertura clínica por el mismo 7%.",
  },
  {
    initials: "RP",
    name: "Rodrigo P.",
    profile: "Optimización de 7% individual",
    quote:
      "No sabía que al subir mi renta estaba generando excedentes sin mejorar mis topes hospitalarios. Me explicaron todo por WhatsApp con mucha paciencia y sin costo.",
  },
  {
    initials: "CV",
    name: "Carolina V.",
    profile: "Evaluación familiar e independiente",
    quote:
      "Excelente atención, cercana y transparente. Compararon opciones según la clínica donde atiendo a mis hijos y resolvieron todas mis dudas en el mismo día.",
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
    "Hola, vi su página web y quiero recibir Asesoría Independiente 100% Gratuita para elegir u optimizar mi plan de salud según mi 7%.",
  );

  const quickQuoteWaHref = buildAdvisoryWhatsAppUrl({
    salary: q.salary,
    dependents: q.dependents,
    region: q.region,
    main_question: `Quiero evaluar qué cobertura puedo obtener con mi 7% estimado de ${money(Math.round(q.salary * 0.07))}/mes`,
  });

  return (
    <>
      {/* ===================== HERO DE ALTO CONTRASTE (#12056E / #1B0994 + #E91E8C + #FFFFFF) ===================== */}
      <section className="hero">
        <div className="site-container hero-grid">
          <div>
            <span className="eyebrow-pill">
              <Sparkles size={14} /> ASESORÍA INDEPENDIENTE · 100% GRATUITA
            </span>

            <h1>
              Si sube tu sueldo, sube tu 7%… <span>¿pero mejoró tu cobertura de salud?</span>
            </h1>

            <p className="hero-description">
              Te ayudamos de forma <strong>100% gratuita, cercana e independiente</strong> a elegir
              y optimizar tu plan de salud en Chile para que obtengas{" "}
              <strong>la mejor cobertura posible por tu presupuesto</strong> y las necesidades
              reales de tu familia.
            </p>

            {/* Gancho de valor principal inspirado en la imagen adjunta */}
            <div className="hook-bubble">
              <span className="hook-bubble-badge">¿POR QUÉ REVISAR TU PLAN HOY?</span>
              <p className="text-sm sm:text-[15px] font-extrabold text-[#12056E] leading-snug">
                Cuando aumenta tu sueldo, tu cotización legal del 7% sube automáticamente, pero eso{" "}
                <span className="text-[#E91E8C] underline">
                  no garantiza mejor cobertura ni un plan bien ajustado
                </span>
                .
              </p>
              <p className="text-xs text-[#0A033C]/80 mt-2 leading-5">
                Analizamos tu caso sin costo para transformar ese aporte obligatorio en mejores
                clínicas, mayor bonificación hospitalaria y tranquilidad para ti.
              </p>
            </div>

            <div className="flex flex-wrap gap-3.5 mt-7">
              <a href={heroWaHref} target="_blank" rel="noreferrer" className="btn-magenta">
                <MessageCircle size={18} />
                Asesoría Gratis por WhatsApp ({WHATSAPP_DISPLAY})
              </a>
              <a href="#cotizar" className="btn-white-outline">
                Evaluar mi 7% y Cotizar <ArrowRight size={17} />
              </a>
            </div>

            <div className="flex flex-wrap gap-2.5 mt-6">
              {[
                "Asesoría 100% Gratuita",
                "Sin compromiso ni letra chica",
                `Atención directa ${WHATSAPP_DISPLAY}`,
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

          {/* Tarjeta visual derecha conservando la imagen original + sello de confianza estilo Lina Cardona */}
          <div className="hero-visual-card">
            <img
              src={family}
              className="hero-photo-frame"
              width={1536}
              height={1024}
              alt="Familia disfrutando un momento juntos en un parque de Santiago"
              fetchPriority="high"
            />

            <div className="hero-letter-box">
              <div className="flex items-start gap-3.5">
                <span className="brand-seal shrink-0 !w-11 !h-11" aria-hidden="true">
                  <span className="brand-cross" />
                </span>
                <div>
                  <p className="text-xs sm:text-sm font-extrabold text-[#12056E] italic leading-relaxed">
                    “Nuestro compromiso es acompañarte paso a paso para que elijas el plan de salud
                    que realmente necesitas, aprovechando cada peso de tu 7%.”
                  </p>
                  <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2.5 border-t border-dashed border-[#12056E]/20 text-[11px]">
                    <span className="font-extrabold text-[#E91E8C] uppercase tracking-wider">
                      Asesoría Independiente en Salud
                    </span>
                    <a
                      href={heroWaHref}
                      target="_blank"
                      rel="noreferrer"
                      className="font-extrabold text-[#12056E] hover:text-[#E91E8C] flex items-center gap-1"
                    >
                      <PhoneCall size={12} className="text-[#E91E8C]" /> {WHATSAPP_DISPLAY}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="hero-note">
              <span className="icon-tile icon-tile-magenta !w-10 !h-10 shrink-0">
                <ShieldCheck size={22} />
              </span>
              <div>
                <p className="font-extrabold text-white text-xs sm:text-sm">
                  Obtén la mejor cobertura por tu presupuesto
                </p>
                <p className="text-white/80 text-[11px] mt-0.5">
                  Orientación personalizada y 100% sin costo para cotizantes en todo Chile.
                </p>
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
              <TrendingUp /> Optimización de tu 7% cuando sube tu sueldo
            </span>
            <span>
              <Heart /> Planes individuales y familiares a medida
            </span>
            <span>
              <BadgeCheck /> Respuesta directa por WhatsApp {WHATSAPP_DISPLAY}
            </span>
          </div>
        </div>
      </div>

      {/* ===================== SIMULADOR RÁPIDO DE 7% ===================== */}
      <section className="site-container">
        <div className="quote-panel">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#E91E8C]">
                CALCULADORA RÁPIDA DE PRESUPUESTO Y 7%
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#12056E] mt-0.5">
                Descubre cuánto es tu 7% hoy y simula escenarios de cobertura
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
              <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
                <button
                  type="submit"
                  className="btn-magenta h-[46px] !px-5 !text-xs whitespace-nowrap"
                >
                  Simular mi 7% ahora <ArrowRight size={15} />
                </button>
              </div>
            </div>

            {error && (
              <p role="alert" className="text-destructive text-xs font-semibold mt-3">
                {error}
              </p>
            )}

            <div className="mt-4 pt-3 border-t border-border flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#0A033C]/75">
              <span className="flex items-center gap-1.5">
                <LockKeyhole size={13} className="text-[#12056E]" />
                Simulación privada y referencial. Te orientamos gratis sobre opciones reales para tu
                presupuesto.
              </span>
              <a
                href={quickQuoteWaHref}
                target="_blank"
                rel="noreferrer"
                className="font-extrabold text-[#E91E8C] hover:underline inline-flex items-center gap-1"
              >
                <MessageCircle size={13} /> ¿Prefieres enviar este 7% directo por WhatsApp (
                {WHATSAPP_DISPLAY})?
              </a>
            </div>
          </form>
        </div>
      </section>

      {/* ===================== SECCIÓN GANCHO DE VALOR / FORMATO CARTA (INSPIRADO EN LINA CARDONA + IMAGEN ADJUNTA) ===================== */}
      <section className="section">
        <div className="site-container grid md:grid-cols-[0.45fr_0.55fr] gap-10 lg:gap-14 items-center">
          <div className="rounded-3xl bg-gradient-to-br from-[#12056E] to-[#1B0994] text-white p-7 md:p-9 shadow-xl relative overflow-hidden">
            <span className="inline-block bg-[#E91E8C] text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
              REALIDAD PREVISIONAL EN CHILE
            </span>
            <h3 className="text-2xl font-extrabold leading-snug">
              “Si sube tu sueldo, sube tu 7% de salud… pero tu cobertura no mejora automáticamente.”
            </h3>
            <p className="text-xs sm:text-sm text-white/85 leading-6 mt-4">
              Muchos cotizantes ven aumentar su descuento legal mes a mes cuando crecen
              profesionalmente, pero mantienen exactamente el mismo plan que contrataron años atrás.
            </p>
            <div className="mt-6 pt-5 border-t border-white/20 space-y-2.5 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#F01E8E] shrink-0" />
                <span>Revisamos si tu 7% actual te alcanza para una mejor red de clínicas.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#F01E8E] shrink-0" />
                <span>
                  Evitamos que pagues diferencias innecesarias por coberturas mal ajustadas.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#F01E8E] shrink-0" />
                <span>Servicio 100% gratuito, transparente y sin compromiso.</span>
              </div>
            </div>
          </div>

          <div>
            <p className="eyebrow">SOBRE NUESTRA ASESORÍA INDEPENDIENTE</p>
            <h2 className="section-title mt-2">
              Te acompañamos a conseguir la <span className="text-[#E91E8C]">mejor cobertura</span>{" "}
              por tu presupuesto
            </h2>
            <p className="section-subtitle">
              Elegir o actualizar un plan de salud en Chile no tiene por qué ser confuso ni lleno de
              letra chica. Nuestra misión es traducir las tablas, porcentajes y topes en una
              recomendación honesta, pensada en tu realidad laboral y familiar.
            </p>
            <p className="section-subtitle !mt-3">
              Ya sea que haya subido tu sueldo y quieras aprovechar mejor tu nuevo 7%, que busques
              agregar o ajustar cargas familiares, o que quieras comparar alternativas con mejor
              bonificación hospitalaria y ambulatoria, te guiamos paso a paso sin costo para ti.
            </p>

            <div className="flex flex-wrap gap-2.5 mt-6">
              {[
                "Asesoría 100% Gratuita",
                "Optimización del 7% legal",
                "Planes individuales y familiares",
                "Trato humano y cercano",
              ].map((tag) => (
                <span
                  key={tag}
                  className="bg-[#F6F5FF] border border-[#12056E]/15 text-[#12056E] text-xs font-extrabold px-3.5 py-1.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={heroWaHref}
                target="_blank"
                rel="noreferrer"
                className="btn-magenta !text-xs"
              >
                <MessageCircle size={16} />
                Hablar ahora por WhatsApp ({WHATSAPP_DISPLAY})
              </a>
              <Link
                to="/asesoria"
                className="inline-flex items-center gap-2 rounded-full border-2 border-[#12056E] text-[#12056E] hover:bg-[#12056E] hover:text-white font-extrabold text-xs px-5 py-3 transition-colors"
              >
                Conocer más sobre la asesoría <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== BENEFICIOS Y VENTAJAS ===================== */}
      <div className="bg-[#F6F5FF]">
        <Benefits />
      </div>

      {/* ===================== CÓMO TRABAJAMOS (TIMELINE ESTILO LINA CARDONA) ===================== */}
      <section className="section">
        <div className="site-container grid md:grid-cols-[0.9fr_1.1fr] gap-12 items-start">
          <div>
            <p className="eyebrow">CÓMO TRABAJAMOS</p>
            <h2 className="section-title mt-2">
              Mejorar tu plan de salud es <span className="text-[#E91E8C]">así de simple.</span>
            </h2>
            <p className="section-subtitle">
              Un proceso claro, cercano y paso a paso para que siempre sepas qué estamos evaluando y
              tomes una decisión con total tranquilidad.
            </p>

            <div className="mt-7 p-6 rounded-2xl bg-[#F6F5FF] border border-[#12056E]/15">
              <p className="text-xs font-extrabold uppercase tracking-wider text-[#E91E8C]">
                CONTACTO DIRECTO Y SIN ESPERAS
              </p>
              <p className="text-base font-extrabold text-[#12056E] mt-1">
                WhatsApp: {WHATSAPP_DISPLAY}
              </p>
              <p className="text-xs text-[#0A033C]/80 mt-2 leading-5">
                ¿Tienes tu liquidación o sabes cuánto es tu 7% aproximado? Escríbenos directo y lo
                revisamos juntos hoy mismo.
              </p>
              <a
                href={heroWaHref}
                target="_blank"
                rel="noreferrer"
                className="btn-magenta mt-4 !py-2.5 !px-5 !text-xs"
              >
                <MessageCircle size={15} />
                Escribir al {WHATSAPP_DISPLAY}
              </a>
            </div>
          </div>

          <div className="pt-2">
            {processSteps.map((s) => (
              <div key={s.n} className="timeline-step">
                <div className="timeline-dot-col">
                  <div className="timeline-dot">{s.n}</div>
                  <div className="timeline-line" />
                </div>
                <div className="pt-1">
                  <h3 className="font-extrabold text-base text-[#12056E]">{s.title}</h3>
                  <p className="text-xs sm:text-sm text-[#0A033C]/80 mt-1.5 leading-6">{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== TESTIMONIOS (ESTILO LINA CARDONA) ===================== */}
      <section className="section-soft">
        <div className="site-container">
          <div className="text-center max-w-2xl mx-auto mb-11">
            <p className="eyebrow">EXPERIENCIAS REALES</p>
            <h2 className="section-title mt-2">Lo que dicen quienes ya optimizaron su 7%</h2>
            <p className="section-subtitle">
              Personas y familias que transformaron su cotización de salud en una mejor cobertura
              con orientación gratuita.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <article key={t.name} className="benefit-card flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 text-[#E91E8C] mb-3" aria-label="5 de 5 estrellas">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star key={idx} size={15} fill="#E91E8C" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-[#0A033C] italic leading-6">“{t.quote}”</p>
                </div>
                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border">
                  <span className="w-10 h-10 rounded-full bg-[#12056E] text-white font-extrabold text-xs flex items-center justify-center border-2 border-[#E91E8C]">
                    {t.initials}
                  </span>
                  <div>
                    <p className="text-xs font-extrabold text-[#12056E]">{t.name}</p>
                    <p className="text-[11px] text-[#0A033C]/70">{t.profile}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== SECCIÓN PRINCIPAL DE ASESORÍA Y FORMULARIO (#cotizar) ===================== */}
      <section id="cotizar" className="section-indigo">
        <div className="site-container grid lg:grid-cols-[0.88fr_1.12fr] gap-12 items-start">
          <div>
            <span className="eyebrow-pill">SOLICITA TU EVALUACIÓN SIN COSTO</span>
            <h2 className="section-title mt-4">
              Cuéntanos tu caso y obtén la mejor cobertura para tu presupuesto
            </h2>
            <p className="section-subtitle">
              Completa el formulario con tus datos básicos o abre directamente nuestro chat de
              WhatsApp al <strong className="text-[#F01E8E]">{WHATSAPP_DISPLAY}</strong>. Te
              responderemos de manera personal, clara y sin compromiso.
            </p>

            <div className="space-y-4 mt-7 text-xs sm:text-sm text-white/90">
              <div className="flex items-start gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F01E8E] mt-1.5 shrink-0" />
                <span>
                  <strong>Especialistas en optimizar tu 7%:</strong> Si subió tu sueldo, verificamos
                  qué planes superiores puedes alcanzar sin pagar de más.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F01E8E] mt-1.5 shrink-0" />
                <span>
                  <strong>Asesoría 100% Gratuita e Independiente:</strong> Nuestro foco es tu
                  tranquilidad y la de tu familia.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F01E8E] mt-1.5 shrink-0" />
                <span>
                  <strong>Respuesta rápida por WhatsApp:</strong> Te explicamos cada alternativa en
                  lenguaje simple y transparente.
                </span>
              </div>
            </div>

            <div className="mt-8 p-5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xs">
              <p className="text-xs font-extrabold uppercase tracking-wider text-[#F01E8E]">
                ¿PREFIERES ESCRIBIRNOS DIRECTO AHORA?
              </p>
              <p className="text-lg font-extrabold text-white mt-1">{WHATSAPP_DISPLAY}</p>
              <p className="text-xs text-white/80 mt-1">
                Haz clic abajo para iniciar una conversación directa por WhatsApp con un mensaje
                predeterminado.
              </p>
              <a
                href={heroWaHref}
                target="_blank"
                rel="noreferrer"
                className="btn-magenta mt-4 w-full sm:w-auto"
              >
                <MessageCircle size={17} />
                Chatear ahora al {WHATSAPP_DISPLAY}
              </a>
            </div>
          </div>

          <div className="bg-white text-[#0A033C] rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#E91E8C]/30">
            <div className="mb-5 pb-4 border-b border-border">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#E91E8C]">
                FORMULARIO DE ASESORÍA RÁPIDA · 100% GRATUITA
              </span>
              <h3 className="text-xl font-extrabold text-[#12056E] mt-1">
                Evalúa y optimiza tu plan de salud
              </h3>
              <p className="text-xs text-[#0A033C]/75 mt-1">
                Ingresa tus datos básicos para enviarnos tu solicitud o abrir directamente WhatsApp
                con tu resumen listo.
              </p>
            </div>
            <LeadForm initialSalary={q.salary} initialDependents={q.dependents} />
          </div>
        </div>
      </section>

      {/* ===================== CTA FINAL (ESTILO LINA CARDONA) ===================== */}
      <section className="section text-center bg-white">
        <div className="site-container max-w-2xl mx-auto flex flex-col items-center">
          <span className="brand-seal !w-14 !h-14 mb-5" aria-hidden="true">
            <span className="brand-cross" />
          </span>
          <p className="eyebrow">DA EL SIGUIENTE PASO CON TRANQUILIDAD</p>
          <h2 className="section-title mt-2">
            ¿Listo para que tu 7% de salud te entregue la cobertura que mereces?
          </h2>
          <p className="section-subtitle">
            No dejes que un aumento de sueldo se pierda en un plan desactualizado. Recibe hoy tu{" "}
            <strong>Asesoría Independiente 100% Gratuita</strong> y elige con información clara.
          </p>
          <div className="flex flex-wrap justify-center gap-3.5 mt-7">
            <a href={heroWaHref} target="_blank" rel="noreferrer" className="btn-magenta">
              <MessageCircle size={18} />
              Hablar por WhatsApp ({WHATSAPP_DISPLAY})
            </a>
            <a
              href="#cotizar"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#12056E] text-[#12056E] hover:bg-[#12056E] hover:text-white font-extrabold text-sm px-6 py-3.5 transition-colors"
            >
              Completar formulario de asesoría
            </a>
          </div>
        </div>
      </section>

      <QuoteWizard key={version} open={open} onOpenChange={setOpen} initial={q} />
    </>
  );
}
