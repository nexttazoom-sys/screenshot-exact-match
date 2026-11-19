interface DenoConn {
  read(p: Uint8Array): Promise<number | null>;
  write(p: Uint8Array): Promise<number>;
  close(): void;
}

declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
  serve(handler: (req: Request) => Response | Promise<Response>): void;
  connectTls(options: { hostname: string; port: number }): Promise<DenoConn>;
  connect(options: { hostname: string; port: number }): Promise<DenoConn>;
  startTls(conn: DenoConn, options: { hostname: string }): Promise<DenoConn>;
};

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

function cleanEnvValue(value: string | undefined): string {
  return (value || "").trim().replace(/^["']|["']$/g, "");
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

function encodeBase64Utf8(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }
  return btoa(binary);
}

function wrapBase64(b64: string, lineLength = 76): string {
  const chunks: string[] = [];
  for (let i = 0; i < b64.length; i += lineLength) {
    chunks.push(b64.slice(i, i + lineLength));
  }
  return chunks.join("\r\n");
}

function encodeMimeHeaderUtf8(text: string): string {
  return `=?UTF-8?B?${encodeBase64Utf8(text)}?=`;
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

class NativeDenoSmtpSession {
  private conn: DenoConn;
  private buffer = "";
  private encoder = new TextEncoder();
  private decoder = new TextDecoder();

  constructor(conn: DenoConn) {
    this.conn = conn;
  }

  replaceConn(nextConn: DenoConn) {
    this.conn = nextConn;
  }

  private extractCompleteResponse(): { code: number; raw: string } | null {
    const lines = this.buffer.split(/\r?\n/);
    for (let i = 0; i < lines.length - 1; i++) {
      const line = lines[i] ?? "";
      const match = /^(\d{3})(?: (.*))?$/.exec(line);
      if (match) {
        const consumed = lines.slice(0, i + 1).join("\r\n");
        this.buffer = lines.slice(i + 1).join("\r\n");
        return {
          code: Number(match[1]),
          raw: consumed,
        };
      }
    }
    return null;
  }

  async readResponse(timeoutMs = 15000): Promise<{ code: number; raw: string }> {
    const existing = this.extractCompleteResponse();
    if (existing) return existing;

    const readLoop = async (): Promise<{ code: number; raw: string }> => {
      const chunk = new Uint8Array(4096);
      while (true) {
        const n = await this.conn.read(chunk);
        if (n === null) {
          throw new Error("El servidor SMTP cerró la conexión inesperadamente.");
        }
        this.buffer += this.decoder.decode(chunk.subarray(0, n), { stream: true });
        const parsed = this.extractCompleteResponse();
        if (parsed) return parsed;
      }
    };

    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      const timeoutPromise = new Promise<never>((_, reject) => {
        timer = setTimeout(
          () =>
            reject(new Error(`Tiempo de espera agotado (${timeoutMs}ms) leyendo respuesta SMTP.`)),
          timeoutMs,
        );
      });
      return await Promise.race([readLoop(), timeoutPromise]);
    } finally {
      if (timer !== undefined) clearTimeout(timer);
    }
  }

  async writeAll(text: string): Promise<void> {
    const bytes = this.encoder.encode(text);
    let offset = 0;
    while (offset < bytes.length) {
      const written = await this.conn.write(bytes.subarray(offset));
      if (written <= 0) {
        throw new Error("No se pudo escribir en el socket SMTP SSL/TLS.");
      }
      offset += written;
    }
  }

  async command(
    cmd: string,
    expectedCodes: number[],
    stepLabel: string,
    timeoutMs = 15000,
  ): Promise<{ code: number; raw: string }> {
    await this.writeAll(`${cmd}\r\n`);
    const res = await this.readResponse(timeoutMs);
    if (!expectedCodes.includes(res.code)) {
      throw new Error(`Error SMTP en ${stepLabel} [Código ${res.code}]: ${res.raw.trim()}`);
    }
    return res;
  }

  close() {
    try {
      this.conn.close();
    } catch {
      // Ignorar errores al cerrar el socket
    }
  }
}

async function sendEmailViaDenoNativeTls(options: {
  host: string;
  port: number;
  user: string;
  pass: string;
  fromName: string;
  recipients: string[];
  replyTo?: string | undefined;
  subject: string;
  html: string;
}): Promise<{ messageId: string; queueResponse: string }> {
  const { host, port, user, pass, fromName, recipients, replyTo, subject, html } = options;
  const implicitTls = port === 465;

  const initialConn = implicitTls
    ? await Deno.connectTls({ hostname: host, port })
    : await Deno.connect({ hostname: host, port });

  const session = new NativeDenoSmtpSession(initialConn);

  try {
    const greeting = await session.readResponse(15000);
    if (greeting.code !== 220) {
      throw new Error(`Saludo SMTP inválido (${greeting.code}): ${greeting.raw}`);
    }

    await session.command("EHLO vyplanesisapre.cl", [250], "EHLO");

    if (!implicitTls) {
      await session.command("STARTTLS", [220], "STARTTLS");
      const tlsConn = await Deno.startTls(initialConn, { hostname: host });
      session.replaceConn(tlsConn);
      await session.command("EHLO vyplanesisapre.cl", [250], "EHLO post-STARTTLS");
    }

    await session.command("AUTH LOGIN", [334], "AUTH LOGIN");
    await session.command(encodeBase64Utf8(user), [334], "SMTP_USER");
    await session.command(encodeBase64Utf8(pass), [235], "SMTP_PASS (Autenticación)");

    await session.command(`MAIL FROM:<${user}>`, [250], "MAIL FROM");

    for (const rcpt of recipients) {
      await session.command(`RCPT TO:<${rcpt}>`, [250, 251], `RCPT TO (${rcpt})`);
    }

    await session.command("DATA", [354], "DATA");

    const domainPart = user.split("@")[1] || "vyplanesisapre.cl";
    const messageId = `<${Date.now()}-${Math.random().toString(36).slice(2, 10)}@${domainPart}>`;
    const encodedFromName = encodeMimeHeaderUtf8(fromName);
    const encodedSubject = encodeMimeHeaderUtf8(subject);
    const wrappedHtmlBase64 = wrapBase64(encodeBase64Utf8(html), 76);

    const headers: string[] = [
      `Date: ${new Date().toUTCString()}`,
      `Message-ID: ${messageId}`,
      `From: "${encodedFromName}" <${user}>`,
      `To: ${recipients.join(", ")}`,
    ];

    if (replyTo && replyTo.includes("@") && replyTo !== user) {
      headers.push(`Reply-To: <${replyTo.trim()}>`);
    }

    headers.push(
      `Subject: ${encodedSubject}`,
      "MIME-Version: 1.0",
      "Content-Type: text/html; charset=UTF-8",
      "Content-Transfer-Encoding: base64",
    );

    const dataBlock = `${headers.join("\r\n")}\r\n\r\n${wrappedHtmlBase64}\r\n.`;
    const dataRes = await session.command(dataBlock, [250], "Envío de cuerpo HTML (DATA)", 20000);

    try {
      await session.writeAll("QUIT\r\n");
    } catch {
      // Ignorar si el servidor cierra inmediatamente tras aceptar DATA
    }

    return {
      messageId,
      queueResponse: dataRes.raw.trim(),
    };
  } finally {
    session.close();
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { status: 200, headers: corsHeaders });
  }

  try {
    const payload = (await req.json()) as LeadEmailRequest;

    if (!payload.full_name || !payload.phone) {
      return new Response(
        JSON.stringify({
          success: false,
          code: "VALIDATION_ERROR",
          error: "Nombre completo y teléfono son obligatorios.",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const smtpHost = cleanEnvValue(Deno.env.get("SMTP_HOST")) || DEFAULT_SMTP_HOST;
    const smtpPort = Number(cleanEnvValue(Deno.env.get("SMTP_PORT")) || String(DEFAULT_SMTP_PORT));
    const smtpUser = cleanEnvValue(Deno.env.get("SMTP_USER")) || DEFAULT_SMTP_USER;
    const smtpPass =
      cleanEnvValue(Deno.env.get("SMTP_PASS")) ||
      cleanEnvValue(Deno.env.get("SMTP_PASSWORD")) ||
      cleanEnvValue(Deno.env.get("VITE_SMTP_PASS"));

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

    const subject = `Nueva Solicitud de Asesoría Gratuita - ${payload.full_name}`;
    const html = buildHtmlEmail(payload, formattedDate);

    const result = await sendEmailViaDenoNativeTls({
      host: smtpHost,
      port: smtpPort,
      user: smtpUser,
      pass: smtpPass,
      fromName: "Victoria Yañez Asesorías",
      recipients: RECIPIENTS,
      replyTo:
        payload.email &&
        payload.email !== "No informado" &&
        payload.email !== "notificaciones@vyplanesisapre.cl"
          ? payload.email
          : undefined,
      subject,
      html,
    });

    return new Response(
      JSON.stringify({
        success: true,
        messageId: result.messageId,
        queueResponse: result.queueResponse,
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
