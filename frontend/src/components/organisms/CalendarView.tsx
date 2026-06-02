/**
 * CalendarView Organism Component
 * FullCalendar integration for task visualization by due date
 */

import { useState, useCallback, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import koLocale from '@fullcalendar/core/locales/ko';
import type { EventInput, EventClickArg, DateSelectArg, EventDropArg, DayCellContentArg } from '@fullcalendar/core';
import type { EventResizeDoneArg } from '@fullcalendar/interaction';
import { TaskModal } from './TaskModal';
import { CreateTaskModal } from './CreateTaskModal';
import { LoadingSpinner } from '../molecules';
import { useUpdateTask } from '../../hooks';
import type { Task, WorkflowStatus } from '../../types';
import { STATUS_COLORS } from '../../types';

// Korean public holidays (fixed dates + lunar calendar holidays for 2024-2026)
const KOREAN_HOLIDAYS: Record<string, string> = {
  // Fixed holidays (every year)
  // 신정
  '01-01': '신정',
  // 삼일절
  '03-01': '삼일절',
  // 어린이날
  '05-05': '어린이날',
  // 현충일
  '06-06': '현충일',
  // 광복절
  '08-15': '광복절',
  // 개천절
  '10-03': '개천절',
  // 한글날
  '10-09': '한글날',
  // 크리스마스
  '12-25': '크리스마스',

  // 2024 Lunar holidays
  '2024-02-09': '설날 연휴',
  '2024-02-10': '설날',
  '2024-02-11': '설날 연휴',
  '2024-02-12': '대체공휴일',
  '2024-05-15': '부처님 오신 날',
  '2024-09-16': '추석 연휴',
  '2024-09-17': '추석',
  '2024-09-18': '추석 연휴',

  // 2025 Lunar holidays
  '2025-01-28': '설날 연휴',
  '2025-01-29': '설날',
  '2025-01-30': '설날 연휴',
  '2025-05-05': '부처님 오신 날',
  '2025-10-05': '추석 연휴',
  '2025-10-06': '추석',
  '2025-10-07': '추석 연휴',
  '2025-10-08': '대체공휴일',

  // 2026 Lunar holidays
  '2026-02-16': '설날 연휴',
  '2026-02-17': '설날',
  '2026-02-18': '설날 연휴',
  '2026-05-24': '부처님 오신 날',
  '2026-09-24': '추석 연휴',
  '2026-09-25': '추석',
  '2026-09-26': '추석 연휴',
};

// Check if a date is a Korean holiday
function isKoreanHoliday(date: Date): boolean {
  const mmdd = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const fullDate = `${date.getFullYear()}-${mmdd}`;

  return KOREAN_HOLIDAYS[mmdd] !== undefined || KOREAN_HOLIDAYS[fullDate] !== undefined;
}

interface CalendarViewProps {
  tasks: Task[];
  statuses: WorkflowStatus[];
  projectId: string;
  isLoading?: boolean;
}

// Map task to FullCalendar event
function taskToEvent(task: Task, statuses: WorkflowStatus[]): EventInput | null {
  if (!task.endDate) return null;

  const status = statuses.find((s) => s.id === task.statusId);
  const statusColor = status ? STATUS_COLORS[status.name] ?? 'bg-gray-400' : 'bg-gray-400';

  // Convert Tailwind class to actual color
  const colorMap: Record<string, string> = {
    'bg-gray-400': '#9ca3af',
    'bg-blue-500': '#3b82f6',
    'bg-green-500': '#22c55e',
    'bg-red-500': '#ef4444',
    'bg-yellow-500': '#eab308',
    'bg-orange-500': '#f97316',
    'bg-purple-500': '#a855f7',
  };

  const bgColor = colorMap[statusColor] ?? '#9ca3af';

  // FullCalendar treats end date as exclusive, so add 1 day to make it inclusive
  // e.g., end date 6/2 should display through 6/2, not just 6/1
  const endDate = new Date(task.endDate);
  endDate.setDate(endDate.getDate() + 1);
  const exclusiveEndDate = endDate.toISOString();

  return {
    id: task.id,
    title: task.title,
    start: task.startDate ?? task.endDate,
    end: exclusiveEndDate,
    allDay: true,
    backgroundColor: bgColor,
    borderColor: bgColor,
    extendedProps: {
      task,
      priority: task.priority,
      status: status?.name,
    },
  };
}

export function CalendarView({ tasks, statuses, projectId, isLoading }: CalendarViewProps) {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState<{ start: string; end: string } | null>(null);

  const updateTask = useUpdateTask();

  // Get selected task from tasks array (synced with cache)
  const selectedTask = useMemo(
    () => (selectedTaskId ? tasks.find((t) => t.id === selectedTaskId) ?? null : null),
    [selectedTaskId, tasks]
  );

  // Convert tasks to calendar events
  const events = useMemo(() => {
    return tasks
      .map((task) => taskToEvent(task, statuses))
      .filter((event): event is EventInput => event !== null);
  }, [tasks, statuses]);

  // Handle event click
  const handleEventClick = useCallback((info: EventClickArg) => {
    const task = info.event.extendedProps.task as Task;
    setSelectedTaskId(task.id);
  }, []);

  // Handle date selection for creating new task
  const handleDateSelect = useCallback((info: DateSelectArg) => {
    // FullCalendar returns exclusive end date, subtract 1 day to get inclusive end date
    const adjustedEnd = new Date(info.end);
    if (info.allDay) {
      adjustedEnd.setDate(adjustedEnd.getDate() - 1);
    }

    // Store selected date range for new task
    setSelectedDateRange({
      start: info.start.toISOString(),
      end: adjustedEnd.toISOString(),
    });
    setCreateModalOpen(true);
  }, []);

  // Handle event drag (change dates)
  const handleEventDrop = useCallback(
    (info: EventDropArg) => {
      const task = info.event.extendedProps.task as Task;
      const startDate = info.event.start;
      // For allDay events, end might be null (same day) - use start date in that case
      let endDate = info.event.end ?? info.event.start;

      // FullCalendar returns exclusive end date, subtract 1 day to get inclusive end date
      if (endDate && info.event.allDay) {
        const adjustedEnd = new Date(endDate);
        adjustedEnd.setDate(adjustedEnd.getDate() - 1);
        endDate = adjustedEnd;
      }

      if (startDate && endDate) {
        updateTask.mutate({
          id: task.id,
          dto: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          },
        });
      }
    },
    [updateTask]
  );

  // Handle event resize (change duration)
  const handleEventResize = useCallback(
    (info: EventResizeDoneArg) => {
      const task = info.event.extendedProps.task as Task;
      const startDate = info.event.start;
      let endDate = info.event.end ?? info.event.start;

      // FullCalendar returns exclusive end date, subtract 1 day to get inclusive end date
      if (endDate && info.event.allDay) {
        const adjustedEnd = new Date(endDate);
        adjustedEnd.setDate(adjustedEnd.getDate() - 1);
        endDate = adjustedEnd;
      }

      if (startDate && endDate) {
        updateTask.mutate({
          id: task.id,
          dto: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          },
        });
      }
    },
    [updateTask]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" label="캘린더 불러오는 중..." />
      </div>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          locale={koLocale}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
          }}
          events={events}
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={3}
          eventClick={handleEventClick}
          select={handleDateSelect}
          eventDrop={handleEventDrop}
          eventResize={handleEventResize}
          eventResizableFromStart={true}
          height="auto"
          eventContent={(eventInfo) => (
            <div className="px-1.5 py-0.5 text-xs truncate">
              <span className="font-medium">{eventInfo.event.title}</span>
            </div>
          )}
          // Show day number only (without '일' suffix)
          dayCellContent={(arg: DayCellContentArg) => arg.dayNumberText.replace('일', '')}
          // Styling hooks - add holiday class for Korean holidays
          dayCellClassNames={(arg) => {
            const classes = ['hover:bg-gray-50', 'dark:hover:bg-gray-800', 'transition-colors'];
            if (isKoreanHoliday(arg.date)) {
              classes.push('fc-day-holiday');
            }
            return classes;
          }}
          eventClassNames="cursor-pointer rounded shadow-sm hover:shadow-md transition-shadow"
        />
      </div>

      {/* Custom CSS for FullCalendar */}
      <style>{`
        .fc {
          --fc-border-color: rgb(229 231 235);
          --fc-button-bg-color: rgb(243 244 246);
          --fc-button-border-color: rgb(229 231 235);
          --fc-button-text-color: rgb(55 65 81);
          --fc-button-hover-bg-color: rgb(229 231 235);
          --fc-button-hover-border-color: rgb(209 213 219);
          --fc-button-active-bg-color: rgb(59 130 246);
          --fc-button-active-border-color: rgb(59 130 246);
          --fc-today-bg-color: rgb(239 246 255);
          --fc-page-bg-color: transparent;
          --fc-neutral-bg-color: rgb(249 250 251);
          --fc-event-border-color: transparent;
        }

        .dark .fc {
          --fc-border-color: rgb(55 65 81);
          --fc-button-bg-color: rgb(55 65 81);
          --fc-button-border-color: rgb(75 85 99);
          --fc-button-text-color: rgb(209 213 219);
          --fc-button-hover-bg-color: rgb(75 85 99);
          --fc-button-hover-border-color: rgb(107 114 128);
          --fc-today-bg-color: rgba(59, 130, 246, 0.1);
          --fc-neutral-bg-color: rgb(31 41 55);
        }

        .fc .fc-toolbar-title {
          font-size: 1.25rem;
          font-weight: 600;
        }

        .fc .fc-button {
          font-weight: 500;
          font-size: 0.875rem;
          padding: 0.375rem 0.75rem;
          border-radius: 0.375rem;
        }

        .fc .fc-button-primary:not(:disabled).fc-button-active {
          color: white;
        }

        .fc .fc-col-header-cell-cushion {
          padding: 0.5rem 0;
          font-weight: 500;
          font-size: 0.75rem;
          text-transform: uppercase;
          color: rgb(107 114 128);
        }

        /* Sunday styling - red color */
        .fc .fc-day-sun .fc-col-header-cell-cushion {
          color: rgb(239 68 68);
        }

        .fc .fc-day-sun .fc-daygrid-day-number {
          color: rgb(239 68 68);
        }

        .fc .fc-daygrid-day.fc-day-sun.fc-day-today .fc-daygrid-day-number {
          background-color: rgb(239 68 68);
          color: white;
        }

        /* Korean holiday styling - red color */
        .fc .fc-day-holiday .fc-daygrid-day-number {
          color: rgb(239 68 68);
        }

        .fc .fc-daygrid-day.fc-day-holiday.fc-day-today .fc-daygrid-day-number {
          background-color: rgb(239 68 68);
          color: white;
        }

        .fc .fc-daygrid-day-number {
          padding: 0.5rem;
          font-size: 0.875rem;
        }

        .fc .fc-daygrid-day.fc-day-today .fc-daygrid-day-number {
          background-color: rgb(59 130 246);
          color: white;
          border-radius: 9999px;
          width: 1.75rem;
          height: 1.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .fc .fc-daygrid-event {
          border-radius: 0.25rem;
          margin: 1px 2px;
        }

        .fc .fc-event-main {
          padding: 0;
        }

        .fc .fc-more-link {
          font-size: 0.75rem;
          color: rgb(107 114 128);
          font-weight: 500;
        }

        .fc .fc-popover {
          border-radius: 0.5rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
      `}</style>

      {/* Task Detail Modal */}
      <TaskModal
        task={selectedTask}
        statuses={statuses}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTaskId(null)}
      />

      {/* Create Task Modal */}
      <CreateTaskModal
        projectId={projectId}
        statuses={statuses}
        defaultStartDate={selectedDateRange?.start}
        defaultEndDate={selectedDateRange?.end}
        isOpen={createModalOpen}
        onClose={() => {
          setCreateModalOpen(false);
          setSelectedDateRange(null);
        }}
      />
    </>
  );
}

export default CalendarView;
