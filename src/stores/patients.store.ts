import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { IPatient as Patient } from '../interfaces/patients.interface';

interface PatientsState {
  patients: Patient[];
  loading: boolean;
  searchTerm: string;
  selectedPatient: Patient | null;
  
  // Actions
  fetchPatients: () => Promise<void>;
  addPatient: (patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updatePatient: (id: string, updates: Partial<Patient>) => Promise<void>;
  deletePatient: (id: string) => Promise<void>;
  setSelectedPatient: (patient: Patient | null) => void;
  setSearchTerm: (term: string) => void;
  getFilteredPatients: () => Patient[];
}

// Mock data
const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'Juan Carlos',
    lastName: 'Perez',
    email: 'juan.perez@email.com',
    phone: '+593 99 123 4567',
    address: 'Av. Amazonas 123, Quito',
    cc: '111111111',
    role: 'customer',
    city: 'Quito',
    country: 'Ecuador',
    birthDate: Date.parse('1990-07-22'),
    emergencyContact: 'María Pérez',
    emergencyPhone: '+593 99 765 4321',
    medicalHistory: 'Sin antecedentes relevantes',
    allergies: 'Penicilina',
    medications: 'Ninguna',
    insuranceProvider: 'Seguros Equinoccial',
    insuranceNumber: '123456789',
    isActive: true,
  },
  {
    id: '2',
    name: 'Ana María',
    lastName: 'Gonzales',
    email: 'ana.gonzalez@email.com',
    phone: '+593 98 876 5432',
    address: 'Calle Bolívar 456, Quito',
    birthDate: Date.parse('1992-03-15'),
    cc: '111111111',
    role: 'customer',
    city: 'Quito',
    country: 'Ecuador',
    emergencyContact: 'Carlos González',
    emergencyPhone: '+593 99 111 2222',
    medicalHistory: 'Diabetes tipo 2',
    allergies: 'Ninguna conocida',
    medications: 'Metformina 500mg',
    insuranceProvider: 'Salud S.A.',
    insuranceNumber: '987654321',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    isActive: true,
  },
  {
    id: '3',
    name: 'Carlos',
    lastName: 'Rodríguez',
    cc: '1234567890',
    role: 'customer',
    city: 'Quito',
    country: 'Ecuador',
    email: 'carlos.rodriguez@email.com',
    phone: '+593 97 555 1234',
    address: 'Av. 6 de Diciembre 789, Quito',
    birthDate: Date.parse('1978-11-08'),
    emergencyContact: 'Lucía Rodríguez',
    emergencyPhone: '+593 98 333 4444',
    medicalHistory: 'Hipertensión arterial',
    allergies: 'Ibuprofeno',
    medications: 'Losartán 50mg',
    insuranceProvider: 'Humana Seguros',
    insuranceNumber: '555666777',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    isActive: true,
  },
];

export const usePatientsStore = create<PatientsState>()(
  persist(
    (set, get) => ({
      patients: [],
      loading: false,
      searchTerm: '',
      selectedPatient: null,

      fetchPatients: async () => {
        set({ loading: true });
        
        try {
          // Simular llamada a API
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set({ 
            patients: mockPatients,
            loading: false 
          });
          
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      addPatient: async (patientData) => {
        set({ loading: true });
        
        try {
          // Simular llamada a API
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const newPatient: Patient = {
            ...patientData,
            id: Date.now().toString(),
            createdAt: Date.now(),
            updatedAt: Date.now(),
            isActive: true,
          };

          const { patients } = get();
          
          set({ 
            patients: [...patients, newPatient],
            loading: false 
          });
          
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      updatePatient: async (id, updates) => {
        set({ loading: true });
        
        try {
          // Simular llamada a API
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const { patients } = get();
          const updatedPatients = patients.map(patient =>
            patient.id === id 
              ? { ...patient, ...updates, updatedAt: Date.now() }
              : patient
          );

          set({ 
            patients: updatedPatients,
            loading: false 
          });
          
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      deletePatient: async (id) => {
        set({ loading: true });
        
        try {
          // Simular llamada a API
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const { patients } = get();
          const updatedPatients = patients.filter(patient => patient.id !== id);

          set({ 
            patients: updatedPatients,
            loading: false 
          });
          
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      setSelectedPatient: (patient) => {
        set({ selectedPatient: patient });
      },

      setSearchTerm: (term) => {
        set({ searchTerm: term });
      },

      getFilteredPatients: () => {
        const { patients, searchTerm } = get();
        
        if (!searchTerm) return patients;
        
        return patients.filter(patient =>
          patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.phone.includes(searchTerm)
        );
      },
    }),
    {
      name: 'goodent-patients-storage',
      partialize: (state) => ({ 
        patients: state.patients 
      }),
    }
  )
);