// Conversión simple UF→CLP (placeholder). Reemplazar luego por microservicio CMF.
export function ufToClp(uf: number, ufHoy?: number) {
  const tasa = ufHoy ?? Number(process.env.NEXT_PUBLIC_UF_DIARIA_CLP ?? 37000);
  return Math.round(uf * tasa);
}

export function clpFmt(n: number) {
  return n.toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });
}

export function ufFmt(n: number) {
  return `UF ${new Intl.NumberFormat("es-CL", { maximumFractionDigits: 0 }).format(n)}`;
}