// src/components/tasks/TaskModal.tsx
import React, { useState, useEffect } from 'react';
import type{ User } from '../../types';
import { TaskStatus } from '../../types';
import { userService } from '../../services/user.service';
import { useAuth } from '../../context/AuthContext';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
    status: TaskStatus;
    assignedTo?: string;
  }) => void;
  initialData?: {
    title: string;
    description: string;
    status: TaskStatus;
    assignedTo?: string;
  };
  title: string;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title
}) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    status: initialData?.status || TaskStatus.TODO,
    assignedTo: initialData?.assignedTo || ''
  });
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  
  const { isAdmin, isEditor } = useAuth();
  const canAssignTasks = isAdmin || isEditor;

  useEffect(() => {
    if (canAssignTasks && isOpen) {
      loadUsers();
    }
  }, [canAssignTasks, isOpen]);

  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
      const data = await userService.getAllUsers();
      setUsers(data.filter(u => u.isActive !== false));
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      assignedTo: formData.assignedTo || undefined
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-2xl w-full border border-[#dce0e5] dark:border-gray-800">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#dce0e5] dark:border-gray-800">
            <h2 className="text-xl font-bold text-[#111417] dark:text-white">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-[#647587] hover:text-[#111417] dark:hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-[#111417] dark:text-gray-200 mb-2">
                Task Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full rounded-lg text-[#111417] dark:text-white focus:outline-0 focus:ring-2 focus:ring-[#368ce2]/20 border border-[#dce0e5] dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-[#368ce2] h-12 px-4 text-base"
                placeholder="Enter task title"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-[#111417] dark:text-gray-200 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full rounded-lg text-[#111417] dark:text-white focus:outline-0 focus:ring-2 focus:ring-[#368ce2]/20 border border-[#dce0e5] dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-[#368ce2] px-4 py-3 text-base resize-none"
                placeholder="Describe the task..."
                required
              />
            </div>

            {/* Status and Assign To */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-[#111417] dark:text-gray-200 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
                  className="w-full rounded-lg text-[#111417] dark:text-white focus:outline-0 focus:ring-2 focus:ring-[#368ce2]/20 border border-[#dce0e5] dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-[#368ce2] h-12 px-4 text-base"
                >
                  <option value={TaskStatus.TODO}>To Do</option>
                  <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                  <option value={TaskStatus.DONE}>Done</option>
                </select>
              </div>

              {/* Assign To */}
              {canAssignTasks && (
                <div>
                  <label className="block text-sm font-medium text-[#111417] dark:text-gray-200 mb-2">
                    Assign to
                  </label>
                  <select
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                    className="w-full rounded-lg text-[#111417] dark:text-white focus:outline-0 focus:ring-2 focus:ring-[#368ce2]/20 border border-[#dce0e5] dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-[#368ce2] h-12 px-4 text-base"
                    disabled={loadingUsers}
                  >
                    <option value="">Unassigned</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.role})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-medium text-[#647587] bg-[#f0f2f4] dark:bg-gray-800 rounded-lg hover:bg-[#dce0e5] dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 text-sm font-bold text-white bg-[#368ce2] rounded-lg hover:bg-[#368ce2]/90 transition-colors shadow-lg shadow-[#368ce2]/20"
              >
                {initialData ? 'Update Task' : 'Create Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};