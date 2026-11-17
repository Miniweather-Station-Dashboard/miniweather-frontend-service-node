import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
const source = readFileSync(process.env.HOOK_SOURCE || new URL("../src/redux/hooks/fetchHistoryData.js", import.meta.url), "utf8").replace(/^import .*;\n/gm, "").replace("export default function", "function");
const flush = async () => { for(let i=0;i<12;i++) await Promise.resolve(); };
function mount() {
 const slots=[], effects=[], calls=[], actions=[]; let cursor=0; let deviceId="a";
 const dispatch=action=>actions.push(action);
 const ctx={URLSearchParams, process:{env:{}}, console, fetch:url=>new Promise((resolve,reject)=>calls.push({url,resolve,reject})),
 useState:initial=>{const i=cursor++; if(!(i in slots)) slots[i]=typeof initial==="function"?initial():initial;return [slots[i],v=>{slots[i]=typeof v==="function"?v(slots[i]):v;}];},
 useRef:initial=>{const i=cursor++;return slots[i] ||= {current:initial};}, useCallback:fn=>fn,
 useEffect:fn=>effects.push(fn), useAppDispatch:()=>dispatch, useAppSelector:fn=>fn({device:{activeDevice:{id:deviceId}}}), setSensorHistoryData:data=>({data})};
 vm.createContext(ctx);vm.runInContext(source+"\nthis.hook=useSensorHistory",ctx);
 const render=()=>{cursor=0;effects.length=0;return ctx.hook();};
 const api=render(); let cleanups=effects.map(fn=>fn());
 return {api,render,calls,actions,switchDevice:()=>{cleanups.forEach(fn=>fn?.());deviceId="b";render();cleanups=effects.map(fn=>fn());},unmount:()=>cleanups.forEach(fn=>fn?.())};
}
const reply=(call,data)=>call.resolve({ok:true,json:async()=>data});
const latest={data:{latest:"2026-11-17T00:00:00Z"}};
const history=value=>({status:"success",data:{data:[{minute:"2026-11-17T00:00:00Z",value}]}});
test("each Last24 click refetches latest and history even with same timestamp",async()=>{
 const h=mount(); reply(h.calls[0],latest);await flush(); reply(h.calls[1],history(1));await flush();
 h.api.resetToLatest();assert.equal(h.calls.length,3);reply(h.calls[2],latest);await flush();assert.equal(h.calls.length,4);
 reply(h.calls[3],history(2));await flush();assert.equal(h.actions.at(-1).data[0].value,2);
});
test("Apply invalidates pending latest; stale history failure and unmount cannot overwrite",async()=>{
 const h=mount();h.api.updateTimeRange("2026-11-16T00:00:00Z","2026-11-16T01:00:00Z");
 reply(h.calls[0],latest);await flush();assert.equal(h.calls.length,2);
 h.api.updateTimeRange("2026-11-15T00:00:00Z","2026-11-15T01:00:00Z");
 reply(h.calls[2],history(3));await flush();h.calls[1].reject(new Error("old"));await flush();
 assert.equal(h.render().historyError,null); assert.equal(h.actions.at(-1).data[0].value,3);
 h.api.refresh();h.unmount();const count=h.actions.length;reply(h.calls[3],history(4));h.calls[4].reject(new Error("late"));await flush();assert.equal(h.actions.length,count);
});
test("Refresh preserves applied range and history succeeds despite latest failure",async()=>{
 const h=mount();reply(h.calls[0],latest);await flush();reply(h.calls[1],history(1));await flush();
 const before=h.render().timeRange;h.api.refresh();assert.ok(h.calls[2].url.includes(encodeURIComponent(before.startTime)));
 h.calls[3].reject(new Error("offline"));reply(h.calls[2],history(5));await flush();
 assert.equal(h.actions.at(-1).data[0].value,5);assert.equal(h.render().timeRange,before);assert.match(h.render().latestError,/offline/);
});

test("device change rejects previous latest and history success/failure/loading", async()=>{
 const h=mount();reply(h.calls[0],latest);await flush();
 h.api.resetToLatest();h.switchDevice();
 reply(h.calls[1],history(99));h.calls[2].reject(new Error("old latest"));await flush();
 assert.equal(h.render().latestError,null);assert.equal(h.render().latestLoading,true);
 assert.equal(h.actions.at(-1).data.length,0);
 reply(h.calls[3],latest);await flush();reply(h.calls[4],history(7));await flush();
 assert.equal(h.actions.at(-1).data[0].value,7);assert.equal(h.render().historyLoading,false);
});
