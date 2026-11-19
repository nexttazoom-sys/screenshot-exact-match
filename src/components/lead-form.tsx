import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  CheckCircle2,
  LockKeyhole,
  Loader2,
  MessageCircle,
  Sparkles,
  MailCheck,
  AlertTriangle,
  Send,
} from "lucide-react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { ClinicCommuneSelect } from "./clinic-commune-select";
import { buildAdvisoryWhatsAppUrl, leadSchema, money, WHATSAPP_DISPLAY } from "@/lib/quote";
import { supabase } from "@/integrations/supabase/client";

export interface LeadFormProps {
  selectedPlan?: string | undefined;
  initialSalary?: number | undefined;
  initialDependents?: number | undefined;
  initialClinicCommune?: string | undefined;
}

interface SmtpApiResponse {
  success?: boolean;
  code?: string;
  messageId?: string;
  error?: string;
  message?: string;
}

async function extractEdgeFunctionError(fnErr: unknown): Promise<string | undefined> {
  if (!fnErr || typeof fnErr !== "object") return undefined;

  const errObj = fnErr as { message?: string; context?: unknown };
  if (errObj.context && typeof (errObj.context as Response).json === "function") {
    try {
      const cloned =
        typeof (errObj.context as Response).clone === "function"
          ? (errObj.context as Response).clone()
          : (errObj.context as Response);
      const body = (await cloned.json()) as SmtpApiResponse;
      if (body?.error) return body.error;
      if (body?.message) return body.message;
    } catch {
      // Ignorar si la respuesta no es JSON válido
    }
  }

  return errObj.message;
}

export function LeadForm({
  selectedPlan,
  initialSalary = 1500000,
  initialDependents = 0,
  initialClinicCommune = "",
}: LeadFormProps) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [salary, setSalary] = useState<string>(
    initialSalary && initialSalary >= 1000000 ? String(initialSalary) : "1500000",
  );
  const [dependents, setDependents] = useState<string>(String(initialDependents));
  const [isapreInterest, setIsapreInterest] = useState(
    "Por evaluar (Comparar Banmédica, CruzBlanca, Nueva Masvida y más)",
  );
  const [clinicCommune, setClinicCommune] = useState(initialClinicCommune);
  const [mainQuestion, setMainQuestion] = useState(
    "Subió mi sueldo / mi 7% y quiero mejorar mi cobertura",
  );
  const [customNote, setCustomNote] = useState("");
  const [preferredTime, setPreferredTime] = useState<"09:00–12:00" | "12:00–15:00" | "15:00–18:00">(
    "09:00–12:00",
  );
  const [consent, setConsent] = useState(true);
  const [error, setError] = useState("");
  const [smtpErrorDetail, setSmtpErrorDetail] = useState("");
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  const [submittedWaUrl, setSubmittedWaUrl] = useState("");

  // Estado para prueba de verificación del envío SMTP
  const [testingSmtp, setTestingSmtp] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);

  const numericSalary = Number(salary) || 0;
  const estimatedSevenPercent = numericSalary > 0 ? Math.round(numericSalary * 0.07) : 0;

  const combinedQuestion = customNote.trim()
    ? `${mainQuestion} (${customNote.trim()})`
    : mainQuestion;

  const whatsappSummaryUrl = buildAdvisoryWhatsAppUrl({
    full_name: fullName.trim() || undefined,
    phone: phone.trim() || undefined,
    email: email.trim() || undefined,
    salary: numericSalary > 0 ? numericSalary : undefined,
    dependents,
    isapre_interest: isapreInterest,
    clinic_commune: clinicCommune.trim() || undefined,
    main_question: mainQuestion,
    additional_message: customNote.trim() || undefined,
    selected_plan: selectedPlan,
    preferred_time: preferredTime,
  });

  function resetFormFields() {
    setFullName("");
    setPhone("");
    setEmail("");
    setSalary("1500000");
    setDependents("0");
    setIsapreInterest("Por evaluar (Comparar Banmédica, CruzBlanca, Nueva Masvida y más)");
    setClinicCommune("");
    setMainQuestion("Subió mi sueldo / mi 7% y quiero mejorar mi cobertura");
    setCustomNote("");
    setPreferredTime("09:00–12:00");
  }

  async function dispatchLeadEmail(payload: {
    full_name: string;
    phone: string;
    email: string;
    salary: number | string;
    estimated_seven_percent?: number | undefined;
    dependents: string;
    isapre_interest: string;
    clinic_commune: string;
    preferred_time: string;
    main_question: string;
    additional_message: string;
    selected_plan?: string | undefined;
    sent_at: string;
    is_test?: boolean | undefined;
  }): Promise<{ ok: boolean; messageId?: string | undefined; error?: string | undefined }> {
    let phpEndpointError: string | undefined;

    // 1. Intentar mediante endpoint SMTP del servidor/hosting (Vite middleware o cPanel PHP public_html/api/send-lead-email.php)
    const apiEndpoint =
      (import.meta.env["VITE_SMTP_API_URL"] as string | undefined) || "./api/send-lead-email.php";
    try {
      const phpRes = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const contentType = phpRes.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const json = (await phpRes.json()) as SmtpApiResponse;
        if (phpRes.ok && json.success) {
          return { ok: true, messageId: json.messageId };
        }
        if (json.error) {
          phpEndpointError = json.error;
        }
      }
    } catch {
      // Si el endpoint local/PHP no está disponible en este hosting, continuar con Supabase Edge Function
    }

    // 2. Intentar mediante la Supabase Edge Function `send-lead-email`
    try {
      const { data: fnRes, error: fnErr } = await supabase.functions.invoke<SmtpApiResponse>(
        "send-lead-email",
        {
          body: payload,
        },
      );

      if (!fnErr && fnRes?.success) {
        return { ok: true, messageId: fnRes.messageId };
      }

      const detailedEdgeError = fnRes?.error || (await extractEdgeFunctionError(fnErr));

      return {
        ok: false,
        error:
          phpEndpointError ||
          detailedEdgeError ||
          "No se pudo completar el envío con el servidor SMTP (solu33.tuwebdns.net:465). Verifica que la Edge Function send-lead-email esté desplegada y tenga configurado el secreto SMTP_PASS.",
      };
    } catch (err) {
      return {
        ok: false,
        error:
          phpEndpointError ||
          (err instanceof Error
            ? err.message
            : "Error de red al conectar con el servicio de correo SMTP (solu33.tuwebdns.net:465)."),
      };
    }
  }

  async function runInternalSmtpTest() {
    setTestingSmtp(true);
    setTestResult(null);
    try {
      const sentAt = new Intl.DateTimeFormat("es-CL", {
        dateStyle: "full",
        timeStyle: "medium",
        timeZone: "America/Santiago",
      }).format(new Date());

      const res = await dispatchLeadEmail({
        full_name: fullName.trim() || "Cliente de Prueba (Verificación SMTP)",
        phone: phone.trim() || "+56 9 4000 9671",
        email: email.trim() || "victoriayanezasesora@gmail.com",
        salary: numericSalary || 1500000,
        estimated_seven_percent: estimatedSevenPercent || 105000,
        dependents: `${dependents} carga(s)`,
        isapre_interest: isapreInterest,
        clinic_commune: clinicCommune.trim() || "Santiago / Regiones",
        preferred_time: preferredTime,
        main_question: mainQuestion,
        additional_message:
          customNote.trim() ||
          "Correo de prueba enviado para verificar conexión SMTP SSL/TLS (solu33.tuwebdns.net:465) desde notificaciones@vyplanesisapre.cl.",
        selected_plan: selectedPlan || "Prueba de sistema",
        sent_at: sentAt,
        is_test: true,
      });

      if (!res.ok) {
        setTestResult({
          ok: false,
          message: `Error en verificación SMTP (solu33.tuwebdns.net:465 SSL/TLS): ${res.error}`,
        });
      } else {
        setTestResult({
          ok: true,
          message:
            "¡Conexión SSL/TLS a solu33.tuwebdns.net:465 verificada con éxito! Correo real enviado desde notificaciones@vyplanesisapre.cl hacia victoriayanezasesora@gmail.com y victoriayanezasesora@vyplanesisapre.cl.",
        });
      }
    } finally {
      setTestingSmtp(false);
    }
  }

  async function send(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const composedPlanSummary = [
      selectedPlan,
      isapreInterest,
      clinicCommune.trim(),
      numericSalary > 0 ? `Renta:${money(numericSalary)}` : "",
      `Cargas:${dependents}`,
      combinedQuestion,
    ]
      .filter(Boolean)
      .join(" · ")
      .slice(0, 100);

    const effectiveEmail = email.trim() || "notificaciones@vyplanesisapre.cl";

    const parsed = leadSchema.safeParse({
      full_name: fullName,
      phone,
      email: effectiveEmail,
      preferred_time: preferredTime,
      selected_plan: composedPlanSummary,
      consent,
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || "Revisa tus datos de contacto para continuar.");
      return;
    }

    setBusy(true);
    setError("");
    setSmtpErrorDetail("");

    const currentSnapshotName = fullName.trim();
    const currentSnapshotWaUrl = whatsappSummaryUrl;
    const sentAt = new Intl.DateTimeFormat("es-CL", {
      dateStyle: "full",
      timeStyle: "medium",
      timeZone: "America/Santiago",
    }).format(new Date());

    try {
      const res = await dispatchLeadEmail({
        full_name: currentSnapshotName,
        phone: phone.trim(),
        email: email.trim() || "No informado",
        salary: numericSalary > 0 ? numericSalary : "No informada",
        estimated_seven_percent: estimatedSevenPercent > 0 ? estimatedSevenPercent : undefined,
        dependents:
          Number(dependents) === 0
            ? "Sin cargas (solo cotizante)"
            : `${dependents} carga(s) familiar(es)`,
        isapre_interest: isapreInterest,
        clinic_commune: clinicCommune.trim() || "No especificada",
        preferred_time: preferredTime,
        main_question: mainQuestion,
        additional_message: customNote.trim() || "Sin comentarios adicionales",
        selected_plan: selectedPlan,
        sent_at: sentAt,
      });

      if (!res.ok) {
        setSmtpErrorDetail(
          res.error ||
            "No fue posible enviar el correo mediante solu33.tuwebdns.net:465. Revisa la configuración o contáctanos directo por WhatsApp.",
        );
        return;
      }

      setSubmittedName(currentSnapshotName);
      setSubmittedWaUrl(currentSnapshotWaUrl);
      resetFormFields();
      setSuccess(true);
    } catch (err) {
      setSmtpErrorDetail(
        err instanceof Error
          ? err.message
          : "Ocurrió un error inesperado al enviar tu solicitud por correo.",
      );
    } finally {
      setBusy(false);
    }
  }

  if (success) {
    return (
      <div
        role="status"
        className="bg-[#F6F5FF] border-2 border-[#E91E8C] rounded-2xl p-7 text-center shadow-lg"
      >
        <CheckCircle2 className="text-[#E91E8C] mx-auto mb-3" size={46} />
        <span className="inline-block bg-[#12056E] text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full mb-2">
          Notificación enviada por correo · Asesoría 100% Gratuita
        </span>
        <h3 className="font-extrabold text-xl text-[#0A033C]">
          ¡Solicitud enviada! Victoria Yañez te contactará pronto
        </h3>
        <p className="text-sm text-[#0A033C]/80 mt-2 leading-6">
          Hola <strong>{submittedName}</strong>, hemos enviado tus datos directamente al correo de{" "}
          <strong>Victoria Yañez Asesorías</strong> (
          <span className="font-semibold">victoriayanezasesora@gmail.com</span> y{" "}
          <span className="font-semibold">victoriayanezasesora@vyplanesisapre.cl</span>). Si deseas
          atención inmediata, también puedes iniciar el chat de WhatsApp con tu resumen:
        </p>
        <div className="mt-5 flex flex-col gap-3">
          <a
            href={submittedWaUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-magenta w-full justify-center !py-3.5 !text-sm"
          >
            <MessageCircle size={18} />
            Conversar ahora por WhatsApp ({WHATSAPP_DISPLAY})
          </a>
          <Button
            type="button"
            variant="outline"
            className="text-xs border-[#12056E]/20 text-[#12056E]"
            onClick={() => setSuccess(false)}
          >
            Enviar otra consulta
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={send} className="grid sm:grid-cols-2 gap-4">
      <label className="field-label">
        Nombre completo *
        <input
          className="field"
          name="full_name"
          autoComplete="name"
          required
          minLength={2}
          maxLength={100}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Ej: Carolina Valdés"
        />
      </label>

      <label className="field-label">
        Teléfono / WhatsApp *
        <input
          className="field"
          name="phone"
          autoComplete="tel"
          type="tel"
          required
          maxLength={16}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+56 9 1234 5678"
        />
      </label>

      <label className="field-label">
        Correo electrónico *
        <input
          className="field"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={255}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@correo.cl"
        />
      </label>

      <label className="field-label">
        Renta imponible aproximada (CLP)
        <input
          className="field"
          name="salary"
          type="number"
          min={1000000}
          max={100000000}
          step={50000}
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          placeholder="Desde $1.000.000"
        />
        {estimatedSevenPercent > 0 && (
          <span className="text-[11px] font-semibold text-[#12056E] flex items-center gap-1">
            <Sparkles size={12} className="text-[#E91E8C]" />
            Tu 7% estimado:{" "}
            <strong className="text-[#E91E8C]">{money(estimatedSevenPercent)}/mes</strong>
          </span>
        )}
      </label>

      <label className="field-label">
        Cargas familiares
        <select
          className="field"
          name="dependents"
          value={dependents}
          onChange={(e) => setDependents(e.target.value)}
        >
          <option value="0">Sin cargas (solo cotizante)</option>
          <option value="1">1 carga familiar</option>
          <option value="2">2 cargas familiares</option>
          <option value="3">3 cargas familiares</option>
          <option value="4">4 o más cargas familiares</option>
        </select>
      </label>

      <label className="field-label">
        Isapre actual o de interés
        <select
          className="field"
          name="isapre_interest"
          value={isapreInterest}
          onChange={(e) => setIsapreInterest(e.target.value)}
        >
          <option value="Por evaluar (Comparar Banmédica, CruzBlanca, Nueva Masvida y más)">
            Comparar opciones (Banmédica, CruzBlanca, Nueva Masvida…)
          </option>
          <option value="Isapre Banmédica">Isapre Banmédica</option>
          <option value="Isapre CruzBlanca">Isapre CruzBlanca</option>
          <option value="Isapre Nueva Masvida">Isapre Nueva Masvida</option>
          <option value="Isapre Colmena">Isapre Colmena</option>
          <option value="Isapre Consalud">Isapre Consalud</option>
          <option value="Isapre Vida Tres">Isapre Vida Tres</option>
          <option value="Isapre Esencial">Isapre Esencial</option>
          <option value="Fonasa (Busco evaluar cambio a Isapre)">
            Estoy en Fonasa (Evaluar cambio a Isapre)
          </option>
        </select>
      </label>

      <div className="field-label">
        <span>Clínica de preferencia / Comuna</span>
        <ClinicCommuneSelect
          name="clinic_commune"
          value={clinicCommune}
          onChange={setClinicCommune}
          placeholder="Buscar comuna o clínica (ej: Copiapó, Las Condes, Indisa...)"
        />
      </div>

      <label className="field-label">
        Horario preferido de contacto
        <select
          className="field"
          name="preferred_time"
          value={preferredTime}
          onChange={(e) =>
            setPreferredTime(e.target.value as "09:00–12:00" | "12:00–15:00" | "15:00–18:00")
          }
        >
          <option value="09:00–12:00">Mañana · 09:00 a 12:00</option>
          <option value="12:00–15:00">Mediodía · 12:00 a 15:00</option>
          <option value="15:00–18:00">Tarde · 15:00 a 18:00</option>
        </select>
      </label>

      <label className="field-label sm:col-span-2">
        ¿Cuál es tu duda o motivo principal de asesoría?
        <select
          className="field"
          name="main_question"
          value={mainQuestion}
          onChange={(e) => setMainQuestion(e.target.value)}
        >
          <option value="Subió mi sueldo / mi 7% y quiero mejorar mi cobertura">
            Subió mi sueldo / mi 7% y quiero mejorar mi cobertura
          </option>
          <option value="Quiero saber si puedo obtener un mejor plan por lo que pago hoy">
            Quiero saber si puedo obtener un mejor plan por lo que pago hoy
          </option>
          <option value="Quiero evaluar un plan para mí y mis cargas familiares">
            Quiero evaluar un plan para mí y mis cargas familiares
          </option>
          <option value="Estoy en Fonasa y quiero comparar opciones de salud privada">
            Estoy en Fonasa y quiero comparar opciones de salud privada
          </option>
          <option value="Busco cobertura quirúrgica, dental o en clínicas específicas">
            Busco cobertura quirúrgica, dental o en clínicas específicas
          </option>
        </select>
      </label>

      <label className="field-label sm:col-span-2">
        Mensaje o consulta adicional (opcional)
        <input
          className="field"
          name="custom_note"
          maxLength={200}
          value={customNote}
          onChange={(e) => setCustomNote(e.target.value)}
          placeholder="Cuéntanos cualquier detalle adicional sobre tu caso o grupo familiar..."
        />
      </label>

      <label className="sm:col-span-2 flex gap-3 items-start text-[11px] leading-5 text-[#0A033C]/80">
        <Checkbox
          checked={consent}
          onCheckedChange={(v) => setConsent(v === true)}
          aria-label="Autorizo el contacto"
        />
        Autorizo el envío de estos datos a Victoria Yañez Asesorías para recibir orientación
        independiente y 100% gratuita sobre mi plan de salud.
      </label>

      {error && (
        <p role="alert" className="sm:col-span-2 text-destructive text-xs font-semibold">
          {error}
        </p>
      )}

      {smtpErrorDetail && (
        <div
          role="alert"
          className="sm:col-span-2 rounded-xl border-2 border-[#E91E8C] bg-[#FFF5FA] p-4 text-xs text-[#0A033C] space-y-2.5"
        >
          <div className="flex items-start gap-2.5">
            <AlertTriangle size={18} className="text-[#E91E8C] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-extrabold text-[#12056E]">
                No se pudo completar el envío por correo electrónico
              </p>
              <p className="text-[#0A033C]/85 leading-5">{smtpErrorDetail}</p>
            </div>
          </div>
          <div className="pt-1 flex flex-col sm:flex-row gap-2">
            <a
              href={whatsappSummaryUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-magenta justify-center !py-2.5 !px-4 !text-xs"
            >
              <MessageCircle size={15} />
              Enviar resumen directo al WhatsApp ({WHATSAPP_DISPLAY})
            </a>
          </div>
        </div>
      )}

      <div className="sm:col-span-2 flex flex-col sm:flex-row gap-3 pt-1">
        <button
          disabled={busy}
          type="submit"
          className="btn-magenta flex-1 h-12 !text-xs sm:!text-sm disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {busy ? <Loader2 size={17} className="animate-spin" /> : <ArrowRight size={17} />}
          {busy ? "Enviando solicitud..." : "Solicitar Asesoría 100% Gratuita"}
        </button>

        <a
          href={whatsappSummaryUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#12056E] hover:bg-[#1B0994] text-white font-extrabold text-xs sm:text-sm px-5 h-12 transition-colors shadow-md"
        >
          <MessageCircle size={17} className="text-[#F01E8E]" />
          Abrir directo en WhatsApp
        </a>
      </div>

      <div className="sm:col-span-2 pt-2 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#0A033C]/70">
        <span className="flex items-center gap-1.5">
          <LockKeyhole size={13} className="text-[#12056E]" />
          Atención directa al <strong>{WHATSAPP_DISPLAY}</strong> · 100% gratuito y confidencial.
        </span>

        <button
          type="button"
          disabled={testingSmtp}
          onClick={runInternalSmtpTest}
          className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#12056E] hover:text-[#E91E8C] underline cursor-pointer disabled:opacity-50"
        >
          {testingSmtp ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
          {testingSmtp ? "Verificando conexión SMTP..." : "Probar envío de correo SMTP"}
        </button>
      </div>

      {testResult && (
        <div
          role="status"
          className={`sm:col-span-2 rounded-xl p-3.5 text-xs flex items-start gap-2.5 border ${
            testResult.ok
              ? "bg-[#F6F5FF] border-[#12056E]/30 text-[#12056E]"
              : "bg-amber-50 border-amber-300 text-amber-900"
          }`}
        >
          {testResult.ok ? (
            <MailCheck size={16} className="text-[#E91E8C] shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
          )}
          <span className="leading-5">{testResult.message}</span>
        </div>
      )}
    </form>
  );
}
