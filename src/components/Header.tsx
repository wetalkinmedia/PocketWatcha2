import React from 'react';
import { LogIn, LogOut, User, GraduationCap, CreditCard as Edit, LayoutDashboard, Shield } from 'lucide-react';

interface HeaderProps {
  isAuthenticated?: boolean;
  user?: { firstName: string; lastName: string } | null;
  onLoginClick?: () => void;
  onLogoutClick?: () => void;
  onCoursesClick?: () => void;
  onAuthoringClick?: () => void;
  onDashboardClick?: () => void;
  onAdminClick?: () => void;
}

export function Header({ isAuthenticated = false, user, onLoginClick, onLogoutClick, onCoursesClick, onAuthoringClick, onDashboardClick, onAdminClick }: HeaderProps) {
  return (
    <div className="bg-gradient-to-br from-blue-400 via-blue-500 to-cyan-400 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-10"></div>

      {/* Title at the top */}
      <div className="relative z-10 text-center pt-6 pb-3">
        <h1 className="text-2xl md:text-3xl font-bold mb-1 drop-shadow-lg">
          💰 Smart Money Allocator
        </h1>
        <p className="text-sm md:text-base opacity-90 font-medium">
          Turn your money into a well-balanced financial smoothie!
        </p>
      </div>

      {/* Buttons below title */}
      <div className="relative z-20 pb-4 px-4">
        <div className="flex items-center justify-center flex-wrap gap-2">
          {isAuthenticated && onDashboardClick && (
            <button
              onClick={onDashboardClick}
              className="flex items-center gap-1 bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1.5 rounded-full transition-all duration-300 text-sm"
            >
              <LayoutDashboard size={14} />
              <span className="hidden md:inline">Dashboard</span>
            </button>
          )}
          {isAuthenticated && onAdminClick && (
            <button
              onClick={onAdminClick}
              className="flex items-center gap-1 bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1.5 rounded-full transition-all duration-300 text-sm"
            >
              <Shield size={14} />
              <span className="hidden md:inline">Admin</span>
            </button>
          )}
          {isAuthenticated && onAuthoringClick && (
            <button
              onClick={onAuthoringClick}
              className="flex items-center gap-1 bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1.5 rounded-full transition-all duration-300 text-sm"
            >
              <Edit size={14} />
              <span className="hidden md:inline">Create Course</span>
            </button>
          )}
          <button
            onClick={onCoursesClick}
            className="flex items-center gap-1 bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1.5 rounded-full transition-all duration-300 text-sm"
          >
            <GraduationCap size={14} />
            <span className="hidden md:inline">AI Courses</span>
          </button>

        {isAuthenticated ? (
          <>
            <div className="flex items-center gap-1 bg-green-500 bg-opacity-90 px-3 py-1.5 rounded-full shadow-lg text-sm">
              <User size={14} className="text-white" />
              <span className="font-semibold hidden lg:inline">
                {user?.firstName ? `${user.firstName} ${user.lastName}` : 'Logged In'}
              </span>
            </div>
            <button
              onClick={onLogoutClick}
              className="flex items-center gap-1 bg-red-500 bg-opacity-80 hover:bg-opacity-90 px-3 py-1.5 rounded-full transition-all duration-300 text-sm"
            >
              <LogOut size={14} />
              <span className="hidden md:inline">Logout</span>
            </button>
          </>
        ) : (
          <button
            onClick={onLoginClick}
            className="flex items-center gap-1 bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1.5 rounded-full transition-all duration-300 text-sm"
          >
            <LogIn size={14} />
            <span>Login</span>
          </button>
        )}
        </div>
      </div>

      <div className="absolute -top-4 -right-4 w-24 h-24 bg-white bg-opacity-20 rounded-full blur-xl"></div>
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white bg-opacity-10 rounded-full blur-2xl"></div>
    </div>
  );
}