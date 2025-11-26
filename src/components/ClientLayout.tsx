import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FileTextIcon, UploadIcon, LogOutIcon, LayoutDashboardIcon } from 'lucide-react';
import { Button } from './Button';
interface ClientLayoutProps {
  children: React.ReactNode;
}
export function ClientLayout({
  children
}: ClientLayoutProps) {
  const {
    user,
    logout
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const isActive = (path: string) => location.pathname === path;
  return <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link to="/client/dashboard" className="flex items-center gap-2">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <FileTextIcon className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl text-gray-900">
                  DocSubmit
                </span>
              </Link>

              <div className="flex gap-1">
                <Link to="/client/dashboard" className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/client/dashboard') ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}>
                  <LayoutDashboardIcon className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link to="/client/upload" className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/client/upload') ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}>
                  <UploadIcon className="w-4 h-4" />
                  Upload
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user?.name}</span>
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