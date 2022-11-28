import React, { useCallback, useEffect, useState, useRef } from 'react';

export const useIsMounted = () => {
  const isMounted = useRef<boolean>(false);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  return useCallback(() => isMounted.current, []);
};

interface IBlurredBottomHookProps {
  height?: number;
}
interface IBlurredBottomHookResult<T> {
  blurredElement: React.ReactNode;
  handleScrollNode: (node: T) => void;
}
export const useBlurredBottomScroll = <T extends HTMLElement>(
  options?: IBlurredBottomHookProps,
): IBlurredBottomHookResult<T> => {
  const isMounted = useIsMounted();
  const { height = 80 } = options || {};
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [nodeState, setNode] = useState<T>();

  const handleVisibility = useCallback(
    (node: T) => isMounted() && setIsVisible(Math.ceil(node.scrollTop + node.clientHeight) < node.scrollHeight),
    [isMounted],
  );

  const onScroll = useCallback(
    (e: Event) => {
      if (!e) {
        return;
      }

      const target = e.target as T;

      handleVisibility(target);
    },
    [handleVisibility],
  );

  const onResize = useCallback(() => {
    const isKeyboardOpened = window.screen.availHeight > window.innerHeight;

    if (isKeyboardOpened) {
      setIsVisible(false);
    } else {
      if (nodeState) {
        handleVisibility(nodeState);
      }
    }
  }, [handleVisibility, nodeState]);

  const handleScrollNode = useCallback((node: T) => {
    if (!node) {
      return;
    }

    setNode(node);
  }, []);

  useEffect(() => {
    if (!nodeState) {
      return;
    }

    handleVisibility(nodeState);
    window.addEventListener('resize', onResize);
    nodeState.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('resize', onResize);
      nodeState.removeEventListener('scroll', onScroll);
    };
  }, [handleVisibility, nodeState, onResize, onScroll]);

  const blurredElement = (
    <div
      style={{
        position: 'absolute',
        zIndex: '10',
        bottom: 0,
        left: 0,
        width: '100%',
        background:
          'linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255, 255, 255, 1) 30%, rgba(255,255,255,0.3) 100%)',
        backdropFilter: 'blur(1px)',
        display: isVisible ? 'block' : 'none',
        height,
      }}
    />
  );

  return {
    blurredElement,
    handleScrollNode,
  };
};
