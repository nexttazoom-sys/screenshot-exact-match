import { Link } from "@tanstack/react-router";
import { ShieldCheck, MessageCircle, Phone, Menu, X, Heart } from "lucide-react";
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
        <span className="brand-caption">ASESORÍA FAMILIAR · 100% GRATUITA</span>
      </div>
    </div>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const waHref = buildWhatsAppUrl(
    "Hola, vengo desde la web y me gustaría recibir asesoría gratuita para comparar Isapres y elegir el mejor plan para mi familia.",
  );

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border shadow-xs">
      <div className="bg-[#0A033C] text-white text-[11px] py-2 px-4">
        <div className="site-container flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 font-semibold">
            <Heart size={13} className="text-[#F01E8E]" />
            Cuidamos el bienestar y presupuesto de tu familia · Comparamos las 7 Isapres sin costo.
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
            Inicio
          </Link>
          <Link to="/beneficios" className="nav-link">
            Comparador e Isapres
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
            Inicio
          </Link>
          <Link className="nav-link" to="/beneficios">
            Comparador e Isapres
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
    "Hola, quiero recibir asesoría independiente 100% gratuita para elegir o mejorar el plan de salud de mi familia.",
  );

  return (
    <>
      <footer className="footer">
        <div className="site-container">
          <div className="grid md:grid-cols-[1.2fr_1fr_1fr] gap-8 items-start pb-8">
            <div>
              <Brand inverted />
              <p className="text-xs text-white/80 mt-4 leading-6 max-w-sm">
                Orientación familiar, independiente y <strong>100% gratuita</strong> para ayudarte a
                comparar Isapres y aprovechar al máximo tu 7% legal de salud en todo Chile.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 text-xs text-[#F01E8E] font-bold">
                <ShieldCheck size={16} /> Atención confidencial, cercana y sin letra chica
              </div>
            </div>

            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#F01E8E] mb-3">
                Secciones del Sitio
              </h3>
              <ul className="space-y-2.5 text-xs text-white/80">
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Portada y Simulador de 7%
                  </Link>
                </li>
                <li>
                  <Link to="/beneficios" className="hover:text-white transition-colors">
                    Comparador de Planes y Guía de Isapres
                  </Link>
                </li>
                <li>
                  <Link to="/asesoria" className="hover:text-white transition-colors">
                    Solicitar evaluación familiar gratuita
                  </Link>
                </li>
                <li>
                  <Link to="/preguntas-frecuentes" className="hover:text-white transition-colors">
                    Preguntas frecuentes
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
                Contacto Directo Familiar
              </p>
              <p className="text-lg font-extrabold text-white mt-1 flex items-center gap-2">
                <Phone size={18} className="text-[#E91E8C]" />
                {WHATSAPP_DISPLAY}
              </p>
              <p className="text-xs text-white/80 mt-2 leading-5">
                Escríbenos por WhatsApp para revisar tu plan actual o comparar opciones sin costo.
              </p>
              <a
                href={waHref}
                target="_blank"
                rel="noreferrer"
                className="btn-magenta w-full mt-4 !py-2.5 !text-xs"
              >
                <MessageCircle size={16} />
                Chatear por WhatsApp
              </a>
            </div>
          </div>

          <p className="footer-legal">
            Servicio de orientación independiente y 100% gratuito para cotizantes de salud en Chile
            ({WHATSAPP_DISPLAY}). No constituye el sitio oficial de ninguna Isapre en particular;
            las marcas mencionadas (Colmena, Banmédica, Consalud, CruzBlanca, Nueva Masvida, Vida
            Tres y Esencial) pertenecen a sus respectivos titulares. Los escenarios y valores en UF
            del comparador son referenciales para orientar el presupuesto familiar y no constituyen
            oferta contractual. La contratación está sujeta a evaluación, declaración de salud,
            tabla de factores oficial, valor GES y normativa vigente. © 2026 Asesoría Independiente
            en Planes de Salud.
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
