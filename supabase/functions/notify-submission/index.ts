import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const NOTIFICATION_TO = Deno.env.get("NOTIFICATION_TO");
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "Veltro Website <onboarding@resend.dev>";
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: cors });
  if (!RESEND_API_KEY || !NOTIFICATION_TO) return Response.json({ ok: false, skipped: true }, { headers: cors });

  try {
    const { type, payload } = await req.json();
    const labels = { contact: "New contact enquiry", vacancy: "New vacancy request", candidate: "New candidate submission" };
    const title = labels[type as keyof typeof labels] || "New website submission";
    const rows = Object.entries(payload || {})
      .filter(([key]) => key !== "cv_path")
      .map(([key, value]) => `<tr><td style="padding:6px 12px;font-weight:600">${escapeHtml(key)}</td><td style="padding:6px 12px">${escapeHtml(String(value ?? ""))}</td></tr>`)
      .join("");
    const html = `<h2>${title}</h2><table>${rows}</table>${payload?.cv_path ? `<p>CV uploaded: ${escapeHtml(payload.cv_path)}</p>` : ""}`;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
      body: JSON.stringify({ from: FROM_EMAIL, to: [NOTIFICATION_TO], subject: title, html }),
    });
    if (!response.ok) return new Response(await response.text(), { status: 502, headers: cors });
    return Response.json({ ok: true }, { headers: cors });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : String(error) }, { status: 400, headers: cors });
  }
});

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[c] || c));
}
