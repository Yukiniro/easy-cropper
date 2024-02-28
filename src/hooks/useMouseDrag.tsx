import React, { useEffect, useState } from "react";

interface MouseDragOptions {
  onStart?: (e: MouseEvent) => void;
  onMove?: (e: MouseEvent) => void;
  onEnd?: (e: MouseEvent) => void;
}

export default function useMouseDrag(ref: React.RefObject<HTMLElement | null>, options: MouseDragOptions) {
  const { onStart, onMove, onEnd } = options;
  const [isDragging, setDragging] = useState(false);
  const [binded, setBinded] = useState(false);

  useEffect(() => {
    if (isDragging && !binded) {
      const moveFn = (e: MouseEvent) => {
        onMove && onMove(e);
      };
      const endFn = (e: MouseEvent) => {
        document.removeEventListener("mousemove", moveFn);
        document.removeEventListener("mouseup", endFn);
        setDragging(false);
        onEnd && onEnd(e);
      };

      document.addEventListener("mousemove", moveFn);
      document.addEventListener("mouseup", endFn);
      setBinded(true);
    }

    if (!isDragging && binded) {
      document.removeEventListener("mousemove", onMove as EventListener);
      document.removeEventListener("mouseup", onEnd as EventListener);
      setBinded(false);
    }

    return () => {
      if (binded) {
        document.removeEventListener("mousemove", onMove as EventListener);
        document.removeEventListener("mouseup", onEnd as EventListener);
      }
    };
  }, [onMove, isDragging, binded, onEnd]);

  useEffect(() => {
    const dom = ref.current;
    const fn = (e: MouseEvent) => {
      e.stopPropagation();
      onStart && onStart(e);
      setDragging(true);
    };
    onStart && dom!.addEventListener("mousedown", fn);
    return () => {
      onStart && dom!.removeEventListener("mousedown", fn);
    };
  }, [onStart, ref]);
}
