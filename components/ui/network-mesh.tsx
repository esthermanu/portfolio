"use client";

import { useEffect, useRef } from "react";
import { useCalmMotion } from "@/lib/use-media-query";

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  /** Depth, 0 (far, dim) to 1 (near, bright). */
  z: number;
};

/** Nodes are seeded per unit of area, so density feels the same on any screen. */
const AREA_PER_NODE = 10500;
const MAX_NODES = 170;
/** Nodes closer than this get a line drawn between them. */
const LINK_DISTANCE = 190;

/**
 * The drifting node-and-line field behind the whole page.
 *
 * Canvas rather than SVG: every frame re-tests each pair of nodes for
 * proximity, which is thousands of line segments a second — far past what
 * mutating DOM nodes can do smoothly.
 *
 * Sits at -z-10 on purpose. A positioned element at z-0 would paint *above*
 * in-flow text; a negative index puts it under the content but still over the
 * page background.
 */
export function NetworkMesh() {
  const calm = useCalmMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;
    let width = 0;
    let height = 0;
    let nodes: Node[] = [];

    /* One radial-gradient sprite, stamped per node. Canvas `shadowBlur` is
       re-computed per draw call and costs far more than blitting a cached
       bitmap — this alone took the field from ~40fps to a locked 60. */
    const SPRITE = 64;
    const sprite = document.createElement("canvas");
    sprite.width = sprite.height = SPRITE;
    const sctx = sprite.getContext("2d");
    if (sctx) {
      const g = sctx.createRadialGradient(
        SPRITE / 2, SPRITE / 2, 0,
        SPRITE / 2, SPRITE / 2, SPRITE / 2,
      );
      g.addColorStop(0, "rgba(210,245,255,1)");
      g.addColorStop(0.12, "rgba(165,230,255,0.9)");
      g.addColorStop(0.35, "rgba(56,189,248,0.35)");
      g.addColorStop(1, "rgba(56,189,248,0)");
      sctx.fillStyle = g;
      sctx.fillRect(0, 0, SPRITE, SPRITE);
    }

    const seed = () => {
      const count = Math.min(
        MAX_NODES,
        Math.max(28, Math.round((width * height) / AREA_PER_NODE)),
      );
      nodes = Array.from({ length: count }, () => {
        const z = Math.random();
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          /* Nearer nodes drift slightly faster, which reads as depth. */
          vx: (Math.random() - 0.5) * (0.08 + z * 0.16),
          vy: (Math.random() - 0.5) * (0.08 + z * 0.16),
          r: 1.2 + z * 2.4,
          z,
        };
      });
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      /* Cap the pixel ratio: this is a soft, blurred field, so the extra
         buffer a 2x-3x display would ask for buys nothing visible. */
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      /* Assigning canvas.width wipes the bitmap, and ResizeObserver fires once
         the moment it starts observing. Without this repaint the static
         reduced-motion render is cleared immediately and never comes back —
         the animation loop just happens to hide that in the normal path. */
      draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      /* Bin the nodes into a grid one link-distance wide, so each node only
         tests the 3x3 cells around it instead of all the others. */
      const cols = Math.max(1, Math.ceil(width / LINK_DISTANCE));
      const rows = Math.max(1, Math.ceil(height / LINK_DISTANCE));
      const cells: number[][] = Array.from({ length: cols * rows }, () => []);
      for (let i = 0; i < nodes.length; i++) {
        const cx = Math.min(cols - 1, Math.max(0, Math.floor(nodes[i].x / LINK_DISTANCE)));
        const cy = Math.min(rows - 1, Math.max(0, Math.floor(nodes[i].y / LINK_DISTANCE)));
        cells[cy * cols + cx].push(i);
      }

      /* Links first, so the glowing nodes sit on top of them. */
      ctx.lineWidth = 0.8;
      const maxD2 = LINK_DISTANCE * LINK_DISTANCE;
      for (let cy = 0; cy < rows; cy++) {
        for (let cx = 0; cx < cols; cx++) {
          for (const i of cells[cy * cols + cx]) {
            const a = nodes[i];
            for (let oy = 0; oy <= 1; oy++) {
              for (let ox = -1; ox <= 1; ox++) {
                if (oy === 0 && ox < 0) continue;
                const nx = cx + ox;
                const ny = cy + oy;
                if (nx < 0 || nx >= cols || ny >= rows) continue;
                for (const j of cells[ny * cols + nx]) {
                  /* j > i keeps each pair to a single line. */
                  if (j <= i) continue;
                  const b = nodes[j];
                  const dx = a.x - b.x;
                  const dy = a.y - b.y;
                  const d2 = dx * dx + dy * dy;
                  if (d2 > maxD2) continue;

                  const closeness = 1 - Math.sqrt(d2) / LINK_DISTANCE;
                  const depth = (a.z + b.z) / 2;
                  ctx.strokeStyle = `rgba(56,189,248,${(closeness * (0.22 + depth * 0.5)).toFixed(3)})`;
                  ctx.beginPath();
                  ctx.moveTo(a.x, a.y);
                  ctx.lineTo(b.x, b.y);
                  ctx.stroke();
                }
              }
            }
          }
        }
      }

      for (const n of nodes) {
        const size = n.r * 7;
        ctx.globalAlpha = 0.45 + n.z * 0.55;
        ctx.drawImage(sprite, n.x - size / 2, n.y - size / 2, size, size);
      }
      ctx.globalAlpha = 1;
    };

    const tick = () => {
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        /* Bounce rather than wrap: wrapping makes links snap across the page. */
        if (n.x <= 0 || n.x >= width) n.vx *= -1;
        if (n.y <= 0 || n.y >= height) n.vy *= -1;
      }
      draw();
      frame = requestAnimationFrame(tick);
    };

    resize();
    if (calm) {
      draw();
    } else {
      frame = requestAnimationFrame(tick);
    }

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    /* A backgrounded tab still fires rAF in some browsers; stop drawing. */
    const onVisibility = () => {
      if (calm) return;
      cancelAnimationFrame(frame);
      if (!document.hidden) frame = requestAnimationFrame(tick);
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [calm]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
    />
  );
}
