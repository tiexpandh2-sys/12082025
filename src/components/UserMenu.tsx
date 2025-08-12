import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, Settings, Upload, Lock } from 'lucide-react';
import { getCurrentUser, clearUserSession } from '../utils/auth';
import LogoUpload from './auth/LogoUpload';
import ChangePasswordForm from './auth/ChangePasswordForm';

interface UserMenuProps {
  onLogout: () => void;
  onLogoUpdate: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ onLogout, onLogoUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoUpload, setShowLogoUpload] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const user = getCurrentUser();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowLogoUpload(false);
        setShowChangePassword(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    clearUserSession();
    onLogout();
  };

  const handleLogoUploadComplete = () => {
    onLogoUpdate();
    setShowLogoUpload(false);
    setIsOpen(false);
  };

  const handlePasswordChangeSuccess = () => {
    setShowChangePassword(false);
    setIsOpen(false);
    alert('Senha alterada com sucesso!');
  };

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
      >
        <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
          <User className="h-5 w-5 text-green-700" />
        </div>
        <span className="text-sm font-medium">{user.name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-200">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
            {user.role === 'admin' && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mt-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 mt-1">
                Administrador
              </span>
            )}
          </div>

          <button
            onClick={() => setShowChangePassword(!showChangePassword)}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
          >
            <Lock className="h-4 w-4 mr-2" />
            Alterar Senha
          </button>

          {user.role === 'admin' && (
            <button
              onClick={() => setShowLogoUpload(!showLogoUpload)}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
            >
              <Upload className="h-4 w-4 mr-2" />
              Gerenciar Logo
            </button>
          )}

          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </button>

          {showLogoUpload && user.role === 'admin' && (
            <div className="border-t border-gray-200 p-4">
              <LogoUpload onLogoUpdate={handleLogoUploadComplete} />
            </div>
          )}
        )
        }
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePassword && (
        <ChangePasswordForm
          onClose={() => setShowChangePassword(false)}
          onSuccess={handlePasswordChangeSuccess}
        />
      )}
    </div>
  );
};

export default UserMenu;
  )
}