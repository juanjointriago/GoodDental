/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Separator } from '../ui/separator';
import { 
  Plus, 
  DollarSign,
  Receipt,
  ShoppingCart,
  User,
  Edit,
  Trash2,
  Eye,
  Package,
  Wrench,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useAuthStore } from '../../stores/auth.store';
import { usePatientsStore } from '../../stores/patients.store';
import { toast } from 'sonner';

// Tipos para ventas
interface SaleItem {
  id: string;
  type: 'service' | 'product';
  itemId: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Sale {
  id: string;
  patientId: string;
  patient: {
    name: string;
    email: string;
    phone: string;
    avatar?: string;
  };
  items: SaleItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'transfer';
  status: 'pending' | 'completed' | 'cancelled';
  notes?: string;
  employeeId: string;
  employeeName: string;
  date: string;
  createdAt: string;
}

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // en minutos
  category: 'consultation' | 'cleaning' | 'filling' | 'extraction' | 'orthodontics' | 'other';
  isActive: boolean;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  minStock: number;
  category: 'medication' | 'supplies' | 'equipment' | 'other';
  isActive: boolean;
}

// Datos simulados
const mockServices: Service[] = [
  {
    id: '1',
    name: 'Consulta General',
    description: 'Evaluación dental completa y diagnóstico',
    price: 80.00,
    duration: 30,
    category: 'consultation',
    isActive: true,
  },
  {
    id: '2',
    name: 'Limpieza Dental',
    description: 'Profilaxis y limpieza profunda',
    price: 120.00,
    duration: 45,
    category: 'cleaning',
    isActive: true,
  },
  {
    id: '3',
    name: 'Empaste Simple',
    description: 'Restauración con resina compuesta',
    price: 150.00,
    duration: 60,
    category: 'filling',
    isActive: true,
  },
  {
    id: '4',
    name: 'Extracción Simple',
    description: 'Extracción dental básica',
    price: 100.00,
    duration: 30,
    category: 'extraction',
    isActive: true,
  },
];

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Ibuprofeno 400mg',
    description: 'Antiinflamatorio, caja x 20 tabletas',
    price: 15.00,
    stock: 50,
    minStock: 10,
    category: 'medication',
    isActive: true,
  },
  {
    id: '2',
    name: 'Cepillo Dental Suave',
    description: 'Cepillo de cerdas suaves',
    price: 25.00,
    stock: 30,
    minStock: 5,
    category: 'supplies',
    isActive: true,
  },
  {
    id: '3',
    name: 'Pasta Dental',
    description: 'Pasta dental con flúor 100ml',
    price: 18.00,
    stock: 25,
    minStock: 8,
    category: 'supplies',
    isActive: true,
  },
];

const mockSales: Sale[] = [
  {
    id: '1',
    patientId: '1',
    patient: { name: 'Juan Carlos Pérez', email: 'juan.perez@email.com', phone: '+593 99 123 4567' },
    items: [
      {
        id: '1',
        type: 'service',
        itemId: '1',
        name: 'Consulta General',
        description: 'Evaluación dental completa',
        quantity: 1,
        unitPrice: 80.00,
        total: 80.00,
      }
    ],
    subtotal: 80.00,
    discount: 0,
    tax: 14.40,
    total: 94.40,
    paymentMethod: 'cash',
    status: 'completed',
    employeeId: 'emp1',
    employeeName: 'Dr. Smith',
    date: '2024-01-15',
    createdAt: '2024-01-15T10:30:00Z',
  }
];

const CATEGORY_LABELS = {
  consultation: 'Consulta',
  cleaning: 'Limpieza',
  filling: 'Restauración',
  extraction: 'Extracción',
  orthodontics: 'Ortodoncia',
  medication: 'Medicamento',
  supplies: 'Suministros',
  equipment: 'Equipo',
  other: 'Otros',
};

const PAYMENT_METHODS = {
  cash: 'Efectivo',
  card: 'Tarjeta',
  transfer: 'Transferencia',
};

export const Sales: React.FC = () => {
  const { user } = useAuthStore();
  const { patients } = usePatientsStore();
  
  const [activeTab, setActiveTab] = useState('new-sale');
  const [sales, setSales] = useState<Sale[]>(mockSales);
  const [services, setServices] = useState<Service[]>(mockServices);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  
  // Estados para nueva venta
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'transfer'>('cash');
  const [notes, setNotes] = useState<string>('');
  
  // Estados para diálogos
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isReceiptDialogOpen, setIsReceiptDialogOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  // Estados para formularios
  const [serviceForm, setServiceForm] = useState({
    name: '',
    description: '',
    price: 0,
    duration: 30,
    category: 'consultation' as Service['category'],
  });

  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    minStock: 5,
    category: 'supplies' as Product['category'],
  });

  // Cálculos
  const subtotal = saleItems.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.18; // IGV 18%
  const total = subtotal - discount + tax;

  const addItemToSale = (type: 'service' | 'product', item: Service | Product) => {
    const newItem: SaleItem = {
      id: Date.now().toString(),
      type,
      itemId: item.id,
      name: item.name,
      description: item.description,
      quantity: 1,
      unitPrice: item.price,
      total: item.price,
    };
    setSaleItems(prev => [...prev, newItem]);
  };

  const updateItemQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setSaleItems(prev => prev.filter(item => item.id !== itemId));
      return;
    }
    
    setSaleItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, quantity, total: item.unitPrice * quantity }
          : item
      )
    );
  };

  const removeItemFromSale = (itemId: string) => {
    setSaleItems(prev => prev.filter(item => item.id !== itemId));
  };

  const createSale = async () => {
    try {
      if (!selectedPatient) {
        toast.error('Selecciona un paciente');
        return;
      }
      if (saleItems.length === 0) {
        toast.error('Agrega al menos un servicio o producto');
        return;
      }

      const patient = patients.find(p => p.id === selectedPatient);
      if (!patient) throw new Error('Paciente no encontrado');

      const newSale: Sale = {
        id: Date.now().toString(),
        patientId: selectedPatient,
        patient: {
          name: patient.name,
          email: patient.email,
          phone: patient.phone,
          avatar: undefined,
        },
        items: saleItems,
        subtotal,
        discount,
        tax,
        total,
        paymentMethod,
        status: 'completed',
        notes,
        employeeId: user?.id || '',
        employeeName: user?.name || '',
        date: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
      };

      setSales(prev => [newSale, ...prev]);
      
      // Limpiar formulario
      setSelectedPatient('');
      setSaleItems([]);
      setDiscount(0);
      setNotes('');
      
      toast.success('Venta registrada correctamente');
      setActiveTab('sales-history');
    } catch (error: any) {
      toast.error(error.message || 'Error registrando venta');
    }
  };

  const createService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newService: Service = {
        id: Date.now().toString(),
        ...serviceForm,
        isActive: true,
      };
      setServices(prev => [...prev, newService]);
      setIsServiceDialogOpen(false);
      setServiceForm({
        name: '',
        description: '',
        price: 0,
        duration: 30,
        category: 'consultation',
      });
      toast.success('Servicio creado correctamente');
    } catch (error) {
        console.warn(error);
      toast.error('Error creando servicio');
    }
  };

  const createProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newProduct: Product = {
        id: Date.now().toString(),
        ...productForm,
        isActive: true,
      };
      setProducts(prev => [...prev, newProduct]);
      setIsProductDialogOpen(false);
      setProductForm({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        minStock: 5,
        category: 'supplies',
      });
      toast.success('Producto creado correctamente');
    } catch (error) {
        console.warn(error);
      toast.error('Error creando producto');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Módulo de Ventas</h1>
          <p className="text-muted-foreground">
            Gestiona servicios, productos y facturación de la clínica
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="border-goodent-primary text-goodent-primary">
            <DollarSign className="mr-1 h-3 w-3" />
            Ventas del día: $ {sales
              .filter(sale => sale.date === new Date().toISOString().split('T')[0])
              .reduce((sum, sale) => sum + sale.total, 0)
              .toFixed(2)}
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="new-sale">Nueva Venta</TabsTrigger>
          <TabsTrigger value="services">Servicios</TabsTrigger>
          <TabsTrigger value="products">Productos</TabsTrigger>
          <TabsTrigger value="sales-history">Historial</TabsTrigger>
        </TabsList>

        {/* Nueva Venta */}
        <TabsContent value="new-sale" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Selección de Items */}
            <div className="space-y-6">
              {/* Selección de Paciente */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    Seleccionar Paciente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={selectedPatient}
                    onChange={(e) => setSelectedPatient(e.target.value)}
                  >
                    <option value="">Seleccionar paciente...</option>
                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name} - {patient.email}
                      </option>
                    ))}
                  </select>
                </CardContent>
              </Card>

              {/* Servicios Disponibles */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Wrench className="mr-2 h-5 w-5" />
                      Servicios Disponibles
                    </CardTitle>
                    <Button 
                      size="sm" 
                      onClick={() => setIsServiceDialogOpen(true)}
                      className="bg-goodent-primary hover:bg-goodent-primary/90"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Nuevo
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {services.filter(s => s.isActive).map((service) => (
                    <div key={service.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-goodent-light/20">
                      <div>
                        <div className="font-medium">{service.name}</div>
                        <div className="text-sm text-muted-foreground">{service.description}</div>
                        <div className="text-xs text-muted-foreground">
                          {service.duration} min • {CATEGORY_LABELS[service.category]}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-goodent-primary">
                          $ {service.price.toFixed(2)}
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => addItemToSale('service', service)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Productos Disponibles */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Package className="mr-2 h-5 w-5" />
                      Productos Disponibles
                    </CardTitle>
                    <Button 
                      size="sm" 
                      onClick={() => setIsProductDialogOpen(true)}
                      className="bg-goodent-secondary hover:bg-goodent-secondary/90"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Nuevo
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {products.filter(p => p.isActive && p.stock > 0).map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-goodent-light/20">
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">{product.description}</div>
                        <div className="text-xs text-muted-foreground">
                          Stock: {product.stock} • {CATEGORY_LABELS[product.category]}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-goodent-secondary">
                          $ {product.price.toFixed(2)}
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => addItemToSale('product', product)}
                          disabled={product.stock === 0}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Carrito de Venta */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Carrito de Venta
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {saleItems.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <ShoppingCart className="mx-auto h-12 w-12 mb-4 opacity-50" />
                      <p>No hay items seleccionados</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {saleItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-muted-foreground">{item.description}</div>
                            <Badge variant="outline" className="mt-1">
                              {item.type === 'service' ? 'Servicio' : 'Producto'}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateItemQuantity(item.id, parseInt(e.target.value) || 0)}
                              className="w-16 text-center"
                              min="1"
                            />
                            <div className="text-right">
                              <div className="text-sm text-muted-foreground">
                                $ {item.unitPrice.toFixed(2)} c/u
                              </div>
                              <div className="font-bold">
                                $ {item.total.toFixed(2)}
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeItemFromSale(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}

                      <Separator />

                      {/* Descuentos y totales */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span>Subtotal:</span>
                          <span>$ {subtotal.toFixed(2)}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <label htmlFor="discount">Descuento:</label>
                          <Input
                            id="discount"
                            type="number"
                            value={discount}
                            onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                            className="w-24 text-right"
                            placeholder="0.00"
                            step="0.01"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span>IGV (18%):</span>
                          <span>$ {tax.toFixed(2)}</span>
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between text-lg font-bold">
                          <span>Total:</span>
                          <span className="text-goodent-primary">$ {total.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Método de pago */}
                      <div>
                        <label className="text-sm font-medium">Método de Pago:</label>
                        <select 
                          className="w-full p-2 border rounded-md mt-1"
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value as any)}
                        >
                          {Object.entries(PAYMENT_METHODS).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                          ))}
                        </select>
                      </div>

                      {/* Notas */}
                      <div>
                        <label className="text-sm font-medium">Notas (Opcional):</label>
                        <Textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Observaciones sobre la venta..."
                          className="mt-1"
                        />
                      </div>

                      {/* Botón de venta */}
                      <Button
                        onClick={createSale}
                        className="w-full bg-goodent-primary hover:bg-goodent-primary/90"
                        disabled={!selectedPatient || saleItems.length === 0}
                      >
                        <Receipt className="mr-2 h-4 w-4" />
                        Procesar Venta
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Servicios */}
        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Gestión de Servicios</CardTitle>
                <Button 
                  onClick={() => setIsServiceDialogOpen(true)}
                  className="bg-goodent-primary hover:bg-goodent-primary/90"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Servicio
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Servicio</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Duración</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{service.name}</div>
                          <div className="text-sm text-muted-foreground">{service.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {CATEGORY_LABELS[service.category]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          {service.duration} min
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-goodent-primary">
                        $ {service.price.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge className={service.isActive ? 'bg-green-500' : 'bg-gray-500'}>
                          {service.isActive ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
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
        </TabsContent>

        {/* Productos */}
        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Gestión de Productos</CardTitle>
                <Button 
                  onClick={() => setIsProductDialogOpen(true)}
                  className="bg-goodent-secondary hover:bg-goodent-secondary/90"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Producto
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">{product.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {CATEGORY_LABELS[product.category]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className={product.stock <= product.minStock ? 'text-red-500 font-bold' : ''}>
                            {product.stock}
                          </span>
                          {product.stock <= product.minStock && (
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-goodent-secondary">
                        $ {product.price.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge className={product.isActive ? 'bg-green-500' : 'bg-gray-500'}>
                          {product.isActive ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
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
        </TabsContent>

        {/* Historial de Ventas */}
        <TabsContent value="sales-history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Ventas</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Paciente</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(sale.date).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {sale.patient.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {sale.patient.name}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {sale.items.length} item{sale.items.length !== 1 ? 's' : ''}
                        </div>
                      </TableCell>
                      <TableCell className="font-bold text-goodent-primary">
                        $ {sale.total.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {PAYMENT_METHODS[sale.paymentMethod]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          sale.status === 'completed' ? 'bg-green-500' :
                          sale.status === 'pending' ? 'bg-yellow-500' :
                          'bg-red-500'
                        }>
                          {sale.status === 'completed' ? 'Completada' :
                           sale.status === 'pending' ? 'Pendiente' : 'Cancelada'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedSale(sale);
                            setIsReceiptDialogOpen(true);
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Ver Recibo
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog para crear servicio */}
      <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo Servicio</DialogTitle>
            <DialogDescription>
              Crea un nuevo servicio dental para ofrecer a los pacientes
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={createService} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nombre del Servicio</label>
              <Input
                value={serviceForm.name}
                onChange={(e) => setServiceForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ej: Consulta General"
                required
                className="mt-1"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Descripción</label>
              <Textarea
                value={serviceForm.description}
                onChange={(e) => setServiceForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descripción del servicio..."
                className="mt-1"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Precio ($)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={serviceForm.price}
                  onChange={(e) => setServiceForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  className="mt-1"
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Duración (min)</label>
                <Input
                  type="number"
                  value={serviceForm.duration}
                  onChange={(e) => setServiceForm(prev => ({ ...prev, duration: parseInt(e.target.value) || 30 }))}
                  className="mt-1"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Categoría</label>
              <select
                value={serviceForm.category}
                onChange={(e) => setServiceForm(prev => ({ ...prev, category: e.target.value as Service['category'] }))}
                className="w-full p-2 border rounded-md mt-1"
              >
                <option value="consultation">Consulta</option>
                <option value="cleaning">Limpieza</option>
                <option value="filling">Restauración</option>
                <option value="extraction">Extracción</option>
                <option value="orthodontics">Ortodoncia</option>
                <option value="other">Otros</option>
              </select>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsServiceDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-goodent-primary hover:bg-goodent-primary/90">
                Crear Servicio
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog para crear producto */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo Producto</DialogTitle>
            <DialogDescription>
              Agrega un nuevo producto al inventario de la clínica
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={createProduct} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nombre del Producto</label>
              <Input
                value={productForm.name}
                onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ej: Ibuprofeno 400mg"
                required
                className="mt-1"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Descripción</label>
              <Textarea
                value={productForm.description}
                onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descripción del producto..."
                className="mt-1"
                required
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Precio ($)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={productForm.price}
                  onChange={(e) => setProductForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  className="mt-1"
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Stock Inicial</label>
                <Input
                  type="number"
                  value={productForm.stock}
                  onChange={(e) => setProductForm(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                  className="mt-1"
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Stock Mínimo</label>
                <Input
                  type="number"
                  value={productForm.minStock}
                  onChange={(e) => setProductForm(prev => ({ ...prev, minStock: parseInt(e.target.value) || 5 }))}
                  className="mt-1"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Categoría</label>
              <select
                value={productForm.category}
                onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value as Product['category'] }))}
                className="w-full p-2 border rounded-md mt-1"
              >
                <option value="medication">Medicamento</option>
                <option value="supplies">Suministros</option>
                <option value="equipment">Equipo</option>
                <option value="other">Otros</option>
              </select>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsProductDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-goodent-secondary hover:bg-goodent-secondary/90">
                Crear Producto
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog para mostrar recibo */}
      <Dialog open={isReceiptDialogOpen} onOpenChange={setIsReceiptDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Recibo de Venta #{selectedSale?.id}</DialogTitle>
            <DialogDescription>
              Detalle completo de la transacción realizada
            </DialogDescription>
          </DialogHeader>
          {selectedSale && (
            <div className="space-y-4">
              {/* Header del recibo */}
              <div className="text-center border-b pb-4">
                <h3 className="text-xl font-bold text-goodent-primary">Clínica Dental Goodent</h3>
                <p className="text-sm text-muted-foreground">Recibo de Venta</p>
                <p className="text-sm">Fecha: {new Date(selectedSale.date).toLocaleDateString()}</p>
              </div>

              {/* Información del paciente */}
              <div className="grid grid-cols-2 gap-4 border-b pb-4">
                <div>
                  <h4 className="font-medium mb-2">Cliente:</h4>
                  <p>{selectedSale.patient.name} </p>
                  <p className="text-sm text-muted-foreground">DNI: {selectedSale.patient.email}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Atendido por:</h4>
                  <p>{selectedSale.employeeName}</p>
                  <p className="text-sm text-muted-foreground">
                    Método: {PAYMENT_METHODS[selectedSale.paymentMethod]}
                  </p>
                </div>
              </div>

              {/* Items de la venta */}
              <div>
                <h4 className="font-medium mb-2">Detalles:</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Cant.</TableHead>
                      <TableHead>Precio Unit.</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedSale.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-muted-foreground">{item.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>$ {item.unitPrice.toFixed(2)}</TableCell>
                        <TableCell className="text-right">$ {item.total.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Totales */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>$ {selectedSale.subtotal.toFixed(2)}</span>
                </div>
                {selectedSale.discount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Descuento:</span>
                    <span>-$ {selectedSale.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>IGV (18%):</span>
                  <span>$ {selectedSale.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total:</span>
                  <span className="text-goodent-primary">$ {selectedSale.total.toFixed(2)}</span>
                </div>
              </div>

              {selectedSale.notes && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Observaciones:</h4>
                  <p className="text-sm text-muted-foreground">{selectedSale.notes}</p>
                </div>
              )}

              <div className="text-center text-xs text-muted-foreground border-t pt-4">
                Gracias por confiar en nosotros
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};