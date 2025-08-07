/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calculator,
  Receipt,
  Plus,
  Minus,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useAuthStore } from '../../stores/auth.store';
import { toast } from 'sonner';

// Schemas para formularios
const expenseSchema = z.object({
  description: z.string().min(5, 'La descripción debe tener al menos 5 caracteres'),
  amount: z.number().min(0.01, 'El monto debe ser mayor a 0'),
  category: z.enum(['supplies', 'maintenance', 'utilities', 'other']),
  receiptNumber: z.string().optional(),
});

const cashCloseSchema = z.object({
  initialAmount: z.number().min(0, 'El monto inicial no puede ser negativo'),
  actualAmount: z.number().min(0, 'El monto actual no puede ser negativo'),
  notes: z.string().optional(),
});

type ExpenseForm = z.infer<typeof expenseSchema>;
type CashCloseForm = z.infer<typeof cashCloseSchema>;

const EXPENSE_CATEGORIES = {
  supplies: 'Suministros',
  maintenance: 'Mantenimiento',
  utilities: 'Servicios',
  other: 'Otros',
};

// Datos simulados
const mockSalesData = [
  { id: '1', total: 250.00, time: '09:30', patient: 'Juan Pérez', method: 'cash' },
  { id: '2', total: 180.00, time: '11:15', patient: 'María García', method: 'card' },
  { id: '3', total: 320.00, time: '14:20', patient: 'Carlos López', method: 'transfer' },
  { id: '4', total: 150.00, time: '16:45', patient: 'Ana Rodríguez', method: 'cash' },
];

const mockExpenses = [
  { id: '1', description: 'Compra de guantes desechables', amount: 45.00, category: 'supplies', time: '10:00' },
  { id: '2', description: 'Reparación de silla dental', amount: 120.00, category: 'maintenance', time: '13:30' },
];

export const CashClose: React.FC = () => {
  const { user } = useAuthStore();
  const [expenses, setExpenses] = useState(mockExpenses);
  const [salesData] = useState(mockSalesData);
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState(false);
  const [cashClosures, setCashClosures] = useState<any[]>([]);

  const expenseForm = useForm<ExpenseForm>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      description: '',
      amount: 0,
      category: 'supplies',
      receiptNumber: '',
    },
  });

  const closeForm = useForm<CashCloseForm>({
    resolver: zodResolver(cashCloseSchema),
    defaultValues: {
      initialAmount: 100, // Caja chica inicial
      actualAmount: 0,
      notes: '',
    },
  });

  // Calcular totales
  const totalSales = salesData.reduce((sum, sale) => sum + sale.total, 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const expectedCash = closeForm.watch('initialAmount') + totalSales - totalExpenses;
  const actualCash = closeForm.watch('actualAmount');
  const difference = actualCash - expectedCash;

  const handleAddExpense = async (data: ExpenseForm) => {
    try {
      const newExpense = {
        id: Date.now().toString(),
        description: data.description,
        amount: data.amount,
        category: data.category,
        receiptNumber: data.receiptNumber,
        time: new Date().toLocaleTimeString(),
        employeeId: user?.id,
      };

      setExpenses(prev => [...prev, newExpense]);
      setIsExpenseDialogOpen(false);
      expenseForm.reset();
      toast.success('Gasto registrado correctamente');
    } catch (error: any) {
    console.warn(error);
      toast.error('Error registrando gasto');
    }
  };

  const handleCashClose = async (data: CashCloseForm) => {
    try {
      const cashClose = {
        id: Date.now().toString(),
        employeeId: user?.id,
        employeeName: user?.name,
        date: new Date().toISOString().split('T')[0],
        startTime: '08:00', // En producción sería la hora de inicio del turno
        endTime: new Date().toLocaleTimeString(),
        initialAmount: data.initialAmount,
        salesTotal: totalSales,
        expensesTotal: totalExpenses,
        expectedAmount: expectedCash,
        actualAmount: data.actualAmount,
        difference: difference,
        notes: data.notes,
        createdAt: new Date().toISOString(),
      };

      setCashClosures(prev => [cashClose, ...prev]);
      setIsCloseDialogOpen(false);
      closeForm.reset();
      setExpenses([]); // Limpiar gastos del día
      
      if (difference === 0) {
        toast.success('¡Cierre de caja perfecto! Todo cuadra correctamente.');
      } else if (difference > 0) {
        toast.success(`Cierre de caja completado. Sobrante: $ ${difference.toFixed(2)}`);
      } else {
        toast.error(`Cierre de caja completado. Faltante: $ ${Math.abs(difference).toFixed(2)}`);
      }
    } catch (error: any) {
        console.warn(error)
      toast.error('Error en el cierre de caja');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cierre de Caja</h1>
          <p className="text-muted-foreground">
            Control diario de ingresos, gastos y cuadre de caja
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="border-goodent-primary text-goodent-primary">
            <Calendar className="mr-1 h-3 w-3" />
            {new Date().toLocaleDateString()}
          </Badge>
          <Badge variant="outline">
            <Clock className="mr-1 h-3 w-3" />
            {user?.name}
          </Badge>
        </div>
      </div>

      {/* Resumen del día */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="mr-2 h-4 w-4 text-green-500" />
              Ventas del Día
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              $ {totalSales.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {salesData.length} transacciones
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingDown className="mr-2 h-4 w-4 text-red-500" />
              Gastos del Día
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              $ {totalExpenses.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {expenses.length} gastos
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Calculator className="mr-2 h-4 w-4 text-blue-500" />
              Caja Esperada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              $ {expectedCash.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Inicial + Ventas - Gastos
            </p>
          </CardContent>
        </Card>

        <Card className={`border-l-4 ${
          difference === 0 ? 'border-l-green-500' : 
          difference > 0 ? 'border-l-yellow-500' : 'border-l-red-500'
        }`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              {difference === 0 ? (
                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
              ) : difference > 0 ? (
                <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500" />
              ) : (
                <XCircle className="mr-2 h-4 w-4 text-red-500" />
              )}
              Diferencia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              difference === 0 ? 'text-green-600' : 
              difference > 0 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              $ {difference.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {difference === 0 ? 'Perfecto' : difference > 0 ? 'Sobrante' : 'Faltante'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detalle de ventas y gastos */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Ventas del día */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Receipt className="mr-2 h-5 w-5 text-green-500" />
              Ventas del Día
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {salesData.map((sale) => (
              <div key={sale.id} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div>
                  <div className="font-medium">{sale.patient}</div>
                  <div className="text-sm text-muted-foreground">
                    {sale.time} • {sale.method === 'cash' ? 'Efectivo' : 
                                   sale.method === 'card' ? 'Tarjeta' : 'Transferencia'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">
                    $ {sale.total.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Gastos del día */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Minus className="mr-2 h-5 w-5 text-red-500" />
                Gastos del Día
              </CardTitle>
              <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-red-500 hover:bg-red-600">
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Gasto
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Registrar Gasto</DialogTitle>
                    <DialogDescription>
                      Registra un gasto realizado durante el turno actual
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...expenseForm}>
                    <form onSubmit={expenseForm.handleSubmit(handleAddExpense)} className="space-y-4">
                      <FormField
                        control={expenseForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Descripción del Gasto</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe el gasto realizado..."
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={expenseForm.control}
                          name="amount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Monto ($)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  step="0.01"
                                  placeholder="0.00"
                                  {...field}
                                  onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={expenseForm.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Categoría</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar..." />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {Object.entries(EXPENSE_CATEGORIES).map(([value, label]) => (
                                    <SelectItem key={value} value={value}>
                                      {label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={expenseForm.control}
                        name="receiptNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Número de Recibo (Opcional)</FormLabel>
                            <FormControl>
                              <Input placeholder="R001-2024" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end space-x-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setIsExpenseDialogOpen(false)}
                        >
                          Cancelar
                        </Button>
                        <Button type="submit" className="bg-red-500 hover:bg-red-600">
                          Registrar Gasto
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {expenses.length > 0 ? (
              expenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div>
                    <div className="font-medium">{expense.description}</div>
                    <div className="text-sm text-muted-foreground">
                      {expense.time} • {EXPENSE_CATEGORIES[expense.category as keyof typeof EXPENSE_CATEGORIES]}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-red-600">
                      -$ {expense.amount.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Minus className="mx-auto h-8 w-8 mb-2 opacity-50" />
                <p>No hay gastos registrados hoy</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Formulario de cierre de caja */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calculator className="mr-2 h-5 w-5 text-goodent-primary" />
            Realizar Cierre de Caja
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...closeForm}>
            <div className="grid gap-6 md:grid-cols-3">
              <FormField
                control={closeForm.control}
                name="initialAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Caja Inicial ($)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={closeForm.control}
                name="actualAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dinero Actual en Caja ($)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        placeholder="Contar efectivo físico"
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <label className="text-sm font-medium">Resultado</label>
                <div className={`p-3 rounded-lg text-center ${
                  difference === 0 ? 'bg-green-100 dark:bg-green-900/20' :
                  difference > 0 ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                  'bg-red-100 dark:bg-red-900/20'
                }`}>
                  <div className={`font-bold ${
                    difference === 0 ? 'text-green-600' :
                    difference > 0 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {difference === 0 ? 'CUADRA' :
                     difference > 0 ? `SOBRANTE: $ ${difference.toFixed(2)}` :
                     `FALTANTE: $ ${Math.abs(difference).toFixed(2)}`}
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <FormField
                control={closeForm.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observaciones (Opcional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Notas adicionales sobre el cierre de caja..."
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Dialog open={isCloseDialogOpen} onOpenChange={setIsCloseDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      className="bg-goodent-primary hover:bg-goodent-primary/90"
                      disabled={actualCash === 0}
                    >
                      <DollarSign className="mr-2 h-4 w-4" />
                      Cerrar Caja
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirmar Cierre de Caja</DialogTitle>
                      <DialogDescription>
                        Revisa los totales antes de confirmar el cierre diario de caja
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="bg-muted p-4 rounded-lg space-y-2">
                        <div className="flex justify-between">
                          <span>Caja Inicial:</span>
                          <span>$ {closeForm.watch('initialAmount').toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-green-600">
                          <span>+ Ventas:</span>
                          <span>$ {totalSales.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-red-600">
                          <span>- Gastos:</span>
                          <span>$ {totalExpenses.toFixed(2)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold">
                          <span>Esperado:</span>
                          <span>$ {expectedCash.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold">
                          <span>Actual:</span>
                          <span>$ {actualCash.toFixed(2)}</span>
                        </div>
                        <Separator />
                        <div className={`flex justify-between font-bold text-lg ${
                          difference === 0 ? 'text-green-600' :
                          difference > 0 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          <span>Diferencia:</span>
                          <span>$ {difference.toFixed(2)}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        ¿Estás seguro de que quieres cerrar la caja? Esta acción no se puede deshacer.
                      </p>
                      
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          onClick={() => setIsCloseDialogOpen(false)}
                        >
                          Cancelar
                        </Button>
                        <Button 
                          onClick={closeForm.handleSubmit(handleCashClose)}
                          className="bg-goodent-primary hover:bg-goodent-primary/90"
                        >
                          Confirmar Cierre
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </Form>
        </CardContent>
      </Card>

      {/* Historial de cierres */}
      {cashClosures.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Historial de Cierres</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cashClosures.map((closure) => (
                <div key={closure.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{closure.date}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {closure.startTime} - {closure.endTime}
                      </span>
                    </div>
                    <Badge className={
                      closure.difference === 0 ? 'bg-green-500' :
                      closure.difference > 0 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }>
                      {closure.difference === 0 ? 'Perfecto' :
                       closure.difference > 0 ? `+${closure.difference.toFixed(2)}` :
                       `${closure.difference.toFixed(2)}`}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Ventas:</span>
                      <div className="font-medium">$ {closure.salesTotal.toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Gastos:</span>
                      <div className="font-medium">$ {closure.expensesTotal.toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Esperado:</span>
                      <div className="font-medium">$ {closure.expectedAmount.toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Actual:</span>
                      <div className="font-medium">$ {closure.actualAmount.toFixed(2)}</div>
                    </div>
                  </div>
                  {closure.notes && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      <strong>Notas:</strong> {closure.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};