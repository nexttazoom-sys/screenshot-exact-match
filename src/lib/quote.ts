import * as z from "zod";

export const WHATSAPP_NUMBER = "56940009671";
export const WHATSAPP_DISPLAY = "+56 9 4000 9671";
export const DEFAULT_WHATSAPP_MESSAGE =
  "Hola, me gustaría recibir asesoría independiente 100% gratuita para evaluar y optimizar mi plan de salud según mi 7% y presupuesto.";

export function buildWhatsAppUrl(customMessage?: string): string {
  const text = customMessage?.trim() ? customMessage.trim() : DEFAULT_WHATSAPP_MESSAGE;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export interface AdvisoryWhatsAppSummary {
  full_name?: string | undefined;
  phone?: string | undefined;
  salary?: string | number | undefined;
  dependents?: string | number | undefined;
  isapre_interest?: string | undefined;
  clinic_commune?: string | undefined;
  main_question?: string | undefined;
  additional_message?: string | undefined;
  region?: string | undefined;
  selected_plan?: string | undefined;
  preferred_time?: string | undefined;
  email?: string | undefined;
}

export function buildAdvisoryWhatsAppUrl(data: AdvisoryWhatsAppSummary): string {
  const lines = [
    "Hola Victoria, solicito asesoría independiente 100% gratuita para elegir/optimizar mi plan de salud:",
    "",
  ];
  if (data.full_name) lines.push(`• Nombre: ${data.full_name}`);
  if (data.phone) lines.push(`• Teléfono / WhatsApp: ${data.phone}`);
  if (data.email) lines.push(`• Correo: ${data.email}`);
  if (data.salary !== undefined && data.salary !== "") {
    const numSalary = Number(data.salary);
    if (!Number.isNaN(numSalary) && numSalary > 0) {
      lines.push(
        `• Renta / presupuesto aprox.: ${money(numSalary)} (7% est.: ${money(Math.round(numSalary * 0.07))}/mes)`,
      );
    } else {
      lines.push(`• Renta / presupuesto aprox.: ${data.salary}`);
    }
  }
  if (data.dependents !== undefined && data.dependents !== "") {
    const depNum = Number(data.dependents);
    const depLabel = !Number.isNaN(depNum)
      ? depNum === 0
        ? "Sin cargas (solo cotizante)"
        : `${depNum} ${depNum === 1 ? "carga familiar" : "cargas familiares"}`
      : String(data.dependents);
    lines.push(`• Cargas: ${depLabel}`);
  }
  if (data.isapre_interest) lines.push(`• Isapre actual o de interés: ${data.isapre_interest}`);
  if (data.clinic_commune) lines.push(`• Clínica / Comuna: ${data.clinic_commune}`);
  if (data.region) lines.push(`• Región: ${data.region}`);
  if (data.main_question) lines.push(`• Motivo principal: ${data.main_question}`);
  if (data.additional_message) lines.push(`• Consulta adicional: ${data.additional_message}`);
  if (data.selected_plan) lines.push(`• Escenario / Plan de interés: ${data.selected_plan}`);
  if (data.preferred_time) lines.push(`• Horario preferido: ${data.preferred_time}`);
  lines.push("", "¿Me puedes orientar para obtener la mejor cobertura posible con mi presupuesto?");
  return buildWhatsAppUrl(lines.join("\n"));
}

export const regions = [
  "Metropolitana de Santiago",
  "Arica y Parinacota",
  "Tarapacá",
  "Antofagasta",
  "Atacama",
  "Coquimbo",
  "Valparaíso",
  "O’Higgins",
  "Maule",
  "Ñuble",
  "Biobío",
  "La Araucanía",
  "Los Ríos",
  "Los Lagos",
  "Aysén",
  "Magallanes",
] as const;

export interface CommuneClinicsGroup {
  commune: string;
  clinics: readonly string[];
}

export const CLINICS_BY_COMMUNE: readonly CommuneClinicsGroup[] = [
  {
    commune: "Arica",
    clinics: ["Clínica San José"],
  },
  {
    commune: "Iquique",
    clinics: ["RedSalud Iquique", "Clínica Tarapacá"],
  },
  {
    commune: "Antofagasta",
    clinics: ["Clínica Bupa Antofagasta", "Clínica La Portada"],
  },
  {
    commune: "Calama",
    clinics: ["Clínica Andes Salud El Loa"],
  },
  {
    commune: "Copiapó",
    clinics: ["Clínica RCR Atacama"],
  },
  {
    commune: "Diego de Almagro",
    clinics: ["Clínica San Lorenzo"],
  },
  {
    commune: "La Serena",
    clinics: ["Clínica RedSalud Elqui"],
  },
  {
    commune: "Viña del Mar",
    clinics: ["Clínica Ciudad del Mar", "Clínica Reñaca", "Hospital Clínico Viña del Mar"],
  },
  {
    commune: "Valparaíso",
    clinics: ["RedSalud Valparaíso"],
  },
  {
    commune: "Quilpué",
    clinics: ["Clínica Los Carrera"],
  },
  {
    commune: "La Calera",
    clinics: ["Clínica Los Leones"],
  },
  {
    commune: "Los Andes",
    clinics: ["Clínica Río Blanco"],
  },
  {
    commune: "San Antonio",
    clinics: ["Clínica San Antonio"],
  },
  {
    commune: "Santiago",
    clinics: [
      "Clínica Alemana",
      "Clínica Las Condes",
      "Clínica Santa María",
      "Clínica INDISA",
      "Clínica Dávila",
      "Clínica Dávila Vespucio",
      "Clínica Bupa Santiago",
      "Clínica Bupa La Florida",
      "Clínica RedSalud Vitacura",
      "Clínica RedSalud Providencia",
      "Clínica RedSalud Santiago",
      "Clínica INDISA Maipú",
      "Clínica MEDS",
      "Clínica MEDS Vitacura",
      "Clínica San Carlos de Apoquindo UC CHRISTUS",
      "Clínica Universidad de los Andes",
      "Hospital Clínico Universidad de Chile",
      "Hospital Clínico UC CHRISTUS",
      "Clínica Alemana de La Dehesa",
      "Clínica Hospital del Profesor",
    ],
  },
  {
    commune: "Rancagua",
    clinics: ["Clínica Isamédica", "Clínica FUSAT", "Clínica de Salud Integral"],
  },
  {
    commune: "San Fernando",
    clinics: ["Clínica San Francisco"],
  },
  {
    commune: "Talca",
    clinics: [
      "Clínica Andes Salud Talca",
      "Clínica Regional del Maule",
      "Clínica Universidad Católica del Maule",
    ],
  },
  {
    commune: "Chillán",
    clinics: ["Clínica Andes Salud Chillán", "Clínica Las Amapolas"],
  },
  {
    commune: "Concepción",
    clinics: ["Clínica Salud Concepción", "Sanatorio Alemán", "Clínica del Sur"],
  },
  {
    commune: "Hualpén",
    clinics: ["Clínica Andes Salud Concepción"],
  },
  {
    commune: "Talcahuano",
    clinics: ["Clínica Biobío"],
  },
  {
    commune: "Los Ángeles",
    clinics: ["Clínica Adventista", "Clínica Los Andes"],
  },
  {
    commune: "Temuco",
    clinics: ["Clínica Alemana de Temuco", "Clínica RedSalud Mayor de Temuco"],
  },
  {
    commune: "Valdivia",
    clinics: ["Clínica Alemana de Valdivia"],
  },
  {
    commune: "Puerto Montt",
    clinics: ["Clínica Andes Salud Puerto Montt", "Clínica Puerto Montt"],
  },
  {
    commune: "Osorno",
    clinics: ["Clínica Alemana de Osorno"],
  },
  {
    commune: "Puerto Varas",
    clinics: ["Clínica de Puerto Varas"],
  },
  {
    commune: "Coyhaique",
    clinics: ["Hospital Regional de Coyhaique"],
  },
  {
    commune: "Punta Arenas",
    clinics: ["Clínica Magallanes", "Clínica RedSalud Magallanes"],
  },
] as const;

export const OTHER_CLINIC_OPTION = "Otra comuna / clínica no listada";

export interface ClinicCommuneOption {
  commune: string;
  clinic: string;
  label: string;
  searchKey: string;
}

export function normalizeSearchText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export const CLINIC_COMMUNE_OPTIONS: readonly ClinicCommuneOption[] = CLINICS_BY_COMMUNE.flatMap(
  (group) =>
    group.clinics.map((clinic) => {
      const label = `${group.commune} — ${clinic}`;
      return {
        commune: group.commune,
        clinic,
        label,
        searchKey: normalizeSearchText(`${group.commune} ${clinic} ${label}`),
      };
    }),
);

export function filterClinicCommuneOptions(query: string): ClinicCommuneOption[] {
  const normalized = normalizeSearchText(query);
  if (!normalized) return [...CLINIC_COMMUNE_OPTIONS];
  const terms = normalized.split(/\s+/).filter(Boolean);
  return CLINIC_COMMUNE_OPTIONS.filter((opt) =>
    terms.every((term) => opt.searchKey.includes(term)),
  );
}

export const quoteSchema = z.object({
  salary: z.coerce.number().min(100000).max(100000000),
  age: z.coerce.number().int().min(18).max(100),
  dependents: z.coerce.number().int().min(0).max(10),
  region: z.string().refine((v) => regions.some((r) => r === v)),
  employment: z.enum(["Dependiente", "Independiente"]),
  clinic: z.string().max(100),
  planType: z.enum(["Preferente", "Libre elección", "Cerrado"]),
  uf: z.coerce.number().min(1000).max(100000),
});

export type QuoteInput = z.infer<typeof quoteSchema>;

export const defaultQuote: QuoteInput = {
  salary: 1500000,
  age: 30,
  dependents: 0,
  region: regions[0],
  employment: "Dependiente",
  clinic: "Sin preferencia",
  planType: "Preferente",
  uf: 40000,
};

export const money = (n: number) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(n);

export function simulateQuote(input: QuoteInput) {
  const q = quoteSchema.parse(input);
  const contribution = Math.round(q.salary * 0.07);
  const illustrativeFactor = 1 + (q.age >= 60 ? 0.6 : q.age >= 45 ? 0.3 : 0) + q.dependents * 0.55;
  const typeMultiplier =
    q.planType === "Libre elección" ? 1.15 : q.planType === "Cerrado" ? 0.9 : 1;
  return [
    { name: "Esencial", base: 2.1, hospital: 70, outpatient: 50 },
    { name: "Equilibrio", base: 2.8, hospital: 85, outpatient: 65 },
    { name: "Integral", base: 3.6, hospital: 90, outpatient: 80 },
  ]
    .map((p) => {
      const uf = Math.round(p.base * illustrativeFactor * typeMultiplier * 100) / 100;
      const price = Math.round(uf * q.uf);
      return {
        ...p,
        uf,
        price,
        contribution,
        surplus: Math.max(0, contribution - price),
        additional: Math.max(0, price - contribution),
      };
    })
    .sort((a, b) => Math.abs(a.price - contribution) - Math.abs(b.price - contribution));
}

export const leadSchema = z.object({
  full_name: z.string().trim().min(2, "Ingresa tu nombre completo.").max(100),
  phone: z
    .string()
    .trim()
    .regex(/^(\+56\s?)?[2-9][0-9\s]{8,11}$/, "Ingresa un teléfono chileno válido.")
    .max(16),
  email: z.string().trim().email("Ingresa un correo válido.").max(255),
  preferred_time: z.enum(["09:00–12:00", "12:00–15:00", "15:00–18:00"]),
  selected_plan: z.string().max(100).optional(),
  consent: z.boolean().refine((v) => v, "Autoriza el contacto para continuar."),
});

export const leadEmailPayloadSchema = z.object({
  full_name: z.string().trim().min(2, "Ingresa tu nombre completo.").max(100),
  phone: z.string().trim().min(6, "Ingresa un teléfono válido.").max(25),
  email: z.string().trim().max(255).optional(),
  salary: z.union([z.number(), z.string()]).optional(),
  estimated_seven_percent: z.union([z.number(), z.string()]).optional(),
  dependents: z.union([z.number(), z.string()]).optional(),
  isapre_interest: z.string().max(160).optional(),
  clinic_commune: z.string().max(160).optional(),
  preferred_time: z.string().max(50).optional(),
  main_question: z.string().max(200).optional(),
  additional_message: z.string().max(300).optional(),
  selected_plan: z.string().max(160).optional(),
  sent_at: z.string().max(120).optional(),
  is_test: z.boolean().optional(),
});
