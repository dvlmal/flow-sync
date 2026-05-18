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
import type { EventInput, EventClickArg, DateSelectArg, EventDropArg } from '@fullcalendar/core';
import { TaskModal } from './TaskModal';
import { CreateTaskModal } from './CreateTaskModal';
import { LoadingSpinner } from '../molecules';
import { useUpdateTask } from '../../hooks';
import type { Task, WorkflowStatus } from '../../types';
import { STATUS_COLORS } from '../../types';

interface CalendarViewProps {
  tasks: Task[];
  statuses: WorkflowStatus[];
  projectId: string;
  isLoading?: boolean;
}

// Map task to FullCalendar event
function taskToEvent(task: Task, statuses: WorkflowStatus[]): EventInput | null {
  if (!task.end_date) return null;

  const status = statuses.find((s) => s.id === task.status_id);
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

  return {
    id: task.id,
    title: task.title,
    start: task.start_date ?? task.end_date,
    end: task.end_date,
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
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const updateTask = useUpdateTask();

  // Convert tasks to calendar events
  const events = useMemo(() => {
    return tasks
      .map((task) => taskToEvent(task, statuses))
      .filter((event): event is EventInput => event !== null);
  }, [tasks, statuses]);

  // Handle event click
  const handleEventClick = useCallback((info: EventClickArg) => {
    const task = info.event.extendedProps.task as Task;
    setSelectedTask(task);
  }, []);

  // Handle date selection for creating new task
  const handleDateSelect = useCallback((_info: DateSelectArg) => {
    setCreateModalOpen(true);
  }, []);

  // Handle event drag (change due date)
  const handleEventDrop = useCallback(
    (info: EventDropArg) => {
      const task = info.event.extendedProps.task as Task;
      const newEndDate = info.event.end ?? info.event.start;

      if (newEndDate) {
        updateTask.mutate({
          id: task.id,
          dto: {
            end_date: newEndDate.toISOString(),
            start_date: info.event.start?.toISOString(),
          },
        });
      }
    },
    [updateTask]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" label="Loading calendar..." />
      </div>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
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
          height="auto"
          eventContent={(eventInfo) => (
            <div className="px-1.5 py-0.5 text-xs truncate">
              <span className="font-medium">{eventInfo.event.title}</span>
            </div>
          )}
          // Notion-style customization
          buttonText={{
            today: 'Today',
            month: 'Month',
            week: 'Week',
            day: 'Day',
            list: 'List',
          }}
          // Styling hooks
          dayCellClassNames="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
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
        onClose={() => setSelectedTask(null)}
      />

      {/* Create Task Modal */}
      <CreateTaskModal
        projectId={projectId}
        statuses={statuses}
        isOpen={createModalOpen}
        onClose={() => {
          setCreateModalOpen(false);
        }}
      />
    </>
  );
}

export default CalendarView;
