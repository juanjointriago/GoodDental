import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '../ui/dialog';
import { UsersService } from '../../services/users.service';
import { PatientsService } from '../../services/patients.service';
import type { IUser } from '../../interfaces/users.interface';
import type { CreatePatientData } from '../../interfaces/patients.interface';
import { PatientForm } from '../patients/PatientForm';
import { toast } from 'sonner';
import { Eye, UserCheck, UserX } from 'lucide-react';

export function UsersTable() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [isPatientFormModalOpen, setIsPatientFormModalOpen] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.cc.includes(searchTerm) ||
        user.phone.includes(searchTerm)
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const usersData = await UsersService.getAllUsers();
      setUsers(usersData);
      setFilteredUsers(usersData);
    } catch (error) {
      toast.error('Error al cargar usuarios');
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleActivateUser = async (user: IUser) => {
    try {
      if (user.role === 'customer') {
        // Para clientes/pacientes, mostrar el formulario para completar datos médicos
        setSelectedUser(user);
        setIsPatientFormModalOpen(true);
      } else {
        // Para otros roles (administradores y empleados), solo activar
        await UsersService.activateUser(user.id);
        toast.success(`Usuario ${user.name} activado correctamente`);
        loadUsers(); // Recargar lista
      }
    } catch (error) {
      toast.error('Error al activar usuario');
      console.error('Error activating user:', error);
    }
  };

  const handleDeactivateUser = async (user: IUser) => {
    try {
      await UsersService.deactivateUser(user.id);
      toast.success(`Usuario ${user.name} desactivado correctamente`);
      loadUsers(); // Recargar lista
    } catch (error) {
      toast.error('Error al desactivar usuario');
      console.error('Error deactivating user:', error);
    }
  };



  const getRoleBadge = (role: string) => {
    const roleConfig = {
      administrator: { label: 'Administrador', variant: 'default' as const },
      employee: { label: 'Empleado', variant: 'secondary' as const },
      customer: { label: 'Cliente/Paciente', variant: 'outline' as const }
    };
    
    const config = roleConfig[role as keyof typeof roleConfig] || { label: role, variant: 'outline' as const };
    
    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    );
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <Badge variant={isActive ? 'default' : 'destructive'}>
        {isActive ? 'Activo' : 'Inactivo'}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Usuarios</h1>
        <p className="text-muted-foreground">
          Gestiona todos los usuarios registrados en el sistema
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios</CardTitle>
          <CardDescription>
            Busca y administra todos los usuarios del sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Buscar usuarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Cargando usuarios...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {users.length === 0 
                  ? 'No hay usuarios registrados.' 
                  : 'No se encontraron usuarios.'
                }
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredUsers.map((user: IUser) => (
                <Card key={user.id}>
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">
                            {user.name} {user.lastName}
                          </h3>
                          {getRoleBadge(user.role)}
                          {getStatusBadge(user.isActive ?? true)}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                          <p>📧 {user.email}</p>
                          <p>📱 {user.phone}</p>
                          <p>🆔 {user.cc}</p>
                          <p>📍 {user.city}, {user.country}</p>
                          <p>📅 {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
                          <p>🕒 {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Nunca'}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => console.log('Ver detalles:', user.id)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                        {user.isActive ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeactivateUser(user)}
                          >
                            <UserX className="h-4 w-4 mr-1" />
                            Desactivar
                          </Button>
                        ) : (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleActivateUser(user)}
                          >
                            <UserCheck className="h-4 w-4 mr-1" />
                            Activar
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="mt-4 text-sm text-muted-foreground">
            Total: {filteredUsers.length} de {users.length}
          </div>
        </CardContent>
      </Card>

      {/* Modal para crear paciente desde usuario */}
      <Dialog open={isPatientFormModalOpen} onOpenChange={setIsPatientFormModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Completar datos de paciente</DialogTitle>
            <DialogDescription>
              Complete los datos médicos para activar este usuario como paciente.
              Los datos básicos del usuario están precargados.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedUser && (
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Datos del Usuario:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p><strong>Nombre:</strong> {selectedUser.name} {selectedUser.lastName}</p>
                  <p><strong>Email:</strong> {selectedUser.email}</p>
                  <p><strong>Teléfono:</strong> {selectedUser.phone}</p>
                  <p><strong>CC:</strong> {selectedUser.cc}</p>
                </div>
              </div>
            )}
            <PatientForm 
              customCreateFunction={async (formData) => {
                if (!selectedUser) return;
                
                const patientData: CreatePatientData = {
                  // Datos del usuario existente (limpiando undefined)
                  name: selectedUser.name || '',
                  lastName: selectedUser.lastName || '',
                  email: selectedUser.email || '',
                  cc: selectedUser.cc || '',
                  phone: selectedUser.phone || '',
                  address: selectedUser.address || '',
                  city: selectedUser.city || '',
                  country: selectedUser.country || '',
                  birthDate: selectedUser.birthDate || Date.now(), // Usar fecha actual si no hay birthDate
                  role: 'customer',
                  avatar: selectedUser.avatar || '',
                  photoURL: selectedUser.photoURL || '',
                  isActive: true,
                  // Datos médicos del formulario
                  emergencyContact: formData.emergencyContact || '',
                  emergencyPhone: formData.emergencyPhone || '',
                  medicalHistory: [],
                  allergies: formData.allergies || '',
                  medications: formData.medications || '',
                  insuranceProvider: formData.insuranceProvider || '',
                  insuranceNumber: formData.insuranceNumber || '',
                };

                // Limpiar cualquier campo undefined antes de enviar
                const cleanedPatientData = Object.fromEntries(
                  Object.entries(patientData).filter(([, value]) => value !== undefined)
                ) as CreatePatientData;

                // Crear paciente y activar usuario
                await PatientsService.createPatientFromExistingUser(selectedUser.id, cleanedPatientData);
                await UsersService.activateUser(selectedUser.id);
              }}
              onSuccess={() => {
                toast.success('Paciente creado y usuario activado correctamente');
                setIsPatientFormModalOpen(false);
                setSelectedUser(null);
                loadUsers(); // Recargar lista
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}