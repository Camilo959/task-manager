// src/components/tasks/TaskForm.tsx
import React, { useState, useEffect } from 'react';
import type { User } from '../../types';
import { TaskStatus } from '../../types';
import { userService } from '../../services/user.service';
import { useAuth } from '../../context/AuthContext';

type TaskStatusType = typeof TaskStatus[keyof typeof TaskStatus];

interface TaskFormProps {
  initialData?: {
    title: string;
    description: string;
    status: TaskStatusType;
    assignedTo?: string;
  };
  onSubmit: (data: { 
    title: string; 
    description: string; 
    status: TaskStatusType;
    assignedTo?: string;
  }) => void;
  onCancel: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [status, setStatus] = useState<TaskStatusType>(initialData?.status || TaskStatus.TODO);
  const [assignedTo, setAssignedTo] = useState(initialData?.assignedTo || '');
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  
  const { isAdmin, isEditor } = useAuth();
  const canAssignTasks = isAdmin || isEditor;

  useEffect(() => {
    // Solo cargar usuarios si puede asignar tareas
    if (canAssignTasks) {
      loadUsers();
    }
  }, [canAssignTasks]);

  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
      const data = await userService.getAllUsers();
      setUsers(data.filter(u => u.isActive !== false)); // Solo usuarios activos
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({ 
      title, 
      description, 
      status,
      assignedTo: assignedTo || undefined // Enviar undefined si está vacío
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-xl font-semibold mb-4">
        {initialData ? 'Edit Task' : 'New Task'}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter task title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe the task..."
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={TaskStatus.TODO}>To Do</option>
              <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
              <option value={TaskStatus.DONE}>Done</option>
            </select>
          </div>

          {/* Solo ADMIN y EDITOR pueden asignar tareas */}
          {canAssignTasks && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assign to
              </label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loadingUsers}
              >
                <option value="">Unassigned</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.role})
                  </option>
                ))}
              </select>
              {loadingUsers && (
                <p className="text-xs text-gray-500 mt-1">Loading users...</p>
              )}
            </div>
          )}
        </div>

        <div className="flex space-x-2 pt-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            {initialData ? 'Update Task' : 'Create Task'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};