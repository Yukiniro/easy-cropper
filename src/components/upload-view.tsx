"use client";

import { InputFile } from "./input-file";
import { useAtomValue, useSetAtom } from "jotai";
import { fileAtom, imageLoadableAtom } from "@/store/atoms";
import React, { Suspense, useEffect } from "react";
import { Skeleton } from "./ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import useValueChange from "@/hooks/useValueChange";

export default function UploadView(): React.ReactElement {
  const { toast } = useToast();
  const setFile = useSetAtom(fileAtom);
  const data = useAtomValue(imageLoadableAtom);
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const state = data.state;
  const stateChanged = useValueChange(state);

  useEffect(() => {
    if (stateChanged && state === "hasError") {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong",
      });
    }
  }, [stateChanged, state, toast]);

  return (
    <div className="bg-white shadow rounded-lg w-full max-w-6xl h-[500px] flex items-center justify-center">
      <Suspense
        fallback={
          <div className="space-y-4 w-4/5">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-8" />
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-8" />
          </div>
        }
      >
        <InputFile id="update-image" onChange={handleUpload} multiple={false} />
      </Suspense>
    </div>
  );
}
