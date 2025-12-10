import { api } from './api';
import { ApiResponse, LoginCredentials, LoginResponse, User } from '@/types';
import { MOCK_USERS, MOCK_PASSWORDS } from '@/config/auth';

export const authService = {
  // Login
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    // Mock authentication (tanpa database)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check if email is one of the special roles (admin, teknisi, manajer)
        const user = MOCK_USERS.find((u) => u.email === credentials.email);

        // If user is not in MOCK_USERS, check if email has @itpln.ac.id domain (mahasiswa/dosen)
        if (!user) {
          // Check if email ends with @itpln.ac.id
          if (credentials.email.endsWith('@itpln.ac.id') && 
              credentials.email !== 'admin@itpln.ac.id' && 
              credentials.email !== 'pimpinan@itpln.ac.id' &&
              credentials.email !== 'manajer@itpln.ac.id' &&
              credentials.email !== 'teknisi@itpln.ac.id') {
            // Check password (default password for mahasiswa)
            if (credentials.password !== 'mahasiswa123') {
              reject({
                success: false,
                error: 'Password salah',
                message: 'Password default untuk mahasiswa/dosen adalah: mahasiswa123',
              });
              return;
            }

            // Create mahasiswa user
            const mahasiswaUser: User = {
              id: `mhs-${Date.now()}`,
              name: credentials.email.split('@')[0].replace(/\./g, ' ').toUpperCase(),
              email: credentials.email,
              role: 'mahasiswa',
              department: 'Mahasiswa/Dosen',
              avatar: undefined,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };

            // Generate mock token
            const mockToken = `mock-token-${mahasiswaUser.id}-${Date.now()}`;

            // Success response
            const response: LoginResponse = {
              success: true,
              data: {
                accessToken: mockToken,
                refreshToken: `refresh-${mockToken}`,
                expiresIn: 3600,
              },
              user: mahasiswaUser,
            };

            // Store token and user in localStorage
            localStorage.setItem('accessToken', mockToken);
            localStorage.setItem('user', JSON.stringify(mahasiswaUser));

            resolve(response);
            return;
          } else {
            // Email not found and not @ac.id domain
            reject({
              success: false,
              error: 'Email tidak ditemukan',
              message: 'User dengan email tersebut tidak terdaftar. Gunakan email @itpln.ac.id untuk akses mahasiswa/dosen.',
            });
            return;
          }
        }

        // Check password for special roles
        const correctPassword = MOCK_PASSWORDS[credentials.email];
        if (credentials.password !== correctPassword) {
          reject({
            success: false,
            error: 'Password salah',
            message: 'Password yang Anda masukkan tidak sesuai',
          });
          return;
        }

        // Generate mock token
        const mockToken = `mock-token-${user.id}-${Date.now()}`;

        // Success response
        const response: LoginResponse = {
          success: true,
          data: {
            accessToken: mockToken,
            refreshToken: `refresh-${mockToken}`,
            expiresIn: 3600, // 1 hour
          },
          user: user,
        };

        // Store token and user in localStorage
        localStorage.setItem('accessToken', mockToken);
        localStorage.setItem('user', JSON.stringify(user));

        resolve(response);
      }, 800); // Simulate network delay
    });
  },

  // Logout
  logout: async (): Promise<ApiResponse> => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    return Promise.resolve({ success: true, data: null });
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<LoginResponse> => {
    return api.post<LoginResponse>('/auth/refresh', { refreshToken });
  },

  // Get current user
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    // Get user from localStorage
    const userStr = localStorage.getItem('user');
    
    if (!userStr) {
      return Promise.reject({
        success: false,
        error: 'Not authenticated',
        message: 'No user found in session',
      });
    }

    try {
      const user = JSON.parse(userStr) as User;
      return Promise.resolve({
        success: true,
        data: user,
      });
    } catch (error) {
      return Promise.reject({
        success: false,
        error: 'Invalid session',
        message: 'Failed to parse user data',
      });
    }
  },

  // Change password
  changePassword: async (oldPassword: string, newPassword: string): Promise<ApiResponse> => {
    return api.post<ApiResponse>('/auth/change-password', {
      oldPassword,
      newPassword,
    });
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  // Get stored user
  getStoredUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  },
};
