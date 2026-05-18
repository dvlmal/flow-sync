/**
 * Dropdown Molecule Component
 * Base dropdown container with proper positioning
 */

import { useState, useRef, useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { clsx } from 'clsx';

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: 'left' | 'right';
  className?: string;
}

export function Dropdown({ trigger, children, align = 'left', className }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const dropdownHeight = 200; // estimated height

      let top = rect.bottom + 4;
      let left = align === 'left' ? rect.left : rect.right - 200;

      // Flip if near bottom of viewport
      if (top + dropdownHeight > window.innerHeight) {
        top = rect.top - dropdownHeight - 4;
      }

      // Keep within viewport horizontally
      if (left < 8) left = 8;
      if (left + 200 > window.innerWidth - 8) left = window.innerWidth - 208;

      setPosition({ top, left });
    }
  }, [isOpen, align]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <>
      <div
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer"
      >
        {trigger}
      </div>
      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: 'fixed',
              top: position.top,
              left: position.left,
              zIndex: 9999,
            }}
            className={clsx(
              'min-w-[180px] max-h-[280px] overflow-auto',
              'bg-white dark:bg-gray-900 rounded-lg shadow-lg',
              'border border-gray-200 dark:border-gray-700',
              'py-1',
              className
            )}
          >
            {children}
          </div>,
          document.body
        )}
    </>
  );
}

interface DropdownItemProps {
  children: ReactNode;
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
  className?: string;
}

export function DropdownItem({
  children,
  onClick,
  selected,
  disabled,
  className,
}: DropdownItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'w-full px-3 py-2 text-sm text-left',
        'transition-colors duration-100',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        selected
          ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
        className
      )}
    >
      {children}
    </button>
  );
}

export default Dropdown;
