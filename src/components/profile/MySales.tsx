import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar,
  ShoppingCart,
  Users,
  Target,
  BarChart3,
  Banknote,
  CreditCard,
  ArrowUpRight,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { useAuthStore } from '../../stores/auth.store';
import { useEmployeesStore } from '../../stores/employees';

export const MySales: React.FC = () => {
  const { user } = useAuthStore();
  const { getSalesByEmployee, getPerformanceByEmployee, calculateCommissions } = useEmployeesStore();
  const [selectedMonth, setSelectedMonth] = useState('2024-12');

  if (!user) return null;

  // Obtener ventas del usuario actual
  const userSales = getSalesByEmployee(user.id, selectedMonth);
  const userPerformance = getPerformanceByEmployee(user.id, selectedMonth);
  const userCommissions = calculateCommissions(user.id, selectedMonth);

  // Calcular estadísticas
  const completedSales = userSales.filter(sale => sale.status === 'completed');
  const pendingSales = userSales.filter(sale => sale.status === 'pending');
  const cancelledSales = userSales.filter(sale => sale.status === 'cancelled');
  const totalSalesAmount = completedSales.reduce((sum, sale) => sum + sale.amount, 0);
  const averageSaleAmount = completedSales.length > 0 ? totalSalesAmount / completedSales.length : 0;

  // Análisis por método de pago
  const paymentMethodStats = userSales.reduce((acc, sale) => {
    if (sale.status === 'completed') {
      acc[sale.paymentMethod] = (acc[sale.paymentMethod] || 0) + sale.amount;
    }
    return acc;
  }, {} as Record<string, number>);

  // Análisis por servicios
  const serviceStats = userSales.reduce((acc, sale) => {
    if (sale.status === 'completed') {
      acc[sale.service] = (acc[sale.service] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'pending': return 'bg-orange-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Completada';
      case 'pending': return 'Pendiente';
      case 'cancelled': return 'Cancelada';
      default: return 'Desconocido';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-3 w-3" />;
      case 'pending': return <Clock className="h-3 w-3" />;
      case 'cancelled': return <XCircle className="h-3 w-3" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-goodent-primary/10 to-goodent-secondary/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-goodent-primary text-white text-lg">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">Mis Ventas</h1>
                <p className="text-muted-foreground">{user.name}</p>
                <Badge className={user.role === 'administrator' ? 'bg-goodent-primary' : 'bg-goodent-secondary'}>
                  {user.role === 'administrator' ? 'Administrador' : 'Empleado'}
                </Badge>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-goodent-secondary">
                $ {totalSalesAmount.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">
                Total en {selectedMonth}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Selector de Mes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Período de Análisis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full max-w-xs p-2 border rounded-md"
          >
            <option value="2024-12">Diciembre 2024</option>
            <option value="2024-11">Noviembre 2024</option>
            <option value="2024-10">Octubre 2024</option>
            <option value="2024-09">Septiembre 2024</option>
          </select>
        </CardContent>
      </Card>

      {/* Estadísticas Principales */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <ShoppingCart className="mr-2 h-4 w-4 text-goodent-primary" />
              Ventas Totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-goodent-primary">
              {userSales.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {completedSales.length} completadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <DollarSign className="mr-2 h-4 w-4 text-goodent-secondary" />
              Ingresos Generados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-goodent-secondary">
              $ {totalSalesAmount.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Promedio: $ {averageSaleAmount.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="mr-2 h-4 w-4 text-green-500" />
              Comisiones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              $ {userCommissions.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Este mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="mr-2 h-4 w-4 text-blue-500" />
              Pacientes Atendidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {userPerformance?.patientsSeen || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Pacientes únicos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Distribución de Estados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="mr-2 h-5 w-5" />
            Estado de las Ventas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {completedSales.length}
              </div>
              <div className="text-sm text-green-600">Completadas</div>
              <div className="text-xs text-muted-foreground">
                $ {completedSales.reduce((sum, sale) => sum + sale.amount, 0).toFixed(2)}
              </div>
            </div>
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {pendingSales.length}
              </div>
              <div className="text-sm text-orange-600">Pendientes</div>
              <div className="text-xs text-muted-foreground">
                $ {pendingSales.reduce((sum, sale) => sum + sale.amount, 0).toFixed(2)}
              </div>
            </div>
            <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {cancelledSales.length}
              </div>
              <div className="text-sm text-red-600">Canceladas</div>
              <div className="text-xs text-muted-foreground">
                $ {cancelledSales.reduce((sum, sale) => sum + sale.amount, 0).toFixed(2)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Análisis Detallado */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="mr-2 h-5 w-5" />
              Métodos de Pago
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(paymentMethodStats).map(([method, amount]) => (
                <div key={method} className="flex items-center justify-between">
                  <div className="flex items-center">
                    {method === 'cash' && <Banknote className="mr-2 h-4 w-4 text-green-500" />}
                    {method === 'card' && <CreditCard className="mr-2 h-4 w-4 text-blue-500" />}
                    {method === 'transfer' && <ArrowUpRight className="mr-2 h-4 w-4 text-purple-500" />}
                    <span className="text-sm">
                      {method === 'cash' ? 'Efectivo' : 
                       method === 'card' ? 'Tarjeta' : 'Transferencia'}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">$ {amount.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground">
                      {((amount / totalSalesAmount) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="mr-2 h-5 w-5" />
              Servicios Más Vendidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(serviceStats)
                .sort(([,a], [,b]) => b - a)
                .map(([service, count]) => (
                <div key={service} className="flex items-center justify-between">
                  <span className="text-sm">{service}</span>
                  <div className="text-right">
                    <Badge variant="outline">{count}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de Ventas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShoppingCart className="mr-2 h-5 w-5" />
            Historial de Ventas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {userSales.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No hay ventas</h3>
              <p className="text-muted-foreground">
                No tienes ventas registradas en este período
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Servicio</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Comisión</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userSales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(sale.date).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{sale.patientName}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{sale.service}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        {sale.paymentMethod === 'cash' && <Banknote className="mr-1 h-3 w-3" />}
                        {sale.paymentMethod === 'card' && <CreditCard className="mr-1 h-3 w-3" />}
                        {sale.paymentMethod === 'transfer' && <ArrowUpRight className="mr-1 h-3 w-3" />}
                        {sale.paymentMethod === 'cash' ? 'Efectivo' : 
                         sale.paymentMethod === 'card' ? 'Tarjeta' : 'Transferencia'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-goodent-secondary">
                        $ {sale.amount.toFixed(2)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-green-600">
                        $ {sale.commission.toFixed(2)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(sale.status)}>
                        {getStatusIcon(sale.status)}
                        <span className="ml-1">{getStatusLabel(sale.status)}</span>
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};