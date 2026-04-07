import type { NormalizedLandmark } from '@mediapipe/hands';
import { euclidean, isFingerExtended } from '@/lib/gestureUtils';

export type GestureType =
  | 'OPEN_PALM'
  | 'PINCH'
  | 'SPREAD'
  | 'FIST'
  | 'INDEX_POINT_UP'
  | 'TWO_HAND_PINCH'
  | 'TWO_HAND_SPREAD'
  | 'NONE';

export interface GestureEvent {
  type: GestureType;
  confidence: number;
  /** Normalized delta values for the current frame */
  delta: {
    x: number;
    y: number;
    pinchDistance?: number;
    scale?: number;
  };
  /** Raw landmarks for the primary hand */
  landmarks?: NormalizedLandmark[];
  /** Raw landmarks for the secondary hand (two-hand gestures) */
  landmarks2?: NormalizedLandmark[];
}

// MediaPipe landmark indices
const WRIST = 0;
const THUMB_TIP = 4;
const INDEX_MCP = 5;
const INDEX_TIP = 8;
const MIDDLE_MCP = 9;
const MIDDLE_TIP = 12;
const RING_MCP = 13;
const RING_TIP = 16;
const PINKY_MCP = 17;
const PINKY_TIP = 20;

function classifySingleHand(lm: NormalizedLandmark[]): {
  type: GestureType;
  confidence: number;
} {
  const wrist = lm[WRIST];
  const thumbTip = lm[THUMB_TIP];
  const indexTip = lm[INDEX_TIP];
  const middleTip = lm[MIDDLE_TIP];
  const ringTip = lm[RING_TIP];
  const pinkyTip = lm[PINKY_TIP];

  const thumbExt = isFingerExtended(thumbTip, lm[2], wrist);
  const indexExt = isFingerExtended(indexTip, lm[INDEX_MCP], wrist);
  const middleExt = isFingerExtended(middleTip, lm[MIDDLE_MCP], wrist);
  const ringExt = isFingerExtended(ringTip, lm[RING_MCP], wrist);
  const pinkyExt = isFingerExtended(pinkyTip, lm[PINKY_MCP], wrist);

  const extendedCount = [thumbExt, indexExt, middleExt, ringExt, pinkyExt].filter(
    Boolean
  ).length;

  const pinchDist = euclidean(thumbTip, indexTip);

  // Index Point Up: only index extended, pointing upward
  if (
    indexExt &&
    !middleExt &&
    !ringExt &&
    !pinkyExt &&
    indexTip.y < wrist.y - 0.1
  ) {
    return { type: 'INDEX_POINT_UP', confidence: 0.9 };
  }

  // Fist: all fingers curled
  if (extendedCount <= 1) {
    return { type: 'FIST', confidence: 0.85 };
  }

  // Open palm: all five extended
  if (extendedCount >= 4) {
    return { type: 'OPEN_PALM', confidence: 0.9 };
  }

  // Pinch: thumb and index close together
  if (pinchDist < 0.05) {
    return { type: 'PINCH', confidence: normalize01(0.05 - pinchDist, 0, 0.05) };
  }

  // Spread (releasing pinch): thumb and index spreading apart
  if (pinchDist > 0.12 && extendedCount >= 2) {
    return { type: 'SPREAD', confidence: normalize01(pinchDist - 0.12, 0, 0.15) };
  }

  return { type: 'NONE', confidence: 0 };
}

function normalize01(value: number, min: number, max: number): number {
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
}

export const GestureClassifier = {
  /**
   * Classify gesture(s) from one or two sets of landmarks.
   */
  classify(
    landmarks: NormalizedLandmark[][],
    previousPinchDistance?: number
  ): GestureEvent {
    if (!landmarks || landmarks.length === 0) {
      return { type: 'NONE', confidence: 0, delta: { x: 0, y: 0 } };
    }

    // Two-hand gesture
    if (landmarks.length === 2) {
      const lm1 = landmarks[0];
      const lm2 = landmarks[1];
      const thumb1 = lm1[THUMB_TIP];
      const index1 = lm1[INDEX_TIP];
      const thumb2 = lm2[THUMB_TIP];
      const index2 = lm2[INDEX_TIP];

      const pinch1 = euclidean(thumb1, index1);
      const pinch2 = euclidean(thumb2, index2);
      const bothPinching = pinch1 < 0.1 && pinch2 < 0.1;

      // Distance between the two hands' index tips
      const interHandDist = euclidean(index1, index2);

      if (bothPinching) {
        const deltaScale = previousPinchDistance
          ? interHandDist - previousPinchDistance
          : 0;
        if (deltaScale > 0.005) {
          return {
            type: 'TWO_HAND_PINCH',
            confidence: 0.9,
            delta: { x: 0, y: 0, scale: deltaScale },
            landmarks: lm1,
            landmarks2: lm2,
          };
        }
        if (deltaScale < -0.005) {
          return {
            type: 'TWO_HAND_SPREAD',
            confidence: 0.9,
            delta: { x: 0, y: 0, scale: deltaScale },
            landmarks: lm1,
            landmarks2: lm2,
          };
        }
      }
    }

    // Single-hand classification
    const lm = landmarks[0];
    const { type, confidence } = classifySingleHand(lm);

    // Compute delta from wrist movement relative to normalised frame centre
    const wrist = lm[WRIST];
    const deltaX = wrist.x - 0.5;
    const deltaY = wrist.y - 0.5;

    const pinchDist = euclidean(lm[THUMB_TIP], lm[INDEX_TIP]);

    return {
      type,
      confidence,
      delta: { x: deltaX, y: deltaY, pinchDistance: pinchDist },
      landmarks: lm,
    };
  },
};
