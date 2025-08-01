"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

interface MousePosition {
  x: number;
  y: number;
}

function MousePosition(): MousePosition {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return mousePosition;
}

interface ParticlesProps {
  className?: string;
  quantityDesktop?: number;
  quantityMobile?: number;
  mobileBreakpoint?: number;
  staticity?: number;
  ease?: number;
  size?: number;
  refresh?: boolean;
  color?: string;
  vx?: number;
  vy?: number;
}

function hexToRgb(hex: string): number[] {
  hex = hex.replace("#", "");
  const hexInt = parseInt(hex, 16);
  const red = (hexInt >> 16) & 255;
  const green = (hexInt >> 8) & 255;
  const blue = hexInt & 255;
  return [red, green, blue];
}

const Particles: React.FC<ParticlesProps> = ({
  className = "",
  quantityDesktop = 100,
  quantityMobile = 50,
  mobileBreakpoint = 768,
  staticity = 50,
  ease = 50,
  size = 0.4,
  refresh = false,
  color = "#ffffff",
  vx = 0,
  vy = 0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const circles = useRef<any[]>([]);
  const mousePosition = MousePosition();
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;

  const [quantity, setQuantity] = useState(quantityDesktop);

  const resizeCanvas = useCallback(() => {
    if (canvasRef.current && context.current) {
      circles.current.length = 0;
      canvasSize.current.w = window.innerWidth;
      canvasSize.current.h = window.innerHeight;
      canvasRef.current.width = canvasSize.current.w * dpr;
      canvasRef.current.height = canvasSize.current.h * dpr;
      canvasRef.current.style.width = `100vw`;
      canvasRef.current.style.height = `100vh`;
      context.current.scale(dpr, dpr);
    }
  }, [dpr]);

  const drawParticles = useCallback(() => {
    if (!context.current) return;
    
    // Clear context
    context.current.clearRect(
      0,
      0,
      canvasSize.current.w,
      canvasSize.current.h,
    );
    
    circles.current = [];
    
    const rgb = hexToRgb(color);
    
    for (let i = 0; i < quantity; i++) {
      const x = Math.floor(Math.random() * canvasSize.current.w);
      const y = Math.floor(Math.random() * canvasSize.current.h);
      const translateX = 0;
      const translateY = 0;
      const pSize = Math.floor(Math.random() * 2) + size;
      const alpha = 0;
      const targetAlpha = parseFloat((Math.random() * 0.6 + 0.1).toFixed(1));
      const dx = (Math.random() - 0.5) * 0.1;
      const dy = (Math.random() - 0.5) * 0.1;
      const magnetism = 0.1 + Math.random() * 4;
      
      const circle = {
        x,
        y,
        translateX,
        translateY,
        size: pSize,
        alpha,
        targetAlpha,
        dx,
        dy,
        magnetism,
      };
      
      // Draw circle
      context.current.translate(translateX, translateY);
      context.current.beginPath();
      context.current.arc(x, y, pSize, 0, 2 * Math.PI);
      context.current.fillStyle = `rgba(${rgb.join(", ")}, ${alpha})`;
      context.current.fill();
      context.current.setTransform(dpr, 0, 0, dpr, 0, 0);
      
      circles.current.push(circle);
    }
  }, [quantity, color, size, dpr]);

  const initCanvas = useCallback(() => {
    resizeCanvas();
    drawParticles();
  }, [resizeCanvas, drawParticles]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < mobileBreakpoint) {
        setQuantity(quantityMobile);
      } else {
        setQuantity(quantityDesktop);
      }
      initCanvas();
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [quantityDesktop, quantityMobile, mobileBreakpoint, initCanvas]);

  const animate = useCallback(() => {
    if (!context.current) return;
    
    // Clear context
    context.current.clearRect(
      0,
      0,
      canvasSize.current.w,
      canvasSize.current.h,
    );
    
    const rgb = hexToRgb(color);
    
    circles.current.forEach((circle: any, i: number) => {
      const edge = [
        circle.x + circle.translateX - circle.size,
        canvasSize.current.w - circle.x - circle.translateX - circle.size,
        circle.y + circle.translateY - circle.size,
        canvasSize.current.h - circle.y - circle.translateY - circle.size,
      ];
      const closestEdge = edge.reduce((a, b) => Math.min(a, b));
      const remapClosestEdge = parseFloat(
        (closestEdge > 0 ? closestEdge : 0).toFixed(2),
      );
      if (remapClosestEdge > 1) {
        circle.alpha += 0.02;
        if (circle.alpha > circle.targetAlpha) {
          circle.alpha = circle.targetAlpha;
        }
      } else {
        circle.alpha = circle.targetAlpha * remapClosestEdge;
      }
      circle.x += circle.dx + vx;
      circle.y += circle.dy + vy;
      circle.translateX +=
        (mouse.current.x / (staticity / circle.magnetism) - circle.translateX) /
        ease;
      circle.translateY +=
        (mouse.current.y / (staticity / circle.magnetism) - circle.translateY) /
        ease;

      // Draw circle
      context.current!.translate(circle.translateX, circle.translateY);
      context.current!.beginPath();
      context.current!.arc(circle.x, circle.y, circle.size, 0, 2 * Math.PI);
      context.current!.fillStyle = `rgba(${rgb.join(", ")}, ${circle.alpha})`;
      context.current!.fill();
      context.current!.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (
        circle.x < -circle.size ||
        circle.x > canvasSize.current.w + circle.size ||
        circle.y < -circle.size ||
        circle.y > canvasSize.current.h + circle.size
      ) {
        circles.current.splice(i, 1);
        const newCircle = {
          x: Math.floor(Math.random() * canvasSize.current.w),
          y: Math.floor(Math.random() * canvasSize.current.h),
          translateX: 0,
          translateY: 0,
          size: Math.floor(Math.random() * 2) + size,
          alpha: 0,
          targetAlpha: parseFloat((Math.random() * 0.6 + 0.1).toFixed(1)),
          dx: (Math.random() - 0.5) * 0.1,
          dy: (Math.random() - 0.5) * 0.1,
          magnetism: 0.1 + Math.random() * 4,
        };
        circles.current.push(newCircle);
      }
    });
    window.requestAnimationFrame(animate);
  }, [color, vx, vy, staticity, ease, size, dpr]);

  useEffect(() => {
    if (canvasRef.current) {
      context.current = canvasRef.current.getContext("2d");
    }
    initCanvas();
    animate();
    window.addEventListener("resize", initCanvas);

    return () => {
      window.removeEventListener("resize", initCanvas);
    };
  }, [initCanvas, animate]);

  const onMouseMove = useCallback(() => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const { w, h } = canvasSize.current;
      const x = mousePosition.x - rect.left - w / 2;
      const y = mousePosition.y - rect.top - h / 2;
      const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2;
      if (inside) {
        mouse.current.x = x;
        mouse.current.y = y;
      }
    }
  }, [mousePosition.x, mousePosition.y]);

  useEffect(() => {
    onMouseMove();
  }, [onMouseMove]);

  useEffect(() => {
    initCanvas();
  }, [refresh, initCanvas]);

  return (
    <div
      className={`${className} fixed inset-0 -z-[100]`}
      ref={canvasContainerRef}
      aria-hidden="true">
      <canvas ref={canvasRef} style={{ width: "100vw", height: "100vh" }} />
    </div>
  );
};

export default Particles;