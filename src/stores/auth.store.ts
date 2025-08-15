import type { StateCreator } from "zustand";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { AuthService } from "../services/auth.service";

export type Role = 'administrator' | 'employee' | 'doctor' | 'customer';

export interface IUser {
  id: string;
  email: string;
  name: string;
  password: string;
  role: Role;
  avatar?: string;
  photoURL?: string;
  address:string;
  bornDate: number;
  cc: string;
  phone: string;
  city: string;
  country: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: number;
  updatedAt: number;
}

interface AuthState {
  user: IUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Omit<IUser, 'id' | 'createdAt' | 'lastLogin'>) => Promise<void>;
  logout: () => void;
  setUser: (user: IUser | null) => void;
  setLoading: (loading: boolean) => void;
  checkAuth: () => Promise<void>;

}

// Mock users para demo
// const mockUsers: User[] = [
//   {
//     id: '1',
//     email: 'admin@goodent.com',
//     password: 'admin123',
//     name: 'Dr. María González',
//     role: 'administrator',
//     avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
//     isActive: true,
//     createdAt: new Date('2024-01-01'),
//     lastLogin: new Date(),
//   },
//   {
//     id: '2',
//     email: 'empleado@goodent.com',
//     password: 'empleado123',
//     name: 'Ana Rodríguez',
//     role: 'employee',
//     avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
//     isActive: true,
//     createdAt: new Date('2024-01-15'),
//     lastLogin: new Date(),
//   },
// ];

export const storeAPI: StateCreator<AuthState, []> = (set, get) => ({

      user: null,
      loading: false,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
          
          const result = await AuthService.login(email, password);
          console.debug('auth.store/StoreAPI/loginUser ', { result });
          if (result.isAuthenticated && result.user) {
            set({ loading: true });
            set({ isAuthenticated: true, user: result.user });
            console.debug("USUARIO almacenado", get().user);
            set({ loading: false });
            
        } else {
            set({ isAuthenticated: false, user: undefined });
            set({ loading: false });
            throw new Error(result.message || 'Error al iniciar sesión');
        }
      },

      register: async (userData) => {
        await AuthService.signUp(userData);
      },

      logout: () => {
         set({ 
          user: null, 
          isAuthenticated: false, 
          loading: false 
        });
        AuthService.logout();
       
      },

      setUser: (user) => {
        set({ 
          user, 
          isAuthenticated: !!user 
        });
      },

      setLoading: (loading) => {
        set({ loading });
      },

      checkAuth: async () => {
        console.debug('start checkAuthStatus=>')
        const user = await AuthService.checkStatus();
        if (user) {
            // console.debug('✅Authorized', JSON.stringify(user))
            set({ isAuthenticated: true, user });
            
        } else {
            // console.debug('❌Unauthorized', JSON.stringify(user))
            set({ isAuthenticated: false, user: undefined });
            set({ loading: false });
        }
       
      },

})


export const useAuthStore = create<AuthState>()(
    devtools(
        persist(
            (storeAPI), {
            name: 'auth-store'
        }
        ))
)