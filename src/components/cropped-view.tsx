import useDomRect from "@/hooks/useDomRect";
import { imageLoadableAtom, renderRelativeRectAtom } from "@/store/atoms";
import { fitSize } from "bittydash";
import { useAtomValue } from "jotai";
import React, { useEffect } from "react";

export function CroppedView() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const value = useAtomValue(imageLoadableAtom);
  const relativeRect = useAtomValue(renderRelativeRectAtom);
  const validImage = value.state === "hasData" && value.data;

  const containerRect = useDomRect(containerRef);

  useEffect(() => {
    if (validImage && relativeRect?.width && relativeRect?.height && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const { naturalWidth, naturalHeight } = validImage;
        const sx = relativeRect.x * naturalWidth;
        const sy = relativeRect.y * naturalHeight;
        const sWidth = relativeRect.width * naturalWidth;
        const sHeight = relativeRect.height * naturalHeight;
        const canvasSize = fitSize({ width: sWidth, height: sHeight }, containerRect);
        canvas.width = canvasSize.width;
        canvas.height = canvasSize.height;
        ctx.drawImage(validImage, sx, sy, sWidth, sHeight, 0, 0, canvasSize.width, canvasSize.height);
      }
    }
  }, [validImage, relativeRect, containerRect]);

  if (validImage && relativeRect) {
    return (
      <div className="w-1/2 h-full flex items-center justify-center" ref={containerRef}>
        <canvas ref={canvasRef} />
      </div>
    );
  }

  return null;
}
