import { useRef, useState } from 'react';

const ACTION_WIDTH = 80; 
const OPEN_THRESHOLD = 40; 
const DRAG_START_DISTANCE = 6; 

const SwipeableRow = ({ actionLabel, onAction, children }) => {
  const [offset, setOffset] = useState(0); // 0 (closed) to -ACTION_WIDTH (open)
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, offset: 0 });
  const hasDragged = useRef(false);

  const isOpen = offset !== 0;

  const handlePointerDown = (event) => {
    dragStart.current = { x: event.clientX, offset };
    hasDragged.current = false;
  };

  const handlePointerMove = (event) => {
    if (event.buttons === 0) return; 

    const distance = event.clientX - dragStart.current.x;

    if (!isDragging) {
      if (Math.abs(distance) < DRAG_START_DISTANCE) return;
      setIsDragging(true);
      hasDragged.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    }

    const next = dragStart.current.offset + distance;
    setOffset(Math.min(0, Math.max(-ACTION_WIDTH, next)));
  };

  const handlePointerEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    setOffset((current) => (current < -OPEN_THRESHOLD ? -ACTION_WIDTH : 0));
  };

  const handleClickCapture = (event) => {
    if (hasDragged.current) {
      event.stopPropagation();
      hasDragged.current = false;
      return;
    }
    if (isOpen) {
      event.stopPropagation();
      setOffset(0);
    }
  };

  return (
    <div className="relative overflow-hidden">
      <button
        type="button"
        onClick={onAction}
        tabIndex={isOpen ? 0 : -1}
        aria-hidden={!isOpen}
        className="absolute inset-y-0 right-0 flex items-center justify-center bg-danger text-sm font-medium text-white"
        style={{ width: ACTION_WIDTH }}
      >
        {actionLabel}
      </button>

      <div
        className="relative touch-pan-y bg-white"
        style={{
          transform: `translateX(${offset}px)`,
          transition: isDragging ? 'none' : 'transform 200ms ease-out',
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onClickCapture={handleClickCapture}
      >
        {children}
      </div>
    </div>
  );
};

export default SwipeableRow;