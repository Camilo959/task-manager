// src/components/users/UserForm.tsx
import React, { useState } from 'react';
import type { User } from '../../types';
import { UserRole } from '../../types';

type UserRoleType = typeof UserRole[keyof typeof UserRole];

export interface CreateUserData {
  email: string;
  name: string;
  role: UserRoleType;
  password?: string;
}

interface UserFormProps {
  initialData?: User;
  onSubmit: (data: CreateUserData) => void;
  onCancel: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [email, setEmail] = useState(initialData?.email || '');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(initialData?.name || '');
  const [role, setRole] = useState(initialData?.role || UserRole.USER);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data: CreateUserData = { email, name, role };
    if (password || !initialData) {
      data.password = password;
    }
    
    onSubmit(data);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-xl font-semibold mb-4">
        {initialData ? 'Edit User' : 'New User'}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password {initialData && '(leave empty to keep current)'}
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required={!initialData}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value={UserRole.USER}>User</option>
            <option value={UserRole.EDITOR}>Editor</option>
            <option value={UserRole.ADMIN}>Admin</option>
          </select>
        </div>

        <div className="flex space-x-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            {initialData ? 'Update' : 'Create'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};