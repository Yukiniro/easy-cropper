"use client";

import React from "react";
import { CroppedView } from "./cropped-view";
import { InteractionView } from "./interaction-view";

export default function PreviewView(): React.ReactElement {
  return (
    <div className="bg-white shadow rounded-lg w-full max-w-6xl h-[500px] flex items-center justify-center">
      <InteractionView />
      <CroppedView />
    </div>
  );
}
