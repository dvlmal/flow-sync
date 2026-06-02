/**
 * ProjectManagement Page Component
 * CRUD operations for projects and workflow statuses
 */

import { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  FolderKanban,
  ExternalLink,
  AlertTriangle,
  ChevronRight,
  GripVertical,
  Layers,
} from 'lucide-react';
import { clsx } from 'clsx';
import { format, parseISO } from 'date-fns';
import { Button, Input } from '../components/atoms';
import { LoadingSpinner } from '../components/molecules';
import {
  useProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
  useWorkflowStatuses,
  useCreateWorkflowStatus,
  useUpdateWorkflowStatus,
  useDeleteWorkflowStatus,
} from '../hooks';
import type {
  Project,
  CreateProjectDto,
  UpdateProjectDto,
  WorkflowStatus,
  CreateWorkflowStatusDto,
  UpdateWorkflowStatusDto,
  WorkflowStatusColor,
} from '../types';
import { WORKFLOW_STATUS_COLORS } from '../types';

export function ProjectManagement() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const { data: projects, isLoading } = useProjects();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" label="프로젝트 불러오는 중..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            프로젝트 관리
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            프로젝트를 추가하고 관리하세요
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4" />
          새 프로젝트
        </Button>
      </div>

      {/* Project List */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
        {!projects || projects.length === 0 ? (
          <div className="p-8 text-center">
            <FolderKanban className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              등록된 프로젝트가 없습니다
            </p>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-4 h-4" />
              첫 번째 프로젝트 만들기
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {projects.map((project) => (
              <ProjectItem
                key={project.id}
                project={project}
                onSelect={() => setSelectedProject(project)}
                onEdit={() => setEditingProject(project)}
                onDelete={() => setDeletingProject(project)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      <ProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        mode="create"
      />

      {/* Edit Modal */}
      <ProjectModal
        isOpen={!!editingProject}
        onClose={() => setEditingProject(null)}
        mode="edit"
        project={editingProject ?? undefined}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingProject}
        onClose={() => setDeletingProject(null)}
        project={deletingProject ?? undefined}
      />

      {/* Project Detail Modal */}
      <ProjectDetailModal
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        project={selectedProject ?? undefined}
      />
    </div>
  );
}

// Project Item Component
interface ProjectItemProps {
  project: Project;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function ProjectItem({ project, onSelect, onEdit, onDelete }: ProjectItemProps) {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <button
        onClick={onSelect}
        className="flex items-center gap-4 min-w-0 flex-1 text-left"
      >
        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-blue-600 dark:text-blue-400 font-bold">
            {project.title.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
            {project.title}
          </h3>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            {project.description && (
              <span className="truncate max-w-xs">{project.description}</span>
            )}
            {project.notionDbId && (
              <span className="flex items-center gap-1 text-xs">
                <ExternalLink className="w-3 h-3" />
                Notion 연동
              </span>
            )}
            {project.createdAt && (
              <span className="text-xs">
                {format(parseISO(project.createdAt), 'yyyy.MM.dd')} 생성
              </span>
            )}
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </button>
      <div className="flex items-center gap-2 ml-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-gray-700 transition-colors"
          aria-label="수정"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-900/20 transition-colors"
          aria-label="삭제"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Project Detail Modal with Workflow Status Management
interface ProjectDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project;
}

function ProjectDetailModal({ isOpen, onClose, project }: ProjectDetailModalProps) {
  const [isAddingStatus, setIsAddingStatus] = useState(false);
  const [editingStatus, setEditingStatus] = useState<WorkflowStatus | null>(null);
  const [deletingStatus, setDeletingStatus] = useState<WorkflowStatus | null>(null);

  const { data: statuses, isLoading: statusesLoading } = useWorkflowStatuses(project?.id ?? null);

  if (!isOpen || !project) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-xl shadow-2xl m-4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 dark:text-blue-400 font-bold">
                {project.title.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {project.title}
              </h2>
              {project.description && (
                <p className="text-sm text-gray-500">{project.description}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Project Info */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              프로젝트 정보
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Notion Database ID</span>
                <code className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">
                  {project.notionDbId}
                </code>
              </div>
              {project.createdAt && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">생성일</span>
                  <span className="text-gray-900 dark:text-gray-100">
                    {format(parseISO(project.createdAt), 'yyyy년 MM월 dd일')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Workflow Statuses */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-gray-500" />
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  워크플로우 상태
                </h3>
              </div>
              <Button
                variant="secondary"
                onClick={() => setIsAddingStatus(true)}
                className="text-sm"
              >
                <Plus className="w-4 h-4" />
                상태 추가
              </Button>
            </div>

            {statusesLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner size="md" />
              </div>
            ) : !statuses || statuses.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                <Layers className="w-10 h-10 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                <p className="text-gray-500 dark:text-gray-400 mb-3">
                  등록된 워크플로우 상태가 없습니다
                </p>
                <Button variant="secondary" onClick={() => setIsAddingStatus(true)}>
                  <Plus className="w-4 h-4" />
                  첫 번째 상태 추가
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {statuses.map((status) => (
                  <WorkflowStatusItem
                    key={status.id}
                    status={status}
                    onEdit={() => setEditingStatus(status)}
                    onDelete={() => setDeletingStatus(status)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Workflow Status Modals */}
        <WorkflowStatusModal
          isOpen={isAddingStatus}
          onClose={() => setIsAddingStatus(false)}
          mode="create"
          projectId={project.id}
          nextSortOrder={statuses?.length ?? 0}
        />

        <WorkflowStatusModal
          isOpen={!!editingStatus}
          onClose={() => setEditingStatus(null)}
          mode="edit"
          projectId={project.id}
          status={editingStatus ?? undefined}
        />

        <DeleteStatusConfirmModal
          isOpen={!!deletingStatus}
          onClose={() => setDeletingStatus(null)}
          status={deletingStatus ?? undefined}
        />
      </div>
    </div>,
    document.body
  );
}

// Workflow Status Item Component
interface WorkflowStatusItemProps {
  status: WorkflowStatus;
  onEdit: () => void;
  onDelete: () => void;
}

function WorkflowStatusItem({ status, onEdit, onDelete }: WorkflowStatusItemProps) {
  const colorConfig = WORKFLOW_STATUS_COLORS[status.color ?? 'gray'];

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg group">
      <GripVertical className="w-4 h-4 text-gray-400 cursor-grab" />
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className={clsx('w-3 h-3 rounded-full', colorConfig.bg)} />
        <span className="font-medium text-gray-900 dark:text-gray-100 truncate">
          {status.name}
        </span>
        {status.notionOptionId && (
          <span className="text-xs text-gray-400 truncate">
            (Notion: {status.notionOptionId.slice(0, 8)}...)
          </span>
        )}
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onEdit}
          className="p-1.5 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-200 dark:hover:text-gray-300 dark:hover:bg-gray-700 transition-colors"
          aria-label="수정"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 rounded text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-900/20 transition-colors"
          aria-label="삭제"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// Workflow Status Modal (Create/Edit)
interface WorkflowStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  projectId: string;
  status?: WorkflowStatus;
  nextSortOrder?: number;
}

function WorkflowStatusModal({
  isOpen,
  onClose,
  mode,
  projectId,
  status,
  nextSortOrder = 0,
}: WorkflowStatusModalProps) {
  const [name, setName] = useState(status?.name ?? '');
  const [notionOptionId, setNotionOptionId] = useState(status?.notionOptionId ?? '');
  const [color, setColor] = useState<WorkflowStatusColor>(status?.color ?? 'gray');

  const createStatus = useCreateWorkflowStatus();
  const updateStatus = useUpdateWorkflowStatus();

  // status?.id를 의존성으로 사용하여 status 객체 참조 변경으로 인한 불필요한 reset 방지
  const statusId = status?.id;
  useEffect(() => {
    if (isOpen) {
      setName(status?.name ?? '');
      setNotionOptionId(status?.notionOptionId ?? '');
      setColor(status?.color ?? 'gray');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, statusId]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!name.trim()) return;

      try {
        if (mode === 'create') {
          const dto: CreateWorkflowStatusDto = {
            projectId,
            name: name.trim(),
            sortOrder: nextSortOrder,
            notionOptionId: notionOptionId.trim() || undefined,
            color,
          };
          await createStatus.mutateAsync(dto);
        } else if (status) {
          const dto: UpdateWorkflowStatusDto = {
            name: name.trim(),
            notionOptionId: notionOptionId.trim() || undefined,
            color,
          };
          await updateStatus.mutateAsync({ id: status.id, dto });
        }
        onClose();
        setName('');
        setNotionOptionId('');
        setColor('gray');
      } catch (error) {
        console.error('Failed to save workflow status:', error);
      }
    },
    [name, notionOptionId, color, mode, projectId, status, nextSortOrder, createStatus, updateStatus, onClose]
  );

  if (!isOpen) return null;

  const isPending = createStatus.isPending || updateStatus.isPending;

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white dark:bg-gray-900 rounded-xl shadow-2xl m-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {mode === 'create' ? '워크플로우 상태 추가' : '워크플로우 상태 수정'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label
              htmlFor="status-name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              상태 이름 *
            </label>
            <Input
              id="status-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 진행 중, 완료, 보류"
              autoFocus
              required
            />
          </div>

          <div>
            <label
              htmlFor="notion-option-id"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Notion Option ID
            </label>
            <Input
              id="notion-option-id"
              value={notionOptionId}
              onChange={(e) => setNotionOptionId(e.target.value)}
              placeholder="Notion 상태 옵션 ID (선택사항)"
            />
            <p className="mt-1 text-xs text-gray-500">
              Notion과 동기화할 상태 옵션 ID
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              색상
            </label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(WORKFLOW_STATUS_COLORS) as WorkflowStatusColor[]).map((colorKey) => {
                const colorConfig = WORKFLOW_STATUS_COLORS[colorKey];
                return (
                  <button
                    key={colorKey}
                    type="button"
                    onClick={() => setColor(colorKey)}
                    className={clsx(
                      'w-8 h-8 rounded-full transition-all',
                      colorConfig.bg,
                      color === colorKey
                        ? 'ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-gray-900'
                        : 'hover:scale-110'
                    )}
                    title={colorConfig.label}
                    aria-label={colorConfig.label}
                  />
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              취소
            </Button>
            <Button type="submit" loading={isPending} disabled={!name.trim()}>
              {mode === 'create' ? '추가' : '저장'}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

// Delete Status Confirmation Modal
interface DeleteStatusConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  status?: WorkflowStatus;
}

function DeleteStatusConfirmModal({ isOpen, onClose, status }: DeleteStatusConfirmModalProps) {
  const deleteStatus = useDeleteWorkflowStatus();

  const handleDelete = useCallback(async () => {
    if (!status) return;

    try {
      await deleteStatus.mutateAsync({ id: status.id, projectId: status.projectId });
      onClose();
    } catch (error) {
      console.error('Failed to delete workflow status:', error);
    }
  }, [status, deleteStatus, onClose]);

  if (!isOpen || !status) return null;

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white dark:bg-gray-900 rounded-xl shadow-2xl m-4 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            상태 삭제
          </h2>
        </div>

        <p className="text-gray-600 dark:text-gray-400 mb-6">
          <strong className="text-gray-900 dark:text-gray-100">{status.name}</strong>
          {' '}상태를 삭제하시겠습니까? 이 상태가 지정된 작업들은 상태가 없어집니다.
        </p>

        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            취소
          </Button>
          <Button
            variant="primary"
            onClick={handleDelete}
            loading={deleteStatus.isPending}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
          >
            삭제
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// Project Modal Component (Create/Edit)
interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  project?: Project;
}

function ProjectModal({ isOpen, onClose, mode, project }: ProjectModalProps) {
  const [title, setTitle] = useState(project?.title ?? '');
  const [notionDbId, setNotionDbId] = useState(project?.notionDbId ?? '');
  const [description, setDescription] = useState(project?.description ?? '');

  const createProject = useCreateProject();
  const updateProject = useUpdateProject();

  // Reset form when modal opens/project changes
  // project?.id를 의존성으로 사용하여 project 객체 참조 변경으로 인한 불필요한 reset 방지
  const projectId = project?.id;
  useEffect(() => {
    if (isOpen) {
      setTitle(project?.title ?? '');
      setNotionDbId(project?.notionDbId ?? '');
      setDescription(project?.description ?? '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, projectId]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!title.trim() || !notionDbId.trim()) return;

      try {
        if (mode === 'create') {
          const dto: CreateProjectDto = {
            title: title.trim(),
            notionDbId: notionDbId.trim(),
            description: description.trim() || undefined,
          };
          await createProject.mutateAsync(dto);
        } else if (project) {
          const dto: UpdateProjectDto = {
            title: title.trim(),
            notionDbId: notionDbId.trim(),
            description: description.trim() || undefined,
          };
          await updateProject.mutateAsync({ id: project.id, dto });
        }
        onClose();
        // Reset form
        setTitle('');
        setNotionDbId('');
        setDescription('');
      } catch (error) {
        console.error('Failed to save project:', error);
      }
    },
    [title, notionDbId, description, mode, project, createProject, updateProject, onClose]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  if (!isOpen) return null;

  const isPending = createProject.isPending || updateProject.isPending;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onKeyDown={handleKeyDown}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-2xl m-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {mode === 'create' ? '새 프로젝트 만들기' : '프로젝트 수정'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label
              htmlFor="project-title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              프로젝트 이름 *
            </label>
            <Input
              id="project-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="프로젝트 이름 입력"
              autoFocus
              required
            />
          </div>

          <div>
            <label
              htmlFor="notion-db-id"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Notion Database ID *
            </label>
            <Input
              id="notion-db-id"
              value={notionDbId}
              onChange={(e) => setNotionDbId(e.target.value)}
              placeholder="예: b677321d18c345428eece748ce04e9de"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Notion 데이터베이스 URL에서 ID를 복사하세요
            </p>
          </div>

          <div>
            <label
              htmlFor="project-description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              설명
            </label>
            <textarea
              id="project-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 resize-none"
              placeholder="프로젝트 설명 (선택사항)"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              취소
            </Button>
            <Button
              type="submit"
              loading={isPending}
              disabled={!title.trim() || !notionDbId.trim()}
            >
              {mode === 'create' ? '만들기' : '저장'}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

// Delete Confirmation Modal
interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project;
}

function DeleteConfirmModal({ isOpen, onClose, project }: DeleteConfirmModalProps) {
  const deleteProject = useDeleteProject();

  const handleDelete = useCallback(async () => {
    if (!project) return;

    try {
      await deleteProject.mutateAsync(project.id);
      onClose();
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  }, [project, deleteProject, onClose]);

  if (!isOpen || !project) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white dark:bg-gray-900 rounded-xl shadow-2xl m-4 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            프로젝트 삭제
          </h2>
        </div>

        <p className="text-gray-600 dark:text-gray-400 mb-6">
          <strong className="text-gray-900 dark:text-gray-100">{project.title}</strong>
          {' '}프로젝트를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
        </p>

        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            취소
          </Button>
          <Button
            variant="primary"
            onClick={handleDelete}
            loading={deleteProject.isPending}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
          >
            삭제
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default ProjectManagement;
