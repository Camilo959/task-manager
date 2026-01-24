// src/components/layout/Sidebar.tsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    {
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
        </svg>
      ),
      label: 'Tasks',
      path: '/tasks',
      show: true
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
        </svg>
      ),
      label: 'Users',
      path: '/users',
      show: isAdmin
    }
  ];

  return (
    <aside className="w-64 border-r border-[#dce0e5] dark:border-r-gray-800 bg-white dark:bg-[#111921] hidden md:flex flex-col justify-between p-4 shrink-0">
      <div className="flex flex-col gap-6">
        {/* Main Navigation */}
        <div className="flex flex-col gap-2">
          {menuItems.map((item) => (
            item.show && (
              <div
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                  isActive(item.path)
                    ? 'bg-[#368ce2]/10 text-[#368ce2]'
                    : 'hover:bg-[#f0f2f4] dark:hover:bg-gray-800 text-[#111417] dark:text-gray-300'
                }`}
              >
                {item.icon}
                <p className="text-sm font-semibold leading-normal">{item.label}</p>
              </div>
            )
          ))}
        </div>
      </div>

      {/* Storage Usage */}
      <div className="bg-[#368ce2]/5 rounded-xl p-4">
        <p className="text-xs text-[#647587] dark:text-gray-400 mb-2">Storage Usage</p>
        <div className="w-full bg-[#dce0e5] dark:bg-gray-700 h-1.5 rounded-full mb-2">
          <div className="bg-[#368ce2] h-1.5 rounded-full w-[65%]"></div>
        </div>
        <p className="text-[10px] text-[#368ce2] font-bold">65% OF 10GB USED</p>
      </div>
    </aside>
  );
};