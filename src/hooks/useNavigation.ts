import { useMemo } from 'react';
import { useAuthStore } from '../stores/auth.store';
import { ROUTE_CONFIGS } from '../config/routes.config';
import { type NavigationItem } from '../types/routes';

/**
 * Hook para obtener elementos de navegación filtrados por rol
 * Principio Open/Closed: Abierto para extensión de nuevas rutas, cerrado para modificación
 */
export const useNavigation = () => {
  const { user } = useAuthStore();

  const navigationItems: NavigationItem[] = useMemo(() => {
    if (!user) return [];

    return ROUTE_CONFIGS
      .filter(route => 
        route.showInNav && 
        route.roles.includes(user.role) &&
        route.icon
      )
      .map(route => ({
        id: route.path.replace('/', ''),
        label: route.title,
        path: route.path,
        icon: route.icon!,
        roles: route.roles,
      }));
  }, [user]);

  const profileMenuItems: NavigationItem[] = useMemo(() => {
    if (!user) return [];

    return ROUTE_CONFIGS
      .filter(route => 
        !route.showInNav && 
        route.roles.includes(user.role) &&
        route.icon
      )
      .map(route => ({
        id: route.path.replace('/', ''),
        label: route.title,
        path: route.path,
        icon: route.icon!,
        roles: route.roles,
      }));
  }, [user]);

  return {
    navigationItems,
    profileMenuItems,
  };
};