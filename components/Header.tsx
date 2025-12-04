import { User } from '../app/page';
import { LogOut } from 'lucide-react';
import Image from 'next/image';

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'inside_sales':
        return 'bg-green-100 text-green-800';
      case 'bdm':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'inside_sales':
        return 'Inside Sales';
      case 'bdm':
        return 'BDM';
      default:
        return role;
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-25 h-19  flex items-center justify-center">
                  <Image src="/legacylogo.png" alt="Legacy Innovations" width={200} height={110}/>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <img
                src={user.picture || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="text-right">
                <p className="text-gray-900">{user.name}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${getRoleBadgeColor(user.role)}`}>
                  {getRoleLabel(user.role)}
                </span>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
           
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
