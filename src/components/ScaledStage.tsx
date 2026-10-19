import { useEffect, useRef, useState, type ReactNode } from "react";

/** Scène 1920×1080 mise à l'échelle pour remplir son conteneur */
export function ScaledStage({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setScale(Math.min(el.clientWidth / 1920, el.clientHeight / 1080)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={ref} className="relative h-full w-full overflow-hidden">
      <div
        className="absolute left-1/2 top-1/2 h-[1080px] w-[1920px]"
        style={{ marginLeft: -960, marginTop: -540, transform: `scale(${scale})`, visibility: scale ? "visible" : "hidden" }}
      >
        {children}
      </div>
    </div>
  );
}
