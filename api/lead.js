import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sanitize = (s = "") => String(s).replace(/[<>]/g, "").trim();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const { nome, whatsapp, email, mensagem } = req.body || {};

    const data = {
      nome: sanitize(nome),
      whatsapp: sanitize(whatsapp),
      email: sanitize(email),
      mensagem: sanitize(mensagem),
    };

    if (!data.nome || !data.whatsapp || !data.email || !data.mensagem) {
      return res.status(400).json({ ok: false, error: "Missing fields" });
    }

    const subject = `Novo lead - ${data.nome}`;
    const text = [
      "Novo lead no site A&E Painéis",
      "",
      `Nome: ${data.nome}`,
      `WhatsApp: ${data.whatsapp}`,
      `E-mail: ${data.email}`,
      "",
      "Mensagem:",
      data.mensagem,
    ].join("\n");

    const html = `
      <div style="font-family: Arial, sans-serif; color:#0b1325;">
        <h2>Novo lead no site A&E Painéis</h2>
        <p><b>Nome:</b> ${data.nome}</p>
        <p><b>WhatsApp:</b> ${data.whatsapp}</p>
        <p><b>E-mail:</b> ${data.email}</p>
        <p><b>Mensagem:</b><br/>${data.mensagem.replace(/\n/g, "<br/>")}</p>
      </div>
    `;

    const to = process.env.LEAD_TO_EMAIL; // seu email que recebe
    const from = process.env.LEAD_FROM_EMAIL; // remetente verificado no Resend

    const resp = await resend.emails.send({
      from,
      to,
      reply_to: data.email,
      subject,
      text,
      html,
    });

    return res.status(200).json({ ok: true, id: resp?.data?.id || null });
  } catch (err) {
    return res.status(500).json({ ok: false, error: "Server error" });
  }
}
