// MediaPipe singleton — loaded once on the client side.
// We import types only; the actual script tag is injected at runtime via CDN.

let handsInstance: import('@mediapipe/hands').Hands | null = null;

export async function getHandsInstance(): Promise<
  import('@mediapipe/hands').Hands
> {
  if (handsInstance) return handsInstance;

  const { Hands } = await import('@mediapipe/hands');

  handsInstance = new Hands({
    locateFile: (file: string) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
  });

  handsInstance.setOptions({
    maxNumHands: 2,
    modelComplexity: 1,
    minDetectionConfidence: 0.7,
    minTrackingConfidence: 0.7,
  });

  return handsInstance;
}

export function destroyHandsInstance(): void {
  if (handsInstance) {
    handsInstance.close();
    handsInstance = null;
  }
}
