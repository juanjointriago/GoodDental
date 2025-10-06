import type { IMedicalRecord, CreateMedicalRecordData } from "../interfaces/medical-records.interface";
import { deleteItem, getDocsFromCollection, setItem, updateItem } from "../utils/firebase.utils";

export class MedicalRecordsService {
    static getMedicalRecords = async (): Promise<IMedicalRecord[]> => 
        await getDocsFromCollection<IMedicalRecord>(import.meta.env.VITE_COLLECTION_MEDICAL_RECORDS || "medical-records");
    
    static getMedicalRecordsByPatient = async (patientId: string): Promise<IMedicalRecord[]> => {
        const allRecords = await MedicalRecordsService.getMedicalRecords();
        return allRecords.filter(record => record.patientId === patientId);
    };
    
    static createMedicalRecord = async (recordData: CreateMedicalRecordData): Promise<IMedicalRecord> => {
        const recordWithTimestamps = {
            ...recordData,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };
        return await setItem(import.meta.env.VITE_COLLECTION_MEDICAL_RECORDS || "medical-records", recordWithTimestamps) as IMedicalRecord;
    };
    
    static updateMedicalRecord = async (record: IMedicalRecord): Promise<void> => {
        const updatedRecord = {
            ...record,
            updatedAt: Date.now(),
        };
        await updateItem(import.meta.env.VITE_COLLECTION_MEDICAL_RECORDS || "medical-records", updatedRecord);
    };
    
    static deleteMedicalRecord = async (id: string): Promise<void> => 
        await deleteItem(import.meta.env.VITE_COLLECTION_MEDICAL_RECORDS || "medical-records", id);
}