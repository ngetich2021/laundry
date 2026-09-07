export function normalizePhone(input: string): string {
  const digits = input.replace(/\D/g, "");
  return digits.slice(-9);
}

export function toLocalDisplay(input: string): string {
  const norm = normalizePhone(input);
  return norm.length === 9 ? "0" + norm : input;
}

export function maskPhone(input: string): string {
  const local = toLocalDisplay(input);
  if (local.length < 6) return local;
  return `${local.slice(0, 4)}***${local.slice(-2)}`;
}
