import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { imageLoadableAtom, renderRelativeRectAtom } from "@/store/atoms";
import { useAtom } from "jotai";
import { fitSize } from "bittydash";
import { clamp } from "lodash-es";
import useDomRect from "@/hooks/useDomRect";
import { Handle } from "./handle";
import { TrackPosition } from "@/types";
import { GridView } from "./grid-view";

export function InteractionView() {
  const [status, setStatus] = useState<"new" | "move" | "none">("none");
  const [recordPoint, setPoint] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [value] = useAtom(imageLoadableAtom);
  const [relativeRect, setRelativeRect] = useAtom(renderRelativeRectAtom);
  const [recordRelativeRect, setRecordRelativeRect] = useState(relativeRect);
  const [draggingPosition, setDraggingPosition] = useState<TrackPosition | null>(null);
  const validImage = value.state === "hasData" && value.data;

  const containerRect = useDomRect(containerRef);

  useEffect(() => {
    if (validImage && canvasRef.current) {
      const canvas = canvasRef.current;
      const { width, height } = fitSize(
        { width: validImage.naturalWidth, height: validImage.naturalHeight },
        containerRect,
      );
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d")?.drawImage(validImage, 0, 0, width, height);
    }
  }, [containerRect, validImage]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const mousePoint = { x: e.clientX, y: e.clientY };
    setPoint(mousePoint);
    setRecordRelativeRect(relativeRect);
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (!canvasRef.current) {
      return;
    }
    handleMouseDown(e);
    setStatus("new");
  };

  const handleAuxiMouseDown = (e: React.MouseEvent) => {
    if (!canvasRef.current) {
      return;
    }
    handleMouseDown(e);
    setStatus("move");
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (status === "none" || !canvasRef.current) {
        return;
      }

      const mousePoint = { x: e.clientX, y: e.clientY };
      const { width, height, left, top } = canvasRef.current.getBoundingClientRect();

      const curX = recordRelativeRect.x * width;
      const curY = recordRelativeRect.y * height;
      const curW = recordRelativeRect.width * width;
      const curH = recordRelativeRect.height * height;

      const recordMouseX = recordPoint.x - left;
      const recordMouseY = recordPoint.y - top;

      let maxDeltaX = 0;
      let maxDeltaY = 0;
      let minDeltaX = 0;
      let minDeltaY = 0;

      switch (status) {
        case "move":
          minDeltaX = -curX;
          maxDeltaX = width - curX - curW;
          minDeltaY = -curY;
          maxDeltaY = height - curY - curH;
          break;
        case "new":
          minDeltaX = -recordMouseX;
          maxDeltaX = width - recordMouseX;
          minDeltaY = -recordMouseY;
          maxDeltaY = height - recordMouseY;
          break;
      }

      const deltaX = clamp(mousePoint.x - recordPoint.x, minDeltaX, maxDeltaX);
      const deltaY = clamp(mousePoint.y - recordPoint.y, minDeltaY, maxDeltaY);

      switch (status) {
        case "move":
          setRelativeRect({
            x: recordRelativeRect.x + deltaX / width,
            y: recordRelativeRect.y + deltaY / height,
            width: recordRelativeRect.width,
            height: recordRelativeRect.height,
          });
          break;
        case "new":
          setRelativeRect({
            x: (Math.min(recordPoint.x, recordPoint.x + deltaX) - left) / width,
            y: (Math.min(recordPoint.y, recordPoint.y + deltaY) - top) / height,
            width: Math.abs(deltaX / width),
            height: Math.abs(deltaY / height),
          });
          break;
      }
    };
    const handleMouseUp = () => {
      setStatus("none");
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [recordPoint, recordRelativeRect, relativeRect, setRelativeRect, status]);

  const auxiStyle = useMemo(() => {
    if (!canvasRef.current) {
      return { left: 0, top: 0, width: "100%", height: "100%" };
    }
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const x = relativeRect.x * canvasRect.width;
    const y = relativeRect.y * canvasRect.height;
    const width = relativeRect.width * canvasRect.width;
    const height = relativeRect.height * canvasRect.height;

    return {
      left: `${x}px`,
      top: `${y}px`,
      width: `${width}px`,
      height: `${height}px`,
    };
  }, [relativeRect]);

  const handleDragStart = useCallback(
    (e: MouseEvent, position: TrackPosition) => {
      setDraggingPosition(position);
      setRecordRelativeRect(relativeRect);
      setPoint({ x: e.clientX, y: e.clientY });
    },
    [relativeRect],
  );
  const handleDragMove = useCallback(
    (e: MouseEvent, position: TrackPosition) => {
      if (draggingPosition === null) {
        return;
      }
      const { width, height } = canvasRef.current!.getBoundingClientRect();
      const deltaX = e.clientX - recordPoint.x;
      const deltaY = e.clientY - recordPoint.y;
      const curX = recordRelativeRect.x * width;
      const curY = recordRelativeRect.y * height;
      const curW = recordRelativeRect.width * width;
      const curH = recordRelativeRect.height * height;
      const x = curX;
      const y = curY;
      const w = curW;
      const h = curH;
      switch (position) {
        case 0:
          setRelativeRect({
            x: (x + deltaX) / width,
            y: (y + deltaY) / height,
            width: (w - deltaX) / width,
            height: (h - deltaY) / height,
          });
          break;
        case 1:
          setRelativeRect({
            x: x / width,
            y: (y + deltaY) / height,
            width: w / width,
            height: (h - deltaY) / height,
          });
          break;
        case 2:
          setRelativeRect({
            x: x / width,
            y: (y + deltaY) / height,
            width: (w + deltaX) / width,
            height: (h - deltaY) / height,
          });
          break;
        case 3:
          setRelativeRect({
            x: x / width,
            y: y / height,
            width: (w + deltaX) / width,
            height: h / height,
          });
          break;
        case 4:
          setRelativeRect({
            x: x / width,
            y: y / height,
            width: (w + deltaX) / width,
            height: (h + deltaY) / height,
          });
          break;
        case 5:
          setRelativeRect({
            x: x / width,
            y: y / height,
            width: w / width,
            height: (h + deltaY) / height,
          });
          break;
        case 6:
          setRelativeRect({
            x: (x + deltaX) / width,
            y: y / height,
            width: (w - deltaX) / width,
            height: (h + deltaY) / height,
          });
          break;
        case 7:
          setRelativeRect({
            x: (x + deltaX) / width,
            y: y / height,
            width: (w - deltaX) / width,
            height: h / height,
          });
          break;
      }
    },
    [draggingPosition, recordPoint, recordRelativeRect, setRelativeRect],
  );
  const handleDragEnd = useCallback(() => {
    setDraggingPosition(null);
  }, []);

  if (validImage) {
    return (
      <div className="w-1/2 h-full flex items-center justify-center" ref={containerRef}>
        <div className="relative">
          <canvas onMouseDown={handleCanvasMouseDown} ref={canvasRef} />
          <div
            className="absolute border-2 border-blue-500 bg-blue-200 bg-opacity-60"
            style={auxiStyle}
            onMouseDown={handleAuxiMouseDown}
          >
            <GridView />
            {[0, 1, 2, 3, 4, 5, 6, 7].map((value) => {
              return (
                <Handle
                  key={value}
                  position={value as unknown as TrackPosition}
                  onDragStart={handleDragStart}
                  onDragMove={handleDragMove}
                  onDragEnd={handleDragEnd}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
