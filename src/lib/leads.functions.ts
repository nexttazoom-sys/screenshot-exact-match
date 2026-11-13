import { createServerFn } from '@tanstack/react-start';
import { leadSchema } from './quote';

export const submitLead = createServerFn({ method: 'POST' })
 .inputValidator(leadSchema)
 .handler(async ({ data }) => {
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
  const { data: row, error } = await supabaseAdmin.from('advisory_requests').insert({...data, selected_plan: data.selected_plan ?? null}).select('id').single();
  if (error || !row) throw new Error('No pudimos guardar tu solicitud. Intenta nuevamente.');
  return { id: row.id };
 });