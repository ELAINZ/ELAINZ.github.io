"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import GLOBE from "vanta/dist/vanta.globe.min";

export default function VantaGlobe() {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);

  useEffect(() => {
    if (!vantaEffect.current && vantaRef.current) {
      vantaEffect.current = GLOBE({
      el: vantaRef.current,
      THREE,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.0,
      minWidth: 200.0,
      scale: 1.0,
      scaleMobile: 1.0,
      color: 0x9ca3af,        // 主线颜色：银灰
      color2: 0x3b82f6,       // 副色：低饱和蓝（科技感）
      size: 1.2,
      backgroundColor: 0xf7f7f7, // 背景深灰黑，和主页黑白灰协调
    });

    }

    return () => {
      if (vantaEffect.current) vantaEffect.current.destroy();
    };
  }, []);

  return (
    <div
      ref={vantaRef}
      className="absolute inset-0"
      style={{ width: "100%", height: "100%" }}
    />
  );
}