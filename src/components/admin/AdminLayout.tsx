import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Users, MessageSquare, Award, Mail, UserPlus, LogOut } from 'lucide-react';

const navItems = [
  { to: '/admin/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
  { to: '/admin/participants', icon: <Users className="w-5 h-5" />, label: 'Participants' },
  { to: '/admin/testimonials', icon: <MessageSquare className="w-5 h-5" />, label: 'Testimonials' },
  { to: '/admin/programs', icon: <Award className="w-5 h-5" />, label: 'Programs' },
  { to: '/admin/contacts', icon: <Mail className="w-5 h-5" />, label: 'Contacts' },
  { to: '/admin/newsletter', icon: <UserPlus className="w-5 h-5" />, label: 'Subscribers' },
];

const AdminLayout: React.FC = () => {
  const { admin, logout } = useAdmin();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen flex font-sans bg-gray-50">
      {/* Sidebar */}
      <aside className="sticky top-0 left-0 h-screen flex flex-col w-60 bg-white border-r border-gray-200 shadow-sm py-8 px-4 z-30 animate-fadein">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-10 px-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl tracking-tight">I</span>
          </div>
          <span className="text-lg font-semibold text-gray-800 tracking-tight">Impact Admin</span>
        </div>
        {/* Nav */}
        <nav className="flex-1 flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-all duration-150 text-sm
                ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'}
                `
              }
            >
              <span className="transition-transform duration-150 group-hover:scale-110">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <Button size="sm" variant="ghost" className="w-full flex items-center gap-2 text-red-500 justify-start mt-8 font-medium hover:bg-red-50 transition-all duration-150" onClick={handleLogout}>
          <LogOut className="w-5 h-5" />
          <span>Log out</span>
        </Button>
      </aside>
      {/* Main area */}
      <div className="flex-1 flex flex-col min-h-screen z-10 animate-slidein">
        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-white shadow-sm flex items-center justify-between px-8 py-4 border-b border-gray-100 animate-fadein-down">
          <div className="text-xl font-semibold text-gray-800 tracking-tight">Dashboard</div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="font-medium text-gray-700 text-sm">{admin?.full_name || admin?.username}</span>
              <span className="text-xs text-gray-400">Admin</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-lg font-bold">
              {admin?.full_name?.[0] || admin?.username?.[0] || 'A'}
            </div>
          </div>
        </header>
        {/* Main content */}
        <main className="flex-1 pl-8 pr-2 py-4 md:pl-10 md:pr-4 md:py-6 bg-gray-50">
          <div className="w-full animate-fadein-up">
            <Outlet />
          </div>
        </main>
      </div>
      {/* Animations */}
      <style>{`
        .animate-fadein {
          animation: fadein 0.7s cubic-bezier(0.4,0,0.2,1);
        }
        @keyframes fadein {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: none; }
        }
        .animate-slidein {
          animation: slidein 0.7s cubic-bezier(0.4,0,0.2,1);
        }
        @keyframes slidein {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: none; }
        }
        .animate-fadein-down {
          animation: fadein-down 0.7s cubic-bezier(0.4,0,0.2,1);
        }
        @keyframes fadein-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: none; }
        }
        .animate-fadein-up {
          animation: fadein-up 0.7s cubic-bezier(0.4,0,0.2,1);
        }
        @keyframes fadein-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;