import type { NormalizedLandmark } from '@mediapipe/hands';

/** Euclidean distance between two 3D landmarks */
export function euclidean(
  a: NormalizedLandmark,
  b: NormalizedLandmark
): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = (a.z ?? 0) - (b.z ?? 0);
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/** Angle in degrees between three landmarks (b is the vertex) */
export function angleBetween(
  a: NormalizedLandmark,
  b: NormalizedLandmark,
  c: NormalizedLandmark
): number {
  const abx = a.x - b.x;
  const aby = a.y - b.y;
  const cbx = c.x - b.x;
  const cby = c.y - b.y;
  const dot = abx * cbx + aby * cby;
  const magAB = Math.sqrt(abx * abx + aby * aby);
  const magCB = Math.sqrt(cbx * cbx + cby * cby);
  if (magAB === 0 || magCB === 0) return 0;
  const cosAngle = Math.max(-1, Math.min(1, dot / (magAB * magCB)));
  return (Math.acos(cosAngle) * 180) / Math.PI;
}

/** Normalize a value from [inMin, inMax] to [outMin, outMax] */
export function normalize(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  const clamped = Math.max(inMin, Math.min(inMax, value));
  return ((clamped - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
}

/** Centroid of a set of landmarks */
export function centroid(
  landmarks: NormalizedLandmark[]
): NormalizedLandmark {
  const sum = landmarks.reduce(
    (acc, l) => ({ x: acc.x + l.x, y: acc.y + l.y, z: acc.z + (l.z ?? 0) }),
    { x: 0, y: 0, z: 0 }
  );
  const n = landmarks.length;
  return { x: sum.x / n, y: sum.y / n, z: sum.z / n };
}

/** Check if a finger is extended (tip farther from wrist than MCP) */
export function isFingerExtended(
  tip: NormalizedLandmark,
  mcp: NormalizedLandmark,
  wrist: NormalizedLandmark
): boolean {
  const tipDist = euclidean(tip, wrist);
  const mcpDist = euclidean(mcp, wrist);
  return tipDist > mcpDist * 1.2;
}
