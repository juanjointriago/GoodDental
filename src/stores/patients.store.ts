import { create, type StateCreator } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { IPatient, CreatePatientData } from '../interfaces/patients.interface';
import { createSearchFilter } from '../utils/store.utils';
import { PatientsService } from '../services/patients.service';

interface PatientsStore {
  patients: IPatient[];
  selectedPatient: IPatient | null;
  filteredPatients: IPatient[];
  searchTerm: string;
  
  // Actions
  getAndSetPatients: () => Promise<void>;
  getPatients: () => IPatient[];
  createPatient: (patientData: CreatePatientData) => Promise<void>;
  updatePatient: (patient: IPatient) => Promise<void>;
  deletePatient: (id: string) => Promise<void>;
  setSelectedPatient: (patient: IPatient | null) => void;
  setSearchTerm: (searchTerm: string) => void;
  refreshFilteredPatients: () => void;
}

// Create search filter for patients
const searchPatients = createSearchFilter<IPatient>([
  'name', 'lastName', 'email', 'phone', 'cc'
]);

const storeAPI: StateCreator<PatientsStore> = (set, get) => {
  const updateFilteredPatients = () => {
    const { patients, searchTerm } = get();
    const filteredPatients = searchPatients(patients, searchTerm);
    set({ filteredPatients });
  };

  return {
    // Initial state
    patients: [],
    searchTerm: '',
    selectedPatient: null,
    filteredPatients: [],

    // Actions
    getAndSetPatients: async () => {
      try {
        const patients = await PatientsService.getPatients();
        set({ patients: [...patients] });
        updateFilteredPatients();
        console.debug('ALL PATIENTS FOUNDED ===>', { patients });
      } catch (error) {
        console.warn(error);
      }
    },

    getPatients: () => get().patients,

    createPatient: async (patientData: CreatePatientData) => {
      const newPatient = await PatientsService.createPatient(patientData);
      set({ patients: [...get().patients, newPatient] });
      updateFilteredPatients();
    },

    updatePatient: async (patient: IPatient) => {
      await PatientsService.updatePatient(patient);
      set({
        patients: get().patients.map(p => p.id === patient.id ? patient : p)
      });
      updateFilteredPatients();
      
      // Update selected patient if it's the one being updated
      const { selectedPatient } = get();
      if (selectedPatient?.id === patient.id) {
        set({ selectedPatient: patient });
      }
    },

    deletePatient: async (id: string) => {
      await PatientsService.deletePatient(id);
      const { selectedPatient } = get();
      set({
        patients: get().patients.filter(p => p.id !== id),
        selectedPatient: selectedPatient?.id === id ? null : selectedPatient
      });
      updateFilteredPatients();
    },

    setSelectedPatient: (patient: IPatient | null) => {
      set({ selectedPatient: patient });
    },

    setSearchTerm: (searchTerm: string) => {
      set({ searchTerm });
      updateFilteredPatients();
    },

    refreshFilteredPatients: updateFilteredPatients,
  };
};

export const usePatientsStore = create<PatientsStore>()(
  devtools(
    immer(
      persist(storeAPI, { name: 'patients-store' })
    )
  )
);