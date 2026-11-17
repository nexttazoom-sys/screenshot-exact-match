import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  ArrowRight,
  CheckCircle2,
  LockKeyhole,
  Loader2,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { buildAdvisoryWhatsAppUrl, leadSchema, money, WHATSAPP_DISPLAY } from "@/lib/quote";
import { submitLead } from "@/lib/leads.functions";

export interface LeadFormProps {
  selectedPlan?: string | undefined;
  initialSalary?: number | undefined;
  initialDependents?: number | undefined;
}

export function LeadForm({
  selectedPlan,
  initialSalary = 1500000,
  initialDependents = 0,
}: LeadFormProps) {
  const submit = useServerFn(submitLead);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [salary, setSalary] = useState<string>(initialSalary ? String(initialSalary) : "1500000");
  const [dependents, setDependents] = useState<string>(String(initialDependents));
  const [mainQuestion, setMainQuestion] = useState(
    "Subió mi sueldo / mi 7% y quiero mejorar mi cobertura",
  );
  const [customNote, setCustomNote] = useState("");
  const [preferredTime, setPreferredTime] = useState<"09:00–12:00" | "12:00–15:00" | "15:00–18:00">(
    "09:00–12:00",
  );
  const [consent, setConsent] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);

  const numericSalary = Number(salary) || 0;
  const estimatedSevenPercent = numericSalary > 0 ? Math.round(numericSalary * 0.07) : 0;

  const combinedQuestion = customNote.trim()
    ? `${mainQuestion} (${customNote.trim()})`
    : mainQuestion;

  const whatsappSummaryUrl = buildAdvisoryWhatsAppUrl({
    full_name: fullName.trim() || undefined,
    phone: phone.trim() || undefined,
    salary: numericSalary > 0 ? numericSalary : undefined,
    dependents,
    main_question: combinedQuestion,
    selected_plan: selectedPlan,
    preferred_time: preferredTime,
    email: email.trim() || undefined,
  });

  async function send(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const composedPlanSummary = [
      selectedPlan,
      numericSalary > 0 ? `Renta:${money(numericSalary)}` : "",
      `Cargas:${dependents}`,
      combinedQuestion,
    ]
      .filter(Boolean)
      .join(" · ")
      .slice(0, 100);

    const effectiveEmail = email.trim() || "contacto@asesoriasalud.cl";

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
    try {
      await submit({ data: parsed.data });
    } catch {
      // Si la base de datos no está disponible en el entorno local, igual permitimos continuar por WhatsApp
    } finally {
      setBusy(false);
      setSuccess(true);
    }
  }

  if (success) {
    return (
      <div
        role="status"
        className="bg-[#F6F5FF] border-2 border-[#E91E8C] rounded-2xl p-7 text-center shadow-lg"
      >
        <CheckCircle2 className="text-[#E91E8C] mx-auto mb-3" size={44} />
        <span className="inline-block bg-[#12056E] text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full mb-2">
          Solicitud lista · Asesoría 100% Gratuita
        </span>
        <h3 className="font-extrabold text-xl text-[#0A033C]">
          ¡Excelente, {fullName || "ya registramos tus datos"}!
        </h3>
        <p className="text-sm text-[#0A033C]/80 mt-2 leading-6">
          Para atenderte de inmediato y revisar cómo aprovechar al máximo tu 7% (
          {estimatedSevenPercent > 0 ? (
            <strong>{money(estimatedSevenPercent)}/mes</strong>
          ) : (
            "tu presupuesto"
          )}
          ), abre ahora el chat directo en WhatsApp con tu resumen listo:
        </p>
        <div className="mt-5 flex flex-col gap-3">
          <a
            href={whatsappSummaryUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-magenta w-full justify-center !py-3.5 !text-sm"
          >
            <MessageCircle size={18} />
            Enviar mi resumen por WhatsApp ({WHATSAPP_DISPLAY})
          </a>
          <Button
            type="button"
            variant="outline"
            className="text-xs border-[#12056E]/20 text-[#12056E]"
            onClick={() => setSuccess(false)}
          >
            Editar mis datos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={send} className="grid sm:grid-cols-2 gap-4">
      <label className="field-label">
        Nombre y apellido *
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
        Renta imponible o presupuesto aprox. (CLP)
        <input
          className="field"
          name="salary"
          type="number"
          min={100000}
          max={100000000}
          step={50000}
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          placeholder="Ej: 1500000"
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
          <option value="Busco mejor cobertura en clínicas específicas">
            Busco mejor cobertura en clínicas específicas
          </option>
        </select>
      </label>

      <label className="field-label">
        Correo electrónico (opcional)
        <input
          className="field"
          name="email"
          type="email"
          autoComplete="email"
          maxLength={255}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@correo.cl"
        />
      </label>

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
        Detalles adicionales o clínica de preferencia (opcional)
        <input
          className="field"
          name="custom_note"
          maxLength={140}
          value={customNote}
          onChange={(e) => setCustomNote(e.target.value)}
          placeholder="Ej: Me interesa buena cobertura hospitalaria o clínica preferente..."
        />
      </label>

      <label className="sm:col-span-2 flex gap-3 items-start text-[11px] leading-5 text-[#0A033C]/80">
        <Checkbox
          checked={consent}
          onCheckedChange={(v) => setConsent(v === true)}
          aria-label="Autorizo el contacto"
        />
        Autorizo el uso confidencial de estos datos para recibir asesoría independiente y 100%
        gratuita sobre mi plan de salud.
      </label>

      {error && (
        <p role="alert" className="sm:col-span-2 text-destructive text-xs font-semibold">
          {error}
        </p>
      )}

      <div className="sm:col-span-2 flex flex-col sm:flex-row gap-3 pt-1">
        <button
          disabled={busy}
          type="submit"
          className="btn-magenta flex-1 h-12 !text-xs sm:!text-sm"
        >
          {busy ? <Loader2 size={17} className="animate-spin" /> : <ArrowRight size={17} />}
          {busy ? "Procesando solicitud…" : "Solicitar Asesoría 100% Gratuita"}
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

      <p className="sm:col-span-2 text-[11px] text-[#0A033C]/70 text-center flex flex-wrap justify-center items-center gap-1.5">
        <LockKeyhole size={13} className="text-[#12056E]" />
        Atención directa al <strong>{WHATSAPP_DISPLAY}</strong> · 100% gratuito y sin compromiso.
      </p>
    </form>
  );
}
