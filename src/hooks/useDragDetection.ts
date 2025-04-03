import { useState } from 'react';

const DRAG_THRESHOLD = 5; // pixels

export function useDragDetection() {
  const [isDragging, setIsDragging] = useState(false);
  const [initialPointerPos, setInitialPointerPos] = useState<{ x: number; y: number } | null>(null);

  const handlePointerDown = (event: { clientX: number; clientY: number }) => {
    setIsDragging(false);
    setInitialPointerPos({ x: event.clientX, y: event.clientY });
  };

  const handlePointerMove = (event: { clientX: number; clientY: number }) => {
    if (!initialPointerPos) return;

    const dx = event.clientX - initialPointerPos.x;
    const dy = event.clientY - initialPointerPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > DRAG_THRESHOLD) {
      setIsDragging(true);
    }
  };

  const handlePointerUp = () => {
    setInitialPointerPos(null);
  };

  return {
    isDragging,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}
