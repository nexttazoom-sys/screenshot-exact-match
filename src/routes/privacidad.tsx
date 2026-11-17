import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, MessageCircle } from "lucide-react";
import { pageHead } from "@/components/site-shell";
import { buildWhatsAppUrl, WHATSAPP_DISPLAY } from "@/lib/quote";

export const Route = createFileRoute("/privacidad")({
  head: () =>
    pageHead(
      "Privacidad y Tratamiento Confidencial de Datos",
      "Información sobre el uso confidencial de datos de contacto para solicitudes de asesoría independiente y gratuita en planes de salud.",
    ),
  component: Page,
});

function Page() {
  const waHref = buildWhatsAppUrl(
    "Hola, quiero consultar sobre la asesoría gratuita en planes de salud.",
  );

  return (
    <>
      <section className="page-heading">
        <div className="site-container">
          <span className="eyebrow-pill mb-4">
            <ShieldCheck size={13} /> TUS DATOS SIEMPRE PROTEGIDOS
          </span>
          <h1>Privacidad y confidencialidad en tu asesoría</h1>
          <p className="section-subtitle max-w-2xl">
            Conoce cómo cuidamos tu información cuando solicitas orientación gratuita para evaluar
            tu plan de salud.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="site-container max-w-3xl">
          <div className="space-y-6 text-sm text-[#0A033C]/85 leading-8 bg-[#F6F5FF] border border-[#12056E]/15 rounded-3xl p-7 md:p-10">
            <p>
              El formulario de asesoría recoge únicamente los datos básicos necesarios para
              brindarte orientación personalizada: nombre, teléfono/WhatsApp, correo electrónico,
              renta o presupuesto aproximado, número de cargas familiares, horario preferido y tu
              duda o escenario de interés. Estos datos se utilizan de manera estrictamente
              confidencial para gestionar tu solicitud de asesoría gratuita.
            </p>
            <p>
              <strong>No solicitamos diagnósticos ni antecedentes médicos sensibles</strong> a
              través de este sitio web. Te recomendamos no incluir información clínica privada en
              los campos de comentarios abiertos.
            </p>
            <p>
              Las simulaciones de 7% y escenarios mostradas en la calculadora son referenciales y se
              procesan en tu navegador para ayudarte a dimensionar tu presupuesto antes de conversar
              con un asesor.
            </p>
            <p>
              En cualquier momento puedes comunicarte directamente a nuestro canal de contacto
              oficial en WhatsApp <strong>{WHATSAPP_DISPLAY}</strong> para resolver dudas o
              solicitar la actualización o eliminación de tus datos de contacto.
            </p>
            <div className="pt-4 border-t border-[#12056E]/15">
              <a href={waHref} target="_blank" rel="noreferrer" className="btn-magenta !text-xs">
                <MessageCircle size={16} />
                Contacto directo: {WHATSAPP_DISPLAY}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
