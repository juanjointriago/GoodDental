/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Search,
  MoreHorizontal,
  Edit,
  Eye,
  Trash2,
  Users,
  UserPlus,
  Phone,
  Mail,
  Calendar,
  MapPin,
  FileText,
} from 'lucide-react';
import { toast } from 'sonner';
import { usePatientsStore } from '../../stores/patients.store';
import { useAppNavigation } from '../../hooks/useAppNavigation';
import { PatientForm } from './PatientForm';

export const PatientsTable: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<string | null>(null);

  const {
    patients,
    loading,
    searchTerm,
    selectedPatient,
    filteredPatients,
    setSearchTerm,
    setSelectedPatient,
    deletePatient,
    fetchPatients,
  } = usePatientsStore();

  const { toMedicalRecords } = useAppNavigation();

  useEffect(() => {
    if (patients.length === 0) {
      fetchPatients();
    }
  }, [fetchPatients, patients.length]);

  const handleAddPatient = () => {
    setSelectedPatientId(null);
    setSelectedPatient(null);
    setIsFormOpen(true);
  };

  const handleEditPatient = (patientId: string) => {
    const patient = patients.find((p:any) => p.id === patientId);
    if (patient) {
      setSelectedPatientId(patientId);
      setSelectedPatient(patient);
      setIsFormOpen(true);
    }
  };

  const handleViewPatient = (patientId: string) => {
    const patient = patients.find((p:any) => p.id === patientId);
    if (patient) {
      setSelectedPatient(patient);
      setIsViewDialogOpen(true);
    }
  };

  const handleDeletePatient = async (patientId: string) => {
    try {
      await deletePatient(patientId);
      toast.success('Paciente eliminado exitosamente');
      setIsDeleteDialogOpen(false);
      setPatientToDelete(null);
    } catch (error) {
        console.warn({error})
      toast.error('Error al eliminar el paciente');
    }
  };

  const handleViewMedicalRecord = (patientId: string) => {
    const patient = patients.find((p:any) => p.id === patientId);
    if (patient) {
      setSelectedPatient(patient);
      toMedicalRecords();
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (date: Date | number | undefined) => {
    if (!date) return 'No especificado';
    return new Intl.DateTimeFormat('es-EC', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  const calculateAge = (birthDate: Date | number | undefined) => {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Pacientes</h1>
          <p className="text-muted-foreground">
            Administra la información de tus pacientes
          </p>
        </div>
        <Button 
          onClick={handleAddPatient}
          className="bg-goodent-primary hover:bg-goodent-primary/90"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Nuevo Paciente
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pacientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-goodent-primary">{patients.length}</div>
            <p className="text-xs text-muted-foreground">
              Pacientes registrados en el sistema
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pacientes Activos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-goodent-secondary">
              {patients.filter((p:any) => p.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Con citas programadas o recientes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nuevos Este Mes</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-goodent-primary">
              {patients.filter((p:any) => {
                const createdAt = new Date(p.createdAt);
                const now = new Date();
                return createdAt.getMonth() === now.getMonth() && 
                       createdAt.getFullYear() === now.getFullYear();
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Registrados en el mes actual
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Pacientes</CardTitle>
          <CardDescription>
            Busca y gestiona la información de los pacientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, email o teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Edad</TableHead>
                  <TableHead>Último Registro</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-goodent-primary border-t-transparent rounded-full animate-spin mr-2" />
                        Cargando pacientes...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredPatients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="text-center">
                        <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold">No hay pacientes</h3>
                        <p className="text-muted-foreground mb-4">
                          {searchTerm ? 'No se encontraron pacientes con esos criterios' : 'Comienza agregando tu primer paciente'}
                        </p>
                        {!searchTerm && (
                          <Button onClick={handleAddPatient} className="bg-goodent-primary hover:bg-goodent-primary/90">
                            <UserPlus className="mr-2 h-4 w-4" />
                            Agregar Primer Paciente
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPatients.map((patient:any) => (
                    <TableRow key={patient.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={`https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face`} />
                            <AvatarFallback className="bg-goodent-accent text-goodent-primary">
                              {getInitials(patient.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{patient.name}</div>
                            <div className="text-sm text-muted-foreground">ID: {patient.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Mail className="mr-1 h-3 w-3 text-muted-foreground" />
                            {patient.email}
                          </div>
                          <div className="flex items-center text-sm">
                            <Phone className="mr-1 h-3 w-3 text-muted-foreground" />
                            {patient.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="mr-1 h-3 w-3 text-muted-foreground" />
                          {calculateAge(patient.birthDate)} años
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(patient.updatedAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={patient.isActive ? "default" : "secondary"}
                          className={patient.isActive ? "bg-goodent-secondary" : ""}
                        >
                          {patient.isActive ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleViewPatient(patient.id)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Ver Detalles
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditPatient(patient.id)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleViewMedicalRecord(patient.id)}>
                              <FileText className="mr-2 h-4 w-4" />
                              Historial Médico
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => {
                                setPatientToDelete(patient.id);
                                setIsDeleteDialogOpen(true);
                              }}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Patient Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedPatientId ? 'Editar Paciente' : 'Nuevo Paciente'}
            </DialogTitle>
            <DialogDescription>
              {selectedPatientId 
                ? 'Modifica la información del paciente.' 
                : 'Completa el formulario para registrar un nuevo paciente.'
              }
            </DialogDescription>
          </DialogHeader>
          <PatientForm
            patient={selectedPatient}
            onSuccess={() => {
              setIsFormOpen(false);
              setSelectedPatient(null);
              setSelectedPatientId(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* View Patient Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Información del Paciente</DialogTitle>
            <DialogDescription>
              Detalles completos del paciente seleccionado
            </DialogDescription>
          </DialogHeader>
          {selectedPatient && (
            <div className="space-y-6">
              {/* Patient Header */}
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={`https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face`} />
                  <AvatarFallback className="bg-goodent-accent text-goodent-primary text-lg">
                    {getInitials(selectedPatient.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{selectedPatient.name}</h3>
                  <p className="text-muted-foreground">{calculateAge(selectedPatient.birthDate)} años</p>
                  <Badge variant={selectedPatient.isActive ? "default" : "secondary"} className="mt-1">
                    {selectedPatient.isActive ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
              </div>

              {/* Patient Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Información Personal</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                      {selectedPatient.email}
                    </div>
                    <div className="flex items-center">
                      <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                      {selectedPatient.phone}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                      {selectedPatient.address}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      {formatDate(selectedPatient.birthDate)}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Contacto de Emergencia</h4>
                  <div className="space-y-2 text-sm">
                    <div>{selectedPatient.emergencyContact}</div>
                    <div className="flex items-center">
                      <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                      {selectedPatient.emergencyPhone}
                    </div>
                  </div>
                </div>
              </div>

              {/* Medical Information */}
              <div>
                <h4 className="font-semibold mb-2">Información Médica</h4>
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div>
                    <span className="font-medium">Alergias:</span> {selectedPatient.allergies || 'Ninguna conocida'}
                  </div>
                  <div>
                    <span className="font-medium">Medicamentos:</span> {selectedPatient.medications || 'Ninguno'}
                  </div>
                  <div>
                    <span className="font-medium">Historial Médico:</span> {
                      selectedPatient.medicalHistory && selectedPatient.medicalHistory.length > 0
                        ? `${selectedPatient.medicalHistory.length} registro(s) médico(s)`
                        : 'Sin antecedentes'
                    }
                  </div>
                </div>
              </div>

              {/* Insurance Information */}
              <div>
                <h4 className="font-semibold mb-2">Información de Seguro</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="font-medium">Proveedor:</span> {selectedPatient.insuranceProvider || 'No especificado'}
                  </div>
                  <div>
                    <span className="font-medium">Número:</span> {selectedPatient.insuranceNumber || 'No especificado'}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button variant="outline" onClick={() => handleEditPatient(selectedPatient.id)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button>
                <Button 
                  onClick={() => handleViewMedicalRecord(selectedPatient.id)}
                  className="bg-goodent-primary hover:bg-goodent-primary/90"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Ver Historial Médico
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar este paciente? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => patientToDelete && handleDeletePatient(patientToDelete)}
            >
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};