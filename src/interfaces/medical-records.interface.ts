import type { BaseEntity } from '../types/common';

export interface IMedicalRecord extends BaseEntity {
  patientId: string;
  employeeId: string;
  date: string;
  diagnosis: string;
  treatment: string;
  observations?: string;
  nextAppointment?: string;
}

// Utility types for medical record operations
export type CreateMedicalRecordData = Omit<IMedicalRecord, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateMedicalRecordData = Partial<Omit<IMedicalRecord, 'id' | 'createdAt'>>;