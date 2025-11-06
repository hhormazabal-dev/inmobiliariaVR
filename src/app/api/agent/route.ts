import { NextResponse, type NextRequest } from "next/server";
import OpenAI from "openai";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  DISCLAIMER,
  NO_DATA_REPLY,
  SYSTEM_PROMPT,
  buildContextSection,
} from "@/lib/policy";

export const runtime = "nodejs";

type Role = "user" | "assistant";

type IncomingMessage = {
  role: Role;
  content: string;
};

type RequestPayload = {
  messages: IncomingMessage[];
};

type Filters = {
  comuna?: string;
  status?: string;
  projectName?: string;
  minPrice?: number;
  maxPrice?: number;
  dormitorios?: number[];
};

type ProjectRow = {
  id: string;
  name: string | null;
  comuna: string | null;
  address?: string | null;
  direccion?: string | null;
  ubicacion?: string | null;
  uf_min?: number | string | null;
  uf_max?: number | string | null;
  status?: string | null;
  tipologias?: string | null;
  tipologia?: string | null;
  slug?: string | null;
  project_url?: string | null;
};

type RateEntry = {
  timestamps: number[];
};

const RATE_WINDOW_MS = 5 * 60 * 1000; // 5 minutos
const RATE_MAX_REQUESTS = 60;
const MAX_MESSAGE_LENGTH = 1500;
const SOURCE_LABEL = "web_chat";
const CONTACT_KEYWORDS = [
  "hablar con alguien",
  "hablar con un asesor",
  "asesor humano",
  "derivar",
  "derívame",
  "derivame",
  "whatsapp",
  "coordinar visita",
  "coordinar una visita",
  "quiero coordinar",
  "agendar visita",
  "agendar una visita",
  "cotizar",
  "cotización",
  "cotizacion",
  "cotizar visita",
  "hablar por teléfono",
  "llamar",
  "contacto humano",
  "contactarme",
  "contacten",
  "agenda una visita",
  "quiero cotizar",
  "quiero hablar con alguien",
];

const textEncoder = new TextEncoder();

const globalRateStore =
  (globalThis as unknown as { __vrChatRate?: Map<string, RateEntry> })
    .__vrChatRate ?? new Map<string, RateEntry>();

if (
  !(globalThis as unknown as { __vrChatRate?: Map<string, RateEntry> })
    .__vrChatRate
) {
  (
    globalThis as unknown as { __vrChatRate?: Map<string, RateEntry> }
  ).__vrChatRate = globalRateStore;
}

function normalizeString(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function sanitizeMessageContent(value: string) {
  const clean = value.replace(/[\u0000-\u001F\u007F]/g, "").trim();
  return clean.slice(0, MAX_MESSAGE_LENGTH);
}

function toNumber(value: string) {
  const compact = value.replace(/\./g, "").replace(",", ".");
  const parsed = Number(compact);
  return Number.isFinite(parsed) ? parsed : null;
}

function parsePriceRange(text: string) {
  const rangeMatch = text.match(
    /(?:entre|desde)\s*uf?\s*(\d[\d.,]*)\s*(?:y|hasta|a)\s*uf?\s*(\d[\d.,]*)/i,
  );
  if (rangeMatch) {
    const min = toNumber(rangeMatch[1]);
    const max = toNumber(rangeMatch[2]);
    if (min !== null && max !== null) {
      return { min, max };
    }
  }

  const fromMatch = text.match(/desde\s*uf?\s*(\d[\d.,]*)/i);
  const toMatch = text.match(/hasta\s*uf?\s*(\d[\d.,]*)/i);
  const singleMatch = text.match(/uf?\s*(\d[\d.,]*)/i);

  const min = fromMatch ? toNumber(fromMatch[1]) : null;
  const max = toMatch ? toNumber(toMatch[1]) : null;

  if (min !== null || max !== null) {
    return { min: min ?? undefined, max: max ?? undefined };
  }

  if (singleMatch) {
    const value = toNumber(singleMatch[1]);
    if (value !== null) {
      return { min: value, max: value };
    }
  }

  return null;
}

const NUMBER_WORDS: Record<string, number> = {
  uno: 1,
  una: 1,
  dos: 2,
  tres: 3,
  cuatro: 4,
  cinco: 5,
  seis: 6,
};

function parseDormitorios(text: string) {
  const dormitorios = new Set<number>();

  const directMatches = text.matchAll(
    /(\d+)\s*(?:dormitorios?|d\b|habitaciones?)/gi,
  );
  for (const match of directMatches) {
    const num = Number(match[1]);
    if (Number.isFinite(num)) {
      dormitorios.add(num);
    }
  }

  const wordMatches = text.matchAll(
    /\b(uno|una|dos|tres|cuatro|cinco|seis)\s*(?:dormitorios?|habitaciones?)\b/gi,
  );
  for (const match of wordMatches) {
    const word = match[1]?.toLowerCase();
    if (word && NUMBER_WORDS[word]) {
      dormitorios.add(NUMBER_WORDS[word]);
    }
  }

  if (/\bstudio\b/i.test(text) || /\bloft\b/i.test(text)) {
    dormitorios.add(0);
  }

  return dormitorios.size
    ? Array.from(dormitorios).sort((a, b) => a - b)
    : undefined;
}

function parseStatus(text: string) {
  if (/en\s+verde/i.test(text)) return "en verde";
  if (/entrega\s+inmediata/i.test(text) || /inmediata/i.test(text)) {
    return "inmediata";
  }
  if (/en\s+blanco/i.test(text)) return "en blanco";
  return undefined;
}

function detectProjectName(text: string) {
  const match = text.match(/proyecto\s+([a-záéíóúñ0-9\s]+)/i);
  if (match) {
    return match[1].trim();
  }
  return undefined;
}

function extractFilters(message: string, comunas: string[]): Filters {
  const normalizedMessage = normalizeString(message);
  let comuna: string | undefined;

  for (const comunaName of comunas) {
    const normalizedComuna = normalizeString(comunaName);
    if (normalizedMessage.includes(normalizedComuna)) {
      comuna = comunaName;
      break;
    }
  }

  if (!comuna) {
    const altMatch = message.match(/en\s+([A-ZÁÉÍÓÚÑ][\w\sÁÉÍÓÚÑ]+)/);
    if (altMatch) {
      comuna = altMatch[1].trim();
    }
  }

  const price = parsePriceRange(message);
  const dormitorios = parseDormitorios(message);
  const status = parseStatus(message);
  const projectName = detectProjectName(message);

  return {
    comuna,
    status,
    projectName,
    minPrice: price?.min,
    maxPrice: price?.max,
    dormitorios,
  };
}

function getClientIp(req: NextRequest) {
  const header =
    req.headers.get("x-forwarded-for") ||
    req.headers.get("x-real-ip") ||
    req.headers.get("cf-connecting-ip");
  if (header) {
    return header.split(",")[0]?.trim() || "0.0.0.0";
  }
  return "0.0.0.0";
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const entry = globalRateStore.get(ip) ?? { timestamps: [] };
  const recent = entry.timestamps.filter((ts) => now - ts <= RATE_WINDOW_MS);
  recent.push(now);

  globalRateStore.set(ip, { timestamps: recent });

  return recent.length > RATE_MAX_REQUESTS;
}

function checkContactIntent(message: string) {
  const normalized = normalizeString(message);
  return CONTACT_KEYWORDS.some((keyword) =>
    normalized.includes(normalizeString(keyword)),
  );
}

function ensureDisclaimer(text: string) {
  if (!text.trim()) return DISCLAIMER;
  if (normalizeString(text).includes(normalizeString(DISCLAIMER))) {
    return text;
  }
  return `${text.trim()}\n\n${DISCLAIMER}`;
}

function parseUfValue(value: ProjectRow["uf_min"]) {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    return toNumber(value) ?? undefined;
  }
  return undefined;
}

function formatPriceRange(min?: number, max?: number) {
  if (typeof min !== "number" && typeof max !== "number") {
    return "Dato no disponible";
  }
  if (typeof min === "number" && typeof max === "number") {
    if (min === max) {
      return `UF ${Math.round(min).toLocaleString("es-CL")}`;
    }
    return `Desde UF ${Math.round(min).toLocaleString("es-CL")} hasta UF ${Math.round(max).toLocaleString("es-CL")}`;
  }
  if (typeof min === "number") {
    return `Desde UF ${Math.round(min).toLocaleString("es-CL")}`;
  }
  return `Hasta UF ${Math.round(max as number).toLocaleString("es-CL")}`;
}

function extractDormitoriosFromTipologias(row: ProjectRow) {
  const tipologias =
    row.tipologias ?? (row.tipologia as string | null | undefined) ?? "";

  if (!tipologias) return "Dato no disponible";
  const matches = new Set(
    tipologias
      .toUpperCase()
      .match(/\b(\d+)\s*D\b/g)
      ?.map((match) => match.replace(/\s*/g, "")) ?? [],
  );

  if (matches.size === 0) {
    return tipologias.toString();
  }

  const sorted = Array.from(matches)
    .map((item) => Number(item.replace("D", "")))
    .filter((n) => Number.isFinite(n))
    .sort((a, b) => a - b);

  return sorted.length
    ? `${sorted.join(", ")} dormitorios`
    : tipologias.toString();
}

function buildProjectLink(row: ProjectRow) {
  if (row.project_url) return row.project_url;
  if (row.slug) {
    return `https://www.vreyes.cl/proyectos/${row.slug}`;
  }
  const name = row.name ?? "";
  const comuna = row.comuna ?? "";
  const slug = [comuna, name]
    .join(" ")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `https://www.vreyes.cl/proyectos?ref=${encodeURIComponent(slug)}`;
}

function buildContextFromProjects(projects: ProjectRow[]) {
  return projects
    .map((project, index) => {
      const min = parseUfValue(project.uf_min);
      const max = parseUfValue(project.uf_max);
      const address =
        project.address ??
        project.direccion ??
        project.ubicacion ??
        "Dato no disponible";
      const price = formatPriceRange(min, max);
      const dormitorios = extractDormitoriosFromTipologias(project);
      const status = project.status ?? "Dato no disponible";
      const link = buildProjectLink(project);

      return [
        `Proyecto ${index + 1}: ${project.name ?? "Nombre no disponible"}`,
        `Comuna: ${project.comuna ?? "Dato no disponible"}`,
        `Dirección: ${address}`,
        `Estado comercial: ${status}`,
        `Rango de precios: ${price}`,
        `Tipologías / Dormitorios: ${dormitorios}`,
        `Link: ${link}`,
      ].join("\n");
    })
    .join("\n\n");
}

function streamFromString(content: string, cta = false) {
  const finalText = ensureDisclaimer(content);

  return new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(
        textEncoder.encode(JSON.stringify({ type: "metadata", cta }) + "\n"),
      );
      controller.enqueue(
        textEncoder.encode(
          JSON.stringify({ type: "token", value: finalText }) + "\n",
        ),
      );
      controller.enqueue(
        textEncoder.encode(JSON.stringify({ type: "done" }) + "\n"),
      );
      controller.close();
    },
  });
}

function buildSupabaseClient() {
  const url =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    "";

  if (!url || !key) {
    throw new Error("Faltan credenciales de Supabase.");
  }

  return createClient(url, key, { auth: { persistSession: false } });
}

async function fetchDistinctComunas(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("projects")
    .select("comuna")
    .not("comuna", "is", null)
    .limit(500);

  if (error) {
    console.error("[api/agent] Error listando comunas:", error);
    return [];
  }

  const comunas = new Set<string>();
  for (const row of data ?? []) {
    const comuna = row.comuna?.trim();
    if (comuna) {
      comunas.add(comuna);
    }
  }
  return Array.from(comunas);
}

async function fetchProjects(supabase: SupabaseClient, filters: Filters) {
  let query = supabase
    .from("projects")
    .select(
      "id, name, comuna, address, direccion, ubicacion, uf_min, uf_max, tipologias, tipologia, status, slug, project_url",
    )
    .limit(10);

  if (filters.comuna) {
    query = query.ilike("comuna", `%${filters.comuna}%`);
  }

  if (typeof filters.minPrice === "number") {
    query = query.gte("uf_min", filters.minPrice);
  }

  if (typeof filters.maxPrice === "number") {
    query = query.lte("uf_max", filters.maxPrice);
  }

  if (filters.status) {
    query = query.ilike("status", `%${filters.status}%`);
  }

  if (filters.projectName) {
    query = query.ilike("name", `%${filters.projectName}%`);
  }

  if (filters.dormitorios?.length) {
    const clauses: string[] = [];
    for (const value of filters.dormitorios) {
      if (value === 0) {
        clauses.push("tipologias.ilike.%STUDIO%", "tipologia.ilike.%STUDIO%");
        continue;
      }
      const pattern = `%${value}D%`;
      clauses.push(`tipologias.ilike.${pattern}`, `tipologia.ilike.${pattern}`);
    }
    if (clauses.length) {
      query = query.or(clauses.join(","));
    }
  }

  const { data, error } = await query;

  if (error) {
    console.error("[api/agent] Error consultando proyectos:", error);
    throw new Error("No fue posible obtener proyectos desde Supabase.");
  }

  return (data ?? []).reduce<ProjectRow[]>((acc, item) => {
    if (
      item &&
      typeof item === "object" &&
      "id" in item &&
      typeof item.id === "string" &&
      "name" in item &&
      typeof item.name === "string"
    ) {
      acc.push(item as ProjectRow);
    }
    return acc;
  }, []);
}

async function insertChatLog(
  supabase: SupabaseClient,
  params: {
    userMessage: string;
    assistantReply: string;
    ip: string;
    source: string;
  },
) {
  const { error } = await supabase.from("chat_logs").insert({
    user_message: params.userMessage,
    assistant_reply: params.assistantReply,
    ip: params.ip,
    source: params.source,
  });

  if (error) {
    console.error("[api/agent] Error insertando chat log:", error);
  }
}

async function streamOpenAIResponse(options: {
  openai: OpenAI;
  supabase: SupabaseClient;
  messages: IncomingMessage[];
  context: string;
  ip: string;
  lastUserMessage: string;
}) {
  const { openai, supabase, messages, context, ip, lastUserMessage } = options;
  const model = process.env.CHAT_MODEL || "gpt-4.1-mini";

  const responseInput = [
    {
      role: "system" as const,
      content: SYSTEM_PROMPT,
    },
    {
      role: "system" as const,
      content: buildContextSection(context),
    },
    ...messages.map((message) => ({
      role: message.role,
      content: message.content,
    })),
  ];

  const stream = await openai.responses.stream({
    model,
    input: responseInput,
    temperature: 0.2,
    max_output_tokens: 800,
  });

  let accumulated = "";

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      controller.enqueue(
        textEncoder.encode(
          JSON.stringify({ type: "metadata", cta: false }) + "\n",
        ),
      );

      try {
        for await (const rawEvent of stream) {
          const event = rawEvent as { type?: string; delta?: string };
          const eventType = event.type;

          if (eventType === "error") {
            console.error("[api/agent] Error del modelo:", event);
            throw new Error("Error generando respuesta");
          }
          if (eventType === "response.output_text.delta") {
            const delta = event.delta ?? "";
            accumulated += delta;
            controller.enqueue(
              textEncoder.encode(
                JSON.stringify({ type: "token", value: delta }) + "\n",
              ),
            );
          }
        }

        await stream.finalResponse();

        const finalText = ensureDisclaimer(accumulated);
        const appended = finalText.slice(accumulated.length);
        if (appended) {
          controller.enqueue(
            textEncoder.encode(
              JSON.stringify({ type: "token", value: appended }) + "\n",
            ),
          );
        }

        await insertChatLog(supabase, {
          userMessage: lastUserMessage,
          assistantReply: finalText,
          ip,
          source: SOURCE_LABEL,
        });

        controller.enqueue(
          textEncoder.encode(JSON.stringify({ type: "done" }) + "\n"),
        );
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });
}

export async function POST(req: NextRequest) {
  if (isRateLimited(getClientIp(req))) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Hemos recibido muchas consultas desde tu red. Intenta nuevamente en unos minutos o contáctanos por WhatsApp.",
      },
      { status: 429 },
    );
  }

  let payload: RequestPayload;
  try {
    payload = (await req.json()) as RequestPayload;
  } catch {
    return NextResponse.json(
      { ok: false, message: "Formato de solicitud inválido." },
      { status: 400 },
    );
  }

  if (!Array.isArray(payload.messages) || payload.messages.length === 0) {
    return NextResponse.json(
      {
        ok: false,
        message: "Debes enviar mensajes para procesar la consulta.",
      },
      { status: 400 },
    );
  }

  const sanitizedMessages = payload.messages
    .filter(
      (message): message is IncomingMessage =>
        message &&
        (message.role === "user" || message.role === "assistant") &&
        typeof message.content === "string",
    )
    .map((message) => ({
      role: message.role,
      content: sanitizeMessageContent(message.content),
    }))
    .slice(-10);

  if (!sanitizedMessages.length) {
    return NextResponse.json(
      { ok: false, message: "No se encontraron mensajes válidos." },
      { status: 400 },
    );
  }

  const lastUserMessage = sanitizedMessages
    .slice()
    .reverse()
    .find((message) => message.role === "user")?.content;

  if (!lastUserMessage) {
    return NextResponse.json(
      { ok: false, message: "Se requiere al menos un mensaje del usuario." },
      { status: 400 },
    );
  }

  if (checkContactIntent(lastUserMessage)) {
    try {
      const supabase = buildSupabaseClient();
      const ip = getClientIp(req);
      const responseText = `${NO_DATA_REPLY}\n\n${DISCLAIMER}`;
      await insertChatLog(supabase, {
        userMessage: lastUserMessage,
        assistantReply: responseText,
        ip,
        source: SOURCE_LABEL,
      });

      return new Response(streamFromString(responseText, true), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("[api/agent] Error procesando derivación:", error);
      return NextResponse.json(
        {
          ok: false,
          message:
            "No fue posible derivar tu solicitud en este momento. Intenta nuevamente más tarde.",
        },
        { status: 500 },
      );
    }
  }

  let supabase: SupabaseClient;
  try {
    supabase = buildSupabaseClient();
  } catch (error) {
    console.error("[api/agent] Supabase no disponible:", error);
    return NextResponse.json(
      {
        ok: false,
        message:
          "Servicio temporalmente no disponible. Contáctanos por WhatsApp.",
      },
      { status: 503 },
    );
  }

  const comunas = await fetchDistinctComunas(supabase);
  const filters = extractFilters(lastUserMessage, comunas);

  let projects: ProjectRow[] = [];
  try {
    projects = await fetchProjects(supabase, filters);
  } catch (error) {
    console.error("[api/agent] Error consultando proyectos:", error);
    return NextResponse.json(
      {
        ok: false,
        message:
          "No fue posible obtener la información solicitada. Intenta nuevamente o contáctanos por WhatsApp.",
      },
      { status: 500 },
    );
  }

  if (!projects.length) {
    const responseText = `${NO_DATA_REPLY}\n\n${DISCLAIMER}`;
    const ip = getClientIp(req);
    await insertChatLog(supabase, {
      userMessage: lastUserMessage,
      assistantReply: responseText,
      ip,
      source: SOURCE_LABEL,
    });

    return new Response(streamFromString(responseText, true), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const openaiApiKey = process.env.OPENAI_API_KEY;
  if (!openaiApiKey) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "El servicio de asistente no está disponible por el momento. Contáctanos por WhatsApp.",
      },
      { status: 503 },
    );
  }

  const openai = new OpenAI({ apiKey: openaiApiKey });
  const context = buildContextFromProjects(projects);
  const ip = getClientIp(req);

  try {
    const stream = await streamOpenAIResponse({
      openai,
      supabase,
      messages: sanitizedMessages,
      context,
      ip,
      lastUserMessage,
    });

    return new Response(stream, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[api/agent] Error generando respuesta:", error);
    return NextResponse.json(
      {
        ok: false,
        message:
          "No fue posible generar la respuesta en este momento. Contáctanos por WhatsApp.",
      },
      { status: 500 },
    );
  }
}

export function GET() {
  return NextResponse.json(
    { ok: false, message: "Método no permitido. Usa POST." },
    {
      status: 405,
      headers: { Allow: "POST" },
    },
  );
}
