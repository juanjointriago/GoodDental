import { create, type StateCreator } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { IenterpriseInfo } from "../interfaces/enterprise.interface";
import { EnterpriseService } from "../services";

interface EnterpriseInfoStore {
    enterpriseInfo: IenterpriseInfo[];
    getAndSetEnterpriseInfo: () => Promise<void>;
    getEnterpriseInfo: () => IenterpriseInfo[];
    createEnterpriseInfo: (info: IenterpriseInfo) => Promise<void>;
    updateEnterpriseInfo: (info: IenterpriseInfo) => Promise<void>;
    deleteEnterpriseInfo: (id: string) => Promise<void>;
}

const storeAPI: StateCreator<EnterpriseInfoStore> = (set, get) => ({
    enterpriseInfo: [],
    
    getAndSetEnterpriseInfo: async () => {
        try {
            const enterpriseInfo = await EnterpriseService.getEnterpriseInfo();
            set({ enterpriseInfo: [...enterpriseInfo] });
            console.debug('ALL ENTERPRISE INFO FOUNDED ===>', { enterpriseInfo });
        } catch (error) {
            console.warn(error);
        }
    },
    
    getEnterpriseInfo: () => get().enterpriseInfo,
    
    createEnterpriseInfo: async (info: IenterpriseInfo) => {
        await EnterpriseService.createEnterpriseInfo(info);
        set({ enterpriseInfo: [...get().enterpriseInfo, info] });
    },
    
    updateEnterpriseInfo: async (info: IenterpriseInfo) => {
        await EnterpriseService.updateEnterpriseInfo(info);
        set({ 
            enterpriseInfo: get().enterpriseInfo.map(e => e.id === info.id ? info : e)
        });
    },
    
    deleteEnterpriseInfo: async (id: string) => {
        await EnterpriseService.deleteEnterpriseInfo(id);
        set({ 
            enterpriseInfo: get().enterpriseInfo.filter(e => e.id !== id)
        });
    }
});

export const useEnterpriseInfoStore = create<EnterpriseInfoStore>()(
    devtools(
        immer(
            persist(storeAPI, { 
                name: 'enterprise-info-store' 
            })
        )
    )
);