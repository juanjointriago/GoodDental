import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Activity,
  Clock,
  FileText,
  ShoppingCart,
  UserCheck,
  AlertTriangle
} from 'lucide-react';
import { useAuthStore } from '../../stores/auth.store';
import { useEffect, type ReactNode } from 'react';
import type { JSX } from 'react/jsx-runtime';
import { usePatientsStore } from '../../stores/patients.store';

// Datos simulados para gráficos
const salesData = [
  { name: 'Ene', ventas: 4000, servicios: 2400 },
  { name: 'Feb', ventas: 3000, servicios: 1398 },
  { name: 'Mar', ventas: 2000, servicios: 9800 },
  { name: 'Abr', ventas: 2780, servicios: 3908 },
  { name: 'May', ventas: 1890, servicios: 4800 },
  { name: 'Jun', ventas: 2390, servicios: 3800 },
];

const patientsData = [
  { name: 'Nuevos', value: 35, color: '#e91e63' },
  { name: 'Regulares', value: 65, color: '#00bcd4' },
];

const appointmentsData = [
  { name: 'Lun', citas: 12 },
  { name: 'Mar', citas: 15 },
  { name: 'Mié', citas: 8 },
  { name: 'Jue', citas: 18 },
  { name: 'Vie', citas: 22 },
  { name: 'Sáb', citas: 10 },
];

interface stats{
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: ReactNode| JSX.Element | any;
  color: string;
}
export const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'administrator';
  const getAndSetPatients = usePatientsStore(state=>state.getAndSetPatients);
  const patients = usePatientsStore(state=>state.patients);
  useEffect(() => {
    const loadPatients = async ()=>{
      await getAndSetPatients();
      console.debug('Pacientes en Dashboard',patients.length)
    }
    loadPatients();

  }, [getAndSetPatients, patients.length])
  

  const adminStats:stats[] = [
    {
      title: 'Pacientes Total',
      value: '1,234',
      change: '+12%',
      changeType: 'positive',
      icon: Users,
      color: 'bg-goodent-primary',
    },
    {
      title: 'Citas Hoy',
      value: '23',
      change: '+5%',
      changeType: 'positive',
      icon: Calendar,
      color: 'bg-goodent-secondary',
    },
    {
      title: 'Ingresos del Mes',
      value: '$ 45,231',
      change: '+18%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      title: 'Empleados Activos',
      value: '8',
      change: '+2',
      changeType: 'positive',
      icon: UserCheck,
      color: 'bg-blue-500',
    },
  ];

  const employeeStats:stats[] = [
    {
      title: 'Mis Pacientes Hoy',
      value: '8',
      change: '+2',
      changeType: 'positive',
      icon: Users,
      color: 'bg-goodent-primary',
    },
    {
      title: 'Ventas del Día',
      value: '$ 1,250',
      change: '+15%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'bg-goodent-secondary',
    },
    {
      title: 'Horas Trabajadas',
      value: '6.5h',
      change: 'Normal',
      changeType: 'neutral',
      icon: Clock,
      color: 'bg-green-500',
    },
    {
      title: 'Citas Completadas',
      value: '12',
      change: '+3',
      changeType: 'positive',
      icon: Activity,
      color: 'bg-blue-500',
    },
  ];

  const stats = isAdmin ? adminStats : employeeStats;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isAdmin ? 'Panel de Administración' : 'Mi Dashboard'}
          </h1>
          <p className="text-muted-foreground">
            {isAdmin 
              ? 'Resumen general de la clínica Goodent' 
              : `Bienvenido, ${user?.name}`
            }
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="border-goodent-primary text-goodent-primary">
            {new Date().toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`${stat.color} p-2 rounded-lg`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${
                stat.changeType === 'positive' 
                  ? 'text-green-600' 
                  : stat.changeType === 'negative' 
                  ? 'text-red-600' 
                  : 'text-muted-foreground'
              }`}>
                {stat.change} desde el mes pasado
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Ventas del Mes */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-goodent-primary" />
              Ventas y Servicios
            </CardTitle>
            <CardDescription>
              Evolución de ventas y servicios en los últimos 6 meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="ventas" 
                  stackId="1"
                  stroke="var(--color-goodent-primary)" 
                  fill="var(--color-goodent-primary)" 
                  fillOpacity={0.8}
                />
                <Area 
                  type="monotone" 
                  dataKey="servicios" 
                  stackId="1"
                  stroke="var(--color-goodent-secondary)" 
                  fill="var(--color-goodent-secondary)" 
                  fillOpacity={0.8}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribución de Pacientes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5 text-goodent-secondary" />
              Pacientes
            </CardTitle>
            <CardDescription>
              Distribución de pacientes nuevos vs regulares
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={patientsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {patientsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-4 mt-4">
              {patientsData.map((entry, index) => (
                <div key={index} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: entry.color }}
                  ></div>
                  <span className="text-sm text-muted-foreground">
                    {entry.name} ({entry.value}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Citas de la Semana */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-goodent-primary" />
              Citas de la Semana
            </CardTitle>
            <CardDescription>
              Número de citas por día
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={appointmentsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar 
                  dataKey="citas" 
                  fill="var(--color-goodent-secondary)" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Acciones Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>
              Tareas frecuentes y accesos directos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-goodent-primary hover:bg-goodent-primary/90">
              <Users className="mr-2 h-4 w-4" />
              Registrar Paciente
            </Button>
            <Button variant="outline" className="w-full justify-start border-goodent-secondary text-goodent-secondary hover:bg-goodent-secondary hover:text-white">
              <Calendar className="mr-2 h-4 w-4" />
              Nueva Cita
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4" />
              Historia Clínica
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Registrar Venta
            </Button>
          </CardContent>
        </Card>

        {/* Alertas y Notificaciones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
              Alertas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Stock Bajo</p>
                <p className="text-xs text-muted-foreground">
                  3 productos necesitan reposición
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Calendar className="h-4 w-4 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Citas Pendientes</p>
                <p className="text-xs text-muted-foreground">
                  5 citas para confirmar mañana
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};