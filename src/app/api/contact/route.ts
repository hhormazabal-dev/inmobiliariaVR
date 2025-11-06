import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { sendContactEmail, type ContactPayload } from "@/lib/mail";

class ContactFormError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "ContactFormError";
    this.status = status;
  }
}

function normalizeValue(value: FormDataEntryValue | null | undefined) {
  if (typeof value === "string") {
    return value.trim();
  }

  if (value instanceof File) {
    return value.name;
  }

  return "";
}

function buildPayload(source: Record<string, unknown>): ContactPayload {
  const nombre = String(source.nombre ?? "").trim();
  const correo = String(source.correo ?? "").trim();
  const telefono = String(source.telefono ?? "").trim();
  const mensaje = String(source.mensaje ?? "").trim();
  const newsletter = source.newsletter
    ? String(source.newsletter).trim()
    : null;

  if (!nombre || !correo || !telefono || !mensaje) {
    throw new ContactFormError("Faltan campos obligatorios en el formulario");
  }

  return {
    nombre,
    correo,
    telefono,
    mensaje,
    newsletter,
  };
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") ?? "";
    let nextUrl: string | null = null;
    let payload: ContactPayload;

    if (contentType.includes("application/json")) {
      const body = await req.json();

      if (body && typeof body === "object") {
        if (typeof body._next === "string") {
          nextUrl = body._next;
        }

        payload = buildPayload(body as Record<string, unknown>);
      } else {
        throw new Error("Formato JSON inválido");
      }
    } else {
      const formData = await req.formData();
      const mapped: Record<string, unknown> = {};

      for (const [key, value] of formData.entries()) {
        mapped[key] = normalizeValue(value);
      }

      if (typeof mapped._next === "string") {
        nextUrl = mapped._next;
      }

      payload = buildPayload(mapped);
    }

    await sendContactEmail(payload);

    const acceptsHtml =
      req.headers
        .get("accept")
        ?.split(",")
        .some((item) => item.includes("text/html")) ?? false;

    if (nextUrl && acceptsHtml) {
      const redirectTarget = nextUrl.startsWith("http")
        ? nextUrl
        : new URL(nextUrl, req.url).toString();

      return NextResponse.redirect(redirectTarget, { status: 303 });
    }

    return NextResponse.json({ ok: true, nextUrl: nextUrl ?? null });
  } catch (error) {
    console.error("Error enviando correo de contacto:", error);

    if (error instanceof ContactFormError) {
      return NextResponse.json(
        { ok: false, message: error.message },
        { status: error.status },
      );
    }

    return NextResponse.json(
      {
        ok: false,
        message: "No fue posible procesar el formulario.",
      },
      { status: 500 },
    );
  }
}

export function GET() {
  return NextResponse.json(
    { ok: false, message: "Método no permitido" },
    {
      status: 405,
      headers: { Allow: "POST" },
    },
  );
}
