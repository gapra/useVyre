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
