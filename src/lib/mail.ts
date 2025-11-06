import nodemailer from "nodemailer";

export type ContactPayload = {
  nombre: string;
  correo: string;
  telefono: string;
  mensaje: string;
  newsletter?: string | null;
};

type MailConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
  to: string;
  bcc?: string;
  replyTo?: string;
  subject: string;
  ackSubject: string;
  ackBody: string;
  whatsappUrl?: string;
};

let cachedTransporter: nodemailer.Transporter | null = null;

function resolveMailConfig(replyTo?: string): MailConfig {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.MAIL_FROM ?? user;
  const to = process.env.MAIL_TO ?? user;
  const bcc = process.env.MAIL_BCC;
  const subject = process.env.MAIL_SUBJECT ?? "Nuevo contacto VR Inmobiliaria";
  const ackSubject =
    process.env.MAIL_AUTOREPLY_SUBJECT ??
    "Gracias por contactarte con VR Inmobiliaria";
  const ackBody =
    process.env.MAIL_AUTOREPLY_BODY ??
    "Hola {{nombre}},\n\nGracias por contactarte con VR Inmobiliaria. En las próximas horas un asesor del equipo se pondrá en contacto contigo.\n\nSi necesitas atención inmediata, puedes escribirnos a nuestro WhatsApp: {{whatsapp_url}}.\n\nSaludos,\nEquipo VR Inmobiliaria";
  const whatsappUrl = process.env.NEXT_PUBLIC_WHATSAPP_URL;

  if (!host || !user || !pass || !from || !to) {
    throw new Error("Faltan variables de entorno requeridas para SMTP");
  }

  return {
    host,
    port,
    secure: process.env.SMTP_SECURE
      ? process.env.SMTP_SECURE === "true"
      : port === 465,
    user,
    pass,
    from,
    to,
    bcc: bcc
      ?.split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .join(","),
    replyTo,
    subject,
    ackSubject,
    ackBody,
    whatsappUrl,
  };
}

function getTransporter(config: MailConfig) {
  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.user,
        pass: config.pass,
      },
    });
  }

  return cachedTransporter;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildTextBody(payload: ContactPayload) {
  const newsletterValue = payload.newsletter ? payload.newsletter : "No";

  return [
    "Nuevo contacto recibido desde el formulario del sitio vreyes.cl",
    "",
    `Nombre: ${payload.nombre}`,
    `Correo: ${payload.correo}`,
    `Teléfono: ${payload.telefono}`,
    "",
    "Mensaje:",
    payload.mensaje,
    "",
    `Desea newsletter: ${newsletterValue}`,
  ].join("\n");
}

function buildHtmlBody(payload: ContactPayload) {
  const nombre = escapeHtml(payload.nombre);
  const correo = escapeHtml(payload.correo);
  const telefono = escapeHtml(payload.telefono);
  const newsletter = payload.newsletter ? escapeHtml(payload.newsletter) : "No";
  const mensaje = escapeHtml(payload.mensaje).replace(/\n/g, "<br/>");

  return `
    <p>Nuevo contacto recibido desde el formulario del sitio <strong>vreyes.cl</strong>.</p>
    <ul>
      <li><strong>Nombre:</strong> ${nombre}</li>
      <li><strong>Correo:</strong> ${correo}</li>
      <li><strong>Teléfono:</strong> ${telefono}</li>
      <li><strong>Newsletter:</strong> ${newsletter}</li>
    </ul>
    <p><strong>Mensaje:</strong></p>
    <p>${mensaje}</p>
  `;
}

export async function sendContactEmail(payload: ContactPayload) {
  const config = resolveMailConfig(payload.correo);
  const transporter = getTransporter(config);

  await transporter.sendMail({
    to: config.to,
    from: config.from,
    bcc: config.bcc,
    replyTo: config.replyTo,
    subject: config.subject,
    text: buildTextBody(payload),
    html: buildHtmlBody(payload),
  });

  const confirmation = buildAcknowledgementMessage(payload, config);
  if (confirmation) {
    try {
      await transporter.sendMail({
        to: payload.correo,
        from: config.from,
        subject: confirmation.subject,
        text: confirmation.text,
        html: confirmation.html,
      });
    } catch (error) {
      console.error(
        "[mail] Error enviando correo de confirmación al usuario:",
        error,
      );
    }
  }
}

function renderTemplate(template: string, payload: ContactPayload) {
  return template
    .replace(/{{\s*nombre\s*}}/gi, payload.nombre)
    .replace(/{{\s*correo\s*}}/gi, payload.correo)
    .replace(/{{\s*telefono\s*}}/gi, payload.telefono ?? "")
    .replace(/{{\s*mensaje\s*}}/gi, payload.mensaje);
}

function buildAcknowledgementMessage(
  payload: ContactPayload,
  config: MailConfig,
) {
  if (!payload.correo) {
    return null;
  }

  const subject = renderTemplate(config.ackSubject, payload);
  const text = renderTemplate(
    config.ackBody.replace(/{{\s*whatsapp_url\s*}}/gi, "").trim(),
    payload,
  );
  const whatsappHtml = config.whatsappUrl
    ? `<a href="${escapeHtml(config.whatsappUrl)}" style="display:inline-block;padding:10px 20px;margin-top:12px;border-radius:9999px;background: linear-gradient(90deg, #0f2451, #d9a63a);color:#ffffff;text-decoration:none;font-weight:600;">Hablar por WhatsApp</a>`
    : "";
  const htmlBody = escapeHtml(text).replace(/\n/g, "<br/>");
  const html = whatsappHtml ? `${htmlBody}<br/>${whatsappHtml}` : htmlBody;

  return {
    subject,
    text,
    html,
  };
}
