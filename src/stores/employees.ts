import { create, type StateCreator } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { Employee, PerformanceMetrics, Sale } from '../interfaces/employees.interface';
import { EmployeeService } from '../services/employee.service';

// Export Employee type for external use
export type { Employee } from '../interfaces/employees.interface';

interface EmployeesStore {
  employees: Employee[];
  sales: Sale[];
  performanceMetrics: PerformanceMetrics[];
  
  // Employee Actions
  getAndSetEmployees: () => Promise<void>;
  getEmployees: () => Employee[];
  createEmployee: (employee: Employee) => Promise<void>;
  updateEmployee: (employee: Employee) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
  getEmployeeById: (id: string) => Employee | undefined;
  
  // Sales Actions
  addSale: (sale: Sale) => void;
  getSalesByEmployee: (employeeId: string, month?: string) => Sale[];
  
  // Performance Actions
  updatePerformance: (metrics: PerformanceMetrics) => void;
  getPerformanceByEmployee: (employeeId: string, month?: string) => PerformanceMetrics | undefined;
  
  // Utility Actions
  calculateCommissions: (employeeId: string, month: string) => number;
}

const storeAPI: StateCreator<EmployeesStore> = (set, get) => ({
  employees: [],
  sales: [],
  performanceMetrics: [],
  
  getAndSetEmployees: async () => {
    try {
      const employees = await EmployeeService.getEmployees();
      set({ employees: [...employees] });
      console.debug('ALL EMPLOYEES FOUNDED ===>', { employees });
    } catch (error) {
      console.warn(error);
    }
  },
  
  getEmployees: () => get().employees,
  
  createEmployee: async (employee: Employee) => {
    await EmployeeService.createEmployee(employee);
    set({ employees: [...get().employees, employee] });
  },
  
  updateEmployee: async (employee: Employee) => {
    await EmployeeService.updateEmployee(employee);
    set({ 
      employees: get().employees.map(e => e.id === employee.id ? employee : e)
    });
  },
  
  deleteEmployee: async (id: string) => {
    await EmployeeService.deleteEmployee(id);
    set({ 
      employees: get().employees.filter(e => e.id !== id)
    });
  },
  
  getEmployeeById: (id: string) => {
    return get().employees.find(emp => emp.id === id);
  },
  
  addSale: (sale: Sale) => {
    set({ sales: [...get().sales, sale] });
  },
  
  getSalesByEmployee: (employeeId: string, month?: string) => {
    const { sales } = get();
    let filteredSales = sales.filter(sale => sale.employeeId === employeeId);
    
    if (month) {
      filteredSales = filteredSales.filter(sale => 
        sale.date.startsWith(month)
      );
    }
    
    return filteredSales.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },
  
  updatePerformance: (metrics: PerformanceMetrics) => {
    const existingIndex = get().performanceMetrics.findIndex(
      m => m.employeeId === metrics.employeeId && m.month === metrics.month
    );
    
    if (existingIndex >= 0) {
      const updatedMetrics = [...get().performanceMetrics];
      updatedMetrics[existingIndex] = metrics;
      set({ performanceMetrics: updatedMetrics });
    } else {
      set({ performanceMetrics: [...get().performanceMetrics, metrics] });
    }
  },
  
  getPerformanceByEmployee: (employeeId: string, month?: string) => {
    const { performanceMetrics } = get();
    return performanceMetrics.find(
      m => m.employeeId === employeeId && (!month || m.month === month)
    );
  },
  
  calculateCommissions: (employeeId: string, month: string) => {
    const sales = get().getSalesByEmployee(employeeId, month);
    return sales
      .filter(sale => sale.status === 'completed')
      .reduce((total, sale) => total + sale.commission, 0);
  },
});



export const useEmployeesStore = create<EmployeesStore>()(
  devtools(
    immer(
      persist(storeAPI, { name: 'employees-store' })
    )
  )
);