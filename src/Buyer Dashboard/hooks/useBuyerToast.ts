import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Reusable toast message helper shared by every Buyer Dashboard page.
 * Returns a `toast` string for rendering plus a `showToast` setter for
 * triggering timed feedback, with auto-dismiss behaviour built in.
 */
export function useBuyerToast(autoDismissMs = 2600) {
  const [toast, setToast] = useState("");
  const timerRef = useRef<number | undefined>(undefined);

  const showToast = useCallback(
    (message: string) => {
      window.clearTimeout(timerRef.current);
      setToast(message);
      timerRef.current = window.setTimeout(() => setToast(""), autoDismissMs);
    },
    [autoDismissMs]
  );

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  return { toast, showToast };
}
