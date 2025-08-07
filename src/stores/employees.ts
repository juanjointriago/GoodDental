import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Employee {
  id: string;
  name: string;
  lastName: string;
  email: string;
  dni: string;
  phone: string;
  position: string;
  department: 'administration' | 'medical' | 'assistance' | 'cleaning';
  salary: number;
  hireDate: string;
  status: 'active' | 'inactive' | 'suspended';
  avatar?: string;
  commissionRate?: number; // Para comisiones de ventas
}

export interface Sale {
  id: string;
  employeeId: string;
  patientId: string;
  patientName: string;
  service: string;
  amount: number;
  commission: number;
  date: string;
  status: 'completed' | 'pending' | 'cancelled';
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

interface EmployeeState {
  employees: Employee[];
  sales: Sale[];
  performanceMetrics: PerformanceMetrics[];
  loading: boolean;
  
  // Employee Actions
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  getEmployeeById: (id: string) => Employee | undefined;
  
  // Sales Actions
  addSale: (sale: Omit<Sale, 'id'>) => void;
  getSalesByEmployee: (employeeId: string, month?: string) => Sale[];
  
  // Performance Actions
  updatePerformance: (metrics: PerformanceMetrics) => void;
  getPerformanceByEmployee: (employeeId: string, month?: string) => PerformanceMetrics | undefined;
  
  // Utility Actions
  setLoading: (loading: boolean) => void;
  calculateCommissions: (employeeId: string, month: string) => number;
}

// Mock data para demo
const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'Dr. Carlos',
    lastName: 'Mendoza',
    email: 'carlos.mendoza@goodent.com',
    dni: '12345678',
    phone: '+593 99 111 2222',
    position: 'Dentista General',
    department: 'medical',
    salary: 4500.00,
    hireDate: '2023-01-15',
    status: 'active',
    commissionRate: 0.15, // 15% comisión
  },
  {
    id: '2',
    name: 'Dra. María',
    lastName: 'García',
    email: 'maria.garcia@goodent.com',
    dni: '87654321',
    phone: '+593 98 333 4444',
    position: 'Ortodoncista',
    department: 'medical',
    salary: 5500.00,
    hireDate: '2023-03-01',
    status: 'active',
    commissionRate: 0.20, // 20% comisión
  },
  {
    id: '3',
    name: 'Ana',
    lastName: 'López',
    email: 'ana.lopez@goodent.com',
    dni: '11223344',
    phone: '+593 96 555 6666',
    position: 'Asistente Dental',
    department: 'assistance',
    salary: 1800.00,
    hireDate: '2023-06-15',
    status: 'active',
    commissionRate: 0.05, // 5% comisión
  },
];

const mockSales: Sale[] = [
  // Ventas para Ana Rodríguez (employee from authStore, id: '2')
  {
    id: '1',
    employeeId: '2',
    patientId: 'p1',
    patientName: 'Carlos Ruiz',
    service: 'Limpieza Dental',
    amount: 80.00,
    commission: 4.00,
    date: '2024-12-15',
    status: 'completed',
    paymentMethod: 'cash',
  },
  {
    id: '2',
    employeeId: '2',
    patientId: 'p2',
    patientName: 'María Fernández',
    service: 'Consulta General',
    amount: 50.00,
    commission: 2.50,
    date: '2024-12-18',
    status: 'completed',
    paymentMethod: 'card',
  },
  {
    id: '3',
    employeeId: '2',
    patientId: 'p3',
    patientName: 'Jorge Morales',
    service: 'Empaste',
    amount: 120.00,
    commission: 6.00,
    date: '2024-12-20',
    status: 'completed',
    paymentMethod: 'transfer',
  },
  {
    id: '4',
    employeeId: '2',
    patientId: 'p4',
    patientName: 'Ana Silva',
    service: 'Extracción',
    amount: 150.00,
    commission: 7.50,
    date: '2024-12-22',
    status: 'completed',
    paymentMethod: 'cash',
  },
  {
    id: '5',
    employeeId: '2',
    patientId: 'p5',
    patientName: 'Pedro Jiménez',
    service: 'Blanqueamiento',
    amount: 300.00,
    commission: 15.00,
    date: '2024-12-25',
    status: 'pending',
    paymentMethod: 'card',
  },
  // Ventas para Dr. María González (administrator from authStore, id: '1')
  {
    id: '6',
    employeeId: '1',
    patientId: 'p6',
    patientName: 'Roberto Vargas',
    service: 'Ortodoncia',
    amount: 1200.00,
    commission: 180.00,
    date: '2024-12-10',
    status: 'completed',
    paymentMethod: 'transfer',
  },
  {
    id: '7',
    employeeId: '1',
    patientId: 'p7',
    patientName: 'Carmen Pérez',
    service: 'Implante Dental',
    amount: 2500.00,
    commission: 375.00,
    date: '2024-12-12',
    status: 'completed',
    paymentMethod: 'card',
  },
  {
    id: '8',
    employeeId: '1',
    patientId: 'p8',
    patientName: 'Luis Herrera',
    service: 'Endodoncia',
    amount: 450.00,
    commission: 67.50,
    date: '2024-12-14',
    status: 'completed',
    paymentMethod: 'cash',
  },
  {
    id: '9',
    employeeId: '1',
    patientId: 'p9',
    patientName: 'Elena Montoya',
    service: 'Prótesis Dental',
    amount: 1800.00,
    commission: 270.00,
    date: '2024-12-16',
    status: 'completed',
    paymentMethod: 'transfer',
  },
  {
    id: '10',
    employeeId: '1',
    patientId: 'p10',
    patientName: 'Miguel Torres',
    service: 'Cirugía Oral',
    amount: 800.00,
    commission: 120.00,
    date: '2024-12-20',
    status: 'pending',
    paymentMethod: 'card',
  },
];

const mockPerformanceMetrics: PerformanceMetrics[] = [
  // Performance para Ana Rodríguez (employee, id: '2')
  {
    employeeId: '2',
    month: '2024-12',
    salesCount: 5,
    totalSales: 700.00,
    totalCommissions: 35.00,
    patientsSeen: 8,
    averageRating: 4.8,
    goalsAchieved: 4,
    goalsTotal: 5,
  },
  {
    employeeId: '2',
    month: '2024-11',
    salesCount: 8,
    totalSales: 980.00,
    totalCommissions: 49.00,
    patientsSeen: 12,
    averageRating: 4.6,
    goalsAchieved: 5,
    goalsTotal: 5,
  },
  // Performance para Dr. María González (administrator, id: '1')
  {
    employeeId: '1',
    month: '2024-12',
    salesCount: 5,
    totalSales: 6750.00,
    totalCommissions: 1012.50,
    patientsSeen: 15,
    averageRating: 4.9,
    goalsAchieved: 5,
    goalsTotal: 5,
  },
  {
    employeeId: '1',
    month: '2024-11',
    salesCount: 12,
    totalSales: 8900.00,
    totalCommissions: 1335.00,
    patientsSeen: 20,
    averageRating: 4.8,
    goalsAchieved: 5,
    goalsTotal: 5,
  },
];

export const useEmployeeStore = create<EmployeeState>()( 
  persist(
    (set, get) => ({
      employees: mockEmployees,
      sales: mockSales,
      performanceMetrics: mockPerformanceMetrics,
      loading: false,

      addEmployee: (employee) => {
        const newEmployee: Employee = {
          ...employee,
          id: Date.now().toString(),
        };
        set(state => ({
          employees: [...state.employees, newEmployee]
        }));
      },

      updateEmployee: (id, updates) => {
        set(state => ({
          employees: state.employees.map(emp => 
            emp.id === id ? { ...emp, ...updates } : emp
          )
        }));
      },

      deleteEmployee: (id) => {
        set(state => ({
          employees: state.employees.filter(emp => emp.id !== id)
        }));
      },

      getEmployeeById: (id) => {
        const { employees } = get();
        return employees.find(emp => emp.id === id);
      },

      addSale: (sale) => {
        const newSale: Sale = {
          ...sale,
          id: Date.now().toString(),
        };
        set(state => ({
          sales: [...state.sales, newSale]
        }));
      },

      getSalesByEmployee: (employeeId, month) => {
        const { sales } = get();
        let filteredSales = sales.filter(sale => sale.employeeId === employeeId);
        
        if (month) {
          filteredSales = filteredSales.filter(sale => 
            sale.date.startsWith(month)
          );
        }
        
        return filteredSales.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      },

      updatePerformance: (metrics) => {
        set(state => {
          const existingIndex = state.performanceMetrics.findIndex(
            m => m.employeeId === metrics.employeeId && m.month === metrics.month
          );
          
          if (existingIndex >= 0) {
            const updatedMetrics = [...state.performanceMetrics];
            updatedMetrics[existingIndex] = metrics;
            return { performanceMetrics: updatedMetrics };
          } else {
            return { performanceMetrics: [...state.performanceMetrics, metrics] };
          }
        });
      },

      getPerformanceByEmployee: (employeeId, month) => {
        const { performanceMetrics } = get();
        return performanceMetrics.find(
          m => m.employeeId === employeeId && (!month || m.month === month)
        );
      },

      setLoading: (loading) => {
        set({ loading });
      },

      calculateCommissions: (employeeId, month) => {
        const sales = get().getSalesByEmployee(employeeId, month);
        return sales
          .filter(sale => sale.status === 'completed')
          .reduce((total, sale) => total + sale.commission, 0);
      },
    }),
    {
      name: 'goodent-employee-storage',
      partialize: (state) => ({
        employees: state.employees,
        sales: state.sales,
        performanceMetrics: state.performanceMetrics,
      }),
    }
  )
);