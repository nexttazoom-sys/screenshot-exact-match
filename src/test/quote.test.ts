import { describe, it, expect } from "vitest";
import {
  defaultQuote,
  simulateQuote,
  quoteSchema,
  leadSchema,
  leadEmailPayloadSchema,
  WHATSAPP_NUMBER,
  WHATSAPP_DISPLAY,
  buildWhatsAppUrl,
  buildAdvisoryWhatsAppUrl,
} from "@/lib/quote";
import {
  DEFAULT_SMTP_CONFIG,
  SMTP_RECIPIENTS,
  renderLeadEmailHtml,
} from "@/lib/smtp-mailer.server";

describe("simulación, enlaces de WhatsApp y módulo de correo SMTP", () => {
  it("calcula el 7% legal", () =>
    expect(simulateQuote({ ...defaultQuote, salary: 1500000 })[0]?.contribution).toBe(105000));

  it("convierte UF y calcula diferencia sin excedentes negativos", () => {
    const p = simulateQuote(defaultQuote).find((p) => p.name === "Esencial");
    expect(p?.price).toBe(84000);
    expect(p?.surplus).toBe(21000);
    expect(simulateQuote({ ...defaultQuote, salary: 100000 }).every((p) => p.surplus === 0)).toBe(
      true,
    );
  });

  it("rechaza edades y rentas inválidas", () =>
    expect(quoteSchema.safeParse({ ...defaultQuote, age: -1, salary: 0 }).success).toBe(false));

  it("requiere autorización de contacto", () =>
    expect(
      leadSchema.safeParse({
        full_name: "Persona Prueba",
        phone: "912345678",
        email: "prueba@example.com",
        preferred_time: "09:00–12:00",
        consent: false,
      }).success,
    ).toBe(false));

  it("genera enlaces directos de WhatsApp al +56 9 4000 9671 con datos resumidos", () => {
    expect(WHATSAPP_NUMBER).toBe("56940009671");
    expect(WHATSAPP_DISPLAY).toBe("+56 9 4000 9671");
    const url = buildWhatsAppUrl("Hola, busco asesoría gratuita");
    expect(url).toContain("https://wa.me/56940009671?text=");
    const summaryUrl = buildAdvisoryWhatsAppUrl({
      full_name: "Ana Pérez",
      phone: "+56 9 8765 4321",
      salary: 1800000,
      dependents: 2,
      main_question: "Subió mi sueldo y quiero mejorar mi cobertura",
    });
    expect(summaryUrl).toContain("https://wa.me/56940009671?text=");
    expect(decodeURIComponent(summaryUrl)).toContain("Ana Pérez");
    expect(decodeURIComponent(summaryUrl)).toContain("2 cargas familiares");
  });

  it("configura correctamente el módulo SMTP SSL/TLS y genera el HTML para ambos destinatarios", () => {
    expect(DEFAULT_SMTP_CONFIG.host).toBe("solu33.tuwebdns.net");
    expect(DEFAULT_SMTP_CONFIG.port).toBe(465);
    expect(DEFAULT_SMTP_CONFIG.secure).toBe(true);
    expect(DEFAULT_SMTP_CONFIG.user).toBe("notificaciones@vyplanesisapre.cl");
    expect(SMTP_RECIPIENTS).toEqual([
      "victoriayanezasesora@gmail.com",
      "victoriayanezasesora@vyplanesisapre.cl",
    ]);

    const parsed = leadEmailPayloadSchema.safeParse({
      full_name: "Carolina Valdés",
      phone: "+56 9 4000 9671",
      email: "carolina@ejemplo.cl",
      salary: 1600000,
      dependents: "2 cargas familiares",
      isapre_interest: "Isapre Banmédica",
      clinic_commune: "Clínica Santa María / Providencia",
    });
    expect(parsed.success).toBe(true);

    const html = renderLeadEmailHtml(
      {
        full_name: "Carolina Valdés",
        phone: "+56 9 4000 9671",
        email: "carolina@ejemplo.cl",
        salary: 1600000,
        dependents: "2 cargas familiares",
        isapre_interest: "Isapre Banmédica",
        clinic_commune: "Clínica Santa María / Providencia",
      },
      "19 de noviembre de 2026, 12:00:00",
    );
    expect(html).toContain("Carolina Valdés");
    expect(html).toContain("Isapre Banmédica");
    expect(html).toContain("solu33.tuwebdns.net:465");
  });
});
