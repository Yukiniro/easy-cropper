import { useRef, useState, useEffect } from "react";

export default function useValueChanged(value: unknown) {
  const prevValueRef = useRef(value);
  const [valueChanged, setValueChanged] = useState(false);

  useEffect(() => {
    if (prevValueRef.current !== value) {
      setValueChanged(true);
    } else {
      setValueChanged(false);
    }

    prevValueRef.current = value;
  }, [value]);

  return valueChanged;
}
