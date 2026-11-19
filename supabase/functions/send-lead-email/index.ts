declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
  serve(handler: (req: Request) => Response | Promise<Response>): void;
};

interface NodemailerTransporter {
  verify(): Promise<boolean>;
  sendMail(options: {
    from: string;
    to: string;
    replyTo?: string | undefined;
    subject: string;
    html: string;
  }): Promise<{ messageId: string }>;
}

interface NodemailerModule {
  createTransport(config: {
    host: string;
    port: number;
    secure: boolean;
    auth: { user: string; pass: string };
    tls?: { rejectUnauthorized?: boolean };
  }): NodemailerTransporter;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const RECIPIENTS = ["victoriayanezasesora@gmail.com", "victoriayanezasesora@vyplanesisapre.cl"];

const DEFAULT_SMTP_HOST = "solu33.tuwebdns.net";
const DEFAULT_SMTP_PORT = 465;
const DEFAULT_SMTP_USER = "notificaciones@vyplanesisapre.cl";

interface LeadEmailRequest {
  full_name: string;
  phone: string;
  email?: string | undefined;
  salary?: number | string | undefined;
  estimated_seven_percent?: number | string | undefined;
  dependents?: string | number | undefined;
  isapre_interest?: string | undefined;
  clinic_commune?: string | undefined;
  preferred_time?: string | undefined;
  main_question?: string | undefined;
  additional_message?: string | undefined;
  selected_plan?: string | undefined;
  sent_at?: string | undefined;
  is_test?: boolean | undefined;
}

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatCLP(value: unknown): string {
  const num = Number(value);
  if (!Number.isFinite(num) || num <= 0) return String(value || "No especificada");
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(num);
}

function buildHtmlEmail(payload: LeadEmailRequest, formattedDate: string): string {
  const salaryText = payload.salary ? formatCLP(payload.salary) : "No especificada";
  const sevenPctText = payload.estimated_seven_percent
    ? formatCLP(payload.estimated_seven_percent)
    : payload.salary && Number(payload.salary) > 0
      ? formatCLP(Math.round(Number(payload.salary) * 0.07))
      : "No calculado";

  const cleanPhone = String(payload.phone || "").replace(/[^\d]/g, "");
  const waClientUrl = cleanPhone
    ? `https://wa.me/${cleanPhone.startsWith("56") ? cleanPhone : `56${cleanPhone}`}`
    : "";

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Nueva Solicitud de Asesoría Gratuita</title>
</head>
<body style="margin:0;padding:0;background-color:#F6F5FF;font-family:'Segoe UI',Arial,sans-serif;color:#0A033C;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F6F5FF;padding:28px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background-color:#FFFFFF;border-radius:18px;overflow:hidden;border:2px solid #E91E8C;box-shadow:0 12px 32px rgba(18,5,110,0.12);">
          <tr>
            <td style="background:linear-gradient(135deg,#12056E 0%,#1B0994 100%);padding:26px 30px;color:#FFFFFF;border-bottom:4px solid #E91E8C;">
              <div style="font-size:11px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;color:#F01E8E;margin-bottom:6px;">
                ${payload.is_test ? "PRUEBA DE CONEXIÓN SMTP SSL/TLS · " : ""}VICTORIA YAÑEZ ASESORÍAS
              </div>
              <h1 style="margin:0;font-size:22px;font-weight:800;color:#FFFFFF;line-height:1.3;">
                Nueva Solicitud de Asesoría Gratuita
              </h1>
              <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.86);">
                Cliente: <strong>${escapeHtml(payload.full_name)}</strong> · Recibido el ${escapeHtml(formattedDate)}
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:26px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px;">
                <tr>
                  <td style="padding:11px 12px;border-bottom:1px solid #ECEAF9;font-weight:700;color:#12056E;width:42%;">
                    Nombre completo
                  </td>
                  <td style="padding:11px 12px;border-bottom:1px solid #ECEAF9;color:#0A033C;font-weight:600;">
                    ${escapeHtml(payload.full_name)}
                  </td>
                </tr>
                <tr style="background-color:#FAF9FF;">
                  <td style="padding:11px 12px;border-bottom:1px solid #ECEAF9;font-weight:700;color:#12056E;">
                    Teléfono / WhatsApp
                  </td>
                  <td style="padding:11px 12px;border-bottom:1px solid #ECEAF9;color:#E91E8C;font-weight:800;">
                    ${escapeHtml(payload.phone)}
                  </td>
                </tr>
                <tr>
                  <td style="padding:11px 12px;border-bottom:1px solid #ECEAF9;font-weight:700;color:#12056E;">
                    Correo electrónico
                  </td>
                  <td style="padding:11px 12px;border-bottom:1px solid #ECEAF9;color:#0A033C;">
                    ${escapeHtml(payload.email || "No informado")}
                  </td>
                </tr>
                <tr style="background-color:#FAF9FF;">
                  <td style="padding:11px 12px;border-bottom:1px solid #ECEAF9;font-weight:700;color:#12056E;">
                    Renta imponible aprox.
                  </td>
                  <td style="padding:11px 12px;border-bottom:1px solid #ECEAF9;color:#0A033C;font-weight:700;">
                    ${escapeHtml(salaryText)} <span style="color:#E91E8C;">(7% est.: ${escapeHtml(sevenPctText)}/mes)</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:11px 12px;border-bottom:1px solid #ECEAF9;font-weight:700;color:#12056E;">
                    Cargas familiares
                  </td>
                  <td style="padding:11px 12px;border-bottom:1px solid #ECEAF9;color:#0A033C;">
                    ${escapeHtml(payload.dependents ?? "0")}
                  </td>
                </tr>
                <tr style="background-color:#FAF9FF;">
                  <td style="padding:11px 12px;border-bottom:1px solid #ECEAF9;font-weight:700;color:#12056E;">
                    Isapre actual o de interés
                  </td>
                  <td style="padding:11px 12px;border-bottom:1px solid #ECEAF9;color:#0A033C;font-weight:600;">
                    ${escapeHtml(payload.isapre_interest || "Por evaluar en asesoría")}
                  </td>
                </tr>
                <tr>
                  <td style="padding:11px 12px;border-bottom:1px solid #ECEAF9;font-weight:700;color:#12056E;">
                    Clínica / Comuna o Región
                  </td>
                  <td style="padding:11px 12px;border-bottom:1px solid #ECEAF9;color:#0A033C;">
                    ${escapeHtml(payload.clinic_commune || "No especificada")}
                  </td>
                </tr>
                <tr style="background-color:#FAF9FF;">
                  <td style="padding:11px 12px;border-bottom:1px solid #ECEAF9;font-weight:700;color:#12056E;">
                    Horario preferido
                  </td>
                  <td style="padding:11px 12px;border-bottom:1px solid #ECEAF9;color:#0A033C;">
                    ${escapeHtml(payload.preferred_time || "Cualquier horario")}
                  </td>
                </tr>
                <tr>
                  <td style="padding:11px 12px;border-bottom:1px solid #ECEAF9;font-weight:700;color:#12056E;">
                    Motivo / Consulta principal
                  </td>
                  <td style="padding:11px 12px;border-bottom:1px solid #ECEAF9;color:#0A033C;">
                    ${escapeHtml(payload.main_question || "Evaluación de plan de salud")}
                  </td>
                </tr>
                <tr style="background-color:#FAF9FF;">
                  <td style="padding:11px 12px;border-bottom:1px solid #ECEAF9;font-weight:700;color:#12056E;">
                    Mensaje o consulta adicional
                  </td>
                  <td style="padding:11px 12px;border-bottom:1px solid #ECEAF9;color:#0A033C;">
                    ${escapeHtml(payload.additional_message || "Sin comentarios adicionales")}
                  </td>
                </tr>
                ${
                  payload.selected_plan
                    ? `<tr>
                  <td style="padding:11px 12px;border-bottom:1px solid #ECEAF9;font-weight:700;color:#12056E;">
                    Plan / Escenario preseleccionado
                  </td>
                  <td style="padding:11px 12px;border-bottom:1px solid #ECEAF9;color:#0A033C;">
                    ${escapeHtml(payload.selected_plan)}
                  </td>
                </tr>`
                    : ""
                }
                <tr>
                  <td style="padding:11px 12px;font-weight:700;color:#12056E;">
                    Fecha y hora de envío
                  </td>
                  <td style="padding:11px 12px;color:#0A033C;">
                    ${escapeHtml(formattedDate)}
                  </td>
                </tr>
              </table>

              ${
                waClientUrl
                  ? `<div style="margin-top:22px;text-align:center;">
                      <a href="${waClientUrl}" style="display:inline-block;background-color:#E91E8C;color:#FFFFFF;font-weight:800;font-size:13px;padding:12px 24px;border-radius:999px;text-decoration:none;">
                        Contactar a ${escapeHtml(payload.full_name)} por WhatsApp
                      </a>
                    </div>`
                  : ""
              }
            </td>
          </tr>

          <tr>
            <td style="background-color:#0A033C;padding:16px 30px;color:rgba(255,255,255,0.75);font-size:11px;text-align:center;">
              Notificación automática enviada vía SSL/TLS (${DEFAULT_SMTP_HOST}:${DEFAULT_SMTP_PORT}) desde <strong>${DEFAULT_SMTP_USER}</strong> · Victoria Yañez Asesorías
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

async function loadNodemailer(): Promise<NodemailerModule> {
  const pkg = "npm:nodemailer@6.9.16";
  const mod = (await import(/* @vite-ignore */ pkg)) as {
    default?: NodemailerModule;
  } & NodemailerModule;
  return mod.default ?? mod;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = (await req.json()) as LeadEmailRequest;

    if (!payload.full_name || !payload.phone) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Nombre completo y teléfono son obligatorios.",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const smtpHost = Deno.env.get("SMTP_HOST") || DEFAULT_SMTP_HOST;
    const smtpPort = Number(Deno.env.get("SMTP_PORT") || String(DEFAULT_SMTP_PORT));
    const smtpUser = Deno.env.get("SMTP_USER") || DEFAULT_SMTP_USER;
    const smtpPass = Deno.env.get("SMTP_PASS");

    if (!smtpPass) {
      return new Response(
        JSON.stringify({
          success: false,
          code: "MISSING_SMTP_SECRET",
          host: smtpHost,
          port: smtpPort,
          user: smtpUser,
          error: `Falta configurar el secreto SMTP_PASS en Supabase Secrets para autenticar ${smtpUser} en ${smtpHost}:${smtpPort} (SSL/TLS).`,
        }),
        {
          status: 503,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const formattedDate =
      payload.sent_at ||
      new Intl.DateTimeFormat("es-CL", {
        dateStyle: "full",
        timeStyle: "medium",
        timeZone: "America/Santiago",
      }).format(new Date());

    const nodemailer = await loadNodemailer();

    // Conexión SMTP con SSL/TLS implícito obligatorio en puerto 465
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    await transporter.verify();

    const subject = `Nueva Solicitud de Asesoría Gratuita - ${payload.full_name}`;
    const html = buildHtmlEmail(payload, formattedDate);

    const info = await transporter.sendMail({
      from: `"Victoria Yañez Asesorías" <${smtpUser}>`,
      to: RECIPIENTS.join(", "),
      replyTo: payload.email && payload.email !== "No informado" ? payload.email : undefined,
      subject,
      html,
    });

    return new Response(
      JSON.stringify({
        success: true,
        messageId: info.messageId,
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        from: `Victoria Yañez Asesorías <${smtpUser}>`,
        recipients: RECIPIENTS,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Error desconocido al conectar con solu33.tuwebdns.net:465.";
    console.error("[send-lead-email] SMTP SSL/TLS error:", message);
    return new Response(
      JSON.stringify({
        success: false,
        code: "SMTP_CONNECTION_ERROR",
        host: DEFAULT_SMTP_HOST,
        port: DEFAULT_SMTP_PORT,
        error: message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
