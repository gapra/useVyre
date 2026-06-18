/** Linear interpolation scale: maps a value in [d0,d1] to [r0,r1]. */
export function scaleLinear(
  domain: readonly [number, number],
  range: readonly [number, number],
): (value: number) => number {
  const [d0, d1] = domain;
  const [r0, r1] = range;
  const span = d1 - d0;
  return (value: number) => {
    if (span === 0) return r0;
    return r0 + ((value - d0) / span) * (r1 - r0);
  };
}

/** Produce ~count human-friendly ticks spanning [min,max] (rounded step). */
export function niceTicks(min: number, max: number, count = 5): number[] {
  if (min === max) {
    const v = min;
    return [v - 1, v, v + 1];
  }
  const rawStep = (max - min) / count;
  const mag = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const norm = rawStep / mag;
  let niceNorm: number;
  if (norm < 1.5) niceNorm = 1;
  else if (norm < 3) niceNorm = 2;
  else if (norm < 4) niceNorm = 2.5;
  else if (norm < 7) niceNorm = 5;
  else niceNorm = 10;
  const step = niceNorm * mag;
  const start = Math.floor(min / step) * step;
  const end = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let t = start; t <= end + step * 1e-9 && ticks.length < 1000; t += step) {
    ticks.push(Math.round(t * 1e6) / 1e6);
  }
  return ticks;
}

export type Curve = "linear" | "smooth";
export type Point = readonly [number, number];

export function buildLinePath(points: readonly Point[], curve: Curve = "linear"): string {
  if (points.length === 0) return "";
  if (curve === "linear" || points.length < 3) {
    return points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
  }
  let d = `M${points[0][0]},${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x},${c1y} ${c2x},${c2y} ${p2[0]},${p2[1]}`;
  }
  return d;
}

export function buildAreaPath(points: readonly Point[], baselineY: number, curve: Curve = "linear"): string {
  if (points.length === 0) return "";
  const top = buildLinePath(points, curve);
  const lastX = points[points.length - 1][0];
  const firstX = points[0][0];
  return `${top} L${lastX},${baselineY} L${firstX},${baselineY} Z`;
}

function polar(cx: number, cy: number, r: number, angle: number): [number, number] {
  return [cx + r * Math.sin(angle), cy - r * Math.cos(angle)];
}

/** SVG path for a pie slice (innerR omitted) or donut slice (innerR set). */
export function arcPath(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
  innerR = 0,
): string {
  const large = endAngle - startAngle > Math.PI ? 1 : 0;
  const [ox0, oy0] = polar(cx, cy, r, startAngle);
  const [ox1, oy1] = polar(cx, cy, r, endAngle);
  if (innerR <= 0) {
    return `M${cx},${cy} L${ox0},${oy0} A${r},${r} 0 ${large} 1 ${ox1},${oy1} Z`;
  }
  const [ix1, iy1] = polar(cx, cy, innerR, endAngle);
  const [ix0, iy0] = polar(cx, cy, innerR, startAngle);
  return `M${ox0},${oy0} A${r},${r} 0 ${large} 1 ${ox1},${oy1} L${ix1},${iy1} A${innerR},${innerR} 0 ${large} 0 ${ix0},${iy0} Z`;
}
