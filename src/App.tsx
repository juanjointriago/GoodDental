import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthPage } from './components/auth/AuthPage';
import { AppRouter } from './components/AppRouter';
import { PublicRoute } from './components/routes/RouteGuards';
import { Toaster } from './components/ui/sonner';
import { useAuthStore } from './stores/auth.store';
import { useThemeStore } from './stores/theme.store';
import { usePatientsStore } from './stores/patients.store';
import { useAuthInitializer } from './hooks/useAuthInitializer';
import { APP_ROUTES } from './types/routes';





export default function App() {
  const { user, loading } = useAuthStore();
  const { initializeTheme } = useThemeStore();
  const { fetchPatients } = usePatientsStore();
  const [initialized, setInitialized] = useState(false);

  // Inicializar el listener de Firebase Auth
  useAuthInitializer();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('🚀 Initializing GoodDental app...');
        
        // Inicializar el tema
        initializeTheme();
        
        setInitialized(true);
        console.log('✅ App initialized successfully');
        
      } catch (error) {
        console.error('❌ Error initializing app:', error);
        setInitialized(true); // Continuar aún si hay error
      }
    };

    if (!initialized) {
      initializeApp();
    }
  }, [initialized, initializeTheme]);

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
            <img src="/assets/img/logo.png" alt="Good Dental Logo" className="w-50 h-20" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-goodent-primary">
              {import.meta.env.VITE_APP_TITLE ?? "Clinical"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {!initialized ? 'Inicializando...' : 'Cargando sistema...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public route for authentication */}
        <Route 
          path={APP_ROUTES.AUTH} 
          element={
            <PublicRoute>
              <AuthPage />
            </PublicRoute>
          } 
        />
        
        {/* Protected routes */}
        <Route path="/*" element={<AppRouter />} />
        
        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to={APP_ROUTES.DASHBOARD} replace />} />
      </Routes>
      
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
    </BrowserRouter>
  );
}