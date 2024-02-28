import useMouseDrag from "@/hooks/useMouseDrag";
import { TrackPosition } from "@/types";
import { useCallback, useMemo, useRef } from "react";

interface HandleProps {
  position: TrackPosition;
  onDragStart?: (e: MouseEvent, position: TrackPosition) => void;
  onDragMove?: (e: MouseEvent, position: TrackPosition) => void;
  onDragEnd?: (e: MouseEvent, position: TrackPosition) => void;
}

export function Handle(props: HandleProps) {
  const { position, onDragStart, onDragMove, onDragEnd } = props;
  const containerRef = useRef<HTMLDivElement | null>(null);

  const onStart = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      onDragStart && onDragStart(e, position);
    },
    [onDragStart, position],
  );
  const onMove = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      onDragMove && onDragMove(e, position);
    },
    [onDragMove, position],
  );
  const onEnd = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      onDragEnd && onDragEnd(e, position);
    },
    [onDragEnd, position],
  );

  useMouseDrag(containerRef, { onStart, onMove, onEnd });

  const style = useMemo(() => {
    switch (position) {
      case 0:
        return { top: 0, left: 0, transform: "translate(-50%, -50%)", cursor: "nwse-resize" };
      case 1:
        return { top: 0, left: "50%", transform: "translate(-50%, -50%)", cursor: "ns-resize" };
      case 2:
        return { top: 0, right: 0, transform: "translate(50%, -50%)", cursor: "nesw-resize" };
      case 3:
        return { top: "50%", right: 0, transform: "translate(50%, -50%)", cursor: "ew-resize" };
      case 4:
        return { bottom: 0, right: 0, transform: "translate(50%, 50%)", cursor: "nwse-resize" };
      case 5:
        return { bottom: 0, left: "50%", transform: "translate(-50%, 50%)", cursor: "ns-resize" };
      case 6:
        return { bottom: 0, left: 0, transform: "translate(-50%, 50%)", cursor: "nesw-resize" };
      case 7:
        return { top: "50%", left: 0, transform: "translate(-50%, -50%)", cursor: "ew-resize" };
      default:
        return {};
    }
  }, [position]);

  return <div ref={containerRef} className="absolute bg-blue-500 w-4 h-4" style={style}></div>;
}
