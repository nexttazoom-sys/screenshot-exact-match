import { useState } from "react";
import {
  Building2,
  HeartPulse,
  ShieldPlus,
  TrendingUp,
  Users,
  MessageCircle,
  ArrowRight,
  CheckCircle2,
  SlidersHorizontal,
  Sparkles,
  Scale,
  Check,
} from "lucide-react";
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
  protectionLevel:
    "Esencial Hogar" | "Equilibrio Familiar" | "Protección Total" | "Libre Elección Plus";
  idealFor: string;
  highlights: string[];
}

const COMPARABLE_PLANS: ComparablePlan[] = [
  {
    id: "red-hogar-7",
    name: "Plan Red Preferente 7%",
    category: "7-exacto",
    categoryLabel: "Ajustado a tu 7%",
    networkType: "Preferente inteligente",
    clinics: "RedSalud, Dávila, Bupa, Integramédica y clínicas regionales",
    hospitalPct: 80,
    outpatientPct: 70,
    ufCost: 2.35,
    protectionLevel: "Esencial Hogar",
    idealFor: "Quienes subieron de sueldo y buscan mejorar cobertura sin pagar adicional.",
    highlights: [
      "Se financia íntegramente con un 7% desde $1.350.000 aprox.",
      "Copagos conocidos en consultas y exámenes frecuentes",
      "Urgencia y hospitalización preferente en red nacional",
    ],
  },
  {
    id: "familia-protegida",
    name: "Plan Familia & Cargas",
    category: "familiar",
    categoryLabel: "Familiar / Cargas",
    networkType: "Preferente familiar ampliada",
    clinics: "Santa María, Indisa, UC Christus, Sanatorio Alemán, Ciudad del Mar",
    hospitalPct: 90,
    outpatientPct: 75,
    ufCost: 3.1,
    protectionLevel: "Equilibrio Familiar",
    idealFor: "Hogares con pareja o hijos que priorizan pediatría, urgencias y hospitalización.",
    highlights: [
      "Excelente relación factor familiar vs. bonificación pediátrica",
      "Descuentos en farmacias y orientación médica pediátrica 24/7",
      "Cobertura dental preventiva para cargas familiares",
    ],
  },
  {
    id: "alta-cobertura",
    name: "Plan Clínica Preferente 90/80",
    category: "alta-clinica",
    categoryLabel: "Alta Cobertura Clínica",
    networkType: "Preferente alta complejidad",
    clinics: "Clínica Alemana, UC Christus, Los Andes, Las Condes y red nacional",
    hospitalPct: 90,
    outpatientPct: 80,
    ufCost: 3.75,
    protectionLevel: "Protección Total",
    idealFor: "Cotizantes que desean máxima tranquilidad ante cirugías y alta complejidad.",
    highlights: [
      "Topes hospitalarios altos en clínicas de primer nivel",
      "Bonificación preferente en imágenes, laboratorio y kinesiología",
      "Respaldo integral GES + cobertura catastrófica CAEC",
    ],
  },
  {
    id: "libre-eleccion-flex",
    name: "Plan Libre Elección Flexible",
    category: "libre-eleccion",
    categoryLabel: "Libre Elección",
    networkType: "Libre elección nacional",
    clinics: "Cualquier clínica, centro médico o médico particular del país",
    hospitalPct: 90,
    outpatientPct: 80,
    ufCost: 4.15,
    protectionLevel: "Libre Elección Plus",
    idealFor: "Familias que se atienden con médicos particulares en distintas clínicas.",
    highlights: [
      "Libertad para elegir especialista sin depender de un solo prestador",
      "Reembolso web rápido de boletas y consultas particulares",
      "Amplia cobertura en Santiago y todas las regiones",
    ],
  },
];

export interface IsapreInfo {
  name: string;
  badge: string;
  group: "7-ajuste" | "regiones" | "alta-complejidad";
  summary: string;
  clinics: string;
  coverageStrength: string;
  familyBenefit: string;
}

const ISAPRES_DATA: IsapreInfo[] = [
  {
    name: "Colmena",
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
    name: "Banmédica",
    badge: "Red Preferente Consolidada",
    group: "7-ajuste",
    summary:
      "Destaca por su equilibrio entre valor del plan y acceso preferente a una red propia de clínicas líderes para toda la familia.",
    clinics: "Clínica Santa María, Dávila, Vespucio, Biobío, Ciudad del Mar y VidaIntegra.",
    coverageStrength: "Bonificaciones de hasta 90%–100% hospitalario dentro de su red preferente.",
    familyBenefit: "Excelente alternativa para grupos familiares que buscan copagos predecibles.",
  },
  {
    name: "Consalud",
    badge: "Cobertura Nacional y Digital",
    group: "regiones",
    summary:
      "Ideal para optimizar el 7% legal con planes competitivos y acceso directo a la red médica más extensa del país.",
    clinics: "Clínicas y Centros Médicos RedSalud en Santiago y de Arica a Magallanes.",
    coverageStrength: "Planes muy eficientes para rentas medias y jóvenes profesionales.",
    familyBenefit: "Bonificación instantánea en farmacias, telemedicina y gestión 100% online.",
  },
  {
    name: "CruzBlanca",
    badge: "Red Integrada Bupa",
    group: "7-ajuste",
    summary:
      "Integra cobertura ambulatoria y hospitalaria bajo el respaldo de la red Bupa, facilitando exámenes y consultas en un mismo ecosistema.",
    clinics: "Clínica Bupa Santiago, Bupa Reñaca, Bupa Antofagasta y red Integramédica.",
    coverageStrength: "Fuerte bonificación ambulatoria en centros médicos y urgencias en red.",
    familyBenefit: "Programas de bienestar familiar, orientación médica telefónica y dental.",
  },
  {
    name: "Nueva Masvida",
    badge: "Fuerte Presencia Regional",
    group: "regiones",
    summary:
      "Ofrece planes versátiles con excelente recepción en clínicas regionales y prestadores preferentes de la Región Metropolitana.",
    clinics:
      "Clínica Indisa, Bicentenario, Universitaria de Concepción, Puerto Montt y Antofagasta.",
    coverageStrength: "Planes preferentes y libre elección con tarifas competitivas en UF.",
    familyBenefit:
      "Alternativa muy valorada por familias en regiones y cotizantes que cambian de plan.",
  },
  {
    name: "Vida Tres",
    badge: "Alta Protección Clínica",
    group: "alta-complejidad",
    summary:
      "Orientada a quienes priorizan acceso a clínicas de primer nivel y mayores topes anuales en hospitalización y cirugías.",
    clinics: "Clínica Alemana, Las Condes, Santa María, UC Christus y Clínica Ciudad del Mar.",
    coverageStrength: "Amplio respaldo en prestaciones de alto costo y libre elección.",
    familyBenefit:
      "Atención preferencial, convenios de maternidad y protección hospitalaria superior.",
  },
  {
    name: "Esencial",
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

const corePillars = [
  {
    icon: TrendingUp,
    title: "Tu 7% convertido en bienestar real",
    text: "Cuando mejora tu sueldo, tu cotización sube sola. Revisamos gratis que ese esfuerzo mensual proteja mejor a tu familia.",
    tag: "Cuidamos el presupuesto de tu hogar",
    accent: true,
  },
  {
    icon: Building2,
    title: "La clínica donde confías atenderte",
    text: "Buscamos planes según los pediatras, especialistas y clínicas que te quedan cerca en Santiago o tu región.",
    tag: "Red clínica a tu medida",
    accent: false,
  },
  {
    icon: Users,
    title: "Protección para cada etapa familiar",
    text: "Ya sea para ti, en pareja o con hijos, comparamos todas las Isapres con calidez, transparencia y cero costo.",
    tag: "Asesoría humana y sin letra chica",
    accent: false,
  },
];

export function PlanComparator() {
  const [filter, setFilter] = useState<string>("todos");
  const [monthlySalary, setMonthlySalary] = useState<number>(1700000);
  const [comparedIds, setComparedIds] = useState<string[]>(["red-hogar-7", "familia-protegida"]);

  const ufReference = 40000;
  const sevenPercentCLP = Math.round(monthlySalary * 0.07);

  const visiblePlans =
    filter === "todos" ? COMPARABLE_PLANS : COMPARABLE_PLANS.filter((p) => p.category === filter);

  const toggleCompare = (id: string) => {
    setComparedIds((prev) =>
      prev.includes(id)
        ? prev.length > 1
          ? prev.filter((item) => item !== id)
          : prev
        : prev.length < 3
          ? [...prev, id]
          : [prev[1] ?? id, prev[2] ?? id, id],
    );
  };

  const comparedPlans = COMPARABLE_PLANS.filter((p) => comparedIds.includes(p.id));

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
              Ajusta tu renta aproximada, filtra por tu prioridad y selecciona hasta 3 opciones para
              contrastar cobertura clínica, bonificaciones y ajuste a tu 7%.
            </p>
          </div>

          {/* Control rápido de renta para ver calce con el 7% */}
          <div className="bg-white border-2 border-[#12056E]/15 rounded-2xl p-4 shadow-sm min-w-[270px]">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#12056E] block">
              Tu renta imponible aprox.:{" "}
              <span className="text-[#E91E8C]">{money(monthlySalary)}</span>
            </label>
            <input
              type="range"
              min={800000}
              max={4000000}
              step={100000}
              value={monthlySalary}
              onChange={(e) => setMonthlySalary(Number(e.target.value))}
              className="w-full accent-[#E91E8C] mt-2 cursor-pointer"
              aria-label="Renta imponible aproximada"
            />
            <div className="flex justify-between items-center text-xs mt-1">
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
            { id: "familiar", label: "Familiar y Cargas" },
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

        {/* Tarjetas de opciones seleccionables */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {visiblePlans.map((plan) => {
            const estPriceCLP = Math.round(plan.ufCost * ufReference);
            const diffCLP = sevenPercentCLP - estPriceCLP;
            const isSelected = comparedIds.includes(plan.id);

            return (
              <article
                key={plan.id}
                className={`benefit-card flex flex-col justify-between !p-5 ${
                  isSelected ? "!border-2 !border-[#E91E8C] ring-4 ring-[#E91E8C]/10" : ""
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#12056E] text-white">
                      {plan.categoryLabel}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleCompare(plan.id)}
                      className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full border transition-colors inline-flex items-center gap-1 ${
                        isSelected
                          ? "bg-[#E91E8C] text-white border-[#E91E8C]"
                          : "bg-white text-[#12056E] border-[#12056E]/25 hover:border-[#E91E8C]"
                      }`}
                    >
                      {isSelected ? <Check size={12} /> : <Scale size={12} />}
                      {isSelected ? "Comparando" : "Comparar"}
                    </button>
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
                    <strong className="text-[#12056E]">Clínicas tipo:</strong> {plan.clinics}
                  </p>
                </div>

                <a
                  href={buildAdvisoryWhatsAppUrl({
                    salary: monthlySalary,
                    selected_plan: `${plan.name} (${plan.ufCost} UF ref.)`,
                    main_question: `Me interesó el perfil "${plan.name}" en el comparador y quiero ver opciones reales en Isapres con mi 7%`,
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

        {/* Tabla comparativa lado a lado */}
        <div className="mt-8 bg-white rounded-3xl border-2 border-[#12056E]/12 p-5 sm:p-7 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#E91E8C]">
                VISTA LADO A LADO ({comparedPlans.length} SELECCIONADOS)
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold text-[#12056E]">
                Comparativa rápida para tu presupuesto de {money(sevenPercentCLP)}/mes (7%)
              </h3>
            </div>
            <span className="text-xs text-[#0A033C]/70">
              Haz clic en <strong>“Comparar”</strong> en las tarjetas superiores para cambiar las
              columnas
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b-2 border-[#12056E]/15">
                  <th className="py-3 pr-4 text-xs font-extrabold uppercase tracking-wider text-[#0A033C]/70 w-1/4">
                    Criterio clave
                  </th>
                  {comparedPlans.map((p) => (
                    <th key={p.id} className="py-3 px-4 text-sm font-extrabold text-[#12056E]">
                      <span className="inline-block text-[10px] text-[#E91E8C] uppercase tracking-wider block">
                        {p.protectionLevel}
                      </span>
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs">
                <tr>
                  <td className="py-3.5 pr-4 font-bold text-[#0A033C]">Tipo de red y clínicas</td>
                  {comparedPlans.map((p) => (
                    <td key={p.id} className="py-3.5 px-4 text-[#0A033C]/85 leading-5">
                      <strong className="text-[#12056E] block">{p.networkType}</strong>
                      {p.clinics}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-bold text-[#0A033C]">
                    Bonificación Hospitalaria / Ambulatoria
                  </td>
                  {comparedPlans.map((p) => (
                    <td key={p.id} className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 font-extrabold text-[#12056E] bg-[#F6F5FF] px-3 py-1 rounded-full">
                        {p.hospitalPct}% Hosp. · {p.outpatientPct}% Amb.
                      </span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-bold text-[#0A033C]">
                    Valor referencial frente a tu 7%
                  </td>
                  {comparedPlans.map((p) => {
                    const price = Math.round(p.ufCost * ufReference);
                    const diff = sevenPercentCLP - price;
                    return (
                      <td key={p.id} className="py-3.5 px-4">
                        <strong className="text-sm text-[#12056E]">{p.ufCost.toFixed(2)} UF</strong>{" "}
                        <span className="text-[#0A033C]/70">(~{money(price)}/mes)</span>
                        <span
                          className={`block text-[11px] font-bold mt-0.5 ${
                            diff >= 0 ? "text-[#12056E]" : "text-[#E91E8C]"
                          }`}
                        >
                          {diff >= 0
                            ? `Se cubre con tu 7% (sobra ~${money(diff)})`
                            : `Diferencia sobre tu 7%: ~${money(Math.abs(diff))}`}
                        </span>
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-bold text-[#0A033C]">Ventajas destacadas</td>
                  {comparedPlans.map((p) => (
                    <td key={p.id} className="py-3.5 px-4">
                      <ul className="space-y-1.5">
                        {p.highlights.map((h) => (
                          <li key={h} className="flex items-start gap-1.5 text-[#0A033C]/85">
                            <CheckCircle2 size={13} className="text-[#E91E8C] shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
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
            Como asesoría independiente, comparamos todas las instituciones del mercado para que
            conozcas de un vistazo qué ofrece cada una para tu hogar y tu presupuesto.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2.5 mt-7 mb-9">
          {[
            { id: "todas", label: "Todas las Isapres (7)" },
            { id: "7-ajuste", label: "Mejor calce con tu 7%" },
            { id: "regiones", label: "Fuerte red en Regiones y RM" },
            { id: "alta-complejidad", label: "Clínicas de Alta Complejidad y Libre Elección" },
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
              `Hola, quiero recibir asesoría gratuita para comparar planes de Isapre ${isa.name} según mi 7% y grupo familiar.`,
            );

            return (
              <article
                key={isa.name}
                className="benefit-card flex flex-col justify-between hover:border-[#E91E8C]"
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#12056E] to-[#1B0994] text-white font-extrabold text-sm flex items-center justify-center shadow-md border border-[#E91E8C]/40">
                        {isa.name.slice(0, 2).toUpperCase()}
                      </span>
                      <div>
                        <h3 className="font-extrabold text-lg text-[#12056E] leading-tight">
                          Isapre {isa.name}
                        </h3>
                        <span className="text-[11px] font-extrabold text-[#E91E8C]">
                          {isa.badge}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[#0A033C]/80 leading-6 mt-4">{isa.summary}</p>

                  <div className="mt-4 pt-3.5 border-t border-border space-y-2.5 text-xs">
                    <div>
                      <strong className="text-[#12056E] block">Red clínica destacada:</strong>
                      <span className="text-[#0A033C]/80">{isa.clinics}</span>
                    </div>
                    <div>
                      <strong className="text-[#12056E] block">Bonificación y planes:</strong>
                      <span className="text-[#0A033C]/80">{isa.coverageStrength}</span>
                    </div>
                    <div>
                      <strong className="text-[#E91E8C] block">Beneficio familiar clave:</strong>
                      <span className="text-[#0A033C]/80">{isa.familyBenefit}</span>
                    </div>
                  </div>
                </div>

                <a
                  href={waUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 pt-3 border-t border-border inline-flex items-center justify-between text-xs font-extrabold text-[#12056E] hover:text-[#E91E8C] transition-colors"
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
      <section className="section">
        <div className="site-container">
          <div className="text-center max-w-3xl mx-auto">
            <p className="eyebrow">POR QUÉ ELEGIR NUESTRA ORIENTACIÓN FAMILIAR</p>
            <h2 className="section-title mt-2">
              Cuidamos la salud de tu familia y el{" "}
              <span className="text-[#E91E8C]">presupuesto de tu hogar</span>
            </h2>
            <p className="section-subtitle">
              Sin tecnicismos ni textos repetidos: analizamos tu caso con cercanía para que cada
              peso de tu cotización obligatoria se transforme en tranquilidad real.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {corePillars.map((b) => (
              <article
                key={b.title}
                className={`benefit-card flex flex-col justify-between ${
                  b.accent ? "border-[#E91E8C]/35 bg-[#F6F5FF]/60" : ""
                }`}
              >
                <div>
                  <span className={`icon-tile ${b.accent ? "icon-tile-magenta" : ""}`}>
                    <b.icon size={24} />
                  </span>
                  <h3 className="font-extrabold text-base text-[#0A033C] mt-5">{b.title}</h3>
                  <p className="text-[#0A033C]/80 text-xs leading-6 mt-2.5">{b.text}</p>
                </div>
                <p className="text-[#12056E] font-extrabold text-xs flex items-center gap-2 mt-5 pt-3.5 border-t border-border">
                  <span className="h-2 w-2 rounded-full bg-[#E91E8C]" />
                  {b.tag}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

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
