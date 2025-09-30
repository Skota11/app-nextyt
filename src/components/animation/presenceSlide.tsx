"use client";
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface PresenceSlideProps {
  in: boolean;
  onExited?: () => void;
  direction?: "left" | "right" | "up" | "down";
  mountOnEnter?: boolean;
  unmountOnExit?: boolean;
  className?: string;
  children: React.ReactNode;
  duration?: number; // ms
  easing?: string;
  distance?: number; // px (translate の距離)
  focusOnEnter?: boolean;
  // 追加で style を受け取りマージ
  style?: React.CSSProperties;
}

// 状態遷移: unmounted -> entering -> entered -> exiting -> unmounted
export const PresenceSlide: React.FC<PresenceSlideProps> = ({
  in: inProp,
  onExited,
  direction = "left",
  mountOnEnter = true,
  unmountOnExit = true,
  className,
  children,
  duration = 300,
  easing = "ease-in-out",
  distance = 16,
  focusOnEnter = false,
  style,
}) => {
  const [status, setStatus] = useState<"unmounted" | "entering" | "entered" | "exiting">(
    mountOnEnter ? "unmounted" : inProp ? "entered" : "unmounted"
  );
  // entering の最初のフレームでは hiddenTransform を適用し、次フレームで visible にしてトランジションを発火
  const [enterVisible, setEnterVisible] = useState(false);
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const latestIn = useRef(inProp);
  // enter アニメ用 rAF id 管理
  const enterRaf1 = useRef<number | null>(null);
  const enterRaf2 = useRef<number | null>(null);

  // 進行中のタイマーを保持
  const timerRef = useRef<number | null>(null);
  const clearTimer = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  // フォーカス補助
  const focusFirst = () => {
    if (!nodeRef.current) return;
    const focusable = nodeRef.current.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    focusable?.focus();
  };

  useEffect(() => {
    // inProp の変化に合わせて状態遷移
    if (inProp) {
      if (status === "unmounted" && mountOnEnter) {
        setEnterVisible(false);
        setStatus("entering");
      } else if (status === "exiting") {
        setEnterVisible(false);
        setStatus("entering");
      } else if (status === "unmounted" && !mountOnEnter) {
        setEnterVisible(false);
        setStatus("entering");
      }
      // entered の場合は何もしない
    } else {
      if (status === "entered") {
        setStatus("exiting");
      } else if (status === "entering") {
        // enter 中にキャンセル
        setStatus("exiting");
      }
    }
    latestIn.current = inProp;
  }, [inProp, mountOnEnter, status]);

  // entering 開始時に次フレームで enterVisible を true にしてアニメ発火
  useEffect(() => {
    if (status === "entering") {
      setEnterVisible(false); // 初期位置
      if (enterRaf1.current) cancelAnimationFrame(enterRaf1.current);
      if (enterRaf2.current) cancelAnimationFrame(enterRaf2.current);
      enterRaf1.current = requestAnimationFrame(() => {
        enterRaf2.current = requestAnimationFrame(() => setEnterVisible(true));
      });
      return () => {
        if (enterRaf1.current) cancelAnimationFrame(enterRaf1.current);
        if (enterRaf2.current) cancelAnimationFrame(enterRaf2.current);
      };
    }
  }, [status]);

  // entering / exiting 完了処理
  useEffect(() => {
    clearTimer();
    if (status === "entering") {
      // layout フレーム後に entered へ
      timerRef.current = window.setTimeout(() => {
        setStatus("entered");
        if (focusOnEnter) {
          // 余裕をもって次フレーム
          requestAnimationFrame(focusFirst);
        }
      }, duration);
    } else if (status === "exiting") {
      timerRef.current = window.setTimeout(() => {
        if (unmountOnExit) {
          setStatus("unmounted");
        } else {
          setStatus("entered"); // アンマウントしない場合は entered に戻す
        }
        onExited?.();
      }, duration);
    }
    return () => clearTimer();
  }, [status, duration, unmountOnExit, focusOnEnter, onExited]);

  if (status === "unmounted") {
    return null;
  }

  const axis = direction === "left" || direction === "right" ? "X" : "Y";
  const sign = direction === "left" || direction === "up" ? -1 : 1;

  const hiddenTransform = `translate${axis}(${sign * distance}px)`;
  const visibleTransform = `translate${axis}(0px)`;

  const isEntering = status === "entering";

  return (
    <div
      ref={nodeRef}
      style={{
        ...style,
        transition: `transform ${duration}ms ${easing}, opacity ${duration}ms ${easing}`,
        transform: isEntering
          ? enterVisible
            ? visibleTransform
            : hiddenTransform
          : status === "exiting"
          ? hiddenTransform
          : visibleTransform,
        opacity: isEntering ? (enterVisible ? 1 : 0) : status === "exiting" ? 0 : 1,
        willChange: "transform, opacity",
      }}
      data-state={status}
      className={cn(className)}
    >
      {children}
    </div>
  );
};

export default PresenceSlide;
