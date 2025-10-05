import { getDocsFromCollection, getDocsFromCollectionQuery } from "../db/fb.helper";
import type { Employee } from "../interfaces/employees.interface";
import type { IPatient } from "../interfaces/patients.interface";
import type { IUser } from "../interfaces/users.interface";

export class UsersService {
       static getAllUsers = async ()=> await getDocsFromCollection<IUser>(import.meta.env.VITE_COLLECTION_USERS);
       static getPatients = async ()=> await getDocsFromCollectionQuery<IPatient>(import.meta.env.VITE_COLLECTION_USERS, 'role','==', 'customer');
       static getDoctors = async ()=> await getDocsFromCollectionQuery<Employee>(import.meta.env.VITE_COLLECTION_USERS, 'role','==', 'employee');
}