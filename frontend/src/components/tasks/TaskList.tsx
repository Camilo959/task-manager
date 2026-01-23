// src/components/tasks/TaskList.tsx
import React, { useState, useEffect } from 'react';
import type { Task } from '../../types';
import { TaskStatus } from '../../types';
import { taskService } from '../../services/task.service';
import { useAuth } from '../../context/AuthContext';
import { TaskItem } from './TaskItem';
import { TaskForm } from './TaskForm';

export const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { user, isAdmin, isEditor } = useAuth();

  const loadTasks = async () => {
    try {
      const data = await taskService.getAllTasks();
      setTasks(data);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleCreate = async (taskData: { title: string; description: string; status: TaskStatus }) => {
    try {
      await taskService.createTask(taskData);
      await loadTasks();
      setShowForm(false);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleUpdate = async (id: string, taskData: Partial<Task>) => {
    try {
      await taskService.updateTask(id, taskData);
      await loadTasks();
      setEditingTask(null);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await taskService.deleteTask(id);
      await loadTasks();
    } catch (error) {
      console.error('Failed to delete task:', error);
      alert('Failed to delete task. You may not have permission.');
    }
  };

  const canEdit = (task: Task) => {
    return isAdmin || isEditor || task.createdBy === user?.id;
  };

  const canDelete = (task: Task) => {
    return isAdmin || task.createdBy === user?.id;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {isAdmin ? 'All Tasks' : isEditor ? 'Tasks' : 'My Tasks'}
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Create Task
        </button>
      </div>

      {showForm && (
        <TaskForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      {tasks.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
          No tasks found. Create your first task!
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onEdit={canEdit(task) ? () => setEditingTask(task) : undefined}
              onDelete={canDelete(task) ? () => handleDelete(task.id) : undefined}
              onUpdate={handleUpdate}
              isEditing={editingTask?.id === task.id}
              onCancelEdit={() => setEditingTask(null)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

