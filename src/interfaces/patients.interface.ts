import type { ClinicalHistory } from "./sales.interface";
import type { IUser } from "./users.interface";

export interface PatientMedicalInfo {
  emergencyContact: string;
  emergencyPhone: string;
  medicalHistory:ClinicalHistory[];
  allergies: string;
  medications: string;
  insuranceProvider: string;
  insuranceNumber: string;
}

export type IPatient = IUser & PatientMedicalInfo ;

// Utility types for patient operations
export type CreatePatientData = Omit<IPatient, 'id' | 'createdAt' | 'updatedAt' | 'lastLogin'>;
export type UpdatePatientData = Partial<Omit<IPatient, 'id' | 'createdAt'>>;

// Search fields for patient filtering
export const PATIENT_SEARCH_FIELDS: (keyof IPatient)[] = [
  'name',
  'lastName', 
  'email', 
  'phone',
  'cc'
];