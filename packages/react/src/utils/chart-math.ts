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
