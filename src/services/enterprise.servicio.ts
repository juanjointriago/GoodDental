import { getDocsFromCollection, updateItem } from "../db/fb.helper";
import type { IenterpriseInfo } from "../interfaces/enterprise.interface";

export class EnterPriseInfoService {
      static getEnterPriseInfo = async ()=> await getDocsFromCollection<IenterpriseInfo>(import.meta.env.VITE_COLLECTION_ENTERPRISEINFO);
      static updateEnterPriseInfo = async (enterpriseInfo: IenterpriseInfo) => await updateItem(import.meta.env.VITE_COLLECTION_ENTERPRISEINFO, enterpriseInfo);

}