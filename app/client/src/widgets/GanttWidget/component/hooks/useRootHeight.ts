import { useState, useEffect } from "react";
import debounce from "lodash/debounce";

function useRootHeight(): number | undefined {
  const [height, setHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const rootElement = document.getElementById("root");

    // Define a debounced version of the setHeight function
    const debouncedSetHeight = debounce((newHeight: number) => {
      setHeight(newHeight);
    }, 1000);

    const observer = new ResizeObserver((entries) => {
      const { height: newHeight } = entries[0].contentRect;

      // Call the debounced version of the setHeight function
      debouncedSetHeight(newHeight);
    });

    if (rootElement) {
      observer.observe(rootElement);
    }

    return () => {
      if (rootElement) {
        observer.unobserve(rootElement);
      }
      // Cancel any pending debounced calls when unmounting
      debouncedSetHeight.cancel();
    };
  }, []);

  return height;
}

export default useRootHeight;
