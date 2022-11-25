import React, { useCallback, useEffect, useState } from "react";
import { useIsMounted } from "./useIsMounted";

interface IBlurredBottomHookProps {
  height?: number;
}
interface IBlurredBottomHookResult<T> {
  blurredElement: React.ReactNode;
  handleScrollNode: (node: T) => void;
}
export const useBlurredBottomScroll = <T extends HTMLElement>(
  options?: IBlurredBottomHookProps
): IBlurredBottomHookResult<T> => {
  const isMounted = useIsMounted();
  const { height = 80 } = options || {};
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [node, setNode] = useState<T>();

  const handleVisibility = useCallback(
    (node: T) =>
      isMounted() &&
      setIsVisible(
        Math.ceil(node.scrollTop + node.clientHeight) < node.scrollHeight
      ),
    [isMounted]
  );

  const onScroll = useCallback(
    (e: Event) => {
      if (!e) {
        return;
      }

      const target = e.target as T;

      handleVisibility(target);
    },
    [handleVisibility]
  );

  const onResize = useCallback(() => {
    const isKeyboardOpened = window.screen.availHeight > window.innerHeight;

    if (isKeyboardOpened) {
      setIsVisible(false);
    } else {
      handleVisibility(node);
    }
  }, [handleVisibility, node]);

  const handleScrollNode = useCallback((node: T) => {
    if (!node) {
      return;
    }

    setNode(node);
  }, []);

  useEffect(() => {
    if (!node) {
      return;
    }

    handleVisibility(node);
    window.addEventListener("resize", onResize);
    node.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("resize", onResize);
      node && node.removeEventListener("scroll", onScroll);
    };
  }, [handleVisibility, node, onResize, onScroll]);

  const blurredElement = (
    <div
      sx={{
        display: isVisible ? "block" : "none",
        position: "absolute",
        zIndex: "10",
        bottom: 0,
        left: 0,
        height,
        width: "100%",
        background:
          "linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255, 255, 255, 1) 30%, rgba(255,255,255,0.3) 100%)",
        backdropFilter: "blur(1px)",
      }}
    />
  );

  return {
    blurredElement,
    handleScrollNode,
  };
};
