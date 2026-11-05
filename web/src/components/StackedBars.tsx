import { type CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import { animate, motion, useMotionValue } from "framer-motion";

/* ══ Stacked bars ═════════════════════════════════════════
   An alert-volume card: a stack of four sources for every day (or
   week), and under the baseline the few that were escalated.

   ── RUN ALONG IT ────────────────────────────────────────
   The column under the pointer gets a ring round its whole stack,
   the rest step back (their colour mixed toward the slab, never
   faded), and one tooltip glides beside it on a spring with the
   date, the total and what made it up.

   ── DAY / WEEK ──────────────────────────────────────────
   Swaps the dataset; every segment eases to its new height and
   offset a beat after its left neighbour. The same transition
   grows the bars out of the baseline the first time the card is
   seen. */

const PAD = 16;
const CH = 104; // room above the baseline
const BH = 22; // room below it for the escalated bars
const SEG_GAP = 2;
const LIFT = 2; // air between the baseline and the bars either side of it
const TIP_W = 156;
const SPRING = { type: "spring" as const, stiffness: 380, damping: 34 };

// Domain Categories: Telemetry Sensors (Dashboard) vs Financial Incentives (Wallet)
const DEFAULT_TELEMETRY_CATS = [
  "SPS30 (PM2.5)",
  "SHT40 (Termal)",
  "GNSS (Spasial)",
  "IMU (Vibrasi)"
] as const;

const DEFAULT_FINANCIAL_CATS = [
  "Bonus Zona H3",
  "Tarif Dasar KM",
  "Subsidi Rute Bersih",
  "Akurasi Sensor"
] as const;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const LAST = Date.UTC(2026, 10, 3); // Nov 3, 2026 (matching current operating time)
const DAY_MS = 86400000;

export type Mode = "Hari" | "Minggu";
export type Bar = { vals: number[]; esc: number; label: string; short: string; isToday?: boolean };

/* a small seeded generator: the same chart on every load */
function mulberry(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const fmtDay = (ms: number) => {
  const d = new Date(ms);
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
};

function makeBars(
  mode: Mode, 
  n: number, 
  isSimulatingAnomaly: boolean = false, 
  variant: "telemetry" | "financial" = "telemetry"
): Bar[] {
  const rnd = mulberry(mode === "Hari" ? 4396 : 9117);

  if (variant === "financial") {
    // Financial mode: amounts in thousands of Rupiah (ribu Rp)
    // Daily proportions: H3 Bonus 2x (~42%), Base KM (~32%), Clean Route Subsidy (~16%), EV Carbon Credit (~10%)
    const base = [125, 85, 45, 25];
    const out: Bar[] = [];
    for (let i = 0; i < 30; i++) {
      const back = 29 - i;
      const isToday = back === 0;
      if (mode === "Hari") {
        const ms = LAST - back * DAY_MS;
        const wd = new Date(ms).getUTCDay();
        const quiet = wd === 0 || wd === 6 ? 0.72 : 1;
        const surge = rnd() < 0.15 ? 1.35 : 1;
        const vals = base.map((b, k) => Math.round(b * quiet * (0.7 + rnd() * 0.6) * (k === 0 ? surge : 1)));
        
        // Escalated: Withdrawals (pencairan saldo) on some days
        const hasWithdrawal = rnd() < 0.22;
        const esc = isToday ? 100 : (hasWithdrawal ? (rnd() < 0.5 ? 50 : 100) : 0);
        
        out.push({
          vals,
          esc,
          label: isToday ? `Hari Ini (${fmtDay(ms)})` : fmtDay(ms),
          short: isToday ? "Hari ini" : fmtDay(ms),
          isToday
        });
      } else {
        const end = LAST - back * 7 * DAY_MS;
        const start = end - 6 * DAY_MS;
        const vals = base.map((b) => Math.round(b * 6.5 * (0.8 + rnd() * 0.4)));
        const esc = Math.round(150 + rnd() * 250);
        const s = new Date(start), e = new Date(end);
        const label = s.getUTCMonth() === e.getUTCMonth()
          ? `${s.getUTCDate()}–${e.getUTCDate()} ${MONTHS[e.getUTCMonth()]}`
          : `${fmtDay(start)} – ${fmtDay(end)}`;
        out.push({ vals, esc, label, short: `${s.getUTCDate()} ${MONTHS[s.getUTCMonth()]}` });
      }
    }
    return out.slice(30 - n);
  }

  // Telemetry sensor mode
  const base = [540, 370, 240, 190];
  const out: Bar[] = [];
  for (let i = 0; i < 30; i++) {
    const back = 29 - i;
    const isToday = back === 0;
    if (mode === "Hari") {
      const ms = LAST - back * DAY_MS;
      const wd = new Date(ms).getUTCDay();
      const quiet = wd === 0 || wd === 6 ? 0.65 : 1;
      const surge = rnd() < 0.12 ? 1.4 : 1;
      const vals = base.map((b, k) => Math.round(b * quiet * (0.65 + rnd() * 0.7) * (k === 3 ? surge * surge : surge)));
      
      let esc = Math.round(2 + rnd() * 6 * quiet);
      if (isToday && isSimulatingAnomaly) {
        esc = 42;
      }
      out.push({ 
        vals, 
        esc, 
        label: isToday ? `Hari Ini (${fmtDay(ms)})` : fmtDay(ms), 
        short: isToday ? "Hari ini" : fmtDay(ms),
        isToday 
      });
    } else {
      const end = LAST - back * 7 * DAY_MS;
      const start = end - 6 * DAY_MS;
      const vals = base.map((b) => Math.round(b * 5.8 * (0.75 + rnd() * 0.5)));
      const esc = Math.round(24 + rnd() * 32);
      const s = new Date(start), e = new Date(end);
      const label = s.getUTCMonth() === e.getUTCMonth()
        ? `${s.getUTCDate()}–${e.getUTCDate()} ${MONTHS[e.getUTCMonth()]}`
        : `${fmtDay(start)} – ${fmtDay(end)}`;
      out.push({ vals, esc, label, short: `${s.getUTCDate()} ${MONTHS[s.getUTCMonth()]}` });
    }
  }
  return out.slice(30 - n);
}

const fmt = (v: number) => Math.round(v).toLocaleString("id-ID");
const sum = (a: number[]) => a.reduce((s, v) => s + v, 0);

export interface StackedBarsProps {
  variant?: "telemetry" | "financial";
  colour?: "Mono" | "Colour";
  bars?: number;
  gap?: number;
  width?: number | string;
  embedded?: boolean;
  title?: string;
  subtitle?: string;
  unit?: string;
  categories?: readonly string[];
  escalatedLabel?: string;
  isSimulatingAnomaly?: boolean;
  totalOverride?: number;
  onSelectBar?: (bar: Bar, index: number) => void;
}

export function StackedBars({
  variant = "telemetry",
  colour = "Colour",
  bars = 20,
  gap = 6,
  width = "100%",
  embedded = false,
  title,
  subtitle,
  unit,
  categories,
  escalatedLabel,
  isSimulatingAnomaly = false,
  totalOverride,
  onSelectBar
}: StackedBarsProps) {
  const root = useRef<HTMLDivElement | null>(null);
  const plot = useRef<HTMLDivElement | null>(null);
  const [measuredWidth, setMeasuredWidth] = useState<number>(typeof width === "number" ? width : 340);

  // Dynamically measure container width to guarantee bars fit the card geometry
  useEffect(() => {
    if (typeof width === "number") {
      setMeasuredWidth(width);
      return;
    }
    const el = root.current;
    if (!el) return;
    const updateWidth = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 80) {
        setMeasuredWidth(rect.width);
      }
    };
    updateWidth();
    const ro = new ResizeObserver(updateWidth);
    ro.observe(el);
    return () => ro.disconnect();
  }, [width]);

  const W = typeof width === "number" ? width : measuredWidth;
  const paddingAmount = embedded ? 0 : PAD * 2;
  const CW = Math.max(160, W - paddingAmount); // the plot's width
  const n = Math.max(2, Math.round(bars));
  const [mode, setMode] = useState<Mode>("Hari");
  const [at, setAt] = useState<number | null>(null);
  const [seen, setSeen] = useState(false);

  // Resolved titles and categories depending on variant
  const isFinancial = variant === "financial";
  const resolvedTitle = title ?? (isFinancial ? "Komposisi Insentif" : "Fusi Telemetri");
  const resolvedSubtitle = subtitle ?? (isFinancial ? `${n} ${mode === "Hari" ? "hari" : "minggu"} • 4 komponen` : `${n} ${mode === "Hari" ? "hari" : "minggu"} • Fusi 4 sensor`);
  const resolvedUnit = unit ?? (isFinancial ? "Rupiah" : "data IoT");
  const resolvedCats = categories ?? (isFinancial ? DEFAULT_FINANCIAL_CATS : DEFAULT_TELEMETRY_CATS);
  const resolvedEscLabel = escalatedLabel ?? (isFinancial ? "Pencairan Saldo" : "Anomali Mock GPS");

  /* Tooltip width: sized so Indonesian labels like "Bonus Zona H3 (2.0x)" and "Rp85.000" never overlap */
  const TIP_W = isFinancial ? Math.min(220, Math.max(180, CW - 12)) : Math.min(180, Math.max(150, CW - 12));

  /* grow in once, the first time the card is on screen */
  useEffect(() => {
    const el = root.current;
    if (!el || seen) return;
    if (typeof IntersectionObserver === "undefined") { setSeen(true); return; }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setSeen(true); io.disconnect(); }
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [seen]);

  const data = useMemo(() => makeBars(mode, n, isSimulatingAnomaly, variant), [mode, n, isSimulatingAnomaly, variant]);

  /* geometry: the gap gives way before a bar gets thinner than 3px,
     so 30 bars at the widest gap still draw */
  const g = Math.max(1, Math.min(gap, (CW - 3 * n) / (n - 1)));
  const bw = (CW - g * (n - 1)) / n;
  const r = Math.min(2.5, bw / 2);
  const totals = data.map((b) => sum(b.vals));
  const maxT = Math.max(...totals);
  const maxE = Math.max(...data.map((b) => b.esc));
  const scale = (CH - LIFT - 2 - SEG_GAP * (resolvedCats.length - 1)) / maxT;
  const layout = data.map((b) => {
    let y = 0;
    const segs = b.vals.map((v) => {
      const h = Math.max(2, v * scale);
      const s = { bottom: y, h };
      y += h + SEG_GAP;
      return s;
    });
    return { segs, top: y - SEG_GAP, esc: Math.max(3, (b.esc / maxE) * (BH - LIFT - 2)) };
  });

  /* format values according to variant */
  const formatVal = (raw: number) => {
    if (isFinancial) {
      return `Rp${(raw * 1000).toLocaleString("id-ID")}`;
    }
    return fmt(raw);
  };

  /* the headline pops in on a change */
  const rawSum = sum(totals);
  const totalDisplay = isFinancial 
    ? (totalOverride ? `Rp${totalOverride.toLocaleString("id-ID")}` : `Rp${(rawSum * 1000).toLocaleString("id-ID")}`)
    : (totalOverride ? fmt(totalOverride) : fmt(rawSum));

  const [gen, setGen] = useState(0);
  const last = useRef(totalDisplay);
  useEffect(() => {
    if (last.current === totalDisplay) return;
    last.current = totalDisplay;
    setGen((g) => g + 1);
  }, [totalDisplay]);

  /* ring and tooltip: placed at once when they appear, glide after */
  const ringX = useMotionValue(0);
  const ringY = useMotionValue(0);
  const ringH = useMotionValue(0);
  const tipX = useMotionValue(0);
  const was = useRef<number | null>(null);
  useEffect(() => {
    if (at === null || at >= n) { was.current = null; return; }
    const L = layout[at];
    const left = at * (bw + g);
    const x = left - 3;
    const up = seen ? L.top : 0;
    const down = seen ? L.esc : 0;
    const y = CH - LIFT - up - 3;
    const h = up + LIFT + 1 + LIFT + down + 6;
    /* Beside the column: flip cleanly depending on screen half so it never clips or sits directly over the active column */
    const isRightHalf = at >= n / 2;
    let tx: number;
    if (isRightHalf) {
      tx = left - 10 - TIP_W;
      if (tx < 0) tx = 0;
    } else {
      tx = left + bw + 10;
      if (tx + TIP_W > CW) tx = CW - TIP_W;
    }

    const go = (mv: typeof ringX, v: number) => {
      if (was.current === null) mv.set(v);
      else animate(mv, v, SPRING);
    };
    go(ringX, x); go(ringY, y); go(ringH, h); go(tipX, tx);
    was.current = at;
    if (onSelectBar && at < data.length) {
      onSelectBar(data[at], at);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [at, n, bw, g, mode, seen, isSimulatingAnomaly, CW, TIP_W]);

  const pick = (e: React.PointerEvent) => {
    const b = plot.current?.getBoundingClientRect();
    if (!b || b.width === 0) return;
    const i = Math.floor(((e.clientX - b.left) / b.width) * n);
    setAt(Math.max(0, Math.min(n - 1, i)));
  };

  const cur = at !== null && at < n ? data[at] : null;
  const top2 = cur
    ? cur.vals.map((v, k) => ({ v, k })).sort((a, b) => b.v - a.v).slice(0, 2)
    : [];

  return (
    <div
      ref={root}
      className={`stb ${embedded ? "stb-embedded" : ""}`}
      data-colour={colour === "Colour" ? "on" : "off"}
      data-scrub={cur ? "" : undefined}
      style={{ 
        width: typeof width === "number" ? `${width}px` : "100%", 
        ["--stb-r" as string]: `${r}px`, 
        ["--stb-rr" as string]: `${r + 3}px` 
      } as CSSProperties}
    >
      <div className="stb-head">
        <div className="stb-titles">
          <div className="stb-title font-bold text-neutral-900">{resolvedTitle}</div>
          <div className="stb-sub">{resolvedSubtitle}</div>
        </div>
        <div className="stb-seg-ctl" data-mode={mode} role="tablist">
          <span className="stb-thumb" aria-hidden />
          {(["Hari", "Minggu"] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              data-on={mode === m || undefined}
              className="stb-tab font-medium"
              onClick={() => { setMode(m); }}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="stb-figure">
        <span className="stb-num tabular-nums" aria-label={totalDisplay}>
          {totalDisplay.split("").map((ch, i) => (
            <span key={`${gen}-${i}`} className="stb-digit" data-pop={gen > 0 || undefined} style={{ ["--i" as string]: i } as CSSProperties} aria-hidden>
              {ch}
            </span>
          ))}
        </span>
        <span className="stb-unit font-medium">{resolvedUnit}</span>
      </div>

      <div
        ref={plot}
        className="stb-plot"
        style={{ height: CH + 1 + BH }}
        onPointerDown={(e) => {
          try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* scripted */ }
          pick(e);
        }}
        onPointerMove={pick}
        onPointerUp={(e) => {
          try { e.currentTarget.releasePointerCapture(e.pointerId); } catch { /* scripted */ }
          if (e.pointerType !== "mouse") setAt(null);
        }}
        onPointerCancel={() => setAt(null)}
        onPointerLeave={() => setAt(null)}
      >
        <span className="stb-base" style={{ top: CH }} />
        {data.map((b, i) => (
          <div
            key={i}
            className="stb-col"
            data-on={at === i || undefined}
            style={{ left: i * (bw + g), width: bw, ["--i" as string]: i } as CSSProperties}
          >
            {layout[i].segs.map((s, k) => (
              <span
                key={k}
                className="stb-bar"
                style={{
                  ["--c" as string]: `var(--stb-c${k + 1})`,
                  bottom: BH + 1 + LIFT + (seen ? s.bottom : 0),
                  height: seen ? s.h : 0,
                } as CSSProperties}
              />
            ))}
            <span
              className={`stb-esc ${!isFinancial && b.isToday && isSimulatingAnomaly ? 'animate-pulse' : ''}`}
              style={{ top: CH + 1 + LIFT, height: seen ? layout[i].esc : 0 }}
              title={
                isFinancial
                  ? (b.esc > 0 ? `Pencairan: Rp${(b.esc * 1000).toLocaleString('id-ID')}` : "Tidak ada pencairan")
                  : (b.isToday && isSimulatingAnomaly ? "Anomali Mock GPS terdeteksi!" : undefined)
              }
            />
          </div>
        ))}

        <motion.span
          className="stb-ring"
          aria-hidden
          style={{ x: ringX, y: ringY, height: ringH, width: bw + 6 }}
        />

        <motion.div className="stb-tip shadow-lg" style={{ x: tipX, width: TIP_W }} aria-hidden={!cur}>
          {cur && (
            <>
              <div className="stb-tip-head">
                <span className="truncate mr-2">{cur.label}</span>
                <b className="tabular-nums shrink-0">{formatVal(totals[at!])}</b>
              </div>
              {top2.map(({ v, k }) => (
                <div className="stb-tip-row text-[11px]" key={resolvedCats[k] || k}>
                  <i style={{ ["--c" as string]: `var(--stb-c${k + 1})` } as CSSProperties} className="shrink-0" />
                  <span className="truncate flex-1 min-w-0 mr-2 text-neutral-600">{resolvedCats[k] || `Komponen ${k + 1}`}</span>
                  <b className="tabular-nums shrink-0 font-medium text-neutral-900">{formatVal(v)}</b>
                </div>
              ))}
              <div className="stb-tip-row text-[11px]" data-esc="">
                <i className={`shrink-0 ${!isFinancial && cur.isToday && isSimulatingAnomaly ? 'bg-rose-500 animate-ping' : ''}`} />
                <span className={`truncate flex-1 min-w-0 mr-2 ${!isFinancial && cur.isToday && isSimulatingAnomaly ? 'text-rose-600 font-bold' : 'text-neutral-600'}`}>
                  {resolvedEscLabel}
                </span>
                <b className={`tabular-nums shrink-0 ${isFinancial ? 'text-rose-600 font-semibold' : (!isFinancial && cur.isToday && isSimulatingAnomaly ? 'text-rose-600 font-bold' : 'text-neutral-900')}`}>
                  {isFinancial 
                    ? (cur.esc > 0 ? `-${formatVal(cur.esc)}` : "Rp0") 
                    : `${cur.esc} ${cur.isToday && isSimulatingAnomaly ? '⚠' : ''}`}
                </b>
              </div>
            </>
          )}
        </motion.div>
      </div>

      <div className="stb-axis tabular-nums">
        <span>{data[0].short}</span>
        <span className="flex items-center space-x-1">
          {!isFinancial && isSimulatingAnomaly && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping mr-1" />}
          <span>{data[n - 1].short}</span>
        </span>
      </div>
    </div>
  );
}

export default StackedBars;
