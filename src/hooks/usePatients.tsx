/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { UsersService } from "../services/users.service";
import type { IPatient } from "../interfaces/patients.interface";
// import type { Patient } from "../types";

// Datos de pacientes simulados para fallback
// const mockPatients: Patient[] = [
//   {
//     id: "2",
//     name: "María",
//     lastName: "García",
//     dni: "87654321",
//     email: "maria.garcia@email.com",
//     phone: "+51 999 654 321",
//     address: "Jr. Secundario 456, Lima",
//     birthDate: "1992-07-22",
//     avatar: undefined,
//     emergencyContact: "Pedro García - 123456789",
//     medicalHistory: [
//       {
//         id: "1",
//         patientId: "1",
//         date: "1985-03-15",
//         diagnosis: "Hypertension",
//         treatment: "string",
//         observations: "stri",
//         dentogramId: "string",
//         employeeId: "string",
//         nextAppointment: "",
//         createdAt: "2024-01-01T10:00:00Z",
//         updatedAt: "2024-01-01T10:00:00Z",
//       },
//     ],
//     createdAt: "2024-01-02T14:30:00Z",
//     updatedAt: "2024-01-02T14:30:00Z",
//   },
//   {
//     id: "3",
//     name: "Carlos",
//     lastName: "López",
//     dni: "11223344",
//     email: "carlos.lopez@email.com",
//     phone: "+51 999 888 777",
//     address: "Calle Tercera 789, Lima",
//     birthDate: "1978-11-08",
//     avatar: undefined,
//     emergencyContact: "Ana López - 456789123",
//     medicalHistory: [
//       {
//         id: "1",
//         patientId: "1",
//         date: "1985-03-15",
//         diagnosis: "Hypertension",
//         treatment: "string",
//         observations: "stri",
//         dentogramId: "string",
//         employeeId: "string",
//         nextAppointment: "",
//         createdAt: "2024-01-01T10:00:00Z",
//         updatedAt: "2024-01-01T10:00:00Z",
//       },
//     ],
//     createdAt: "2024-01-03T09:15:00Z",
//     updatedAt: "2024-01-03T09:15:00Z",
//   },
// ];

export const usePatients = () => {
  const [patients, setPatients] = useState<IPatient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = async () => {
    try {
      const patientsData = await UsersService.getPatients();
      console.debug('Data de Pacientes',{patientsData});
      setPatients(patientsData);
      setLoading(false);
      console.log("test");
    } catch (error) {
      setError("Error al obtener los pacientes");
      setLoading(false);
      console.warn(error);
    }
  };

  const createPatient = async (patientData: any) => {
    console.log(patientData)
    try {
      console.log("test");
    } catch (err: any) {
      // Fallback: crear paciente localmente
      console.warn(err);
    }
  };

  const getPatient = async (id: string) => {
    try {
      console.log("test", id);
    } catch (err: any) {
      // Fallback: buscar en pacientes locales
      console.warn(err);
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
