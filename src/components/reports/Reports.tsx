import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Calendar, 
  Download,
  FileText,
  PieChart,
  Activity,
  Clock,
  LogIn,
  LogOut
} from 'lucide-react';
// import { useAuthStore } from '../../stores/auth.store';
import { useEmployeeStore } from '../../stores/employees';

interface SessionData {
  id: string;
  employeeId: string;
  startTime: string;
  endTime: string | null;
  duration: number | null;
  date: string;
  status: 'active' | 'completed';
}

export const Reports: React.FC = () => {
//   const { user } = useAuthStore();
  const { employees } = useEmployeeStore();
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);

  // Datos simulados para reportes
  const salesData = {
    today: 1250.00,
    week: 8500.00,
    month: 32000.00,
    year: 285000.00,
  };

  const patientData = {
    total: 156,
    newThisMonth: 23,
    appointments: 89,
    completed: 82,
  };

  const popularServices = [
    { name: 'Limpieza Dental', count: 45, revenue: 5400.00 },
    { name: 'Consulta General', count: 38, revenue: 3040.00 },
    { name: 'Empaste Simple', count: 22, revenue: 3300.00 },
    { name: 'Extracción', count: 15, revenue: 1500.00 },
  ];

  const monthlyData = [
    { month: 'Ene', sales: 28500, patients: 125 },
    { month: 'Feb', sales: 31200, patients: 134 },
    { month: 'Mar', sales: 29800, patients: 128 },
    { month: 'Abr', sales: 33500, patients: 142 },
    { month: 'May', sales: 35600, patients: 156 },
  ];

  // Function to load sessions
  const loadSessions = async () => {
    if (!selectedEmployee) return;
    
    setLoadingSessions(true);
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      //todo change for firebase stpre
      const response = await fetch(
        `https://.supabase.co/functions/v1/make-server-d027b595/sessions/${selectedEmployee}?${params.toString()}`,
        {
          headers: {
            'Authorization': `Bearer`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to load sessions');
      }
      
      const data = await response.json();
      setSessions(data.sessions || []);
    } catch (error) {
      console.error('Error loading sessions:', error);
      setSessions([]);
    } finally {
      setLoadingSessions(false);
    }
  };

  // Load sessions when employee or date range changes
  useEffect(() => {
    loadSessions();
  }, [selectedEmployee, startDate, endDate]);

  // Format duration from seconds to hours and minutes
  const formatDuration = (seconds: number | null) => {
    if (!seconds) return 'En sesión';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  // Format time to display only hours and minutes
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // Get employee name by ID
//   const getEmployeeName = (employeeId: string) => {
//     const employee = employees.find(emp => emp.id === employeeId);
//     return employee ? `${employee.name} ${employee.lastName}` : 'Empleado no encontrado';
//   };

  // Calculate total hours for the period
  const calculateTotalHours = () => {
    const totalSeconds = sessions
      .filter(session => session.duration)
      .reduce((sum, session) => sum + (session.duration || 0), 0);
    return formatDuration(totalSeconds);
  };

  // Calculate average hours per day
  const calculateAverageHours = () => {
    const completedSessions = sessions.filter(session => session.duration);
    if (completedSessions.length === 0) return '0h 0m';
    
    const uniqueDates = [...new Set(completedSessions.map(session => session.date))];
    const totalSeconds = completedSessions.reduce((sum, session) => sum + (session.duration || 0), 0);
    const averageSeconds = totalSeconds / uniqueDates.length;
    
    return formatDuration(averageSeconds);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reportes y Análisis</h1>
          <p className="text-muted-foreground">
            Métricas y estadísticas de la clínica dental
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button className="bg-goodent-primary hover:bg-goodent-primary/90">
            <FileText className="mr-2 h-4 w-4" />
            Generar Reporte
          </Button>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <DollarSign className="mr-2 h-4 w-4 text-goodent-primary" />
              Ventas de Hoy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-goodent-primary">
              $ {salesData.today.toFixed(2)}
            </div>
            <p className="text-xs text-green-600 flex items-center">
              <TrendingUp className="mr-1 h-3 w-3" />
              +12% vs ayer
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <BarChart3 className="mr-2 h-4 w-4 text-goodent-secondary" />
              Ventas del Mes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-goodent-secondary">
              $ {salesData.month.toFixed(2)}
            </div>
            <p className="text-xs text-green-600 flex items-center">
              <TrendingUp className="mr-1 h-3 w-3" />
              +8% vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="mr-2 h-4 w-4 text-blue-500" />
              Pacientes Totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{patientData.total}</div>
            <p className="text-xs text-green-600 flex items-center">
              <TrendingUp className="mr-1 h-3 w-3" />
              +{patientData.newThisMonth} este mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-purple-500" />
              Citas del Mes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{patientData.appointments}</div>
            <p className="text-xs text-green-600">
              {patientData.completed} completadas ({((patientData.completed / patientData.appointments) * 100).toFixed(1)}%)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de reportes */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="sales">Ventas</TabsTrigger>
          <TabsTrigger value="patients">Pacientes</TabsTrigger>
          <TabsTrigger value="services">Servicios</TabsTrigger>
          <TabsTrigger value="sessions">Sesiones</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Evolución Mensual de Ventas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyData.map((data) => (
                    <div key={data.month} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-goodent-light rounded-lg flex items-center justify-center">
                          <span className="text-sm font-medium">{data.month}</span>
                        </div>
                        <div>
                          <div className="font-medium">$ {data.sales.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">{data.patients} pacientes</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-goodent-primary">
                        {((data.sales / salesData.month) * 100).toFixed(1)}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="mr-2 h-5 w-5" />
                  Servicios Más Populares
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {popularServices.map((service, index) => (
                    <div key={service.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-goodent-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{service.name}</div>
                          <div className="text-sm text-muted-foreground">{service.count} veces</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-goodent-secondary">
                          $ {service.revenue.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análisis de Ventas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-goodent-primary mb-2">
                    $ {salesData.week.toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">Esta Semana</div>
                  <Badge variant="outline" className="mt-2 text-green-600">+15%</Badge>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-goodent-secondary mb-2">
                    $ {salesData.month.toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">Este Mes</div>
                  <Badge variant="outline" className="mt-2 text-green-600">+8%</Badge>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    $ {salesData.year.toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">Este Año</div>
                  <Badge variant="outline" className="mt-2 text-green-600">+22%</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Estadísticas de Pacientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Pacientes Totales</span>
                    <span className="font-bold text-2xl text-goodent-primary">{patientData.total}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Nuevos este Mes</span>
                    <span className="font-bold text-xl text-goodent-secondary">{patientData.newThisMonth}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Tasa de Retención</span>
                    <span className="font-bold text-xl text-green-600">85%</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Citas Programadas</span>
                    <span className="font-bold text-xl">{patientData.appointments}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Citas Completadas</span>
                    <span className="font-bold text-xl text-green-600">{patientData.completed}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Tasa de Asistencia</span>
                    <span className="font-bold text-xl text-green-600">
                      {((patientData.completed / patientData.appointments) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análisis de Servicios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {popularServices.map((service, index) => (
                  <div key={service.name} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-goodent-primary text-white rounded-full flex items-center justify-center font-bold">
                          #{index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold">{service.name}</h4>
                          <p className="text-sm text-muted-foreground">Servicio dental</p>
                        </div>
                      </div>
                      <Badge className="bg-goodent-secondary">Popular</Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="text-center">
                        <div className="font-bold text-lg">{service.count}</div>
                        <div className="text-xs text-muted-foreground">Realizados</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-lg text-goodent-secondary">
                          $ {service.revenue.toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground">Ingresos</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-lg text-goodent-primary">
                          $ {(service.revenue / service.count).toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground">Promedio</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Control de Sesiones de Empleados
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Filtros */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium mb-2">
                    Seleccionar Empleado/Médico
                  </label>
                  <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar empleado..." />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.name} {employee.lastName} - {employee.position}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-sm font-medium mb-2">
                    Fecha Inicio
                  </label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-sm font-medium mb-2">
                    Fecha Fin
                  </label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Estadísticas resumidas */}
              {selectedEmployee && sessions.length > 0 && (
                <div className="grid gap-4 md:grid-cols-3 mb-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-goodent-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Total de Horas</p>
                          <p className="text-2xl font-bold text-goodent-primary">
                            {calculateTotalHours()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Activity className="h-4 w-4 text-goodent-secondary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Días Trabajados</p>
                          <p className="text-2xl font-bold text-goodent-secondary">
                            {[...new Set(sessions.map(s => s.date))].length}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <BarChart3 className="h-4 w-4 text-blue-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">Promedio por Día</p>
                          <p className="text-2xl font-bold text-blue-600">
                            {calculateAverageHours()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Tabla de sesiones */}
              {selectedEmployee ? (
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Hora de Entrada</TableHead>
                        <TableHead>Hora de Salida</TableHead>
                        <TableHead>Duración</TableHead>
                        <TableHead>Estado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loadingSessions ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            <div className="flex items-center justify-center space-x-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-goodent-primary"></div>
                              <span>Cargando sesiones...</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : sessions.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            <div className="flex flex-col items-center space-y-2">
                              <Clock className="h-12 w-12 text-muted-foreground" />
                              <p className="text-muted-foreground">
                                No hay sesiones registradas para este empleado
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        sessions.map((session) => (
                          <TableRow key={session.id}>
                            <TableCell>{formatDate(session.date)}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <LogIn className="h-4 w-4 text-green-500" />
                                <span>{formatTime(session.startTime)}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {session.endTime ? (
                                <div className="flex items-center space-x-2">
                                  <LogOut className="h-4 w-4 text-red-500" />
                                  <span>{formatTime(session.endTime)}</span>
                                </div>
                              ) : (
                                <span className="text-muted-foreground">--</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <span className={`font-medium ${
                                session.duration ? 'text-goodent-primary' : 'text-orange-500'
                              }`}>
                                {formatDuration(session.duration)}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={session.status === 'completed' ? 'default' : 'secondary'}
                                className={
                                  session.status === 'completed' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-orange-100 text-orange-800'
                                }
                              >
                                {session.status === 'completed' ? 'Completada' : 'Activa'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Selecciona un empleado para ver sus sesiones
                  </h3>
                  <p className="text-muted-foreground">
                    Elige un empleado o médico del menú desplegable para ver el detalle de sus horarios de trabajo.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};