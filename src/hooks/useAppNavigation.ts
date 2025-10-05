import { useNavigate, useLocation } from 'react-router-dom';
import { APP_ROUTES, type AppRoute } from '../types/routes';

/**
 * Hook para navegación tipada y simplificada
 * Principio Single Responsibility: Solo maneja navegación
 */
export const useAppNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateTo = (route: AppRoute, replace = false) => {
    navigate(route, { replace });
  };

  const goBack = () => {
    navigate(-1);
  };

  const goForward = () => {
    navigate(1);
  };

  const getCurrentRoute = (): AppRoute => {
    return location.pathname as AppRoute;
  };

  const isCurrentRoute = (route: AppRoute): boolean => {
    return location.pathname === route;
  };

  return {
    navigateTo,
    goBack,
    goForward,
    getCurrentRoute,
    isCurrentRoute,
    // Métodos de conveniencia para rutas específicas
    toDashboard: () => navigateTo(APP_ROUTES.DASHBOARD),
    toPatients: () => navigateTo(APP_ROUTES.PATIENTS),
    toMedicalRecords: () => navigateTo(APP_ROUTES.MEDICAL_RECORDS),
    toSales: () => navigateTo(APP_ROUTES.SALES),
    toInventory: () => navigateTo(APP_ROUTES.INVENTORY),
    toCashClose: () => navigateTo(APP_ROUTES.CASH_CLOSE),
    toEmployees: () => navigateTo(APP_ROUTES.EMPLOYEES),
    toReports: () => navigateTo(APP_ROUTES.REPORTS),
    toSettings: () => navigateTo(APP_ROUTES.SETTINGS),
    toProfile: () => navigateTo(APP_ROUTES.PROFILE),
    toMySales: () => navigateTo(APP_ROUTES.MY_SALES),
  };
};