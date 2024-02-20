import React, { useEffect, useState } from "react";

export default function useDomRect(ref: React.RefObject<HTMLElement | null>): DOMRect {
  const [rect, setRect] = useState<DOMRect>(new DOMRect(0, 0, 0, 0));

  useEffect(() => {
    const handleResize = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setRect(DOMRect.fromRect(rect));
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [ref]);

  return rect;
}
