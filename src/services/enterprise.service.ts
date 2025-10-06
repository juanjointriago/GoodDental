import type { IenterpriseInfo } from "../interfaces/enterprise.interface";
import { deleteItem, getDocsFromCollection, setItem, updateItem } from "../utils/firebase.utils";

export class EnterpriseService {
    static getEnterpriseInfo = async (): Promise<IenterpriseInfo[]> => 
        await getDocsFromCollection<IenterpriseInfo>(import.meta.env.VITE_COLLECTION_ENTERPRISE || "enterprise");
    
    static createEnterpriseInfo = async (enterprise: IenterpriseInfo): Promise<{ id: string } & IenterpriseInfo> => 
        await setItem(import.meta.env.VITE_COLLECTION_ENTERPRISE || "enterprise", enterprise) as { id: string } & IenterpriseInfo;
    
    static updateEnterpriseInfo = async (enterprise: IenterpriseInfo): Promise<void> => 
        await updateItem(import.meta.env.VITE_COLLECTION_ENTERPRISE || "enterprise", enterprise);
    
    static deleteEnterpriseInfo = async (id: string): Promise<void> => 
        await deleteItem(import.meta.env.VITE_COLLECTION_ENTERPRISE || "enterprise", id);
}