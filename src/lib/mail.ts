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
}
