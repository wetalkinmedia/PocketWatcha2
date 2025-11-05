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
    <div className="bg-gradient-to-br from-blue-400 via-blue-500 to-cyan-400 p-8 text-center text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-10"></div>
      
      {/* Login/Logout Button */}
      <div className="absolute top-4 right-4 z-20">
        <div className="flex items-center gap-3">
          {isAuthenticated && onDashboardClick && (
            <button
              onClick={onDashboardClick}
              className="flex items-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-full transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
            >
              <LayoutDashboard size={16} />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
          )}
          {isAuthenticated && onAdminClick && (
            <button
              onClick={onAdminClick}
              className="flex items-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-full transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
            >
              <Shield size={16} />
              <span className="hidden sm:inline">Admin</span>
            </button>
          )}
          {isAuthenticated && onAuthoringClick && (
            <button
              onClick={onAuthoringClick}
              className="flex items-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-full transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
            >
              <Edit size={16} />
              <span className="hidden sm:inline">Create Course</span>
            </button>
          )}
          <button
            onClick={onCoursesClick}
            className="flex items-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-full transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
          >
            <GraduationCap size={16} />
            <span className="hidden sm:inline">AI Courses</span>
          </button>
          
        {isAuthenticated ? (
          <>
            <div className="flex items-center gap-2 bg-green-500 bg-opacity-90 px-4 py-2 rounded-full shadow-lg">
              <User size={20} className="text-white" />
              <span className="text-sm font-semibold">
                {user?.firstName ? `${user.firstName} ${user.lastName}` : 'Logged In'}
              </span>
            </div>
            <button
              onClick={onLogoutClick}
              className="flex items-center gap-2 bg-red-500 bg-opacity-80 hover:bg-opacity-90 px-4 py-2 rounded-full transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </>
        ) : (
          <button
            onClick={onLoginClick}
            className="flex items-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-full transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
          >
            <LogIn size={20} />
            <span>Login</span>
          </button>
        )}
        </div>
      </div>

      <div className="relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 drop-shadow-lg">
          💰 Smart Money Allocator
        </h1>
        <p className="text-xl md:text-2xl opacity-90 font-medium">
          Turn your money into a well-balanced financial smoothie!
        </p>
      </div>
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-white bg-opacity-20 rounded-full blur-xl"></div>
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white bg-opacity-10 rounded-full blur-2xl"></div>
    </div>
  );
}