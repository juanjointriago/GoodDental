import { useState, useEffect } from 'react';
import type { Patient } from '../types';


// Datos de pacientes simulados para fallback
const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'Juan',
    lastName: 'Pérez',
    dni: '12345678',
    email: 'juan.perez@email.com',
    phone: '+51 999 123 456',
    address: 'Av. Principal 123, Lima',
    birthDate: '1985-03-15',
    avatar: undefined,
    emergencyContact: 'María Pérez - 987654321',
    medicalHistory: 'Alergia a la penicilina',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
  },
  {
    id: '2',
    name: 'María',
    lastName: 'García',
    dni: '87654321',
    email: 'maria.garcia@email.com',
    phone: '+51 999 654 321',
    address: 'Jr. Secundario 456, Lima',
    birthDate: '1992-07-22',
    avatar: undefined,
    emergencyContact: 'Pedro García - 123456789',
    medicalHistory: 'Hipertensión controlada',
    createdAt: '2024-01-02T14:30:00Z',
    updatedAt: '2024-01-02T14:30:00Z',
  },
  {
    id: '3',
    name: 'Carlos',
    lastName: 'López',
    dni: '11223344',
    email: 'carlos.lopez@email.com',
    phone: '+51 999 888 777',
    address: 'Calle Tercera 789, Lima',
    birthDate: '1978-11-08',
    avatar: undefined,
    emergencyContact: 'Ana López - 456789123',
    medicalHistory: 'Diabetes tipo 2',
    createdAt: '2024-01-03T09:15:00Z',
    updatedAt: '2024-01-03T09:15:00Z',
  },
];

export const usePatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = async () => {
    try {
        
    } catch (error) {
        
    }
  };

  const createPatient = async (patientData: any) => {
    try {
      
    } catch (err: any) {
      // Fallback: crear paciente localmente
     
    }
  };

  const getPatient = async (id: string) => {
    try {
     
    } catch (err: any) {
      // Fallback: buscar en pacientes locales
      
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return {
    patients,
    loading,
    error,
    fetchPatients,
    createPatient,
    getPatient,
  };
};