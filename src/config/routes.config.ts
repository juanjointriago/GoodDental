import {
  LayoutDashboard,
  Users,
  FileText,
  ShoppingCart,
  Package,
  DollarSign,
  UserCheck,
  BarChart3,
  Settings,
  User,
  TrendingUp,
} from 'lucide-react';
import { type RouteConfig, APP_ROUTES } from '../types/routes';
import { Dashboard } from '../components/dashboard/Dashboard';
import { PatientsTable } from '../components/patients/PatientsTable';
import { UsersTable } from '../components/users/UsersTable';
import { MedicalRecords } from '../components/medical/MedicaRecords';
import { Sales } from '../components/sales/Sales';
import { Inventory } from '../components/inventory/Inventory';
import { CashClose } from '../components/finance/CashClose';
import { Employees } from '../components/employees/Employees';
import { Reports } from '../components/reports/Reports';
import { Settings as SettingsPage } from '../components/settings/Settings';
import { UserProfile } from '../components/profile/UserProfile';
import { MySales } from '../components/profile/MySales';
import { FirebaseTestComponent } from '../components/FirebaseTestComponent';

export const ROUTE_CONFIGS: RouteConfig[] = [
  {
    path: APP_ROUTES.DASHBOARD,
    element: Dashboard,
    roles: ['administrator', 'employee'],
    title: 'Dashboard',
    icon: LayoutDashboard,
    showInNav: true,
  },
  {
    path: APP_ROUTES.PATIENTS,
    element: PatientsTable,
    roles: ['administrator', 'employee'],
    title: 'Pacientes',
    icon: Users,
    showInNav: true,
  },
  {
    path: APP_ROUTES.USERS,
    element: UsersTable,
    roles: ['administrator', 'employee'],
    title: 'Usuarios',
    icon: UserCheck,
    showInNav: true,
  },
  {
    path: APP_ROUTES.MEDICAL_RECORDS,
    element: MedicalRecords,
    roles: ['administrator', 'employee'],
    title: 'Historiales Médicos',
    icon: FileText,
    showInNav: true,
  },
  {
    path: APP_ROUTES.SALES,
    element: Sales,
    roles: ['administrator', 'employee'],
    title: 'Ventas',
    icon: ShoppingCart,
    showInNav: true,
  },
  {
    path: APP_ROUTES.INVENTORY,
    element: Inventory,
    roles: ['administrator', 'employee'],
    title: 'Inventario',
    icon: Package,
    showInNav: true,
  },
  {
    path: APP_ROUTES.CASH_CLOSE,
    element: CashClose,
    roles: ['administrator'],
    title: 'Cierre de Caja',
    icon: DollarSign,
    showInNav: true,
  },
  {
    path: APP_ROUTES.EMPLOYEES,
    element: Employees,
    roles: ['administrator'],
    title: 'Empleados',
    icon: UserCheck,
    showInNav: true,
  },
  {
    path: APP_ROUTES.REPORTS,
    element: Reports,
    roles: ['administrator'],
    title: 'Reportes',
    icon: BarChart3,
    showInNav: true,
  },
  {
    path: APP_ROUTES.SETTINGS,
    element: SettingsPage,
    roles: ['administrator'],
    title: 'Configuraciones',
    icon: Settings,
    showInNav: true,
  },
  {
    path: APP_ROUTES.PROFILE,
    element: UserProfile,
    roles: ['administrator', 'employee'],
    title: 'Mi Perfil',
    icon: User,
    showInNav: false, // Se muestra en dropdown de usuario
  },
  {
    path: APP_ROUTES.MY_SALES,
    element: MySales,
    roles: ['administrator', 'employee'],
    title: 'Mis Ventas',
    icon: TrendingUp,
    showInNav: false, // Se muestra en dropdown de usuario
  },
  {
    path: APP_ROUTES.FIREBASE_TEST,
    element: FirebaseTestComponent,
    roles: ['administrator'],
    title: 'Firebase Test',
    icon: Settings,
    showInNav: true, // Mostrar en desarrollo
  },
];