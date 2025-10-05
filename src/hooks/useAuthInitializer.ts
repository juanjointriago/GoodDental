import { useEffect } from 'react';
import { useAuthStore } from '../stores/auth.store';

/**
 * Hook para manejar la inicialización de la autenticación
 * Se asegura de que Firebase Auth esté sincronizado con Zustand
 */
export const useAuthInitializer = () => {
  const { initializeAuthListener } = useAuthStore();

  useEffect(() => {
    console.log('🔑 Initializing Firebase Auth listener...');
    
    // Inicializar el listener de Firebase Auth
    const unsubscribe = initializeAuthListener();
    
    // Cleanup al desmontar el componente
    return () => {
      console.log('🔑 Cleaning up Firebase Auth listener...');
      unsubscribe();
    };
  }, [initializeAuthListener]);
};