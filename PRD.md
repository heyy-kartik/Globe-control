# PRD: GlobeHands — Gesture-Controlled 3D Globe

**Document Version:** 1.0  
**Date:** April 2026  
**Status:** Draft  
**Author:** Product Team

---

## 1. Executive Summary

**GlobeHands** is a Next.js web application that uses a device camera and real-time hand gesture recognition (via MediaPipe Hands) to let users interact with a 3D globe rendered with React Three Fiber. Users can rotate, zoom, and resize the globe using natural hand gestures — no mouse or touch required.

---

## 2. Problem Statement

Traditional 3D globe interactions rely on mouse drag, scroll, and pinch gestures on touchscreens. These are limiting for:

- Accessibility scenarios (motor impairments)
- Presentation/kiosk environments (hands-free control)
- Novel, engaging UX experiences in ed-tech or data-viz products
- Touch-free hygienic use cases (public displays)

There is no mainstream, open-source, browser-native solution combining hand-gesture recognition with 3D globe rendering in a React/Next.js stack.

---

## 3. Goals & Success Metrics

### Goals
- Detect and interpret hand gestures in real-time (<100ms latency)
- Smoothly drive 3D globe rotation, zoom, and tilt via gestures
- Keep the app fully browser-based (no backend required for gesture detection)
- Provide intuitive gesture mappings with visual feedback

### Success Metrics

| Metric | Target |
|---|---|
| Gesture recognition latency | < 100ms |
| Frame rate (3D render) | ≥ 30 FPS on mid-range laptop |
| Gesture accuracy | ≥ 90% correct interpretation |
| Time-to-first-gesture | < 3 seconds from page load |
| Browser compatibility | Chrome 90+, Edge 90+, Firefox 95+ |

---

## 4. Scope

### In Scope
- Camera feed capture via `getUserMedia`
- Hand landmark detection via `@mediapipe/hands`
- Gesture classification (pinch zoom, open-palm rotate, fist grab, two-hand scale)
- 3D globe rendering via `@react-three/fiber` + `@react-three/drei`
- Earth texture mapping (NASA Blue Marble or equivalent)
- Gesture confidence overlay UI (landmark skeleton + gesture label)
- Settings panel (gesture sensitivity, camera toggle)

### Out of Scope (v1)
- Server-side processing
- Mobile/tablet camera support (desktop-first)
- Multi-user collaboration
- Location pinning or data layers on the globe
- Voice commands

---

## 5. User Personas

### 5.1 Presenter / Educator
Uses GlobeHands on a large monitor or projector to demonstrate geography or geopolitical data without touching a keyboard. Needs reliable gesture recognition and clear visual feedback.

### 5.2 Developer / Tinkerer
Exploring gesture-based UX. Needs clean, well-documented code they can fork and extend.

### 5.3 Accessibility User
Has limited fine motor control and wants to control digital interfaces through gross hand movements rather than precision mouse input.

---

## 6. User Stories

| ID | Story | Priority |
|---|---|---|
| US-01 | As a user, I want to open the app and have my camera detected automatically so I can start using gestures immediately | High |
| US-02 | As a user, I want to rotate the globe by moving my open hand left/right/up/down | High |
| US-03 | As a user, I want to zoom in/out on the globe using a pinch gesture (thumb + index finger) | High |
| US-04 | As a user, I want to use two hands to scale the globe (spread/close both hands) | Medium |
| US-05 | As a user, I want to see hand landmark overlays on the camera feed so I know the system is tracking me | High |
| US-06 | As a user, I want a gesture label shown on screen (e.g., "Zoom In", "Rotating") | Medium |
| US-07 | As a user, I want to pause gesture tracking without closing the camera | Low |
| US-08 | As a user, I want to reset the globe to its default orientation with a specific gesture | Medium |

---

## 7. Gesture Design

### 7.1 Gesture Map

| Gesture | Detection Method | Globe Action |
|---|---|---|
| **Open Palm + Move** | All 5 fingers extended, hand translation | Rotate globe (pan) |
| **Pinch (1 hand)** | Thumb-tip ↔ Index-tip distance decreasing | Zoom in |
| **Spread (1 hand)** | Thumb-tip ↔ Index-tip distance increasing | Zoom out |
| **Two-Hand Pinch** | Both hands pinching, moving apart | Scale up globe |
| **Two-Hand Spread** | Both hands spreading inward | Scale down globe |
| **Fist (closed hand)** | All fingertips near palm | Stop / lock position |
| **Index Point Up** | Only index finger extended vertically | Reset globe to default |

### 7.2 Gesture Detection Pipeline

```
Camera Frame
    ↓
MediaPipe Hands (21 landmarks/hand)
    ↓
GestureClassifier (custom utility)
    ↓
GestureEvent { type, confidence, delta }
    ↓
GlobeController (maps gesture → Three.js transforms)
    ↓
React Three Fiber (renders updated globe)
```

---

## 8. Technical Architecture

### 8.1 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| 3D Rendering | React Three Fiber (`@react-three/fiber`) |
| 3D Utilities | `@react-three/drei` (OrbitControls, Sphere, Stars) |
| Hand Tracking | `@mediapipe/hands` + `@mediapipe/camera_utils` |
| State Management | Zustand |
| Styling | Tailwind CSS |
| Animation | `@react-spring/three` (for smooth globe transitions) |

### 8.2 Component Architecture

```
app/
├── page.tsx                    ← Root page (layout: camera + globe)
├── layout.tsx
components/
├── Globe/
│   ├── GlobeScene.tsx          ← R3F Canvas + lighting + stars
│   ├── GlobeModel.tsx          ← Sphere + Earth texture + shaders
│   └── GlobeController.tsx     ← Consumes gesture state, drives transforms
├── Camera/
│   ├── CameraFeed.tsx          ← getUserMedia video element
│   ├── HandOverlay.tsx         ← Canvas overlay for landmark skeleton
│   └── MediaPipeSetup.tsx      ← Initializes MediaPipe, emits gesture events
├── Gesture/
│   ├── GestureClassifier.ts    ← Pure function: landmarks → gesture type
│   ├── GestureStore.ts         ← Zustand store for current gesture state
│   └── GestureLabel.tsx        ← On-screen gesture name badge
└── UI/
    ├── SettingsPanel.tsx
    └── GestureGuide.tsx        ← Gesture cheat-sheet modal
hooks/
├── useMediaPipe.ts             ← MediaPipe lifecycle hook
├── useGestureStream.ts         ← Throttled gesture event hook
└── useGlobeControls.ts         ← Translates gestures to globe state
lib/
├── mediapipe.ts                ← MediaPipe singleton init
└── gestureUtils.ts             ← Distance, angle, normalization helpers
```

### 8.3 Data Flow

```
useMediaPipe hook
  → onResults(landmarks[]) callback
    → GestureClassifier.classify(landmarks)
      → GestureStore.setGesture(gesture)
        → useGlobeControls reads store
          → updates R3F globe rotation/scale/zoom via useFrame
```

### 8.4 Landmark Geometry

MediaPipe provides 21 hand landmarks (x, y, z normalized 0–1).

Key landmark indices used:
- `4` — Thumb tip
- `8` — Index finger tip
- `12` — Middle finger tip
- `0` — Wrist

Pinch distance = `euclidean(landmark[4], landmark[8])`  
Finger curl = compare tip y to MCP y per finger

---

## 9. Non-Functional Requirements

| Category | Requirement |
|---|---|
| Performance | Gesture loop must run at ≥ 30 FPS; 3D render ≥ 30 FPS simultaneously |
| Latency | End-to-end gesture → globe response < 100ms |
| Privacy | Camera data never leaves the browser; no server upload |
| Accessibility | Keyboard fallback controls available at all times |
| Security | Content Security Policy allows camera API and wasm (MediaPipe) |
| Browser Support | Chrome 90+, Edge 90+ (WebAssembly + WebGL2 required) |

---

## 10. Milestones & Timeline

| Phase | Deliverable | Duration |
|---|---|---|
| Phase 1 | Camera feed + MediaPipe integration, landmark overlay | Week 1 |
| Phase 2 | Gesture classifier for pinch, open-palm, fist | Week 1–2 |
| Phase 3 | R3F globe with texture, basic OrbitControls | Week 2 |
| Phase 4 | Wire gesture state → globe transforms (rotate, zoom, scale) | Week 3 |
| Phase 5 | Polish: animations, gesture label UI, settings panel | Week 3–4 |
| Phase 6 | Testing, performance profiling, documentation | Week 4 |

---

## 11. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| MediaPipe WASM load time too slow | Medium | High | Preload with `<link rel="preload">`, show loading state |
| Poor lighting causes gesture misdetection | High | Medium | Warn user about lighting; add sensitivity slider |
| Camera permission denied | Low | High | Clear permission prompt UI; fallback to mouse/touch |
| R3F + MediaPipe competing for main thread | Medium | High | Run MediaPipe in Web Worker (offscreen canvas) |
| Gesture fatigue for long sessions | Medium | Low | Add "pause gesture control" button |

---

## 12. Open Questions

1. Should the globe include real geographic data layers (cities, borders) in v1 or stay as a visual-only sphere?
2. Do we need a "calibration" step where the user holds up their hand to set the reference distance?
3. Should two-hand gestures be required (more reliable) or optional (one-hand first)?
4. What Earth texture resolution is appropriate for performance vs. visual quality?

---

## 13. Appendix: Gesture Confidence Thresholds

| Gesture | Min Confidence | Debounce |
|---|---|---|
| Pinch zoom | 0.85 | 2 frames |
| Open palm rotate | 0.80 | 1 frame |
| Two-hand scale | 0.90 | 3 frames |
| Index point (reset) | 0.92 | 5 frames |
| Fist (lock) | 0.88 | 4 frames |
