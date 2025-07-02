import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAdmin } from '@/contexts/AdminContext';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Award, 
  MessageSquare, 
  TrendingUp, 
  Mail, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

const AdminLayout = () => {
  const { user, logout } = useAdmin();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'Participants', path: '/admin/participants' },
    { icon: Award, label: 'Programs', path: '/admin/programs' },
    { icon: Calendar, label: 'Events', path: '/admin/events' },
    { icon: TrendingUp, label: 'Testimonials', path: '/admin/testimonials' },
    { icon: MessageSquare, label: 'Contact Forms', path: '/admin/contacts' },
    { icon: Mail, label: 'Newsletter', path: '/admin/newsletter' },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-border transform transition-transform duration-200 ease-in-out lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">I</span>
              </div>
              <div>
                <h2 className="font-bold text-foreground">IIN Admin</h2>
                <p className="text-xs text-muted-foreground">Admin Panel</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-primary text-white" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User info and logout */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-primary">
                  {user?.full_name?.charAt(0) || 'A'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.full_name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.role}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        <main className="min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;