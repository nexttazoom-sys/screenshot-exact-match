import { useState } from "react";
import { MessageCircle, ArrowRight, SlidersHorizontal, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { buildAdvisoryWhatsAppUrl, buildWhatsAppUrl, money, WHATSAPP_DISPLAY } from "@/lib/quote";

export interface ComparablePlan {
  id: string;
  name: string;
  category: "7-exacto" | "familiar" | "alta-clinica" | "libre-eleccion";
  categoryLabel: string;
  networkType: string;
  clinics: string;
  hospitalPct: number;
  outpatientPct: number;
  ufCost: number;
  idealFor: string;
}

const COMPARABLE_PLANS: ComparablePlan[] = [
  {
    id: "plan-base-7",
    name: "Plan Optimiza tu 7%",
    category: "7-exacto",
    categoryLabel: "Ajustado a tu 7%",
    networkType: "Red Preferente Regional y RM",
    clinics: "Clínica Dávila, Hospital Clínico Indisa, Andes Salud El Loa, RedSalud Iquique",
    hospitalPct: 90,
    outpatientPct: 70,
    ufCost: 1.75,
    idealFor:
      "Cotizantes desde $1.000.000 de renta que buscan aprovechar su 7% sin pagar diferencia adicional.",
  },
  {
    id: "plan-quirurgico-plus",
    name: "Plan Cobertura Quirúrgica Preferente",
    category: "familiar",
    categoryLabel: "Familiar y Cirugías",
    networkType: "Red Preferente Hospitalaria",
    clinics: "Santa María, Clínica Dávila, Isamédica, Ciudad del Mar, Vida Integral, UC Católica",
    hospitalPct: 100,
    outpatientPct: 80,
    ufCost: 2.55,
    idealFor:
      "Hogares que priorizan respaldo hospitalario y quirúrgico con alta cobertura en clínicas líderes.",
  },
  {
    id: "plan-alta-clinica",
    name: "Plan Clínica Preferente 90/80",
    category: "alta-clinica",
    categoryLabel: "Alta Cobertura Clínica",
    networkType: "Preferente alta complejidad",
    clinics: "Clínica Alemana, UC Católica, Santa María, Las Condes y red nacional",
    hospitalPct: 90,
    outpatientPct: 80,
    ufCost: 3.45,
    idealFor: "Cotizantes que desean máxima tranquilidad ante cirugías y alta complejidad.",
  },
  {
    id: "plan-libre-eleccion",
    name: "Plan Libre Elección Flexible",
    category: "libre-eleccion",
    categoryLabel: "Libre Elección",
    networkType: "Libre elección nacional",
    clinics: "Cualquier clínica, centro médico o médico particular del país",
    hospitalPct: 90,
    outpatientPct: 80,
    ufCost: 3.95,
    idealFor: "Familias que se atienden con médicos particulares en distintas clínicas de Chile.",
  },
];

export interface IsapreInfo {
  name: string;
  code: string;
  badge: string;
  featured?: boolean | undefined;
  group: "destacadas" | "7-ajuste" | "regiones" | "alta-complejidad";
  summary: string;
  clinics: string;
  coverageStrength: string;
  familyBenefit: string;
}

const ISAPRES_DATA: IsapreInfo[] = [
  {
    name: "Banmédica",
    code: "BA",
    badge: "Red Preferente Consolidada",
    featured: true,
    group: "destacadas",
    summary:
      "Destaca por su equilibrio entre valor del plan y acceso preferente a una red propia de clínicas líderes para toda la familia.",
    clinics:
      "Santa María, Clínica Dávila, Isamédica, Ciudad del Mar, Vida Integral, UC Católica, Hospital Clínico Indisa.",
    coverageStrength: "Bonificaciones de hasta 90%–100% hospitalario dentro de su red preferente.",
    familyBenefit:
      "Excelente alternativa para intervención quirúrgica sin tope en prótesis, órtesis y elementos de osteosíntesis (manguito rotador, columna, disco, rodilla) con copago cero.",
  },
  {
    name: "CruzBlanca",
    code: "CR",
    badge: "Red Integrada y Cobertura Norte / Nacional",
    featured: true,
    group: "destacadas",
    summary:
      "Integra cobertura ambulatoria y hospitalaria con convenios preferentes de alto porcentaje en regiones y Santiago, facilitando exámenes y hospitalización.",
    clinics:
      "100% Andes Salud El Loa, RedSalud Iquique, Clínica Bupa Santiago, Bupa Reñaca, Bupa Antofagasta y red Integramédica.",
    coverageStrength:
      "Fuerte bonificación hospitalaria y ambulatoria en clínicas regionales preferentes y centros médicos.",
    familyBenefit:
      "Programas de bienestar familiar, orientación médica continua y excelente cobertura en zona norte y central.",
  },
  {
    name: "Nueva Masvida",
    code: "NU",
    badge: "Fuerte Presencia Regional y Dental",
    featured: true,
    group: "destacadas",
    summary:
      "Ofrece planes versátiles con excelente recepción en clínicas regionales y prestadores de alta complejidad en Santiago y todo Chile.",
    clinics:
      "Clínica Atacama, Indisa Puerto Montt, Clínica Las Condes, Clínico del Sur, Antofagasta, Clínica Los Leones, Clínica Lircay.",
    coverageStrength: "Planes preferentes y libre elección con tarifas competitivas en UF.",
    familyBenefit:
      "Dental 80% sin tope en prótesis fijas y removibles, frenillos, y reembolsos en 24 horas por WhatsApp.",
  },
  {
    name: "Colmena",
    code: "CO",
    badge: "Fortaleza en Libre Elección",
    group: "alta-complejidad",
    summary:
      "Reconocida por su solidez en planes de libre elección y convenios con clínicas de alta complejidad en Santiago y regiones.",
    clinics: "UC Christus, San Carlos de Apoquindo, Los Andes, Meds, Sanatorio Alemán.",
    coverageStrength:
      "Altos topes de reembolso ambulatorio y hospitalario en prestadores diversos.",
    familyBenefit:
      "Programas preventivos familiares, reembolso ágil en app y descuentos en farmacias.",
  },
  {
    name: "Consalud",
    code: "CS",
    badge: "Cobertura Nacional y Digital",
    group: "7-ajuste",
    summary:
      "Ideal para optimizar el 7% legal con planes competitivos y acceso directo a una extensa red médica en todo el país.",
    clinics: "Clínicas y Centros Médicos RedSalud en Santiago y de Arica a Magallanes.",
    coverageStrength: "Planes muy eficientes para rentas desde $1.000.000 y grupos familiares.",
    familyBenefit: "Bonificación instantánea en farmacias, telemedicina y gestión 100% online.",
  },
  {
    name: "Vida Tres",
    code: "VT",
    badge: "Alta Protección Clínica",
    group: "alta-complejidad",
    summary:
      "Orientada a quienes priorizan acceso a clínicas de primer nivel y mayores topes anuales en hospitalización y cirugías.",
    clinics: "Clínica Alemana, Las Condes, Santa María, UC Católica y Clínica Ciudad del Mar.",
    coverageStrength: "Amplio respaldo en prestaciones de alto costo y libre elección.",
    familyBenefit:
      "Atención preferencial, convenios de maternidad y protección hospitalaria superior.",
  },
  {
    name: "Esencial",
    code: "ES",
    badge: "Respaldo Grupo Alemana",
    group: "alta-complejidad",
    summary:
      "Isapre moderna y digital vinculada a Corporación Chileno Alemana de Beneficencia, enfocada en resolutividad y experiencia simple.",
    clinics: "Clínica Alemana de Santiago, Temuco, Valdivia y Osorno, más red complementaria.",
    coverageStrength: "Planes claros con cobertura preferente en la red Alemana y telemedicina.",
    familyBenefit:
      "Ideal para hogares que buscan respaldo clínico de excelencia con gestión digital.",
  },
];

export function PlanComparator() {
  const [filter, setFilter] = useState<string>("todos");
  const [monthlySalary, setMonthlySalary] = useState<number>(1500000);

  const ufReference = 40000;
  const safeSalary = Math.max(1000000, monthlySalary);
  const sevenPercentCLP = Math.round(safeSalary * 0.07);

  const visiblePlans =
    filter === "todos" ? COMPARABLE_PLANS : COMPARABLE_PLANS.filter((p) => p.category === filter);

  return (
    <section id="comparador" className="section bg-[#F6F5FF]">
      <div className="site-container">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <span className="eyebrow inline-flex items-center gap-1.5">
              <SlidersHorizontal size={14} /> COMPARADOR INTERACTIVO DE OPCIONES
            </span>
            <h2 className="section-title mt-2">
              Compara alternativas lado a lado según tu{" "}
              <span className="text-[#E91E8C]">necesidad familiar</span>
            </h2>
            <p className="section-subtitle max-w-2xl">
              Ajusta tu renta imponible aproximada (desde $1.000.000) y filtra por tu prioridad para
              revisar opciones de cobertura clínica, bonificaciones y calce con tu 7%.
            </p>
          </div>

          {/* Control rápido de renta con mínimo $1.000.000 */}
          <div className="bg-white border-2 border-[#12056E]/15 rounded-2xl p-4 shadow-sm min-w-[280px]">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#12056E] block">
              Tu renta imponible aprox.: <span className="text-[#E91E8C]">{money(safeSalary)}</span>
            </label>
            <input
              type="range"
              min={1000000}
              max={4500000}
              step={100000}
              value={safeSalary}
              onChange={(e) => setMonthlySalary(Math.max(1000000, Number(e.target.value)))}
              className="w-full accent-[#E91E8C] mt-2 cursor-pointer"
              aria-label="Renta imponible aproximada desde un millón de pesos"
            />
            <div className="flex justify-between items-center text-[10px] text-[#0A033C]/65 mt-0.5">
              <span>Mín: $1.000.000</span>
              <span>Máx: $4.500.000+</span>
            </div>
            <div className="flex justify-between items-center text-xs mt-1.5 pt-1.5 border-t border-border">
              <span className="text-[#0A033C]/70">Tu 7% mensual estimado:</span>
              <strong className="text-[#12056E] bg-[#F6F5FF] px-2.5 py-0.5 rounded-full">
                {money(sevenPercentCLP)}/mes
              </strong>
            </div>
          </div>
        </div>

        {/* Filtros por necesidad */}
        <div className="flex flex-wrap gap-2.5 mb-7" role="tablist" aria-label="Filtrar planes">
          {[
            { id: "todos", label: "Todas las opciones" },
            { id: "7-exacto", label: "Ajustado a tu 7%" },
            { id: "familiar", label: "Familiar y Cirugías" },
            { id: "alta-clinica", label: "Alta Cobertura Clínica" },
            { id: "libre-eleccion", label: "Libre Elección" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`filter-pill ${filter === tab.id ? "filter-pill-active" : ""}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tarjetas de opciones */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {visiblePlans.map((plan) => {
            const estPriceCLP = Math.round(plan.ufCost * ufReference);
            const diffCLP = sevenPercentCLP - estPriceCLP;

            return (
              <article key={plan.id} className="benefit-card flex flex-col justify-between !p-5">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#12056E] text-white">
                      {plan.categoryLabel}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-[#12056E] mt-3">{plan.name}</h3>
                  <p className="text-xs text-[#0A033C]/75 mt-1 leading-5">{plan.idealFor}</p>

                  <div className="mt-4 pt-3 border-t border-border">
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl font-extrabold text-[#12056E]">
                        {plan.ufCost.toFixed(2)} <small className="text-xs font-bold">UF/mes</small>
                      </span>
                      <span className="text-xs font-bold text-[#0A033C]/70">
                        ~{money(estPriceCLP)}
                      </span>
                    </div>
                    <p
                      className={`text-[11px] font-extrabold mt-1 ${
                        diffCLP >= 0 ? "text-[#12056E]" : "text-[#E91E8C]"
                      }`}
                    >
                      {diffCLP >= 0
                        ? `✓ Cubierto con tu 7% (holgura ~${money(diffCLP)})`
                        : `Aporte adicional aprox.: ${money(Math.abs(diffCLP))}/mes`}
                    </p>
                  </div>

                  <div className="space-y-2.5 mt-4 text-xs">
                    <div>
                      <div className="flex justify-between font-bold mb-1">
                        <span>Bonif. Hospitalaria</span>
                        <span className="text-[#12056E]">{plan.hospitalPct}%</span>
                      </div>
                      <div className="coverage-bar-track">
                        <div
                          className="coverage-bar-fill"
                          style={{ width: `${plan.hospitalPct}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-bold mb-1">
                        <span>Bonif. Ambulatoria</span>
                        <span className="text-[#12056E]">{plan.outpatientPct}%</span>
                      </div>
                      <div className="coverage-bar-track">
                        <div
                          className="coverage-bar-fill"
                          style={{ width: `${plan.outpatientPct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#0A033C]/80 mt-3 leading-5">
                    <strong className="text-[#12056E]">Clínicas destacadas:</strong> {plan.clinics}
                  </p>
                </div>

                <a
                  href={buildAdvisoryWhatsAppUrl({
                    salary: safeSalary,
                    selected_plan: `${plan.name} (${plan.ufCost} UF ref.)`,
                    main_question: `Me interesó "${plan.name}" con mi renta aprox. de ${money(safeSalary)} y quiero ver opciones reales en Isapres`,
                  })}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-magenta w-full mt-4 !py-2.5 !text-xs"
                >
                  <MessageCircle size={15} />
                  Consultar esta opción
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function IsapresDirectory() {
  const [activeGroup, setActiveGroup] = useState<string>("todas");

  const filteredIsapres =
    activeGroup === "todas"
      ? ISAPRES_DATA
      : activeGroup === "destacadas"
        ? ISAPRES_DATA.filter((item) => item.featured)
        : ISAPRES_DATA.filter((item) => item.group === activeGroup);

  return (
    <section id="isapres" className="section bg-white">
      <div className="site-container">
        <div className="text-center max-w-3xl mx-auto">
          <span className="eyebrow inline-flex items-center gap-1.5">
            <Sparkles size={14} /> GUÍA CLARA DE ISAPRES EN CHILE
          </span>
          <h2 className="section-title mt-2">
            Beneficios y fortalezas de cada <span className="text-[#E91E8C]">Isapre</span>
          </h2>
          <p className="section-subtitle">
            Como asesoría independiente, comparamos las instituciones del mercado destacando las
            mejores redes clínicas, coberturas quirúrgicas y beneficios regionales para tu familia.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2.5 mt-7 mb-9">
          {[
            { id: "todas", label: "Todas las Isapres (7)" },
            { id: "destacadas", label: "★ Destacadas: Banmédica · CruzBlanca · Nueva Masvida" },
            { id: "alta-complejidad", label: "Alta Complejidad y Libre Elección" },
            { id: "7-ajuste", label: "Ajuste al 7%" },
          ].map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setActiveGroup(g.id)}
              className={`filter-pill ${activeGroup === g.id ? "filter-pill-active" : ""}`}
            >
              {g.label}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIsapres.map((isa) => {
            const waUrl = buildWhatsAppUrl(
              `Hola, quiero recibir asesoría gratuita para cotizar planes de Isapre ${isa.name} según mi 7% y grupo familiar.`,
            );

            return (
              <article
                key={isa.name}
                className={`benefit-card flex flex-col justify-between hover:border-[#E91E8C] ${
                  isa.featured ? "border-[#E91E8C]/45 shadow-md" : ""
                }`}
              >
                <div>
                  <div className="flex items-center gap-3.5">
                    <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#12056E] to-[#1B0994] text-white font-extrabold text-sm flex items-center justify-center shadow-md border border-[#E91E8C]/40 shrink-0">
                      {isa.code}
                    </span>
                    <div>
                      <h3 className="font-extrabold text-lg text-[#12056E] leading-tight">
                        Isapre {isa.name}
                      </h3>
                      <span className="text-xs font-extrabold text-[#E91E8C] block mt-0.5">
                        {isa.badge}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#0A033C]/80 leading-6 mt-4">{isa.summary}</p>

                  <div className="mt-4 pt-3.5 border-t border-border space-y-2.5 text-xs">
                    <div>
                      <strong className="text-[#12056E] block">Red clínica destacada:</strong>
                      <span className="text-[#0A033C]/85 leading-5">{isa.clinics}</span>
                    </div>
                    <div>
                      <strong className="text-[#12056E] block">Bonificación y planes:</strong>
                      <span className="text-[#0A033C]/85 leading-5">{isa.coverageStrength}</span>
                    </div>
                    <div>
                      <strong className="text-[#E91E8C] block">Beneficio familiar clave:</strong>
                      <span className="text-[#0A033C]/85 leading-5">{isa.familyBenefit}</span>
                    </div>
                  </div>
                </div>

                <a
                  href={waUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 pt-3.5 border-t border-border inline-flex items-center justify-between text-xs font-extrabold text-[#12056E] hover:text-[#E91E8C] transition-colors"
                >
                  <span>Cotizar planes de {isa.name} gratis</span>
                  <ArrowRight size={15} className="text-[#E91E8C]" />
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Benefits({ full = false }: { full?: boolean }) {
  const waHref = buildWhatsAppUrl(
    "Hola, quiero asesoría independiente 100% gratuita para revisar mi 7% y elegir el mejor plan para mi familia.",
  );

  return (
    <>
      <PlanComparator />
      <IsapresDirectory />

      {full && (
        <section className="section pt-0">
          <div className="site-container">
            <div className="rounded-3xl bg-gradient-to-br from-[#12056E] to-[#1B0994] text-white p-7 md:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="max-w-xl">
                <span className="eyebrow-pill">ACOMPAÑAMIENTO GRATUITO</span>
                <h3 className="text-2xl font-extrabold mt-3">
                  ¿No sabes qué Isapre o red clínica le conviene más a tu familia?
                </h3>
                <p className="text-white/85 text-xs sm:text-sm leading-6 mt-2">
                  Escríbenos directamente por WhatsApp al <strong>{WHATSAPP_DISPLAY}</strong> y te
                  preparamos una comparativa personalizada sin costo ni compromiso.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 shrink-0">
                <a href={waHref} target="_blank" rel="noreferrer" className="btn-magenta !text-xs">
                  <MessageCircle size={16} />
                  Hablar por WhatsApp ({WHATSAPP_DISPLAY})
                </a>
                <Link to="/asesoria" className="btn-white-outline !text-xs">
                  Solicitar evaluación <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
