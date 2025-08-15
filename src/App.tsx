import React, { useEffect, useState } from 'react';
import { AuthPage } from './components/auth/AuthPage';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Dashboard } from './components/dashboard/Dashboard';
import { PatientsTable } from './components/patients/PatientsTable';
import { MedicalRecords } from './components/medical/MedicaRecords';
import { Sales } from './components/sales/Sales';
import { Inventory } from './components/inventory/Inventory';
import { CashClose } from './components/finance/CashClose';
import { Employees } from './components/employees/Employees';
import { Reports } from './components/reports/Reports';
import { Settings } from './components/settings/Settings';
import { UserProfile } from './components/profile/UserProfile';
import { MySales } from './components/profile/MySales';
import { Toaster } from './components/ui/sonner';
import { useAuthStore } from './stores/auth.store';
import { useThemeStore } from './stores/theme.store';
import { useRouterStore } from './stores/router.store';
import { usePatientsStore } from './stores/patients.store';

const AppRouter: React.FC = () => {
  const currentRoute = useRouterStore(state => state.currentRoute);

  const renderCurrentRoute = () => {
    switch (currentRoute) {
      case 'dashboard':
        return <Dashboard />;
      case 'patients':
        return <PatientsTable />;
      case 'medical-records':
        return <MedicalRecords />;
      case 'sales':
        return <Sales />;
      case 'inventory':
        return <Inventory />;
      case 'cash-close':
        return <CashClose />;
      case 'employees':
        return <Employees />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      case 'profile':
        return <UserProfile />;
      case 'my-sales':
        return <MySales />;
      default:
        return <Dashboard />;
    }
  };

  return <>{renderCurrentRoute()}</>;
};



export default function App() {
  const user  = useAuthStore(state=>state.user);
  const  loading = useAuthStore(state=>state.loading);
  const  checkAuth  = useAuthStore(state=>state.checkAuth);
  const { initializeTheme } = useThemeStore();
  const { fetchPatients } = usePatientsStore();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('Initializing app...');
        
        // Inicializar el tema primero
        initializeTheme();
        
        // Verificar autenticación
        await checkAuth();
        
        setInitialized(true);
        console.log('App initialized successfully');
        
      } catch (error) {
        console.error('Error initializing app:', error);
        setInitialized(true); // Continuar aún si hay error
      }
    };

    if (!initialized) {
      initializeApp();
    }
  }, [initialized, initializeTheme, checkAuth]);

  // Cargar pacientes cuando el usuario esté autenticado
  useEffect(() => {
    if (user && initialized && !loading) {
      fetchPatients().catch(error => {
        console.error('Error fetching patients:', error);
      });
    }
  }, [user, initialized, loading, fetchPatients]);

  // Mostrar loading solo durante la inicialización o cuando auth está cargando
  if (!initialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-goodent-primary to-goodent-secondary rounded-full flex items-center justify-center mx-auto animate-pulse">
            <span className="text-white text-xl font-bold">G</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-goodent-primary">Good Dental</h2>
            <p className="text-sm text-muted-foreground">
              {!initialized ? 'Inicializando...' : 'Cargando sistema...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>      
      {!user ? (
        <AuthPage />
      ) : (
        <DashboardLayout>
          <AppRouter />
        </DashboardLayout>
      )}
      
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: 'var(--color-card)',
            color: 'var(--color-foreground)',
            border: '1px solid var(--color-border)',
          },
        }}
      />
    </>
  );
}