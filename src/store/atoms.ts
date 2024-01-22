import { atom } from "jotai";
import { loadable } from "jotai/utils";

export const fileAtom = atom<File | null>(null);
export const imageLoadableAtom = loadable(
  atom(async (get) => {
    const file = get(fileAtom);
    if (!file) {
      return null;
    }
    const image = new Image();
    const url = URL.createObjectURL(file);
    try {
      await new Promise((resolve, reject) => {
        image.onerror = reject;
        image.onabort = reject;
        image.onload = resolve;
        image.src = url;
      });
    } catch (e) {
      image.src = "";
      return null;
    } finally {
      image.onerror = null;
      image.onabort = null;
      image.onload = null;
      URL.revokeObjectURL(url);
    }
    return image;
  }),
);
