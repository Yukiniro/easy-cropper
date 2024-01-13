"use client";

import { useState } from "react";
import { InputFile } from "./input-file";

export default function UploadView() {
  const [image, setImage] = useState<File | null>(null);
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg w-full max-w-6xl h-[500px] flex items-center justify-center">
      <InputFile id="update-image" onChange={handleUpload} multiple={false} />
    </div>
  );
}
