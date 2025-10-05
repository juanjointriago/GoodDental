import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { 
  IPatient, 
  CreatePatientData, 
  UpdatePatientData
} from '../interfaces/patients.interface';
import type { SearchableState, LoadingState } from '../types/common';
import { 
  createAsyncAction, 
  createSearchFilter, 
  generateId, 
  getCurrentTimestamp,
  delay 
} from '../utils/store.utils';
import { UsersService } from '../services/users.service';

interface PatientsState extends LoadingState, SearchableState {
  patients: IPatient[];
  selectedPatient: IPatient | null;
  filteredPatients: IPatient[];
  
  // Actions
  fetchPatients: () => Promise<void>;
  addPatient: (patient: CreatePatientData) => Promise<void>;
  updatePatient: (id: string, updates: UpdatePatientData) => Promise<void>;
  deletePatient: (id: string) => Promise<void>;
  setSelectedPatient: (patient: IPatient | null) => void;
  clearError: () => void;
  refreshFilteredPatients: () => void;
}

// Mock data - In production, this would come from an API
// const createMockPatients = (): IPatient[] => [
//   {
//     id: '1',
//     name: 'Juan Carlos',
//     lastName: 'Perez',
//     email: 'juan.perez@email.com',
//     phone: '+593 99 123 4567',
//     address: 'Av. Amazonas 123, Quito',
//     cc: '1234567890',
//     role: 'customer',
//     city: 'Quito',
//     country: 'Ecuador',
//     birthDate: Date.parse('1990-07-22'),
//     emergencyContact: 'María Pérez',
//     emergencyPhone: '+593 99 765 4321',
//     medicalHistory: 'Sin antecedentes relevantes',
//     allergies: 'Penicilina',
//     medications: 'Ninguna',
//     insuranceProvider: 'Seguros Equinoccial',
//     insuranceNumber: '123456789',
//     isActive: true,
//     createdAt: getCurrentTimestamp(),
//     updatedAt: getCurrentTimestamp(),
//   },
//   {
//     id: '2',
//     name: 'Ana María',
//     lastName: 'Gonzales',
//     email: 'ana.gonzalez@email.com',
//     phone: '+593 98 876 5432',
//     address: 'Calle Bolívar 456, Quito',
//     birthDate: Date.parse('1992-03-15'),
//     cc: '0987654321',
//     role: 'customer',
//     city: 'Quito',
//     country: 'Ecuador',
//     emergencyContact: 'Carlos González',
//     emergencyPhone: '+593 99 111 2222',
//     medicalHistory: 'Diabetes tipo 2',
//     allergies: 'Ninguna conocida',
//     medications: 'Metformina 500mg',
//     insuranceProvider: 'Salud S.A.',
//     insuranceNumber: '987654321',
//     isActive: true,
//     createdAt: getCurrentTimestamp(),
//     updatedAt: getCurrentTimestamp(),
//   },
//   {
//     id: '3',
//     name: 'Carlos',
//     lastName: 'Rodríguez',
//     cc: '1122334455',
//     role: 'customer',
//     city: 'Quito',
//     country: 'Ecuador',
//     email: 'carlos.rodriguez@email.com',
//     phone: '+593 97 555 1234',
//     address: 'Av. 6 de Diciembre 789, Quito',
//     birthDate: Date.parse('1978-11-08'),
//     emergencyContact: 'Lucía Rodríguez',
//     emergencyPhone: '+593 98 333 4444',
//     medicalHistory: 'Hipertensión arterial',
//     allergies: 'Ibuprofeno',
//     medications: 'Losartán 50mg',
//     insuranceProvider: 'Humana Seguros',
//     insuranceNumber: '555666777',
//     isActive: true,
//     createdAt: getCurrentTimestamp(),
//     updatedAt: getCurrentTimestamp(),
//   },
// ];

// Create search filter for patients
const searchPatients = createSearchFilter<IPatient>([
  'name', 'lastName', 'email', 'phone', 'cc'
]);

export const usePatientsStore = create<PatientsState>()(
  devtools(
    persist(
      (set, get) => {
        // Helper functions
        const setLoading = (loading: boolean) => set({ loading });
        const setError = (error: string | null) => set({ error });
        
        const updateFilteredPatients = () => {
          const { patients, searchTerm } = get();
          const filteredPatients = searchPatients(patients, searchTerm);
          set({ filteredPatients });
        };

        return {
          // Initial state
          patients: [],
          loading: false,
          error: null,
          searchTerm: '',
          selectedPatient: null,
          filteredPatients: [],

          // Actions
          fetchPatients: createAsyncAction(
            async () => {
              const patients = await UsersService.getPatients();
              console.debug("Fetched Patients:", patients);
              set({ patients });
              updateFilteredPatients();
            },
            setLoading,
            setError
          ),

          addPatient: createAsyncAction(
            async (patientData: CreatePatientData) => {
              // Simulate API call
              await delay(500);
              
              const newPatient: IPatient = {
                ...patientData,
                id: generateId(),
                createdAt: getCurrentTimestamp(),
                updatedAt: getCurrentTimestamp(),
                isActive: true,
              };

              const { patients } = get();
              const updatedPatients = [...patients, newPatient];
              
              set({ patients: updatedPatients });
              updateFilteredPatients();
            },
            setLoading,
            setError
          ),

          updatePatient: createAsyncAction(
            async (id: string, updates: UpdatePatientData) => {
              // Simulate API call
              await delay(500);
              
              const { patients } = get();
              const updatedPatients = patients.map(patient =>
                patient.id === id 
                  ? { ...patient, ...updates, updatedAt: getCurrentTimestamp() }
                  : patient
              );

              set({ patients: updatedPatients });
              updateFilteredPatients();
              
              // Update selected patient if it's the one being updated
              const { selectedPatient } = get();
              if (selectedPatient?.id === id) {
                set({ selectedPatient: { ...selectedPatient, ...updates } });
              }
            },
            setLoading,
            setError
          ),

          deletePatient: createAsyncAction(
            async (id: string) => {
              // Simulate API call
              await delay(500);
              
              const { patients, selectedPatient } = get();
              const updatedPatients = patients.filter(patient => patient.id !== id);

              set({ 
                patients: updatedPatients,
                selectedPatient: selectedPatient?.id === id ? null : selectedPatient
              });
              updateFilteredPatients();
            },
            setLoading,
            setError
          ),

          setSelectedPatient: (patient: IPatient | null) => {
            set({ selectedPatient: patient });
          },

          setSearchTerm: (searchTerm: string) => {
            set({ searchTerm });
            updateFilteredPatients();
          },

          clearError: () => {
            set({ error: null });
          },

          refreshFilteredPatients: updateFilteredPatients,
        };
      },
      {
        name: 'goodent-patients-storage',
        partialize: (state) => ({ 
          patients: state.patients,
          selectedPatient: state.selectedPatient,
        }),
        onRehydrateStorage: () => (state) => {
          // Refresh filtered patients after rehydration
          if (state) {
            state.refreshFilteredPatients();
          }
        },
      }
    ),
    { name: 'PatientsStore' }
  )
);