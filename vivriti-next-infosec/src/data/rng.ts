// Deterministic seeded RNG so mock data is stable across reloads.
let seed = 20260709;
export function rng() {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
}
export function resetSeed(s = 20260709) { seed = s; }
export const pick = <T,>(arr: T[]): T => arr[Math.floor(rng() * arr.length)];
export const pickN = <T,>(arr: T[], n: number): T[] => {
  const copy = [...arr];
  const out: T[] = [];
  for (let i = 0; i < n && copy.length; i++) out.push(copy.splice(Math.floor(rng() * copy.length), 1)[0]);
  return out;
};
export const int = (min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min;
export const chance = (p: number) => rng() < p;
export function daysFromNow(d: number) {
  const date = new Date("2026-07-09T09:30:00");
  date.setDate(date.getDate() + d);
  return date.toISOString();
}
