import { getDocsFromCollection, getDocsFromCollectionQuery } from "../db/fb.helper";
import { updateItem } from "../utils/firebase.utils";
import type { Employee } from "../interfaces/employees.interface";
import type { IPatient } from "../interfaces/patients.interface";
import type { IUser } from "../interfaces/users.interface";

export class UsersService {
       static getAllUsers = async ()=> await getDocsFromCollection<IUser>(import.meta.env.VITE_COLLECTION_USERS);
       static getPatients = async ()=> await getDocsFromCollectionQuery<IPatient>(import.meta.env.VITE_COLLECTION_USERS, 'role','==', 'customer');
       static getDoctors = async ()=> await getDocsFromCollectionQuery<Employee>(import.meta.env.VITE_COLLECTION_USERS, 'role','==', 'employee');
       
       static activateUser = async (userId: string): Promise<void> => {
              const updatedUser = {
                     id: userId,
                     isActive: true,
                     updatedAt: Date.now()
              };
              await updateItem(import.meta.env.VITE_COLLECTION_USERS || "users", updatedUser);
       };

       static deactivateUser = async (userId: string): Promise<void> => {
              const updatedUser = {
                     id: userId,
                     isActive: false,
                     updatedAt: Date.now()
              };
              await updateItem(import.meta.env.VITE_COLLECTION_USERS || "users", updatedUser);
       };
}