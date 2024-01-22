"use client";

import UploadView from "@/components/upload-view";
import { imageLoadableAtom } from "@/store/atoms";
import { useAtomValue } from "jotai";
import PreviewView from "./preview-view";

export default function MainView() {
  const data = useAtomValue(imageLoadableAtom);

  if (data.state === "hasData" && data.data) {
    return <PreviewView />;
  }

  return <UploadView />;
}
