/**
 * useDragState Hook
 *
 * Manages drag and drop state for kanban cards with proper CSS class management.
 * Provides smooth animations and visual feedback following Notion's interaction patterns.
 *
 * @example
 * ```tsx
 * function TaskCard({ task }) {
 *   const { dragState, handlers, className } = useDragState({
 *     onDragStart: () => console.log('Started dragging'),
 *     onDragEnd: (success) => console.log('Ended:', success),
 *   });
 *
 *   return (
 *     <div className={className} {...handlers}>
 *       {task.title}
 *     </div>
 *   );
 * }
 * ```
 */

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';

// ============================================================================
// Types
// ============================================================================

export type DragStateType =
  | 'idle'
  | 'hover'
  | 'lifting'
  | 'dragging'
  | 'dropping'
  | 'returning'
  | 'success'
  | 'invalid';

export interface UseDragStateOptions {
  /** Callback when drag starts */
  onDragStart?: () => void;
  /** Callback when drag ends (success: true if dropped successfully) */
  onDragEnd?: (success: boolean) => void;
  /** Duration for lifting animation (ms) */
  liftDuration?: number;
  /** Duration for drop animation (ms) */
  dropDuration?: number;
  /** Duration for success flash (ms) */
  successDuration?: number;
  /** Base CSS class to apply */
  baseClass?: string;
  /** Whether the element is currently draggable */
  isDraggable?: boolean;
}

export interface UseDragStateResult {
  /** Current drag state */
  dragState: DragStateType;
  /** Whether currently in any drag state */
  isDragging: boolean;
  /** Whether hovering */
  isHovering: boolean;
  /** Computed CSS class names */
  className: string;
  /** Inline styles for drag transform */
  style: React.CSSProperties;
  /** Event handlers to spread on the element */
  handlers: {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onMouseDown: (e: React.MouseEvent) => void;
    onDragStart: (e: React.DragEvent) => void;
    onDragEnd: (e: React.DragEvent) => void;
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchEnd: (e: React.TouchEvent) => void;
  };
  /** Manual state setters for integration with dnd-kit */
  setDragState: (state: DragStateType) => void;
  /** Reset to idle state */
  reset: () => void;
  /** Trigger success animation */
  triggerSuccess: () => void;
  /** Trigger invalid/shake animation */
  triggerInvalid: () => void;
}

// ============================================================================
// CSS Class Mapping
// ============================================================================

const stateClassMap: Record<DragStateType, string> = {
  idle: 'drag-card',
  hover: 'drag-card',
  lifting: 'drag-card drag-card--lifting',
  dragging: 'drag-card drag-card--dragging',
  dropping: 'drag-card drag-card--dropping',
  returning: 'drag-card drag-card--returning',
  success: 'drag-card drag-card--success',
  invalid: 'drag-card drag-card--invalid',
};

// ============================================================================
// Hook Implementation
// ============================================================================

export function useDragState(options: UseDragStateOptions = {}): UseDragStateResult {
  const {
    onDragStart,
    onDragEnd,
    liftDuration = 150,
    dropDuration = 200,
    successDuration = 300,
    baseClass = '',
    isDraggable = true,
  } = options;

  const [dragState, setDragState] = useState<DragStateType>('idle');
  const [isHovering, setIsHovering] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Clear any pending timeout
  const clearPendingTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Reset to idle state
  const reset = useCallback(() => {
    clearPendingTimeout();
    setDragState('idle');
    setIsHovering(false);
  }, [clearPendingTimeout]);

  // Trigger success animation
  const triggerSuccess = useCallback(() => {
    clearPendingTimeout();
    setDragState('success');
    timeoutRef.current = setTimeout(() => {
      setDragState('idle');
    }, successDuration);
  }, [clearPendingTimeout, successDuration]);

  // Trigger invalid/shake animation
  const triggerInvalid = useCallback(() => {
    clearPendingTimeout();
    setDragState('invalid');
    timeoutRef.current = setTimeout(() => {
      setDragState('returning');
      timeoutRef.current = setTimeout(() => {
        setDragState('idle');
      }, dropDuration);
    }, 150); // Shake duration
  }, [clearPendingTimeout, dropDuration]);

  // Event handlers
  const handleMouseEnter = useCallback(() => {
    if (isDraggable && dragState === 'idle') {
      setIsHovering(true);
    }
  }, [isDraggable, dragState]);

  const handleMouseLeave = useCallback(() => {
    if (dragState === 'idle' || dragState === 'hover') {
      setIsHovering(false);
    }
  }, [dragState]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!isDraggable || e.button !== 0) return; // Only left click

    clearPendingTimeout();
    setDragState('lifting');

    // Transition to dragging after lift animation
    timeoutRef.current = setTimeout(() => {
      setDragState('dragging');
    }, liftDuration);
  }, [isDraggable, clearPendingTimeout, liftDuration]);

  const handleDragStart = useCallback((e: React.DragEvent) => {
    if (!isDraggable) {
      e.preventDefault();
      return;
    }

    // Set drag data
    e.dataTransfer.effectAllowed = 'move';

    // Skip if already in dragging state (from mousedown)
    if (dragState !== 'dragging') {
      setDragState('dragging');
    }

    onDragStart?.();
  }, [isDraggable, dragState, onDragStart]);

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    clearPendingTimeout();

    const success = e.dataTransfer.dropEffect === 'move';

    if (success) {
      setDragState('dropping');
      timeoutRef.current = setTimeout(() => {
        triggerSuccess();
        onDragEnd?.(true);
      }, dropDuration);
    } else {
      triggerInvalid();
      onDragEnd?.(false);
    }
  }, [clearPendingTimeout, dropDuration, triggerSuccess, triggerInvalid, onDragEnd]);

  const handleTouchStart = useCallback((_e: React.TouchEvent) => {
    if (!isDraggable) return;

    clearPendingTimeout();
    setDragState('lifting');

    timeoutRef.current = setTimeout(() => {
      setDragState('dragging');
    }, liftDuration);
  }, [isDraggable, clearPendingTimeout, liftDuration]);

  const handleTouchEnd = useCallback(() => {
    if (dragState === 'dragging' || dragState === 'lifting') {
      triggerInvalid();
      onDragEnd?.(false);
    }
  }, [dragState, triggerInvalid, onDragEnd]);

  // Computed values
  const isDragging = useMemo(() => {
    return ['lifting', 'dragging', 'dropping', 'returning'].includes(dragState);
  }, [dragState]);

  const className = useMemo(() => {
    return `${baseClass} ${stateClassMap[dragState]}`.trim();
  }, [baseClass, dragState]);

  const style = useMemo((): React.CSSProperties => {
    if (!isDraggable) {
      return { cursor: 'default' };
    }

    switch (dragState) {
      case 'dragging':
        return {
          cursor: 'grabbing',
          userSelect: 'none',
        };
      case 'lifting':
        return {
          cursor: 'grabbing',
          userSelect: 'none',
        };
      default:
        return {
          cursor: isHovering ? 'grab' : 'default',
        };
    }
  }, [isDraggable, dragState, isHovering]);

  // Return handlers object
  const handlers = useMemo(() => ({
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onMouseDown: handleMouseDown,
    onDragStart: handleDragStart,
    onDragEnd: handleDragEnd,
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
  }), [
    handleMouseEnter,
    handleMouseLeave,
    handleMouseDown,
    handleDragStart,
    handleDragEnd,
    handleTouchStart,
    handleTouchEnd,
  ]);

  return {
    dragState,
    isDragging,
    isHovering,
    className,
    style,
    handlers,
    setDragState,
    reset,
    triggerSuccess,
    triggerInvalid,
  };
}

export default useDragState;
