import bcrypt from 'bcryptjs';
import { User } from '../types/auth';

const SALT_ROUNDS = 12;

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('A senha deve ter no mínimo 8 caracteres');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('A senha deve conter pelo menos uma letra maiúscula');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('A senha deve conter pelo menos uma letra minúscula');
  }
  
  if (!/\d/.test(password)) {
    errors.push('A senha deve conter pelo menos um número');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const generateUserId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

export const getStoredUsers = (): User[] => {
  const users = localStorage.getItem('loteamentos-users');
  return users ? JSON.parse(users) : [];
};

export const storeUser = (user: User): void => {
  const users = getStoredUsers();
  users.push(user);
  localStorage.setItem('loteamentos-users', JSON.stringify(users));
};

export const findUserByEmail = (email: string): User | null => {
  const users = getStoredUsers();
  return users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
};

export const getCurrentUser = (): User | null => {
  const userSession = localStorage.getItem('loteamentos-session');
  if (!userSession) return null;
  
  try {
    const session = JSON.parse(userSession);
    if (session.expiresAt && new Date(session.expiresAt) < new Date()) {
      localStorage.removeItem('loteamentos-session');
      return null;
    }
    return session.user;
  } catch {
    return null;
  }
};

export const setUserSession = (user: User): void => {
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours session
  
  const session = {
    user,
    expiresAt: expiresAt.toISOString()
  };
  
  localStorage.setItem('loteamentos-session', JSON.stringify(session));
};

export const clearUserSession = (): void => {
  localStorage.removeItem('loteamentos-session');
};

export const getCompanyLogo = (): string | null => {
  return localStorage.getItem('loteamentos-company-logo');
};

export const setCompanyLogo = (logoDataUrl: string): void => {
  localStorage.setItem('loteamentos-company-logo', logoDataUrl);
};

// Create default admin user if none exists
export const initializeDefaultAdmin = async (): Promise<void> => {
  const users = getStoredUsers();
  if (users.length === 0) {
    const hashedPassword = await hashPassword('Expandh@123');
    
    // Create company users
    const companyUsers: User[] = [
      {
        id: generateUserId(),
        name: 'TI Expandh',
        email: 'ti@expandhurbanismo.com.br',
        password: hashedPassword,
        role: 'admin',
        createdAt: new Date().toISOString()
      },
      {
        id: generateUserId(),
        name: 'Jorge Pereira',
        email: 'jorgepereira@expandhurbanismo.com.br',
        password: hashedPassword,
        role: 'admin',
        createdAt: new Date().toISOString()
      },
      {
        id: generateUserId(),
        name: 'M. Puntel',
        email: 'mpuntel@expandhurbanismo.com.br',
        password: hashedPassword,
        role: 'admin',
        createdAt: new Date().toISOString()
      }
    ];
    
    companyUsers.forEach(user => storeUser(user));
  }
};

export const updateUserPassword = async (userId: string, newPassword: string): Promise<boolean> => {
  try {
    const users = getStoredUsers();
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      return false;
    }
    
    const hashedPassword = await hashPassword(newPassword);
    users[userIndex].password = hashedPassword;
    
    localStorage.setItem('loteamentos-users', JSON.stringify(users));
    return true;
  } catch (error) {
    return false;
  }
};

export const verifyCurrentPassword = async (userId: string, currentPassword: string): Promise<boolean> => {
  try {
    const users = getStoredUsers();
    const user = users.find(user => user.id === userId);
    
    if (!user) {
      return false;
    }
    
    return await comparePassword(currentPassword, user.password);
  } catch (error) {
    return false;
  }
};

export const createDefaultAdmin = async (): Promise<void> => {
  const users = getStoredUsers();
  if (users.length === 0) {
    const hashedPassword = await hashPassword('admin123');
    const adminUser: User = {
      id: generateUserId(),
      name: 'Administrador',
      email: 'admin@loteamentos.com',
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date().toISOString()
    };
    storeUser(adminUser);
  }
};