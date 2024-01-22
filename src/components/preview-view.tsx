"use client";

import React, { useEffect } from "react";
import { imageLoadableAtom } from "@/store/atoms";
import { useAtomValue } from "jotai";

export default function PreviewView(): React.ReactElement {
  const data = useAtomValue(imageLoadableAtom);
  const mainCanvasRef = React.useRef<HTMLCanvasElement>(null);
  const subCanvasRef = React.useRef<HTMLCanvasElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const hasValidIamge = data.state === "hasData" && data.data;

  // @ts-ignore
  const image = data.data as unknown as HTMLImageElement;

  useEffect(() => {
    if (!hasValidIamge || !mainCanvasRef.current || !subCanvasRef.current || !containerRef.current) {
      return;
    }

    const container = containerRef.current;
    const clientRect = container.getBoundingClientRect();
    const width = clientRect.width;
    const height = clientRect.height;
    const canvasWidth = width / 2 - 80;
    const canvasHeight = height - 80;

    const mainCanvas = mainCanvasRef.current;
    const subCanvas = subCanvasRef.current;

    mainCanvas.width = canvasWidth;
    mainCanvas.height = canvasHeight;
    subCanvas.width = canvasWidth;
    subCanvas.height = canvasHeight;

    const mainCtx = mainCanvas.getContext("2d");
    const subCtx = subCanvas.getContext("2d");

    if (!mainCtx || !subCtx) {
      return;
    }

    mainCtx.drawImage(image, 0, 0, canvasWidth, canvasHeight);
  }, [image, hasValidIamge]);

  if (!hasValidIamge) {
    return null as unknown as React.ReactElement;
  }

  return (
    <div
      ref={containerRef}
      className="bg-white shadow rounded-lg w-full max-w-6xl h-[500px] flex items-center justify-center"
    >
      <canvas ref={mainCanvasRef} />
      <canvas ref={subCanvasRef} />
    </div>
  );
}
