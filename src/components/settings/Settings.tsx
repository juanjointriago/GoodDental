import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Building2, 
  Globe, 
  Users, 
  Shield, 
  Palette,
  Save,
  RotateCcw,
  Download,
  Upload,
  Moon,
  Sun,
  Monitor,
  Database,
  AlertTriangle,
} from 'lucide-react';
import { useAuthStore } from '../../stores/auth.store';
import { useThemeStore } from '../../stores/theme.store';
import { toast } from 'sonner';

// Schemas para formularios
const clinicInfoSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  address: z.string().min(10, 'La dirección debe tener al menos 10 caracteres'),
  city: z.string().min(2, 'La ciudad debe tener al menos 2 caracteres'),
  country: z.string().min(2, 'El país debe tener al menos 2 caracteres'),
  phone: z.string().min(10, 'El teléfono debe tener al menos 10 dígitos'),
  email: z.string().email('Email inválido'),
  website: z.string().url('URL inválida').optional().or(z.literal('')),
  ruc: z.string().min(10, 'El RUC debe tener al menos 10 caracteres'),
  description: z.string().max(500, 'La descripción no puede superar 500 caracteres').optional(),
});

const systemPreferencesSchema = z.object({
  currency: z.enum(['USD', 'EUR', 'COP', 'PEN']),
  timezone: z.string(),
  language: z.enum(['es', 'en']),
  dateFormat: z.enum(['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']),
  timeFormat: z.enum(['12h', '24h']),
  fiscalYearStart: z.enum(['01', '04', '07', '10']),
});

const securitySchema = z.object({
  sessionTimeout: z.number().min(5).max(480),
  passwordMinLength: z.number().min(6).max(20),
  requirePasswordChange: z.boolean(),
  enableTwoFactor: z.boolean(),
  autoBackup: z.boolean(),
  backupFrequency: z.enum(['daily', 'weekly', 'monthly']),
});

type ClinicInfoForm = z.infer<typeof clinicInfoSchema>;
type SystemPreferencesForm = z.infer<typeof systemPreferencesSchema>;
type SecurityForm = z.infer<typeof securitySchema>;

// Datos iniciales
const defaultClinicInfo = {
  name: 'Clínica Dental Goodent',
  address: 'Av. Principal 123, Centro Comercial Plaza Norte',
  city: 'Quito',
  country: 'Ecuador',
  phone: '+593 99 123 4567',
  email: 'info@goodent.com',
  website: 'https://www.goodent.com',
  ruc: '1792345678001',
  description: 'Clínica dental especializada en tratamientos integrales con tecnología de vanguardia y un equipo profesional altamente calificado.',
};

const defaultSystemPreferences = {
  currency: 'USD' as const,
  timezone: 'America/Guayaquil',
  language: 'es' as const,
  dateFormat: 'DD/MM/YYYY' as const,
  timeFormat: '24h' as const,
  fiscalYearStart: '01' as const,
};

const defaultSecurity = {
  sessionTimeout: 60,
  passwordMinLength: 8,
  requirePasswordChange: false,
  enableTwoFactor: false,
  autoBackup: true,
  backupFrequency: 'weekly' as const,
};

const TIMEZONES = [
  { value: 'America/Guayaquil', label: 'Ecuador (UTC-5)' },
  { value: 'America/Bogota', label: 'Colombia (UTC-5)' },
  { value: 'America/Lima', label: 'Perú (UTC-5)' },
  { value: 'America/Mexico_City', label: 'México (UTC-6)' },
  { value: 'America/Argentina/Buenos_Aires', label: 'Argentina (UTC-3)' },
  { value: 'America/Santiago', label: 'Chile (UTC-3)' },
];

export const Settings: React.FC = () => {
  const { user } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const [activeTab, setActiveTab] = useState('clinic');
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  // Forms
  const clinicForm = useForm<ClinicInfoForm>({
    resolver: zodResolver(clinicInfoSchema),
    defaultValues: defaultClinicInfo,
  });

  const systemForm = useForm<SystemPreferencesForm>({
    resolver: zodResolver(systemPreferencesSchema),
    defaultValues: defaultSystemPreferences,
  });

  const securityForm = useForm<SecurityForm>({
    resolver: zodResolver(securitySchema),
    defaultValues: defaultSecurity,
  });

  // Solo administradores pueden acceder
  if (user?.role !== 'administrator') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 mb-4 text-red-500" />
          <h2 className="text-xl font-semibold text-red-600 mb-2">Acceso Denegado</h2>
          <p className="text-muted-foreground">Solo los administradores pueden acceder a las configuraciones</p>
        </div>
      </div>
    );
  }

  const handleSaveClinicInfo = async (data: ClinicInfoForm) => {
    try {
      // Aquí iría la lógica para guardar en la base de datos
      console.log('Guardando información de la clínica:', data);
      toast.success('Información de la clínica actualizada correctamente');
    } catch (error) {
        console.warn('Error saving clinic information:', error);
      toast.error('Error al guardar la información de la clínica');
    }
  };

  const handleSaveSystemPreferences = async (data: SystemPreferencesForm) => {
    try {
      // Aquí iría la lógica para guardar en la base de datos
      console.log('Guardando preferencias del sistema:', data);
      toast.success('Preferencias del sistema actualizadas correctamente');
    } catch (error) {
        console.warn('Error saving system preferences:', error);
      toast.error('Error al guardar las preferencias del sistema');
    }
  };

  const handleSaveSecurity = async (data: SecurityForm) => {
    try {
      // Aquí iría la lógica para guardar en la base de datos
      console.log('Guardando configuración de seguridad:', data);
      toast.success('Configuración de seguridad actualizada correctamente');
    } catch (error) {
        console.warn('Error saving security configuration:', error);
      toast.error('Error al guardar la configuración de seguridad');
    }
  };

  const handleExportSettings = () => {
    const settings = {
      clinic: clinicForm.getValues(),
      system: systemForm.getValues(),
      security: securityForm.getValues(),
      exportDate: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `goodent-settings-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    setIsExportDialogOpen(false);
    toast.success('Configuraciones exportadas correctamente');
  };

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const settings = JSON.parse(e.target?.result as string);
        
        if (settings.clinic) clinicForm.reset(settings.clinic);
        if (settings.system) systemForm.reset(settings.system);
        if (settings.security) securityForm.reset(settings.security);
        
        setIsImportDialogOpen(false);
        toast.success('Configuraciones importadas correctamente');
      } catch (error) {
        console.warn('Error importing settings:', error);
        toast.error('Error al importar las configuraciones. Archivo inválido.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetSettings = () => {
    clinicForm.reset(defaultClinicInfo);
    systemForm.reset(defaultSystemPreferences);
    securityForm.reset(defaultSecurity);
    setIsResetDialogOpen(false);
    toast.success('Configuraciones restablecidas a valores por defecto');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuraciones del Sistema</h1>
          <p className="text-muted-foreground">
            Gestiona las configuraciones de la clínica y el sistema
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Importar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Importar Configuraciones</DialogTitle>
                <DialogDescription>
                  Selecciona un archivo JSON con las configuraciones exportadas previamente
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  type="file"
                  accept=".json"
                  onChange={handleImportSettings}
                />
                <div className="text-sm text-muted-foreground">
                  <AlertTriangle className="inline h-4 w-4 mr-1" />
                  Esto sobrescribirá las configuraciones actuales
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Exportar Configuraciones</DialogTitle>
                <DialogDescription>
                  Descarga un archivo con todas las configuraciones actuales como respaldo
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleExportSettings} className="bg-goodent-primary hover:bg-goodent-primary/90">
                  <Download className="mr-2 h-4 w-4" />
                  Exportar
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <RotateCcw className="mr-2 h-4 w-4" />
                Restablecer
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Restablecer Configuraciones</DialogTitle>
                <DialogDescription>
                  ¿Estás seguro de que quieres restablecer todas las configuraciones a sus valores por defecto?
                  Esta acción no se puede deshacer.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsResetDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="destructive" onClick={handleResetSettings}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Restablecer
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="clinic" className="flex items-center">
            <Building2 className="mr-2 h-4 w-4" />
            Clínica
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center">
            <Globe className="mr-2 h-4 w-4" />
            Sistema
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            Usuarios
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center">
            <Shield className="mr-2 h-4 w-4" />
            Seguridad
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center">
            <Palette className="mr-2 h-4 w-4" />
            Apariencia
          </TabsTrigger>
        </TabsList>

        {/* Información de la Clínica */}
        <TabsContent value="clinic">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="mr-2 h-5 w-5" />
                Información de la Clínica
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...clinicForm}>
                <form onSubmit={clinicForm.handleSubmit(handleSaveClinicInfo)} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <FormField
                      control={clinicForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre de la Clínica</FormLabel>
                          <FormControl>
                            <Input placeholder="Clínica Dental Goodent" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={clinicForm.control}
                      name="ruc"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>RUC / Identificación Fiscal</FormLabel>
                          <FormControl>
                            <Input placeholder="1792345678001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={clinicForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dirección</FormLabel>
                        <FormControl>
                          <Input placeholder="Av. Principal 123, Centro Comercial Plaza Norte" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-6">
                    <FormField
                      control={clinicForm.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ciudad</FormLabel>
                          <FormControl>
                            <Input placeholder="Quito" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={clinicForm.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>País</FormLabel>
                          <FormControl>
                            <Input placeholder="Ecuador" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <FormField
                      control={clinicForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Teléfono</FormLabel>
                          <FormControl>
                            <Input placeholder="+593 99 123 4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={clinicForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="info@goodent.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={clinicForm.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sitio Web (Opcional)</FormLabel>
                          <FormControl>
                            <Input placeholder="https://www.goodent.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={clinicForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Descripción de la clínica, servicios y especialidades..."
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end">
                    <Button type="submit" className="bg-goodent-primary hover:bg-goodent-primary/90">
                      <Save className="mr-2 h-4 w-4" />
                      Guardar Información
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferencias del Sistema */}
        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="mr-2 h-5 w-5" />
                Preferencias del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...systemForm}>
                <form onSubmit={systemForm.handleSubmit(handleSaveSystemPreferences)} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <FormField
                      control={systemForm.control}
                      name="currency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Moneda</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar moneda" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="USD">Dólar Estadounidense (USD)</SelectItem>
                              <SelectItem value="EUR">Euro (EUR)</SelectItem>
                              <SelectItem value="COP">Peso Colombiano (COP)</SelectItem>
                              <SelectItem value="PEN">Sol Peruano (PEN)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={systemForm.control}
                      name="language"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Idioma</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar idioma" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="es">Español</SelectItem>
                              <SelectItem value="en">English</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={systemForm.control}
                    name="timezone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zona Horaria</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar zona horaria" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {TIMEZONES.map((tz) => (
                              <SelectItem key={tz.value} value={tz.value}>
                                {tz.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-3 gap-6">
                    <FormField
                      control={systemForm.control}
                      name="dateFormat"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Formato de Fecha</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Formato" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                              <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                              <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={systemForm.control}
                      name="timeFormat"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Formato de Hora</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Formato" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="12h">12 horas (AM/PM)</SelectItem>
                              <SelectItem value="24h">24 horas</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={systemForm.control}
                      name="fiscalYearStart"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Inicio Año Fiscal</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Mes" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="01">Enero</SelectItem>
                              <SelectItem value="04">Abril</SelectItem>
                              <SelectItem value="07">Julio</SelectItem>
                              <SelectItem value="10">Octubre</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" className="bg-goodent-primary hover:bg-goodent-primary/90">
                      <Save className="mr-2 h-4 w-4" />
                      Guardar Preferencias
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gestión de Usuarios */}
        <TabsContent value="users">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Configuración de Usuarios
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Roles y Permisos</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">Administrador</div>
                          <div className="text-sm text-muted-foreground">Acceso completo al sistema</div>
                        </div>
                        <Badge className="bg-goodent-primary">Activo</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">Empleado</div>
                          <div className="text-sm text-muted-foreground">Acceso limitado a módulos específicos</div>
                        </div>
                        <Badge className="bg-goodent-secondary">Activo</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Configuraciones de Acceso</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Registro de Usuarios</div>
                          <div className="text-sm text-muted-foreground">Permitir auto-registro</div>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Aprobación Manual</div>
                          <div className="text-sm text-muted-foreground">Requiere aprobación del administrador</div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Notificaciones por Email</div>
                          <div className="text-sm text-muted-foreground">Enviar notificaciones de nuevos usuarios</div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Seguridad */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Configuración de Seguridad
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...securityForm}>
                <form onSubmit={securityForm.handleSubmit(handleSaveSecurity)} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <FormField
                      control={securityForm.control}
                      name="sessionTimeout"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tiempo de Sesión (minutos)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="5" 
                              max="480"
                              {...field}
                              onChange={e => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={securityForm.control}
                      name="passwordMinLength"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Longitud Mínima de Contraseña</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="6" 
                              max="20"
                              {...field}
                              onChange={e => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <FormField
                      control={securityForm.control}
                      name="requirePasswordChange"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <FormLabel>Cambio de Contraseña Obligatorio</FormLabel>
                            <div className="text-sm text-muted-foreground">
                              Requerir cambio de contraseña cada 90 días
                            </div>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={securityForm.control}
                      name="enableTwoFactor"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <FormLabel>Autenticación de Dos Factores</FormLabel>
                            <div className="text-sm text-muted-foreground">
                              Habilitar 2FA para mayor seguridad
                            </div>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium flex items-center">
                      <Database className="mr-2 h-4 w-4" />
                      Respaldos Automáticos
                    </h4>

                    <FormField
                      control={securityForm.control}
                      name="autoBackup"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <FormLabel>Respaldo Automático</FormLabel>
                            <div className="text-sm text-muted-foreground">
                              Crear respaldos automáticos de la base de datos
                            </div>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={securityForm.control}
                      name="backupFrequency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Frecuencia de Respaldo</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar frecuencia" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="daily">Diario</SelectItem>
                              <SelectItem value="weekly">Semanal</SelectItem>
                              <SelectItem value="monthly">Mensual</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" className="bg-goodent-primary hover:bg-goodent-primary/90">
                      <Save className="mr-2 h-4 w-4" />
                      Guardar Configuración
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Apariencia */}
        <TabsContent value="appearance">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="mr-2 h-5 w-5" />
                  Configuración de Apariencia
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-4">Tema del Sistema</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div 
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        theme === 'light' ? 'border-goodent-primary bg-goodent-light' : 'border-border'
                      }`}
                      onClick={() => setTheme('light')}
                    >
                      <div className="flex items-center space-x-3">
                        <Sun className="h-5 w-5" />
                        <div>
                          <div className="font-medium">Claro</div>
                          <div className="text-sm text-muted-foreground">Tema claro</div>
                        </div>
                      </div>
                    </div>

                    <div 
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        theme === 'dark' ? 'border-goodent-primary bg-goodent-light' : 'border-border'
                      }`}
                      onClick={() => setTheme('dark')}
                    >
                      <div className="flex items-center space-x-3">
                        <Moon className="h-5 w-5" />
                        <div>
                          <div className="font-medium">Oscuro</div>
                          <div className="text-sm text-muted-foreground">Tema oscuro</div>
                        </div>
                      </div>
                    </div>

                    <div 
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        theme === 'system' ? 'border-goodent-primary bg-goodent-light' : 'border-border'
                      }`}
                      onClick={() => setTheme('system')}
                    >
                      <div className="flex items-center space-x-3">
                        <Monitor className="h-5 w-5" />
                        <div>
                          <div className="font-medium">Sistema</div>
                          <div className="text-sm text-muted-foreground">Automático</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-4">Colores de la Marca</h4>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-sm font-medium">Color Primario</label>
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-goodent-primary rounded-lg border"></div>
                        <div>
                          <div className="font-medium text-goodent-primary">Fucsia</div>
                          <div className="text-sm text-muted-foreground">#e91e63</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-medium">Color Secundario</label>
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-goodent-secondary rounded-lg border"></div>
                        <div>
                          <div className="font-medium text-goodent-secondary">Celeste</div>
                          <div className="text-sm text-muted-foreground">#00bcd4</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-4">Configuraciones de Interfaz</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Sidebar Compacto</div>
                        <div className="text-sm text-muted-foreground">Usar barra lateral compacta</div>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Animaciones</div>
                        <div className="text-sm text-muted-foreground">Habilitar animaciones de transición</div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Sonidos del Sistema</div>
                        <div className="text-sm text-muted-foreground">Reproducir sonidos de notificación</div>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};