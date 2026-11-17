import { useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  ShieldCheck,
  Info,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import {
  buildAdvisoryWhatsAppUrl,
  defaultQuote,
  money,
  quoteSchema,
  regions,
  simulateQuote,
  WHATSAPP_DISPLAY,
  type QuoteInput,
} from "@/lib/quote";
import { LeadForm } from "./lead-form";

export function QuoteFields({
  value,
  onChange,
  compact = false,
}: {
  value: QuoteInput;
  onChange: (q: QuoteInput) => void;
  compact?: boolean;
}) {
  const set = (key: keyof QuoteInput, val: string) =>
    onChange({
      ...value,
      [key]: ["salary", "age", "dependents", "uf"].includes(key) ? Number(val) : val,
    });
  return (
    <>
      <label className="field-label">
        {compact ? "Renta imponible mensual (CLP)" : "Sueldo / renta imponible (CLP)"}
        <input
          className="field"
          type="number"
          min={100000}
          max={100000000}
          required
          value={value.salary || ""}
          onChange={(e) => set("salary", e.target.value)}
        />
      </label>
      <label className="field-label">
        Tu edad
        <input
          className="field"
          type="number"
          min={18}
          max={100}
          required
          value={value.age || ""}
          onChange={(e) => set("age", e.target.value)}
        />
      </label>
      <label className="field-label">
        Cargas familiares
        <select
          className="field"
          value={value.dependents}
          onChange={(e) => set("dependents", e.target.value)}
        >
          {Array.from({ length: 11 }, (_, i) => (
            <option key={i} value={i}>
              {i === 0 ? "Sin cargas" : `${i} ${i === 1 ? "carga" : "cargas"}`}
            </option>
          ))}
        </select>
      </label>
      <label className="field-label">
        Región
        <select
          className="field"
          value={value.region}
          onChange={(e) => set("region", e.target.value)}
        >
          {regions.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
      </label>
    </>
  );
}

export function QuoteWizard({
  open,
  onOpenChange,
  initial = defaultQuote,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial?: QuoteInput | undefined;
}) {
  const [q, setQ] = useState(initial);
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState("");

  function next() {
    if (!quoteSchema.safeParse(q).success) {
      setError("Revisa tu renta (desde $100.000) y edad (18 a 100 años).");
      return;
    }
    setError("");
    setStep(step + 1);
  }

  const plans = quoteSchema.safeParse(q).success ? simulateQuote(q) : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="wizard-dialog p-6 md:p-9 bg-white text-[#0A033C]">
        <div className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider text-[#E91E8C]">
          <Sparkles size={14} /> Asesoría Independiente 100% Gratuita
        </div>
        <DialogTitle className="text-2xl font-extrabold text-[#12056E]">
          Evalúa cómo rinde tu 7% de salud
        </DialogTitle>
        <DialogDescription className="text-[#0A033C]/75">
          Si subió tu sueldo, tu 7% también subió. Simula escenarios referenciales y optimiza tu
          cobertura con acompañamiento gratuito.
        </DialogDescription>

        <div className="grid grid-cols-3 gap-2 my-5">
          {["Tus datos y 7%", "Preferencias", "Escenarios y Asesoría"].map((s, i) => (
            <div
              key={s}
              className={`border-b-3 pb-3 text-xs font-extrabold ${
                step >= i + 1
                  ? "border-[#E91E8C] text-[#12056E]"
                  : "border-border text-muted-foreground"
              }`}
            >
              <span className="mr-1.5 text-[#E91E8C]">0{i + 1}</span>
              {s}
            </div>
          ))}
        </div>

        {step === 1 && (
          <>
            <div className="grid sm:grid-cols-2 gap-5">
              <QuoteFields value={q} onChange={setQ} />
              <label className="field-label sm:col-span-2">
                Situación laboral
                <select
                  className="field"
                  value={q.employment}
                  onChange={(e) =>
                    setQ({
                      ...q,
                      employment:
                        e.target.value === "Independiente" ? "Independiente" : "Dependiente",
                    })
                  }
                >
                  <option>Dependiente</option>
                  <option>Independiente</option>
                </select>
              </label>
            </div>
            <div className="mt-5 p-4 rounded-xl bg-[#F6F5FF] border-l-4 border-[#E91E8C] text-xs text-[#0A033C]">
              Tu 7% legal referencial es de{" "}
              <strong className="text-[#E91E8C] text-sm">{money(q.salary * 0.07)} al mes</strong>.
              Recuerda: cuando sube tu sueldo, este monto sube automáticamente, pero tu cobertura no
              mejora sola a menos que optimices tu plan.
            </div>
          </>
        )}

        {step === 2 && (
          <div className="grid sm:grid-cols-2 gap-5">
            <label className="field-label">
              Clínica o prestador de preferencia
              <input
                className="field"
                maxLength={100}
                value={q.clinic}
                onChange={(e) => setQ({ ...q, clinic: e.target.value })}
              />
              <span className="text-xs text-muted-foreground font-normal">
                Te ayudamos a comparar qué planes tienen mejor cobertura en tu clínica preferida.
              </span>
            </label>
            <label className="field-label">
              Tipo de cobertura buscada
              <select
                className="field"
                value={q.planType}
                onChange={(e) =>
                  setQ({
                    ...q,
                    planType:
                      e.target.value === "Cerrado"
                        ? "Cerrado"
                        : e.target.value === "Libre elección"
                          ? "Libre elección"
                          : "Preferente",
                  })
                }
              >
                <option>Preferente</option>
                <option>Libre elección</option>
                <option>Cerrado</option>
              </select>
            </label>
            <label className="field-label">
              Valor de UF referencial (CLP)
              <input
                className="field"
                type="number"
                min={1000}
                max={100000}
                value={q.uf}
                onChange={(e) => setQ({ ...q, uf: Number(e.target.value) })}
              />
            </label>
            <p className="text-xs text-muted-foreground leading-6 flex gap-2 items-start">
              <Info size={18} className="shrink-0 text-[#E91E8C]" />
              $40.000 es una referencia ilustrativa para estimar tu presupuesto en pesos. Puedes
              ajustarla si lo deseas.
            </p>
          </div>
        )}

        {step === 3 && (
          <>
            <div className="p-4 rounded-xl bg-[#12056E] text-white text-xs sm:text-sm mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span>
                  Perfil: <strong>{q.planType}</strong> · {q.region} ·{" "}
                  {q.dependents === 0 ? "Sin cargas" : `${q.dependents} carga(s)`}
                </span>
                <p className="text-white/80 text-xs mt-0.5">
                  Presupuesto 7% estimado:{" "}
                  <strong className="text-[#F01E8E]">{money(q.salary * 0.07)}/mes</strong>
                </p>
              </div>
              <a
                href={buildAdvisoryWhatsAppUrl({
                  salary: q.salary,
                  dependents: q.dependents,
                  region: q.region,
                  main_question: `Simulé mi 7% (${money(q.salary * 0.07)}/mes) y quiero revisar qué planes reales me dan la mejor cobertura`,
                  selected_plan: `${q.planType} · Clínica: ${q.clinic}`,
                })}
                target="_blank"
                rel="noreferrer"
                className="btn-magenta !py-2 !px-4 !text-xs"
              >
                <MessageCircle size={15} />
                Revisar por WhatsApp ({WHATSAPP_DISPLAY})
              </a>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {plans.map((p, i) => {
                const planWaUrl = buildAdvisoryWhatsAppUrl({
                  salary: q.salary,
                  dependents: q.dependents,
                  region: q.region,
                  selected_plan: `Escenario ${p.name} (${p.uf.toFixed(2)} UF/mes · ${q.planType})`,
                  main_question:
                    "Quiero comparar opciones reales equivalentes a este escenario con mi 7%",
                });

                return (
                  <article
                    key={p.name}
                    className={`benefit-card p-5 ${
                      i === 0 ? "!border-2 !border-[#E91E8C] !bg-[#F6F5FF]" : ""
                    }`}
                  >
                    <p className="text-[10px] text-[#E91E8C] font-extrabold uppercase tracking-wider">
                      {i === 0 ? "★ MEJOR AJUSTE A TU 7%" : "ESCENARIO COMPARATIVO"}
                    </p>
                    <h3 className="text-lg font-extrabold text-[#12056E] mt-2">Nivel {p.name}</h3>
                    <p className="plan-price mt-2">
                      {p.uf.toFixed(2)} <span className="text-sm font-medium">UF/mes</span>
                    </p>
                    <p className="text-xs text-muted-foreground font-semibold">
                      {money(p.price)} aprox. al mes
                    </p>
                    <div className="text-xs space-y-2.5 my-5 border-t border-b border-border py-3">
                      <p>
                        Bonif. Hospitalaria{" "}
                        <strong className="float-right text-[#12056E]">{p.hospital}%</strong>
                      </p>
                      <p>
                        Bonif. Ambulatoria{" "}
                        <strong className="float-right text-[#12056E]">{p.outpatient}%</strong>
                      </p>
                      <p>
                        Holgura frente a tu 7%{" "}
                        <strong className="float-right text-[#12056E]">{money(p.surplus)}</strong>
                      </p>
                      <p>
                        Diferencia adicional{" "}
                        <strong className="float-right text-[#E91E8C]">
                          {money(p.additional)}
                        </strong>
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <Button
                        className={`w-full ${
                          i === 0
                            ? "bg-[#E91E8C] hover:bg-[#F01E8E] text-white font-bold"
                            : "border-[#12056E] text-[#12056E] font-bold"
                        }`}
                        variant={i === 0 ? "default" : "outline"}
                        onClick={() => setSelected(p.name)}
                      >
                        Dejar mis datos <ArrowRight size={15} />
                      </Button>
                      <a
                        href={planWaUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 text-[11px] font-extrabold text-[#12056E] hover:text-[#E91E8C] py-1.5 transition-colors"
                      >
                        <MessageCircle size={13} className="text-[#E91E8C]" />
                        Consultar este nivel por WhatsApp
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>

            <p className="text-[11px] text-muted-foreground leading-5 mt-4">
              Nota de transparencia: Los escenarios, valores en UF y porcentajes de bonificación son
              simulaciones ilustrativas para dimensionar tu presupuesto y no constituyen planes
              comerciales oficiales. En tu asesoría gratuita comparamos planes reales vigentes según
              tabla de factores oficial, GES, topes y redes clínicas.
            </p>

            {selected && (
              <div className="border-t-2 border-[#E91E8C]/30 mt-6 pt-6">
                <h3 className="font-extrabold text-lg text-[#12056E] mb-2">
                  Solicita tu comparativa real basada en el escenario {selected}
                </h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Completa tus datos o envíalos directo a nuestro WhatsApp{" "}
                  <strong>{WHATSAPP_DISPLAY}</strong>:
                </p>
                <LeadForm
                  selectedPlan={`Nivel ${selected} · ${q.region} · ${q.clinic} · ${q.planType}`.slice(
                    0,
                    100,
                  )}
                  initialSalary={q.salary}
                  initialDependents={q.dependents}
                />
              </div>
            )}
          </>
        )}

        {error && (
          <p role="alert" className="text-destructive text-sm font-semibold mt-4">
            {error}
          </p>
        )}

        <div className="flex items-center justify-between mt-7 pt-4 border-t border-border">
          <span className="text-[11px] text-[#12056E] font-bold flex gap-1.5 items-center">
            <ShieldCheck size={15} className="text-[#E91E8C]" /> Asesoría 100% gratuita ·{" "}
            {WHATSAPP_DISPLAY}
          </span>
          <div className="flex gap-3">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={() => {
                  setStep(step - 1);
                  setSelected("");
                }}
              >
                <ArrowLeft /> Atrás
              </Button>
            )}
            {step < 3 && (
              <button type="button" className="btn-magenta !py-2.5 !px-5 !text-xs" onClick={next}>
                {step === 2 ? "Ver mis escenarios" : "Continuar"} <ArrowRight size={15} />
              </button>
            )}
            {step === 3 && (
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                <Check /> Cerrar
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
