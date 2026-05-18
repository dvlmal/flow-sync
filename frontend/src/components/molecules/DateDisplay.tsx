/**
 * DateDisplay Molecule Component
 * Formatted date display with optional due date styling
 */

import { Calendar, Clock } from 'lucide-react';
import { clsx } from 'clsx';
import { format, isPast, isToday, isTomorrow, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';

interface DateDisplayProps {
  date: string | null | undefined;
  showTime?: boolean;
  showIcon?: boolean;
  colorByDue?: boolean;
  className?: string;
}

export function DateDisplay({
  date,
  showTime = false,
  showIcon = true,
  colorByDue = true,
  className,
}: DateDisplayProps) {
  if (!date) return null;

  const parsedDate = parseISO(date);
  const isOverdue = colorByDue && isPast(parsedDate) && !isToday(parsedDate);
  const isDueToday = colorByDue && isToday(parsedDate);
  const isDueTomorrow = colorByDue && isTomorrow(parsedDate);

  const formatString = showTime ? 'M/d HH:mm' : 'M/d';
  const formattedDate = format(parsedDate, formatString, { locale: ko });

  let displayText = formattedDate;
  if (isDueToday) displayText = 'Today';
  else if (isDueTomorrow) displayText = 'Tomorrow';

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 text-xs',
        isOverdue && 'text-red-500',
        isDueToday && 'text-orange-500',
        isDueTomorrow && 'text-yellow-600 dark:text-yellow-500',
        !isOverdue && !isDueToday && !isDueTomorrow && 'text-gray-500',
        className
      )}
    >
      {showIcon && (
        showTime ? (
          <Clock className="w-3 h-3" />
        ) : (
          <Calendar className="w-3 h-3" />
        )
      )}
      {displayText}
    </span>
  );
}

export default DateDisplay;
