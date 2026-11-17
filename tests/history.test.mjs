import test from "node:test";
import assert from "node:assert/strict";
import * as history from "../src/helper/history.mjs";
import { formatWib, formatWibInput, parseWibInput, formatReading, chartRows, defaultSensors } from "../src/helper/history.mjs";
test("WIB input conversion is independent of host timezone and rejects rollover", () => {
 for (const tz of ["UTC", "America/New_York", "Asia/Jakarta"]) {
 process.env.TZ = tz;
 assert.equal(formatWib("2026-11-16T18:30:42Z"), "17/11/2026 01:30:42 WIB");
 assert.equal(formatWibInput("2026-11-16T18:30:00Z"), "2026-11-17T01:30");
 assert.equal(parseWibInput("2026-11-17T01:30"), "2026-11-16T18:30:00.000Z");
 assert.equal(parseWibInput("2026-02-30T01:30"), null);
 }
});
test("readings retain zero, omit invalid readings, and use metadata units", () => {
 assert.equal(formatReading(0, "%"), "0 %");
 assert.equal(formatReading(1.2345, "m/s"), "1.23 m/s");
 for (const x of [null, undefined, NaN, Infinity, ""]) assert.equal(formatReading(x, ""), "—");
});
test("gaps over five minutes get a null separator; missing values stay absent", () => {
 const rows = chartRows([{timestamp:"2026-01-01T00:00Z", t:0},{timestamp:"2026-01-01T00:06Z", t:null}], ["t"]);
 assert.equal(chartRows([{timestamp:"2026-01-01T00:00Z",t:1.2345},{timestamp:"2026-01-01T00:05Z",t:Infinity}], ["t"]).length, 2);
 assert.equal(rows.length, 3); assert.equal(rows[0].t, 0); assert.equal(rows[1].t, null); assert.equal(rows[2].t, null);
 assert.deepEqual(defaultSensors([{name:"Other"},{name:"Temperature"},{name:"Kelembapan"}]), ["Temperature","Kelembapan"]);
});

test("isolated readings remain visible across gaps without marking continuous lines", () => {
 const sparse = chartRows([
  {timestamp: "2026-01-01T00:00Z", t: 0},
  {timestamp: "2026-01-01T00:06Z", t: 12},
 ], ["t"]);
 assert.deepEqual(sparse.map((_, index) => history.isIsolatedReading(sparse, index, "t")), [true, false, true]);
 const continuous = chartRows([
  {timestamp: "2026-01-01T00:00Z", t: 0},
  {timestamp: "2026-01-01T00:01Z", t: 12},
 ], ["t"]);
 assert.deepEqual(continuous.map((_, index) => history.isIsolatedReading(continuous, index, "t")), [false, false]);
 assert.equal(history.isIsolatedReading([{time: 0, t: 0}], 0, "t"), true);
 assert.equal(history.isIsolatedReading([{time: 0, t: null}], 0, "t"), false);
});
