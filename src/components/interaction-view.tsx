import { useEffect, useMemo, useRef, useState } from "react";
import { imageLoadableAtom, renderRelativeRectAtom } from "@/store/atoms";
import { useAtom } from "jotai";
import { fitSize } from "bittydash";

export function InteractionView() {
  const [isDraging, setIsDraging] = useState(false);
  const [point, setPoint] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [value] = useAtom(imageLoadableAtom);
  const [relativeRect, setRelativeRect] = useAtom(renderRelativeRectAtom);
  const validImage = value.state === "hasData" && value.data;

  useEffect(() => {
    if (validImage) {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      const containerRect = container?.getBoundingClientRect();
      const containerSize = { width: containerRect?.width || 0, height: containerRect?.height || 0 };

      if (canvas && container) {
        const { width, height } = fitSize(
          { width: validImage.naturalWidth, height: validImage.naturalHeight },
          containerSize,
        );
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d")?.drawImage(validImage, 0, 0, width, height);
      }
    }
  }, [validImage]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDraging(true);
    setPoint({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    setIsDraging(false);
    setRelativeRect({ x: 0, y: 0, width: 0, height: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraging && validImage) {
      const canvas = canvasRef.current;
      const rect = canvas!.getBoundingClientRect();
      const x = point.x - rect!.left;
      const y = point.y - rect!.top;
      const width = e.clientX - point.x;
      const height = e.clientY - point.y;
      setRelativeRect({
        x: x / canvas!.width,
        y: y / canvas!.height,
        width: width / canvas!.width,
        height: height / canvas!.height,
      });
    }
  };

  const trackViewStyle = useMemo(() => {
    const canvas = canvasRef.current;
    if (isDraging && canvas) {
      return {
        left: `${relativeRect.x * canvas.width}px`,
        top: `${relativeRect.y * canvas.height}px`,
        width: `${relativeRect.width * canvas.width}px`,
        height: `${relativeRect.height * canvas.height}px`,
      };
    }
    return {};
  }, [isDraging, relativeRect]);

  console.log(trackViewStyle);

  if (validImage) {
    return (
      <div
        className="w-1/2 h-full flex items-center justify-center"
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <div className="relative">
          <canvas ref={canvasRef} />
          <div className="absolute bg-blue-300 opacity-60" style={trackViewStyle} />
        </div>
      </div>
    );
  }

  return null;
}
