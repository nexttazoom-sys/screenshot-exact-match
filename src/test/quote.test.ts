import { describe, it, expect } from 'vitest';
import { defaultQuote, simulateQuote, quoteSchema, leadSchema } from '@/lib/quote';
describe('simulación', () => {
 it('calcula el 7% legal', () => expect(simulateQuote({ ...defaultQuote, salary: 1500000 })[0]?.contribution).toBe(105000));
 it('convierte UF y calcula diferencia sin excedentes negativos', () => { const p = simulateQuote(defaultQuote).find(p => p.name === 'Esencial'); expect(p?.price).toBe(84000); expect(p?.surplus).toBe(21000); expect(simulateQuote({...defaultQuote, salary: 100000}).every(p => p.surplus === 0)).toBe(true); });
 it('rechaza edades y rentas inválidas', () => expect(quoteSchema.safeParse({...defaultQuote, age: -1, salary: 0}).success).toBe(false));
 it('requiere autorización de contacto', () => expect(leadSchema.safeParse({full_name:'Persona Prueba',phone:'912345678',email:'prueba@example.com',preferred_time:'09:00–12:00',consent:false}).success).toBe(false));
});