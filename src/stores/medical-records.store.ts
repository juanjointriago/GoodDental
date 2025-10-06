import { create, type StateCreator } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { IMedicalRecord, CreateMedicalRecordData } from '../interfaces/medical-records.interface';
import { MedicalRecordsService } from '../services/medical-records.service';

interface MedicalRecordsStore {
  medicalRecords: IMedicalRecord[];
  selectedRecord: IMedicalRecord | null;
  loading: boolean;
  
  // Actions
  getAndSetMedicalRecords: () => Promise<void>;
  getMedicalRecordsByPatient: (patientId: string) => IMedicalRecord[];
  createMedicalRecord: (recordData: CreateMedicalRecordData) => Promise<void>;
  updateMedicalRecord: (record: IMedicalRecord) => Promise<void>;
  deleteMedicalRecord: (id: string) => Promise<void>;
  setSelectedRecord: (record: IMedicalRecord | null) => void;
  clearRecords: () => void;
}

const storeAPI: StateCreator<MedicalRecordsStore> = (set, get) => ({
  // Initial state
  medicalRecords: [],
  selectedRecord: null,
  loading: false,

  // Actions
  getAndSetMedicalRecords: async () => {
    set({ loading: true });
    try {
      const records = await MedicalRecordsService.getMedicalRecords();
      set({ medicalRecords: [...records] });
      console.debug('ALL MEDICAL RECORDS LOADED ===>', { records });
    } catch (error) {
      console.warn('Error loading medical records:', error);
    } finally {
      set({ loading: false });
    }
  },

  getMedicalRecordsByPatient: (patientId: string) => {
    const { medicalRecords } = get();
    return medicalRecords.filter(record => record.patientId === patientId);
  },

  createMedicalRecord: async (recordData: CreateMedicalRecordData) => {
    try {
      const newRecord = await MedicalRecordsService.createMedicalRecord(recordData);
      set({ medicalRecords: [...get().medicalRecords, newRecord] });
      console.debug('Medical record created:', newRecord);
    } catch (error) {
      console.error('Error creating medical record:', error);
      throw error;
    }
  },

  updateMedicalRecord: async (record: IMedicalRecord) => {
    try {
      await MedicalRecordsService.updateMedicalRecord(record);
      set({
        medicalRecords: get().medicalRecords.map(r => r.id === record.id ? record : r)
      });
      
      // Update selected record if it's the one being updated
      const { selectedRecord } = get();
      if (selectedRecord?.id === record.id) {
        set({ selectedRecord: record });
      }
      console.debug('Medical record updated:', record);
    } catch (error) {
      console.error('Error updating medical record:', error);
      throw error;
    }
  },

  deleteMedicalRecord: async (id: string) => {
    try {
      await MedicalRecordsService.deleteMedicalRecord(id);
      const { selectedRecord } = get();
      set({
        medicalRecords: get().medicalRecords.filter(r => r.id !== id),
        selectedRecord: selectedRecord?.id === id ? null : selectedRecord
      });
      console.debug('Medical record deleted:', id);
    } catch (error) {
      console.error('Error deleting medical record:', error);
      throw error;
    }
  },

  setSelectedRecord: (record: IMedicalRecord | null) => {
    set({ selectedRecord: record });
  },

  clearRecords: () => {
    set({ medicalRecords: [], selectedRecord: null });
  },
});

export const useMedicalRecordsStore = create<MedicalRecordsStore>()(
  devtools(
    immer(
      persist(storeAPI, { name: 'medical-records-store' })
    )
  )
);