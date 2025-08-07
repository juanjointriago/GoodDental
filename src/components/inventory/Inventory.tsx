import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { 
  Package, 
  Search, 
  Plus, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Edit,
  FileText,
  Building,
  ShoppingCart,
  BarChart3
} from 'lucide-react';
import { toast } from 'sonner';

// Tipos para inventario
interface Product {
  id: string;
  name: string;
  description: string;
  category: 'medication' | 'supplies' | 'equipment' | 'other';
  price: number;
  stock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  supplier: string;
  barcode?: string;
  expirationDate?: string;
  location: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  ruc: string;
  isActive: boolean;
  createdAt: string;
}

interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason: string;
  unitCost?: number;
  totalCost?: number;
  supplier?: string;
  date: string;
  employeeId: string;
  employeeName: string;
  createdAt: string;
}

// interface PurchaseOrder {
//   id: string;
//   supplierId: string;
//   supplierName: string;
//   items: {
//     productId: string;
//     productName: string;
//     quantity: number;
//     unitCost: number;
//     total: number;
//   }[];
//   subtotal: number;
//   tax: number;
//   total: number;
//   status: 'draft' | 'sent' | 'received' | 'cancelled';
//   orderDate: string;
//   expectedDate?: string;
//   receivedDate?: string;
//   notes?: string;
//   createdAt: string;
// }

// Datos simulados
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Ibuprofeno 400mg',
    description: 'Antiinflamatorio, caja x 20 tabletas',
    category: 'medication',
    price: 15.00,
    stock: 12,
    minStock: 10,
    maxStock: 100,
    unit: 'caja',
    supplier: 'Farmacéutica ABC',
    expirationDate: '2025-12-31',
    location: 'Estante A1',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Guantes de Nitrilo',
    description: 'Guantes desechables, caja x 100 unidades',
    category: 'supplies',
    price: 45.00,
    stock: 5,
    minStock: 8,
    maxStock: 50,
    unit: 'caja',
    supplier: 'Suministros Médicos XYZ',
    location: 'Estante B2',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-14',
  },
  {
    id: '3',
    name: 'Jeringa 5ml',
    description: 'Jeringas desechables estériles',
    category: 'supplies',
    price: 0.50,
    stock: 200,
    minStock: 50,
    maxStock: 500,
    unit: 'unidad',
    supplier: 'Suministros Médicos XYZ',
    location: 'Estante B1',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-10',
  },
];

const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'Farmacéutica ABC',
    contact: 'Juan Pérez',
    email: 'ventas@farmaceuticaabc.com',
    phone: '+593 99 123 4567',
    address: 'Av. Principal 123, Quito',
    ruc: '20123456789',
    isActive: true,
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    name: 'Suministros Médicos XYZ',
    contact: 'María García',
    email: 'contacto@suministrosxyz.com',
    phone: '+593 98 765 4321',
    address: 'Jr. Comercio 456, Guayaquil',
    ruc: '20987654321',
    isActive: true,
    createdAt: '2024-01-01',
  },
];

const mockMovements: StockMovement[] = [
  {
    id: '1',
    productId: '1',
    productName: 'Ibuprofeno 400mg',
    type: 'in',
    quantity: 50,
    reason: 'Compra inicial',
    unitCost: 12.00,
    totalCost: 600.00,
    supplier: 'Farmacéutica ABC',
    date: '2024-01-01',
    employeeId: 'emp1',
    employeeName: 'Admin',
    createdAt: '2024-01-01T10:00:00Z',
  },
  {
    id: '2',
    productId: '1',
    productName: 'Ibuprofeno 400mg',
    type: 'out',
    quantity: 38,
    reason: 'Venta a pacientes',
    date: '2024-01-15',
    employeeId: 'emp1',
    employeeName: 'Dr. Smith',
    createdAt: '2024-01-15T15:30:00Z',
  },
];

const CATEGORY_LABELS = {
  medication: 'Medicamento',
  supplies: 'Suministros',
  equipment: 'Equipo',
  other: 'Otros',
};

const MOVEMENT_TYPES = {
  in: 'Entrada',
  out: 'Salida',
  adjustment: 'Ajuste',
};

export const Inventory: React.FC = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [movements, setMovements] = useState<StockMovement[]>(mockMovements);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados para diálogos
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isSupplierDialogOpen, setIsSupplierDialogOpen] = useState(false);
  const [isMovementDialogOpen, setIsMovementDialogOpen] = useState(false);
  
  // Estados para formularios
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    category: 'supplies' as Product['category'],
    price: 0,
    stock: 0,
    minStock: 5,
    maxStock: 100,
    unit: 'unidad',
    supplier: '',
    expirationDate: '',
    location: '',
  });

  const [supplierForm, setSupplierForm] = useState({
    name: '',
    contact: '',
    email: '',
    phone: '',
    address: '',
    ruc: '',
  });

  const [movementForm, setMovementForm] = useState({
    productId: '',
    type: 'in' as StockMovement['type'],
    quantity: 0,
    reason: '',
    unitCost: 0,
    supplier: '',
  });

  // Filtrar productos
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Productos con stock bajo
  const lowStockProducts = products.filter(product => product.stock <= product.minStock);

  // Estadísticas
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, product) => sum + (product.stock * product.price), 0);
  const lowStockCount = lowStockProducts.length;

  const createProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newProduct: Product = {
        id: Date.now().toString(),
        ...productForm,
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };
      
      setProducts(prev => [...prev, newProduct]);
      setIsProductDialogOpen(false);
      setProductForm({
        name: '',
        description: '',
        category: 'supplies',
        price: 0,
        stock: 0,
        minStock: 5,
        maxStock: 100,
        unit: 'unidad',
        supplier: '',
        expirationDate: '',
        location: '',
      });
      toast.success('Producto creado correctamente');
    } catch (error) {
        console.warn(error);
      toast.error('Error creando producto');
    }
  };

  const createSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newSupplier: Supplier = {
        id: Date.now().toString(),
        ...supplierForm,
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0],
      };
      
      setSuppliers(prev => [...prev, newSupplier]);
      setIsSupplierDialogOpen(false);
      setSupplierForm({
        name: '',
        contact: '',
        email: '',
        phone: '',
        address: '',
        ruc: '',
      });
      toast.success('Proveedor creado correctamente');
    } catch (error) {
        console.warn(error);
      toast.error('Error creando proveedor');
    }
  };

  const createMovement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!movementForm.productId || movementForm.quantity <= 0) {
        toast.error('Completa todos los campos requeridos');
        return;
      }

      const product = products.find(p => p.id === movementForm.productId);
      if (!product) {
        toast.error('Producto no encontrado');
        return;
      }

      // Verificar stock suficiente para salidas
      if (movementForm.type === 'out' && product.stock < movementForm.quantity) {
        toast.error('Stock insuficiente');
        return;
      }

      const newMovement: StockMovement = {
        id: Date.now().toString(),
        productId: movementForm.productId,
        productName: product.name,
        type: movementForm.type,
        quantity: movementForm.quantity,
        reason: movementForm.reason,
        unitCost: movementForm.unitCost || undefined,
        totalCost: movementForm.unitCost ? movementForm.unitCost * movementForm.quantity : undefined,
        supplier: movementForm.supplier || undefined,
        date: new Date().toISOString().split('T')[0],
        employeeId: 'current-user',
        employeeName: 'Usuario Actual',
        createdAt: new Date().toISOString(),
      };

      // Actualizar stock del producto
      setProducts(prev => prev.map(p => {
        if (p.id === movementForm.productId) {
          let newStock = p.stock;
          if (movementForm.type === 'in') {
            newStock += movementForm.quantity;
          } else if (movementForm.type === 'out') {
            newStock -= movementForm.quantity;
          } else { // adjustment
            newStock = movementForm.quantity;
          }
          
          return {
            ...p,
            stock: Math.max(0, newStock),
            updatedAt: new Date().toISOString().split('T')[0],
          };
        }
        return p;
      }));

      setMovements(prev => [newMovement, ...prev]);
      setIsMovementDialogOpen(false);
      setMovementForm({
        productId: '',
        type: 'in',
        quantity: 0,
        reason: '',
        unitCost: 0,
        supplier: '',
      });
      toast.success('Movimiento registrado correctamente');
    } catch (error) {
        console.warn(error);
      toast.error('Error registrando movimiento');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Inventario</h1>
          <p className="text-muted-foreground">
            Control de productos, stock y proveedores
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {lowStockCount > 0 && (
            <Badge variant="destructive">
              <AlertTriangle className="mr-1 h-3 w-3" />
              {lowStockCount} productos con stock bajo
            </Badge>
          )}
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Package className="mr-2 h-4 w-4 text-goodent-primary" />
              Total Productos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-goodent-primary">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">En inventario</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <BarChart3 className="mr-2 h-4 w-4 text-goodent-secondary" />
              Valor Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-goodent-secondary">
              $ {totalValue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">En stock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertTriangle className="mr-2 h-4 w-4 text-red-500" />
              Stock Bajo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{lowStockCount}</div>
            <p className="text-xs text-muted-foreground">Productos críticos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Building className="mr-2 h-4 w-4 text-blue-500" />
              Proveedores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{suppliers.length}</div>
            <p className="text-xs text-muted-foreground">Activos</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="products">Productos</TabsTrigger>
          <TabsTrigger value="movements">Movimientos</TabsTrigger>
          <TabsTrigger value="suppliers">Proveedores</TabsTrigger>
          <TabsTrigger value="alerts">Alertas</TabsTrigger>
        </TabsList>

        {/* Productos */}
        <TabsContent value="products" className="space-y-4">
          {/* Filtros y acciones */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Search className="mr-2 h-5 w-5" />
                  Productos en Inventario
                </CardTitle>
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => setIsMovementDialogOpen(true)}
                    variant="outline"
                  >
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Movimiento
                  </Button>
                  <Button 
                    onClick={() => setIsProductDialogOpen(true)}
                    className="bg-goodent-primary hover:bg-goodent-primary/90"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Producto
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <Input
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
                <Badge variant="outline" className="border-goodent-primary text-goodent-primary">
                  {filteredProducts.length} productos
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Tabla de productos */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Proveedor</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id} className={product.stock <= product.minStock ? 'bg-red-50 dark:bg-red-900/20' : ''}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">{product.description}</div>
                          <div className="text-xs text-muted-foreground">
                            {product.unit} • {product.expirationDate && `Vence: ${new Date(product.expirationDate).toLocaleDateString()}`}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {CATEGORY_LABELS[product.category]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className={`font-medium ${product.stock <= product.minStock ? 'text-red-600' : ''}`}>
                            {product.stock} {product.unit}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Min: {product.minStock} • Max: {product.maxStock}
                          </div>
                          {product.stock <= product.minStock && (
                            <div className="flex items-center text-red-600">
                              <AlertTriangle className="mr-1 h-3 w-3" />
                              <span className="text-xs">Stock bajo</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-goodent-secondary">
                        $ {product.price.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-sm">{product.supplier}</TableCell>
                      <TableCell className="text-sm">{product.location}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <FileText className="h-4 w-4" />
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

        {/* Movimientos */}
        <TabsContent value="movements" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Movimientos de Stock</CardTitle>
                <Button 
                  onClick={() => setIsMovementDialogOpen(true)}
                  className="bg-goodent-secondary hover:bg-goodent-secondary/90"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Movimiento
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Costo</TableHead>
                    <TableHead>Motivo</TableHead>
                    <TableHead>Empleado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movements.map((movement) => (
                    <TableRow key={movement.id}>
                      <TableCell>
                        {new Date(movement.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-medium">
                        {movement.productName}
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          movement.type === 'in' ? 'bg-green-500' :
                          movement.type === 'out' ? 'bg-red-500' :
                          'bg-yellow-500'
                        }>
                          {movement.type === 'in' && <TrendingUp className="mr-1 h-3 w-3" />}
                          {movement.type === 'out' && <TrendingDown className="mr-1 h-3 w-3" />}
                          {MOVEMENT_TYPES[movement.type]}
                        </Badge>
                      </TableCell>
                      <TableCell className={movement.type === 'out' ? 'text-red-600' : 'text-green-600'}>
                        {movement.type === 'out' ? '-' : '+'}{movement.quantity}
                      </TableCell>
                      <TableCell>
                        {movement.totalCost ? `$ ${movement.totalCost.toFixed(2)}` : '-'}
                      </TableCell>
                      <TableCell className="text-sm">{movement.reason}</TableCell>
                      <TableCell className="text-sm">{movement.employeeName}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Proveedores */}
        <TabsContent value="suppliers" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Gestión de Proveedores</CardTitle>
                <Button 
                  onClick={() => setIsSupplierDialogOpen(true)}
                  className="bg-goodent-primary hover:bg-goodent-primary/90"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Proveedor
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Proveedor</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>RUC</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suppliers.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{supplier.name}</div>
                          <div className="text-sm text-muted-foreground">{supplier.address}</div>
                        </div>
                      </TableCell>
                      <TableCell>{supplier.contact}</TableCell>
                      <TableCell className="font-mono text-sm">{supplier.ruc}</TableCell>
                      <TableCell className="text-sm">{supplier.email}</TableCell>
                      <TableCell className="text-sm">{supplier.phone}</TableCell>
                      <TableCell>
                        <Badge className={supplier.isActive ? 'bg-green-500' : 'bg-gray-500'}>
                          {supplier.isActive ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <ShoppingCart className="h-4 w-4" />
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

        {/* Alertas */}
        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
                Alertas de Inventario
              </CardTitle>
            </CardHeader>
            <CardContent>
              {lowStockProducts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>No hay alertas de stock</p>
                  <p className="text-sm">Todos los productos tienen stock suficiente</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {lowStockProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 border border-red-200 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <AlertTriangle className="h-6 w-6 text-red-500" />
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">{product.description}</div>
                          <div className="text-sm text-red-600">
                            Stock actual: {product.stock} {product.unit} (Mínimo: {product.minStock})
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          onClick={() => {
                            setMovementForm(prev => ({ ...prev, productId: product.id, type: 'in' }));
                            setIsMovementDialogOpen(true);
                          }}
                          className="bg-goodent-primary hover:bg-goodent-primary/90"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Reponer Stock
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog para crear producto */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nuevo Producto</DialogTitle>
            <DialogDescription>
              Registra un nuevo producto en el sistema de inventario
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={createProduct} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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
            
            <div className="grid grid-cols-4 gap-4">
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
              
              <div>
                <label className="text-sm font-medium">Stock Máximo</label>
                <Input
                  type="number"
                  value={productForm.maxStock}
                  onChange={(e) => setProductForm(prev => ({ ...prev, maxStock: parseInt(e.target.value) || 100 }))}
                  className="mt-1"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Unidad</label>
                <Input
                  value={productForm.unit}
                  onChange={(e) => setProductForm(prev => ({ ...prev, unit: e.target.value }))}
                  placeholder="unidad, caja, litro..."
                  className="mt-1"
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Proveedor</label>
                <Input
                  value={productForm.supplier}
                  onChange={(e) => setProductForm(prev => ({ ...prev, supplier: e.target.value }))}
                  placeholder="Nombre del proveedor"
                  className="mt-1"
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Ubicación</label>
                <Input
                  value={productForm.location}
                  onChange={(e) => setProductForm(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Estante A1, Refrigerador..."
                  className="mt-1"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Fecha de Vencimiento (Opcional)</label>
              <Input
                type="date"
                value={productForm.expirationDate}
                onChange={(e) => setProductForm(prev => ({ ...prev, expirationDate: e.target.value }))}
                className="mt-1"
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsProductDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-goodent-primary hover:bg-goodent-primary/90">
                Crear Producto
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog para crear proveedor */}
      <Dialog open={isSupplierDialogOpen} onOpenChange={setIsSupplierDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo Proveedor</DialogTitle>
            <DialogDescription>
              Registra un nuevo proveedor para el inventario
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={createSupplier} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Nombre de la Empresa</label>
                <Input
                  value={supplierForm.name}
                  onChange={(e) => setSupplierForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Farmacéutica ABC"
                  required
                  className="mt-1"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">RUC</label>
                <Input
                  value={supplierForm.ruc}
                  onChange={(e) => setSupplierForm(prev => ({ ...prev, ruc: e.target.value }))}
                  placeholder="20123456789"
                  className="mt-1"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Persona de Contacto</label>
                <Input
                  value={supplierForm.contact}
                  onChange={(e) => setSupplierForm(prev => ({ ...prev, contact: e.target.value }))}
                  placeholder="Juan Pérez"
                  className="mt-1"
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Teléfono</label>
                <Input
                  value={supplierForm.phone}
                  onChange={(e) => setSupplierForm(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+51 999 123 456"
                  className="mt-1"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={supplierForm.email}
                onChange={(e) => setSupplierForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="ventas@proveedor.com"
                className="mt-1"
                required
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Dirección</label>
              <Textarea
                value={supplierForm.address}
                onChange={(e) => setSupplierForm(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Av. Principal 123, Lima"
                className="mt-1"
                required
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsSupplierDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-goodent-primary hover:bg-goodent-primary/90">
                Crear Proveedor
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog para crear movimiento */}
      <Dialog open={isMovementDialogOpen} onOpenChange={setIsMovementDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo Movimiento de Stock</DialogTitle>
            <DialogDescription>
              Registra una entrada, salida o ajuste de inventario
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={createMovement} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Producto</label>
              <select
                value={movementForm.productId}
                onChange={(e) => setMovementForm(prev => ({ ...prev, productId: e.target.value }))}
                className="w-full p-2 border rounded-md mt-1"
                required
              >
                <option value="">Seleccionar producto...</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} (Stock actual: {product.stock})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Tipo de Movimiento</label>
                <select
                  value={movementForm.type}
                  onChange={(e) => setMovementForm(prev => ({ ...prev, type: e.target.value as StockMovement['type'] }))}
                  className="w-full p-2 border rounded-md mt-1"
                >
                  <option value="in">Entrada (Compra/Ingreso)</option>
                  <option value="out">Salida (Venta/Uso)</option>
                  <option value="adjustment">Ajuste de Inventario</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Cantidad</label>
                <Input
                  type="number"
                  value={movementForm.quantity}
                  onChange={(e) => setMovementForm(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                  className="mt-1"
                  required
                  min="1"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Motivo/Razón</label>
              <Textarea
                value={movementForm.reason}
                onChange={(e) => setMovementForm(prev => ({ ...prev, reason: e.target.value }))}
                placeholder="Compra de stock, venta a paciente, ajuste por inventario..."
                className="mt-1"
                required
              />
            </div>

            {movementForm.type === 'in' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Costo Unitario (S/.)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={movementForm.unitCost}
                    onChange={(e) => setMovementForm(prev => ({ ...prev, unitCost: parseFloat(e.target.value) || 0 }))}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Proveedor</label>
                  <Input
                    value={movementForm.supplier}
                    onChange={(e) => setMovementForm(prev => ({ ...prev, supplier: e.target.value }))}
                    placeholder="Nombre del proveedor"
                    className="mt-1"
                  />
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsMovementDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-goodent-secondary hover:bg-goodent-secondary/90">
                Registrar Movimiento
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};