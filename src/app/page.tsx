import { Button } from "@/components/ui/button";
import Placeholder from "@/components/placeholder";
import { SolarDownloadOutline } from "@/components/icon/solar-download-outline";
import { SolarUploadOutline } from "@/components/icon/solar-upload-outline";
import GitHubCorners from "@yukiniro/react-github-corners";
// import '@yukiniro/react-github-corners/dist/style.css';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <GitHubCorners href="https://github.com/Yukiniro" />
      <h1 className="text-6xl font-bold mb-8">Image Cropper</h1>
      <div className="bg-white shadow rounded-lg w-full max-w-6xl p-10">
        <div className="flex items-center justify-between mb-8">
          <Button className="inline-flex items-center">
            <SolarDownloadOutline className="w-6 h-6 mr-2" /> Upload Image
          </Button>
          <Button className="inline-flex items-center" variant="outline">
            <SolarUploadOutline className="w-6 h-6 mr-2" /> Save Image
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
