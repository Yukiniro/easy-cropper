import Image from "next/image";
import { cn } from "@/lib/utils";

interface PlaceholderProps {
  alt?: string;
  className?: string;
}

export default function Placeholder(props: PlaceholderProps) {
  const { alt = "placeholder", className } = props;
  return (
    <Image
      alt={alt}
      className={cn("w-full h-full object-cover", className)}
      height="256"
      src="assets/placeholder.svg"
      style={{
        aspectRatio: "256/256",
        objectFit: "cover",
      }}
      width="256"
    />
  );
}
