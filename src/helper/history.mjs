const parts = (value) => {
  const date = new Date(value);
  if (value == null || !Number.isFinite(date.getTime())) return null;
  return Object.fromEntries(new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Jakarta", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
  }).formatToParts(date).map(({ type, value }) => [type, value]));
};
export function formatWibInput(value) {
  const p = parts(value);
  return p ? `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}` : "";
}
export function parseWibInput(value) {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return null;
  const date = new Date(`${value}:00+07:00`);
  return formatWibInput(date) === value ? date.toISOString() : null;
}
export function formatWib(value, short = false) {
  const p = parts(value);
  if (!p) return "—";
  return short ? `${p.hour}:${p.minute}` : `${p.day}/${p.month}/${p.year} ${p.hour}:${p.minute}:${p.second} WIB`;
}
export const finiteReading = (value) => typeof value === "number" && Number.isFinite(value) ? value : null;
export function formatReading(value, unit = "") {
  return finiteReading(value) === null ? "—" : `${Number(value.toFixed(2))}${unit ? ` ${unit}` : ""}`;
}
export function defaultSensors(sensors) {
  const core = ["Temperature", "Kelembapan", "KecepatanAngin", "CurahHujan"];
  const names = sensors.map(s => s.name);
  const selected = core.filter(name => names.includes(name));
  return selected.length ? selected : names.slice(0, 3);
}
export function chartRows(data, keys) {
  const sorted = data.map(row => ({ ...row, time: new Date(row.timestamp).getTime() }))
    .filter(row => Number.isFinite(row.time)).sort((a,b) => a.time-b.time);
  const rows = [];
  for (const row of sorted) {
    const previous = rows.at(-1);
    if (previous && row.time - previous.time > 5 * 60 * 1000)
      rows.push({ time: previous.time + 1, ...Object.fromEntries(keys.map(key => [key, null])) });
    rows.push({ ...row, ...Object.fromEntries(keys.map(key => [key, finiteReading(row[key])])) });
  }
  return rows;
}

export function isIsolatedReading(rows, index, key) {
  return finiteReading(rows[index]?.[key]) !== null &&
    finiteReading(rows[index - 1]?.[key]) === null &&
    finiteReading(rows[index + 1]?.[key]) === null;
}
