import type { IPatient, CreatePatientData } from "../interfaces/patients.interface";
import { deleteItem, getDocsFromCollection, setItem, updateItem } from "../utils/firebase.utils";
import { createUserWithEmailAndPassword, getAuth, updateProfile, signOut } from "firebase/auth";
import type { IUser } from "../interfaces/users.interface";

export class PatientsService {
    static getPatients = async (): Promise<IPatient[]> => 
        await getDocsFromCollection<IPatient>(import.meta.env.VITE_COLLECTION_PATIENTS || "patients");
    
    static createPatientFromExistingUser = async (userId: string, patientData: CreatePatientData): Promise<IPatient> => {
        try {
            // Solo crear documento del paciente sin crear usuario de auth
            const patientWithTimestamps: IPatient = {
                ...patientData,
                id: userId, // Usar el ID del usuario existente
                createdAt: Date.now(),
                updatedAt: Date.now(),
            };

            // Guardar en colección patients usando el ID del usuario existente
            const savedPatient = await setItem(
                import.meta.env.VITE_COLLECTION_PATIENTS || "patients", 
                patientWithTimestamps
            ) as IPatient;

            return savedPatient;
        } catch (error) {
            console.error('Error creating patient from existing user:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            throw new Error(`Error al crear paciente: ${errorMessage}`);
        }
    };
    
    static createPatient = async (patientData: CreatePatientData): Promise<IPatient> => {
        const auth = getAuth();
        
        try {
            // Crear usuario de autenticación usando la cédula como contraseña
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                patientData.email,
                patientData.cc // Usar cédula como contraseña
            );

            if (userCredential) {
                const { uid } = userCredential.user;
                
                // Actualizar el perfil del usuario en Firebase Auth
                await updateProfile(userCredential.user, { 
                    displayName: `${patientData.name} ${patientData.lastName}` 
                });

                // Crear documento de usuario en la colección users
                const userData: IUser = {
                    id: uid,
                    name: patientData.name,
                    lastName: patientData.lastName,
                    email: patientData.email,
                    role: 'customer',
                    phone: patientData.phone,
                    address: patientData.address,
                    cc: patientData.cc,
                    city: patientData.city,
                    country: patientData.country,
                    birthDate: patientData.birthDate,
                    photoURL: patientData.avatar || '',
                    avatar: patientData.avatar || '',
                    isActive: true, // Los pacientes se activan automáticamente
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                    lastLogin: Date.now(),
                };

                // Guardar en colección users
                await setItem(import.meta.env.VITE_COLLECTION_USERS || "users", userData);

                // Crear documento del paciente con el mismo ID
                const patientWithTimestamps: IPatient = {
                    ...patientData,
                    id: uid, // Usar el mismo ID del usuario de auth
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                };

                // Guardar en colección patients
                const savedPatient = await setItem(
                    import.meta.env.VITE_COLLECTION_PATIENTS || "patients", 
                    patientWithTimestamps
                ) as IPatient;

                // Cerrar sesión después de crear la cuenta
                await signOut(auth);

                return savedPatient;
            } else {
                throw new Error('No se pudo crear la cuenta de usuario');
            }
        } catch (error) {
            console.error('Error creating patient:', error);
            // Intentar cerrar sesión si hay algún error
            try {
                await signOut(auth);
            } catch (signOutError) {
                console.warn('Error signing out after failed registration:', signOutError);
            }
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            throw new Error(`Error al crear paciente: ${errorMessage}`);
        }
    };
    
    static updatePatient = async (patient: IPatient): Promise<void> => {
        const updatedPatient = {
            ...patient,
            updatedAt: Date.now(),
        };
        await updateItem(import.meta.env.VITE_COLLECTION_PATIENTS || "patients", updatedPatient);
    };
    
    static deletePatient = async (id: string): Promise<void> => 
        await deleteItem(import.meta.env.VITE_COLLECTION_PATIENTS || "patients", id);

    static deactivatePatient = async (id: string): Promise<void> => {
        const updatedPatient = {
            id,
            isActive: false,
            updatedAt: Date.now(),
        };
        await updateItem(import.meta.env.VITE_COLLECTION_PATIENTS || "patients", updatedPatient);
    };
}