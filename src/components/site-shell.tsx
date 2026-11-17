import { Link } from "@tanstack/react-router";
import { ShieldCheck, MessageCircle, Phone, Menu, X, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { buildWhatsAppUrl, WHATSAPP_DISPLAY } from "@/lib/quote";

export function Brand({ inverted = false }: { inverted?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span className="brand-seal" aria-hidden="true">
        <span className="brand-cross" />
      </span>
      <div>
        <div className={`wordmark ${inverted ? "!text-white" : ""}`}>Tu Plan de Salud</div>
        <span className="brand-caption">ASESORÍA INDEPENDIENTE · 100% GRATUITA</span>
      </div>
    </div>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const waHref = buildWhatsAppUrl(
    "Hola, vengo desde la web y quiero asesoría independiente 100% gratuita para revisar y mejorar mi plan de salud.",
  );

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border shadow-xs">
      <div className="bg-[#0A033C] text-white text-[11px] py-2 px-4">
        <div className="site-container flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 font-semibold">
            <Sparkles size={13} className="text-[#F01E8E]" />
            ¿Subió tu sueldo y también tu 7%? Revisamos gratis si puedes tener mejor cobertura.
          </span>
          <a
            href={waHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 font-extrabold text-[#F01E8E] hover:underline"
          >
            <Phone size={12} /> WhatsApp Directo: {WHATSAPP_DISPLAY}
          </a>
        </div>
      </div>

      <div className="site-container site-header">
        <Link to="/" aria-label="Asesoría de Salud Inicio">
          <Brand />
        </Link>

        <nav className="desktop-nav flex items-center gap-7" aria-label="Navegación principal">
          <Link to="/" className="nav-link">
            Inicio y Cotizador
          </Link>
          <Link to="/beneficios" className="nav-link">
            Optimiza tu 7%
          </Link>
          <Link to="/preguntas-frecuentes" className="nav-link">
            Preguntas frecuentes
          </Link>
          <Link to="/asesoria" className="nav-link">
            Asesoría personalizada
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a
            href={waHref}
            target="_blank"
            rel="noreferrer"
            className="btn-magenta !py-2.5 !px-5 !text-xs"
          >
            <MessageCircle size={16} />
            Asesoría Gratis · {WHATSAPP_DISPLAY}
          </a>
        </div>

        <Button
          className="md:hidden text-[#12056E]"
          variant="ghost"
          size="icon"
          aria-label="Abrir menú"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </Button>
      </div>

      {open && (
        <nav
          className="md:hidden site-container grid gap-2 pb-5 border-t border-border pt-3 bg-white"
          onClick={() => setOpen(false)}
          aria-label="Navegación móvil"
        >
          <Link className="nav-link" to="/">
            Inicio y Cotizador
          </Link>
          <Link className="nav-link" to="/beneficios">
            Optimiza tu 7% y Coberturas
          </Link>
          <Link className="nav-link" to="/preguntas-frecuentes">
            Preguntas frecuentes
          </Link>
          <Link className="nav-link" to="/asesoria">
            Asesoría personalizada
          </Link>
          <a
            href={waHref}
            target="_blank"
            rel="noreferrer"
            className="btn-magenta mt-2 w-full justify-center"
          >
            <MessageCircle size={16} />
            Hablar por WhatsApp ({WHATSAPP_DISPLAY})
          </a>
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  const waHref = buildWhatsAppUrl(
    "Hola, quiero recibir asesoría independiente 100% gratuita para elegir o mejorar mi plan de salud.",
  );

  return (
    <>
      <footer className="footer">
        <div className="site-container">
          <div className="grid md:grid-cols-[1.2fr_1fr_1fr] gap-8 items-start pb-8">
            <div>
              <Brand inverted />
              <p className="text-xs text-white/80 mt-4 leading-6 max-w-sm">
                Asesoría independiente, cercana y <strong>100% gratuita</strong> para ayudarte a
                elegir y optimizar tu plan de salud en Chile. Si subió tu sueldo y tu 7% aumentó, te
                ayudamos a conseguir la mejor cobertura posible por tu presupuesto.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 text-xs text-[#F01E8E] font-bold">
                <ShieldCheck size={16} /> Tus datos e inquietudes son 100% confidenciales
              </div>
            </div>

            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#F01E8E] mb-3">
                Navegación y Ayuda
              </h3>
              <ul className="space-y-2.5 text-xs text-white/80">
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Simulador de 7% y Planes
                  </Link>
                </li>
                <li>
                  <Link to="/beneficios" className="hover:text-white transition-colors">
                    Por qué revisar tu 7% de salud
                  </Link>
                </li>
                <li>
                  <Link to="/asesoria" className="hover:text-white transition-colors">
                    Solicitar evaluación gratuita
                  </Link>
                </li>
                <li>
                  <Link to="/preguntas-frecuentes" className="hover:text-white transition-colors">
                    Preguntas frecuentes sobre Isapres y 7%
                  </Link>
                </li>
                <li>
                  <Link to="/privacidad" className="hover:text-white transition-colors">
                    Política de Privacidad
                  </Link>
                </li>
                <li>
                  <a
                    href="https://www.superdesalud.gob.cl/"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Superintendencia de Salud ↗
                  </a>
                </li>
              </ul>
            </div>

            <div className="bg-[#12056E] border border-[#E91E8C]/40 rounded-2xl p-5">
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#F01E8E]">
                Contacto Directo de Asesoría
              </p>
              <p className="text-lg font-extrabold text-white mt-1 flex items-center gap-2">
                <Phone size={18} className="text-[#E91E8C]" />
                {WHATSAPP_DISPLAY}
              </p>
              <p className="text-xs text-white/80 mt-2 leading-5">
                Escríbenos directamente por WhatsApp para revisar tu plan actual o cotizar sin costo
                ni compromiso.
              </p>
              <a
                href={waHref}
                target="_blank"
                rel="noreferrer"
                className="btn-magenta w-full mt-4 !py-2.5 !text-xs"
              >
                <MessageCircle size={16} />
                Iniciar chat en WhatsApp
              </a>
            </div>
          </div>

          <p className="footer-legal">
            Servicio de orientación y asesoría independiente 100% gratuita para cotizantes de salud
            en Chile ({WHATSAPP_DISPLAY}). Este sitio no constituye el portal oficial de ninguna
            aseguradora en particular. Los valores, escenarios y coberturas del simulador son
            referenciales e ilustrativos para facilitar la comparación presupuestaria y no
            constituyen oferta contractual. La contratación definitiva está sujeta a evaluación,
            declaración de salud, tabla de factores oficial, valor GES y normativa vigente ante la
            Superintendencia de Salud. © 2026 Asesoría Independiente en Planes de Salud.
          </p>
        </div>
      </footer>

      <a
        href={waHref}
        target="_blank"
        rel="noreferrer"
        aria-label={`Hablar por WhatsApp al ${WHATSAPP_DISPLAY}`}
        className="whatsapp-float"
      >
        <MessageCircle size={20} />
        <span>Asesoría Gratis · {WHATSAPP_DISPLAY}</span>
      </a>
    </>
  );
}

export function pageHead(title: string, description: string) {
  return {
    meta: [
      { title: `${title} | Asesoría Independiente de Salud 100% Gratuita` },
      { name: "description", content: description },
      {
        property: "og:title",
        content: `${title} | Asesoría Independiente de Salud 100% Gratuita`,
      },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  };
}
