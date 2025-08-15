import type { IDepartment, IUser } from "./users.interface";

export interface Employee extends IUser{
  status: 'active' | 'inactive' | 'suspended';
  commissionRate?: number; // Para comisiones de ventas
  position: string;
  department: IDepartment;
  salary: number;
  hireDate: string;

}

type SaleStatus = 'completed' | 'pending' | 'cancelled';

export interface Sale {
  id: string;
  employeeId: string;
  patientId: string;
  patientName: string;
  service: string;
  amount: number;
  commission: number;
  date: string;
  status: SaleStatus
  paymentMethod: 'cash' | 'card' | 'transfer';
}

export interface PerformanceMetrics {
  employeeId: string;
  month: string;
  salesCount: number;
  totalSales: number;
  totalCommissions: number;
  patientsSeen: number;
  averageRating: number;
  goalsAchieved: number;
  goalsTotal: number;
}