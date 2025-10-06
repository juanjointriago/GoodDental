import type { Employee } from "../interfaces/employees.interface";
import { deleteItem, getDocsFromCollection, setItem, updateItem } from "../utils/firebase.utils";

export class EmployeeService {
    static getEmployees = async (): Promise<Employee[]> => 
        await getDocsFromCollection<Employee>(import.meta.env.VITE_COLLECTION_EMPLOYEES || "employees");
    
    static createEmployee = async (employee: Employee): Promise<{ id: string } & Employee> => 
        await setItem(import.meta.env.VITE_COLLECTION_EMPLOYEES || "employees", employee) as { id: string } & Employee;
    
    static updateEmployee = async (employee: Employee): Promise<void> => 
        await updateItem(import.meta.env.VITE_COLLECTION_EMPLOYEES || "employees", employee);
    
    static deleteEmployee = async (id: string): Promise<void> => 
        await deleteItem(import.meta.env.VITE_COLLECTION_EMPLOYEES || "employees", id);
}
