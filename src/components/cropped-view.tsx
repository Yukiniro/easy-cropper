import useDomRect from "@/hooks/useDomRect";
import { imageLoadableAtom, renderRelativeRectAtom } from "@/store/atoms";
import { fitSize } from "bittydash";
import { useAtomValue } from "jotai";
import { download } from "downloadmejs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import React, { useCallback, useEffect } from "react";

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

  const downloadJPG = useCallback(() => {
    if (canvasRef.current) {
      download(canvasRef.current.toDataURL("image/jpeg"), { name: "cropped.jpg" });
    }
  }, []);

  const downloadPNG = useCallback(() => {
    if (canvasRef.current) {
      download(canvasRef.current.toDataURL("image/png"), { name: "cropped.png" });
    }
  }, []);

  if (validImage && relativeRect) {
    return (
      <>
        <div className="w-1/2 h-full relative flex items-center justify-center" ref={containerRef}>
          <canvas ref={canvasRef} />
          <div className="absolute translate-x-full -right-4 top-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Download</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={downloadJPG}>JPG</DropdownMenuItem>
                <DropdownMenuItem onClick={downloadPNG}>PNG</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </>
    );
  }

  return null;
}
