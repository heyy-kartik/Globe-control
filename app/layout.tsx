import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EarthControls — Hand Gesture Globe',
  description:
    'Real-time 3D Earth visualization controlled by hand gestures via MediaPipe Hands and React Three Fiber.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif' }}>{children}</body>
    </html>
  );
}
