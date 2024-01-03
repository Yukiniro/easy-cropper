"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import Placeholder from "@/components/placeholder";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-6xl font-bold mb-8">Image Cropper</h1>
      <div className="bg-white shadow rounded-lg w-full max-w-6xl p-10">
        <div className="flex items-center justify-between mb-8">
          <Button className="inline-flex items-center">
            <Icon className="w-6 h-6 mr-2" icon="solar:upload-outline" /> Upload Image
          </Button>
          <Button className="inline-flex items-center" variant="outline">
            <Icon className="w-6 h-6 mr-2" icon="solar:download-outline" /> Save Image
          </Button>
        </div>
        <div className="flex items-start justify-between">
          <div className="relative w-102 h-102 border border-gray-300 rounded-lg overflow-hidden">
            <Placeholder alt="Uploaded image" />
          </div>
          <div className="ml-8 w-102 h-102 border border-gray-300 rounded-lg overflow-hidden">
            <Placeholder alt="Cropped image preview" />
          </div>
        </div>
      </div>
    </main>
  );
}
