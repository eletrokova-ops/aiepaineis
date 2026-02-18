export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });

  try {
    const { nome, whatsapp, email, mensagem, website } = req.body || {};

    // honeypot anti-spam (campo escondido no form)
    if (website) return res.status(200).json({ ok: true });

    if (!nome || !whatsapp || !email || !mensagem) {
      return res.status(400).json({ ok: false, error: "Campos obrigatórios faltando." });
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const TO_EMAIL = process.env.LEADS_TO_EMAIL;

    if (!RESEND_API_KEY || !TO_EMAIL) {
      return res.status(500).json({ ok: false, error: "Env vars não configuradas." });
    }

    const subject = `Novo lead - A&E Painéis (${nome})`;
    const text = [
      "Novo lead recebido pelo site:",
      "",
      `Nome: ${nome}`,
      `WhatsApp: ${whatsapp}`,
      `E-mail: ${email}`,
      "",
      "Mensagem:",
      mensagem,
    ].join("\n");

    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "A&E Painéis <onboarding@resend.dev>", // depois você troca pro seu domínio
        to: [TO_EMAIL],
        subject,
        text,
        reply_to: email,
      }),
    });

    if (!resp.ok) {
      const err = await resp.text();
      return res.status(500).json({ ok: false, error: "Falha ao enviar e-mail.", detail: err });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ ok: false, error: "Erro inesperado." });
  }
}
