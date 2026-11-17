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
  main_question?: string | undefined;
  region?: string | undefined;
  selected_plan?: string | undefined;
  preferred_time?: string | undefined;
  email?: string | undefined;
}

export function buildAdvisoryWhatsAppUrl(data: AdvisoryWhatsAppSummary): string {
  const lines = [
    "Hola, solicito asesoría independiente 100% gratuita para elegir/optimizar mi plan de salud:",
    "",
  ];
  if (data.full_name) lines.push(`• Nombre: ${data.full_name}`);
  if (data.phone) lines.push(`• Teléfono / WhatsApp: ${data.phone}`);
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
  if (data.region) lines.push(`• Región: ${data.region}`);
  if (data.main_question) lines.push(`• Duda principal: ${data.main_question}`);
  if (data.selected_plan) lines.push(`• Escenario / Plan de interés: ${data.selected_plan}`);
  if (data.preferred_time) lines.push(`• Horario preferido: ${data.preferred_time}`);
  if (data.email) lines.push(`• Correo: ${data.email}`);
  lines.push("", "¿Me pueden orientar para obtener la mejor cobertura posible con mi presupuesto?");
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
