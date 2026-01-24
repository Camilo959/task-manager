// src/components/users/UserModal.tsx
import React, { useState } from 'react';
import type { User } from '../../types';
import { UserRole } from '../../types';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    email: string;
    password?: string;
    name: string;
    role: UserRole;
  }) => void;
  initialData?: User;
  title: string;
}

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title
}) => {
  const [formData, setFormData] = useState({
    email: initialData?.email || '',
    password: '',
    name: initialData?.name || '',
    role: initialData?.role || UserRole.USER
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data: any = {
      email: formData.email,
      name: formData.name,
      role: formData.role
    };
    
    if (formData.password || !initialData) {
      data.password = formData.password;
    }
    
    onSubmit(data);
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
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-[#111417] dark:text-gray-200 mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-lg text-[#111417] dark:text-white focus:outline-0 focus:ring-2 focus:ring-[#368ce2]/20 border border-[#dce0e5] dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-[#368ce2] h-12 px-4 text-base"
                placeholder="Enter full name"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#111417] dark:text-gray-200 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-lg text-[#111417] dark:text-white focus:outline-0 focus:ring-2 focus:ring-[#368ce2]/20 border border-[#dce0e5] dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-[#368ce2] h-12 px-4 text-base"
                placeholder="user@example.com"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[#111417] dark:text-gray-200 mb-2">
                Password {initialData && <span className="text-xs text-[#647587]">(leave empty to keep current)</span>}
                {!initialData && <span className="text-red-500">*</span>}
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full rounded-lg text-[#111417] dark:text-white focus:outline-0 focus:ring-2 focus:ring-[#368ce2]/20 border border-[#dce0e5] dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-[#368ce2] h-12 px-4 text-base"
                placeholder="••••••••"
                required={!initialData}
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-[#111417] dark:text-gray-200 mb-2">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                className="w-full rounded-lg text-[#111417] dark:text-white focus:outline-0 focus:ring-2 focus:ring-[#368ce2]/20 border border-[#dce0e5] dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-[#368ce2] h-12 px-4 text-base"
              >
                <option value={UserRole.USER}>User - Basic access</option>
                <option value={UserRole.EDITOR}>Editor - Can manage tasks</option>
                <option value={UserRole.ADMIN}>Admin - Full access</option>
              </select>
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
                {initialData ? 'Update User' : 'Create User'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};