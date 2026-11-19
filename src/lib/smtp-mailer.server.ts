import nodemailer from "nodemailer";

export const SMTP_RECIPIENTS = [
  "victoriayanezasesora@gmail.com",
  "victoriayanezasesora@vyplanesisapre.cl",
] as const;

export const DEFAULT_SMTP_CONFIG = {
  host: "solu33.tuwebdns.net",
  port: 465,
  secure: true,
  user: "notificaciones@vyplanesisapre.cl",
  pass: "Vicy@ases2029",
} as const;

export interface LeadEmailPayload {
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

export function renderLeadEmailHtml(payload: LeadEmailPayload, formattedDate: string): string {
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
                ${payload.is_test ? "PRUEBA DE VERIFICACIÓN SMTP SSL/TLS · " : ""}VICTORIA YAÑEZ ASESORÍAS
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
              Notificación automática enviada vía SSL/TLS (${DEFAULT_SMTP_CONFIG.host}:${DEFAULT_SMTP_CONFIG.port}) desde <strong>${DEFAULT_SMTP_CONFIG.user}</strong> · Victoria Yañez Asesorías
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function cleanEnv(value: string | undefined): string {
  return (value || "").trim().replace(/^["']|["']$/g, "");
}

export async function sendLeadEmailViaSmtp(payload: LeadEmailPayload) {
  const smtpHost = cleanEnv(process.env["SMTP_HOST"]) || DEFAULT_SMTP_CONFIG.host;
  const smtpPort = Number(cleanEnv(process.env["SMTP_PORT"]) || String(DEFAULT_SMTP_CONFIG.port));
  const smtpUser = cleanEnv(process.env["SMTP_USER"]) || DEFAULT_SMTP_CONFIG.user;
  const smtpPass =
    cleanEnv(process.env["SMTP_PASS"]) ||
    cleanEnv(process.env["SMTP_PASSWORD"]) ||
    cleanEnv(process.env["VITE_SMTP_PASS"]) ||
    DEFAULT_SMTP_CONFIG.pass;

  const formattedDate =
    payload.sent_at ||
    new Intl.DateTimeFormat("es-CL", {
      dateStyle: "full",
      timeStyle: "medium",
      timeZone: "America/Santiago",
    }).format(new Date());

  if (!smtpPass) {
    return {
      success: false as const,
      code: "MISSING_SMTP_SECRET",
      host: smtpHost,
      port: smtpPort,
      user: smtpUser,
      error: `Falta configurar el secreto SMTP_PASS en las variables de entorno / Secrets para autenticar ${smtpUser} en ${smtpHost}:${smtpPort} (SSL/TLS).`,
    };
  }

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
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
  });

  try {
    const subject = `Nueva Solicitud de Asesoría Gratuita - ${payload.full_name}`;
    const html = renderLeadEmailHtml(payload, formattedDate);

    const info = await transporter.sendMail({
      from: `"Victoria Yañez Asesorías" <${smtpUser}>`,
      to: SMTP_RECIPIENTS.join(", "),
      replyTo:
        payload.email &&
        payload.email !== "No informado" &&
        payload.email !== "notificaciones@vyplanesisapre.cl"
          ? payload.email
          : undefined,
      subject,
      html,
    });

    return {
      ok: true as const,
      success: true as const,
      messageId: info.messageId,
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      from: `Victoria Yañez Asesorías <${smtpUser}>`,
      recipients: [...SMTP_RECIPIENTS],
    };
  } finally {
    transporter.close();
  }
}
