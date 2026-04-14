# 🌍 GlobeHands (EarthControls) [Link](https://controldaearth.vercel.app/) 

A futuristic, touch-free web application that allows users to interact with a 3D Earth in real-time using native hand gestures via their device's webcam.

Imagine rotating, zooming, and interacting with a digital globe—just like *Minority Report*—right from your browser, securely and without needing a mouse or touchscreen.

![GlobeHands Concept](https://img.shields.io/badge/Status-In%20Development-yellow) ![Next.js](https://img.shields.io/badge/Next.js-14-black) ![React Three Fiber](https://img.shields.io/badge/Three.js-R3F-blue) ![MediaPipe](https://img.shields.io/badge/MediaPipe-Hands-orange)

---

## ✨ Key Features

- **Gesture-Driven UX:** Rotate, zoom, and scale a 3D globe purely through hand movements.
- **Real-Time Hand Tracking:** Utilizes Google's MediaPipe for ultra-low latency (<100ms) hand landmark detection.
- **Privacy-First (Browser Native):** All computer vision processing happens directly in the browser via WebAssembly. Neither video feeds nor hand data ever leave your device.
- **Immersive 3D Rendering:** High-performance React Three Fiber environment featuring procedural starfields, realistic lighting, and smooth animations.
- **Visual Feedback:** Live camera overlay with a landmark skeleton UI and a dynamic gesture recognition badge to guide interactions.

## 🛠️ Tech Stack & Architecture

This project modernizes the 3D-web stack by merging advanced computer vision with declarative Three.js integration.

### The Technologies
- **Core Framework:** Next.js 14 (App Router), TypeScript
- **3D Engine:** React Three Fiber (`@react-three/fiber`), `@react-three/drei`
- **Computer Vision:** Google MediaPipe Hands (`@mediapipe/hands`, `@mediapipe/camera_utils`)
- **State Management:** Zustand (for reactive, uncoupled gesture state handling)
- **Styling:** Tailwind CSS

### How It Works (The Pipeline)
1. **Camera Feed:** User's webcam is captured securely entirely on the client-side (`<CameraFeed />`).
2. **Landmark Detection:** MediaPipe extracts 21 3D spatial points (landmarks) per hand.
3. **Gesture Classification:** Custom math logic (`GestureClassifier.ts`) calculates finger curl, pinch distance, and palm movement to determine the active gesture.
4. **State Update:** The resulting gesture event is stored into a lightning-fast Zustand `GestureStore`.
5. **3D Transformation:** The `GlobeController` translates these active gestures into actual 3D math (quaternions for rotation, field-of-view adjustments for zoom) and seamlessly updates the `<GlobeModel />` via R3F's `useFrame` loop.

## ✋ Gesture Controls Map

| Hand Gesture | Action on Globe |
| :--- | :--- |
| **Open Palm + Move** | Rotate / Pan the globe |
| **Pinch (1 hand)** | Zoom In |
| **Spread (1 hand)** | Zoom Out |
| **Two-Hand Pinch & Spread** | Scale the globe up / down |
| **Fist (Closed hand)** | Stop / Lock position |
| **Index Point Up** | Reset globe to default orientation |

## 📁 Project Structure

```text
├── app/
│   └── page.tsx                # Main UI Layout wrapping 3D context & UI overlays
├── components/
│   ├── Camera/                 # MediaPipe WebCam initialization & Skeleton Overlay
│   ├── Gesture/                # Hand logic routing, Store configuration, UI Labels
│   ├── Globe/                  # R3F Canvas, Scene Lighting, Globe Meshes & Controllers
│   └── UI/                     # Settings panels, Gesture Guides
├── hooks/                      # Custom hooks bridging MediaPipe and Three.js logic
└── lib/                        # Math utilities for gesture calculations
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A modern web browser (Canvas, WebGL2, and WebAssembly support required — Chrome 90+, Edge 90+, Firefox 95+)
- A working webcam

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/globe-control.git
   cd globe-control
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   # or npm install / yarn install
   ```

3. **Run the development server:**
   ```bash
   pnpm dev
   ```

4. **Navigate to:** `http://localhost:3000`
5. **Allow camera access** when prompted by the browser to begin testing gesture interactions.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! 
Feel free to check out the underlying vision in the `PRD.md` file to see the project's roadmap and upcoming milestones.
