import GitHubCorners from "@yukiniro/react-github-corners";
import "@yukiniro/react-github-corners/dist/style.css";
import UploadView from "@/components/upload-view";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <GitHubCorners href="https://github.com/Yukiniro" />
      <h1 className="text-6xl font-bold mb-8">Image Cropper</h1>
      <UploadView />
    </main>
  );
}
