import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,  } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { 
  Users, 
  Search, 
  Plus, 
  UserCheck,
  DollarSign,
  AlertCircle,
  Edit,
  Eye,
  CheckCircle,
} from 'lucide-react';
import { useAuthStore } from '../../stores/auth.store';
import { useEmployeeStore, type Employee } from '../../stores/employees';
import { toast } from 'sonner';

// No necesitamos tipos ni datos simulados aquí, los manejamos en el store

const DEPARTMENT_LABELS = {
  administration: 'Administración',
  medical: 'Médico',
  assistance: 'Asistencia',
  cleaning: 'Limpieza',
};

const STATUS_LABELS = {
  active: 'Activo',
  inactive: 'Inactivo',
  suspended: 'Suspendido',
};

export const Employees: React.FC = () => {
  const { user } = useAuthStore();
  const { employees, addEmployee } = useEmployeeStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] = useState(false);

  
  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    lastName: '',
    email: '',
    dni: '',
    phone: '',
    position: '',
    department: 'medical' as Employee['department'],
    salary: 0,
    status: 'active' as Employee['status'],
    hireDate: new Date().toISOString().split('T')[0],
  });

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.dni.includes(searchTerm) ||
    employee.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(e => e.status === 'active').length;
  const totalSalaries = employees.reduce((sum, employee) => sum + employee.salary, 0);

  const createEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!employeeForm.name || !employeeForm.lastName || !employeeForm.email || !employeeForm.dni) {
        toast.error('Completa todos los campos requeridos');
        return;
      }

      if (employees.some(emp => emp.dni === employeeForm.dni)) {
        toast.error('Ya existe un empleado con ese DNI');
        return;
      }

      if (employees.some(emp => emp.email === employeeForm.email)) {
        toast.error('Ya existe un empleado con ese email');
        return;
      }

      addEmployee(employeeForm);
      setIsEmployeeDialogOpen(false);
      setEmployeeForm({
        name: '',
        lastName: '',
        email: '',
        dni: '',
        phone: '',
        position: '',
        department: 'medical',
        salary: 0,
        status: 'active',
        hireDate: new Date().toISOString().split('T')[0],
      });
      toast.success('Empleado creado correctamente');
    } catch (error) {
        console.warn(error);
      toast.error('Error creando empleado');
    }
  };

  // Solo administradores pueden ver gestión completa
  if (user?.role !== 'administrator') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 mb-4 text-red-500" />
          <h2 className="text-xl font-semibold text-red-600 mb-2">Acceso Denegado</h2>
          <p className="text-muted-foreground">No tienes permisos para acceder a este módulo</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Empleados</h1>
          <p className="text-muted-foreground">
            Administración de personal y recursos humanos
          </p>
        </div>
        
        <Button 
          onClick={() => setIsEmployeeDialogOpen(true)}
          className="bg-goodent-primary hover:bg-goodent-primary/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Empleado
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="mr-2 h-4 w-4 text-goodent-primary" />
              Total Empleados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-goodent-primary">{totalEmployees}</div>
            <p className="text-xs text-muted-foreground">En la clínica</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <UserCheck className="mr-2 h-4 w-4 text-green-500" />
              Empleados Activos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeEmployees}</div>
            <p className="text-xs text-muted-foreground">
              {((activeEmployees / totalEmployees) * 100).toFixed(1)}% del total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <DollarSign className="mr-2 h-4 w-4 text-goodent-secondary" />
              Nómina Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-goodent-secondary">
              $ {totalSalaries.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Mensual</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="mr-2 h-5 w-5" />
            Buscar Empleados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Input
              placeholder="Buscar por nombre, email, DNI o cargo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Badge variant="outline" className="border-goodent-primary text-goodent-primary">
              {filteredEmployees.length} empleados
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de empleados */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empleado</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Salario</TableHead>
                <TableHead>Fecha Ingreso</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={employee.avatar} />
                        <AvatarFallback className="bg-goodent-primary text-white">
                          {employee.name.charAt(0)}{employee.lastName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {employee.name} {employee.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {employee.email}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          DNI: {employee.dni}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{employee.position}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {DEPARTMENT_LABELS[employee.department]}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium text-goodent-secondary">
                    $ {employee.salary.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {new Date(employee.hireDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge className={employee.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}>
                      {employee.status === 'active' && <CheckCircle className="mr-1 h-3 w-3" />}
                      {STATUS_LABELS[employee.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog para crear empleado */}
      <Dialog open={isEmployeeDialogOpen} onOpenChange={setIsEmployeeDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nuevo Empleado</DialogTitle>
            <DialogDescription>
              Registra un nuevo empleado en el sistema
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={createEmployee} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Nombre</label>
                <Input
                  value={employeeForm.name}
                  onChange={(e) => setEmployeeForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Carlos"
                  required
                  className="mt-1"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Apellido</label>
                <Input
                  value={employeeForm.lastName}
                  onChange={(e) => setEmployeeForm(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Mendoza"
                  required
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">DNI</label>
                <Input
                  value={employeeForm.dni}
                  onChange={(e) => setEmployeeForm(prev => ({ ...prev, dni: e.target.value }))}
                  placeholder="12345678"
                  required
                  className="mt-1"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Teléfono</label>
                <Input
                  value={employeeForm.phone}
                  onChange={(e) => setEmployeeForm(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+593 99 123 4567"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={employeeForm.email}
                onChange={(e) => setEmployeeForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="carlos.mendoza@goodent.com"
                required
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Cargo</label>
                <Input
                  value={employeeForm.position}
                  onChange={(e) => setEmployeeForm(prev => ({ ...prev, position: e.target.value }))}
                  placeholder="Dentista General"
                  required
                  className="mt-1"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Departamento</label>
                <select
                  value={employeeForm.department}
                  onChange={(e) => setEmployeeForm(prev => ({ ...prev, department: e.target.value as Employee['department'] }))}
                  className="w-full p-2 border rounded-md mt-1"
                >
                  <option value="medical">Médico</option>
                  <option value="administration">Administración</option>
                  <option value="assistance">Asistencia</option>
                  <option value="cleaning">Limpieza</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Salario ($)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={employeeForm.salary}
                  onChange={(e) => setEmployeeForm(prev => ({ ...prev, salary: parseFloat(e.target.value) || 0 }))}
                  placeholder="4500.00"
                  required
                  className="mt-1"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsEmployeeDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-goodent-primary hover:bg-goodent-primary/90">
                Crear Empleado
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};