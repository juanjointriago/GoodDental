/* eslint-disable @typescript-eslint/no-explicit-any */
import { create} from "zustand";
import type { StateCreator} from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { IenterpriseInfo } from "../interfaces/enterprise.interface";
import { EnterPriseInfoService } from "../services";

 interface IenterpriseInfoStore {
    enterpriseInfo: IenterpriseInfo | null;
    loading: boolean;
    error: string | null;
    getEnterpriseInfo: () => Promise<IenterpriseInfo>;
    updateEnterpriseInfo: (info: IenterpriseInfo) => Promise<IenterpriseInfo>;
}

const storeAPI: StateCreator<IenterpriseInfoStore, []>=(set, get)=>({
    enterpriseInfo: null,
    loading: false,
    error: null,
    getEnterpriseInfo: async () => {
        set({ loading: true, error: null });
            if (get().enterpriseInfo) {
            console.debug("Enterprise Info already loaded:", get().enterpriseInfo);
            set({ error: null, loading: false });
            return get().enterpriseInfo as IenterpriseInfo;
        }
        try {
            // Implement your logic to fetch enterprise info
            const info = await EnterPriseInfoService.getEnterPriseInfo();
            const resp = info[0];
            console.debug("Enterprise Info fetched:", resp);
            set({ enterpriseInfo: resp, loading: false });
            return resp;
        } catch (error:any) {
            set({ loading: false, error: error.message || "Error fetching enterprise info" });
            throw new Error("Error fetching enterprise info");
        }
    },
    updateEnterpriseInfo: async (info: IenterpriseInfo) => {
        set({ loading: true, error: null });
        try {
            const updatedInfo = await EnterPriseInfoService.updateEnterPriseInfo(info);
            console.debug("Enterprise Info updated:", updatedInfo);
            set({ enterpriseInfo: info, loading: false });
            return info;
        } catch (error:any) {
            set({ loading: false, error: error.message || "Error updating enterprise info" });
            throw new Error("Error updating enterprise info");
        }
    }
})


export const useEnterpriseInfoStore = create<IenterpriseInfoStore>()(
    devtools(
            persist(
                (storeAPI), { 
                    name: 'enterprise-info-store' 
                }
            ))
);