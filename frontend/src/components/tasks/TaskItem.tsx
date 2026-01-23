// src/components/tasks/TaskItem.tsx
import React from 'react';
import type { Task } from '../../types';
import { TaskStatus } from '../../types';
import { TaskForm } from './TaskForm';

interface TaskItemProps {
  task: Task;
  onEdit?: () => void;
  onDelete?: () => void;
  onUpdate: (id: string, data: Partial<Task>) => void;
  isEditing: boolean;
  onCancelEdit: () => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onEdit,
  onDelete,
  onUpdate,
  isEditing,
  onCancelEdit
}) => {
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.TODO:
        return 'bg-gray-100 text-gray-800';
      case TaskStatus.IN_PROGRESS:
        return 'bg-blue-100 text-blue-800';
      case TaskStatus.DONE:
        return 'bg-green-100 text-green-800';
    }
  };

  const formatStatus = (status: TaskStatus) => {
    return status.replace('_', ' ');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isEditing) {
    return (
      <TaskForm
        initialData={{
          title: task.title,
          description: task.description,
          status: task.status
        }}
        onSubmit={(data: Partial<Task>) => onUpdate(task.id, data)}
        onCancel={onCancelEdit}
      />
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-800 mb-1">{task.title}</h3>
          {/* Mostrar información del creador si está disponible */}
          {task.creator && (
            <p className="text-xs text-gray-500">
              Created by: <span className="font-medium">{task.creator.name}</span>
            </p>
          )}
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(task.status)}`}>
          {formatStatus(task.status)}
        </span>
      </div>
      
      <p className="text-gray-600 mb-4">{task.description}</p>
      
      {/* Mostrar asignado si existe */}
      {task.assignee && (
        <div className="mb-3 text-sm text-gray-600">
          <span className="font-medium">Assigned to:</span> {task.assignee.name}
        </div>
      )}
      
      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
        <div className="text-sm text-gray-500">
          <div>Created: {formatDate(task.createdAt)}</div>
          {task.updatedAt && task.updatedAt !== task.createdAt && (
            <div className="text-xs">Updated: {formatDate(task.updatedAt)}</div>
          )}
        </div>
        
        <div className="flex space-x-2">
          {onEdit && (
            <button
              onClick={onEdit}
              className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};