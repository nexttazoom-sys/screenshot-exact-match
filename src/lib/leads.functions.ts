import { createServerFn } from "@tanstack/react-start";
import { leadEmailPayloadSchema, leadSchema } from "./quote";

export const submitLead = createServerFn({ method: "POST" })
  .inputValidator(leadSchema)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("advisory_requests")
      .insert({ ...data, selected_plan: data.selected_plan ?? null })
      .select("id")
      .single();
    if (error || !row) throw new Error("No pudimos guardar tu solicitud. Intenta nuevamente.");
    return { id: row.id };
  });

export const sendLeadEmailServer = createServerFn({ method: "POST" })
  .inputValidator(leadEmailPayloadSchema)
  .handler(async ({ data }) => {
    const { sendLeadEmailViaSmtp } = await import("./smtp-mailer.server");
    return await sendLeadEmailViaSmtp(data);
  });
