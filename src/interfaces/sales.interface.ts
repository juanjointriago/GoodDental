

// Tipos para pacientes
// export interface Patient {
//   id: string;
//   dni: string;
//   name: string;
//   lastName: string;
//   email?: string;
//   phone: string;
//   birthDate: string;
//   address: string;
//   emergencyContact?: string;
//   emergencyPhone?: string;
//   medicalHistory:ClinicalHistory[];
//   avatar?: string;
//   createdAt: string;
//   updatedAt: string;
// }

// Tipos para dentograma
export interface ToothStatus {
  toothNumber: number;
  surfaces: {
    vestibular: 'healthy' | 'cavity' | 'filling' | 'crown' | 'missing';
    lingual: 'healthy' | 'cavity' | 'filling' | 'crown' | 'missing';
    mesial: 'healthy' | 'cavity' | 'filling' | 'crown' | 'missing';
    distal: 'healthy' | 'cavity' | 'filling' | 'crown' | 'missing';
    occlusal: 'healthy' | 'cavity' | 'filling' | 'crown' | 'missing';
  };
  notes?: string;
  lastUpdate: string;
}

export interface Dentogram {
  id: string;
  patientId: string;
  teeth: ToothStatus[];
  createdAt: string;
  updatedAt: string;
}

// Tipos para historia clínica
export interface ClinicalHistory {
  id: string;
  patientId: string;
  date: string;
  diagnosis: string;
  treatment: string;
  observations?: string;
  dentogramId?: string;
  employeeId: string;
  nextAppointment?: string;
  createdAt: string;
  updatedAt: string;
}

// Tipos para productos y servicios
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category: 'material' | 'medicine' | 'equipment' | 'service';
  sku: string;
  minStock: number;
  supplierId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: 'consultation' | 'treatment' | 'surgery' | 'cleaning' | 'orthodontics' | 'other';
  duration: number; // en minutos
  createdAt: string;
  updatedAt: string;
}

// Tipos para proveedores
export interface Supplier {
  id: string;
  name: string;
  contact: string;
  email?: string;
  phone: string;
  address: string;
  ruc?: string;
  createdAt: string;
  updatedAt: string;
}

// Tipos para ventas
export interface SaleItem {
  productId?: string;
  serviceId?: string;
  quantity: number;
  unitPrice: number;
  total: number;
  description: string;
}

type PaymentMethod = 'cash' | 'credit' | 'debit' | 'insurance';
export interface Sale {
  id: string;
  patientId: string;
  employeeId: string;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: 'completed' | 'pending' | 'cancelled';
  receiptNumber: string;
  createdAt: string;
  updatedAt: string;
}

// Tipos para cierre de caja
export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: 'supplies' | 'maintenance' | 'utilities' | 'other';
  employeeId: string;
  receiptNumber?: string;
  createdAt: string;
}

export interface CashClose {
  id: string;
  employeeId: string;
  date: string;
  startTime: string;
  endTime: string;
  initialAmount: number;
  salesTotal: number;
  expensesTotal: number;
  expectedAmount: number;
  actualAmount: number;
  difference: number; // positivo = sobrante, negativo = faltante
  notes?: string;
  createdAt: string;
}

// Tipos para reportes
export interface SalesReport {
  period: string;
  totalSales: number;
  totalRevenue: number;
  topProducts: Array<{
    productId: string;
    name: string;
    quantity: number;
    revenue: number;
  }>;
  topServices: Array<{
    serviceId: string;
    name: string;
    quantity: number;
    revenue: number;
  }>;
  salesByEmployee: Array<{
    employeeId: string;
    name: string;
    sales: number;
    revenue: number;
  }>;
}

// Tipos para empleados
export interface EmployeePerformance {
  employeeId: string;
  period: string;
  totalSales: number;
  totalRevenue: number;
  averageTicket: number;
  punctuality: number; // porcentaje
  patientsAttended: number;
}

export interface EmployeeAttendance {
  id: string;
  employeeId: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  isLate: boolean;
  notes?: string;
  createdAt: string;
}

// Tipos para formularios con Zod
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  dni: string;
  phone: string;
  role: 'administrator' | 'employee';
}

export interface PatientForm {
  dni: string;
  name: string;
  lastName: string;
  email?: string;
  phone: string;
  birthDate: string;
  address: string;
  emergencyContact?: string;
  emergencyPhone?: string;
}

export interface ProductForm {
  name: string;
  description?: string;
  price: number;
  stock: number;
  category: 'material' | 'medicine' | 'equipment' | 'service';
  sku: string;
  minStock: number;
  supplierId?: string;
}

export interface SaleForm {
  patientId: string;
  items: SaleItem[];
  paymentMethod: 'cash' | 'card' | 'transfer' | 'credit';
  discount: number;
}

export interface CashCloseForm {
  actualAmount: number;
  notes?: string;
}