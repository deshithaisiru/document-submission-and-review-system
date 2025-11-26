import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheckIcon, LogOutIcon, LayoutDashboardIcon } from 'lucide-react';
import { Button } from './Button';
interface StaffLayoutProps {
  children: React.ReactNode;
}
export function StaffLayout({
  children
}: StaffLayoutProps) {
  const {
    user,
    logout
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = () => {
    logout();
    navigate('/staff/login');
  };
  const isActive = (path: string) => location.pathname === path;
  return <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link to="/staff/dashboard" className="flex items-center gap-2">
                <div className="bg-indigo-600 p-2 rounded-lg">
                  <ShieldCheckIcon className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl text-gray-900">
                  Staff Portal
                </span>
              </Link>

              <div className="flex gap-1">
                <Link to="/staff/dashboard" className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/staff/dashboard') ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}>
                  <LayoutDashboardIcon className="w-4 h-4" />
                  Dashboard
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="bg-indigo-100 px-2 py-1 rounded text-xs font-medium text-indigo-700">
                  STAFF
                </div>
                <span className="text-sm text-gray-600">{user?.name}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOutIcon className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>;
}