export interface IenterpriseInfo {
    id?: string;
    uid?: string;
    name: string;
    address: string;
    phoneNumber: string;
    mobileNumber: string;
    ruc: string;
    createdAt: number;
    updatedAt: number;
    email?: string;
    logo?: string;
    website?: string;
    socialMedia?: {
        facebook?: string;
        instagram?: string;
        twitter?: string;
        linkedin?: string;
        youtube?: string;
        tiktok?: string;
    };
    generalConditions:string[]
}