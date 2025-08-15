import type { IUser } from "./users.interface";

export interface Patient{
  emergencyContact: string;
  emergencyPhone: string;
  medicalHistory: string;
  allergies: string;
  medications: string;
  insuranceProvider: string;
  insuranceNumber: string;
}

export type IPatient = IUser & Patient; 