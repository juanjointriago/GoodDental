/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { 
  Search, 
  Plus, 
  FileText, 
  Calendar, 
  User,
  Stethoscope,
  Eye,
} from 'lucide-react';
import { Dentogram } from './Dentogram';
import { usePatientsStore } from '../../stores/patients.store';
import { useMedicalRecordsStore } from '../../stores/medical-records.store';
import { useAuthStore } from '../../stores/auth.store';
import { toast } from 'sonner';

export const MedicalRecords: React.FC = () => {
  const { patients, getAndSetPatients } = usePatientsStore();
  const { 
    medicalRecords, 
    createMedicalRecord, 
    getAndSetMedicalRecords,
    loading: recordsLoading 
  } = useMedicalRecordsStore();
  const { user } = useAuthStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'list' | 'patient-detail'>('list');
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [formData, setFormData] = useState({
    patientId: '',
    date: new Date().toISOString().split('T')[0],
    diagnosis: '',
    treatment: '',
    observations: '',
    nextAppointment: '',
  });

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        if (patients.length === 0) {
          await getAndSetPatients();
        }
        await getAndSetMedicalRecords();
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [getAndSetPatients, getAndSetMedicalRecords, patients.length]);

  // Update loading state when data changes
  useEffect(() => {
    if (patients.length > 0 && !recordsLoading) {
      setIsLoading(false);
    }
  }, [patients.length, recordsLoading]);

  // Helper function to get patient by ID
  const getPatientById = (patientId: string) => {
    return patients.find(p => p.id === patientId);
  };

  // Get enriched medical records with patient data
  const enrichedMedicalRecords = medicalRecords.map(record => {
    const patient = getPatientById(record.patientId);
    const employee = { name: user?.name || 'Dr. Usuario' }; // Usar datos del usuario actual
    return {
      ...record,
      patient: patient ? {
        name: patient.name,
        lastName: patient.lastName,
        cc: patient.cc,
        avatar: patient.avatar
      } : null,
      employee
    };
  });

  const filteredRecords = enrichedMedicalRecords.filter(record => {
    if (!record.patient) return false;
    return record.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           record.patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           record.patient.cc.includes(searchTerm) ||
           record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validation
      if (!formData.patientId) {
        toast.error('Selecciona un paciente');
        return;
      }
      if (formData.diagnosis.length < 10) {
        toast.error('El diagnóstico debe tener al menos 10 caracteres');
        return;
      }
      if (formData.treatment.length < 10) {
        toast.error('El tratamiento debe tener al menos 10 caracteres');
        return;
      }

      const patient = patients.find(p => p.id === formData.patientId);
      if (!patient) throw new Error('Paciente no encontrado');

      const newRecordData = {
        patientId: formData.patientId,
        employeeId: user?.id || 'current-user',
        date: formData.date,
        diagnosis: formData.diagnosis,
        treatment: formData.treatment,
        observations: formData.observations || '',
        nextAppointment: formData.nextAppointment || '',
        isActive: true,
      };

      await createMedicalRecord(newRecordData);
      setIsCreateDialogOpen(false);
      setFormData({
        patientId: '',
        date: new Date().toISOString().split('T')[0],
        diagnosis: '',
        treatment: '',
        observations: '',
        nextAppointment: '',
      });
      toast.success('Historia clínica creada correctamente');
    } catch (error: any) {
      toast.error(error.message || 'Error creando historia clínica');
    }
  };

  const handleViewPatientDetail = (patientId: string) => {
    setSelectedPatient(patientId);
    setCurrentView('patient-detail');
  };

  if (currentView === 'patient-detail' && selectedPatient) {
    const patient = patients.find(p => p.id === selectedPatient);
    const patientRecords = enrichedMedicalRecords.filter(r => r.patientId === selectedPatient);

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => setCurrentView('list')}
            >
              ← Volver
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Historia Clínica</h1>
              <p className="text-muted-foreground">
                {patient?.name} {patient?.lastName}
              </p>
            </div>
          </div>
        </div>

        {/* Patient Info Card */}
        {patient && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Información del Paciente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={patient.avatar} />
                  <AvatarFallback className="bg-goodent-primary text-white text-lg">
                    {patient.name.charAt(0)}{patient.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid grid-cols-2 gap-4 flex-1">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Nombre Completo</label>
                    <p className="font-medium">{patient.name} {patient.lastName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Cédula</label>
                    <p className="font-medium">{patient.cc}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Teléfono</label>
                    <p className="font-medium">{patient.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Edad</label>
                    <p className="font-medium">
                      {patient.birthDate ? new Date().getFullYear() - new Date(patient.birthDate).getFullYear() : 'N/A'} años
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs defaultValue="dentogram" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dentogram">Dentograma</TabsTrigger>
            <TabsTrigger value="records">Historial</TabsTrigger>
            <TabsTrigger value="appointments">Próximas Citas</TabsTrigger>
          </TabsList>

          <TabsContent value="dentogram" className="space-y-4">
            <Dentogram
              patientId={selectedPatient}
              onSave={async (data) => {
                // Aquí se guardarían los datos en el backend
                console.log('Saving dentogram data:', data);
              }}
            />
          </TabsContent>

          <TabsContent value="records" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    Historial Médico ({patientRecords.length})
                  </CardTitle>
                  <Button 
                    className="bg-goodent-primary hover:bg-goodent-primary/90"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, patientId: selectedPatient }));
                      setIsCreateDialogOpen(true);
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Nueva Consulta
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {patientRecords.length > 0 ? (
                  <div className="space-y-4 p-6">
                    {patientRecords.map((record) => (
                      <Card key={record.id} className="border-l-4 border-l-goodent-primary">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <Badge variant="outline">
                                  <Calendar className="mr-1 h-3 w-3" />
                                  {new Date(record.date).toLocaleDateString()}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  por {record.employee?.name || 'Dr. Usuario'}
                                </span>
                              </div>
                              {record.nextAppointment && (
                                <Badge className="bg-goodent-secondary">
                                  Próxima: {new Date(record.nextAppointment).toLocaleDateString()}
                                </Badge>
                              )}
                            </div>
                            
                            <div>
                              <h4 className="font-medium text-goodent-primary">Diagnóstico:</h4>
                              <p className="text-sm mt-1">{record.diagnosis}</p>
                            </div>
                            
                            <div>
                              <h4 className="font-medium text-goodent-secondary">Tratamiento:</h4>
                              <p className="text-sm mt-1">{record.treatment}</p>
                            </div>
                            
                            {record.observations && (
                              <div>
                                <h4 className="font-medium">Observaciones:</h4>
                                <p className="text-sm mt-1 text-muted-foreground">{record.observations}</p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
                    <p>No hay historias clínicas registradas</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Próximas Citas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>No hay citas programadas</p>
                  <Button className="mt-4 bg-goodent-primary hover:bg-goodent-primary/90">
                    Programar Cita
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Historias Clínicas</h1>
          <p className="text-muted-foreground">
            Gestiona las historias clínicas y dentogramas de los pacientes
          </p>
        </div>
        
        <Button 
          className="bg-goodent-primary hover:bg-goodent-primary/90"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nueva Historia
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="mr-2 h-5 w-5" />
            Buscar Historias Clínicas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por paciente, DNI o diagnóstico..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Badge variant="outline" className="border-goodent-primary text-goodent-primary">
              {filteredRecords.length} registros
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Records Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-goodent-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Cargando historias clínicas...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Diagnóstico</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Próxima Cita</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                <TableRow key={record.id} className="hover:bg-goodent-light/20">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={record.patient?.avatar || ''} />
                        <AvatarFallback className="bg-goodent-primary text-white">
                          {record.patient?.name?.charAt(0) || '?'}{record.patient?.lastName?.charAt(0) || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {record.patient?.name || 'Paciente'} {record.patient?.lastName || 'Desconocido'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          CC: {record.patient?.cc || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {new Date(record.date).toLocaleDateString()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <p className="text-sm truncate">{record.diagnosis}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Stethoscope className="mr-1 h-3 w-3 text-muted-foreground" />
                      {record.employee?.name || 'Dr. Usuario'}
                    </div>
                  </TableCell>
                  <TableCell>
                    {record.nextAppointment ? (
                      <Badge className="bg-goodent-secondary">
                        {new Date(record.nextAppointment).toLocaleDateString()}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">No programada</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewPatientDetail(record.patientId)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Ver Ficha
                    </Button>
                  </TableCell>
                </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          
          {!isLoading && filteredRecords.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No se encontraron historias clínicas</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nueva Historia Clínica</DialogTitle>
            <DialogDescription>
              Registra una nueva consulta y tratamiento para el paciente
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateRecord} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Paciente</label>
              <select 
                className="w-full p-2 border rounded-md mt-1"
                value={formData.patientId}
                onChange={(e) => handleInputChange('patientId', e.target.value)}
                required
              >
                <option value="">Seleccionar paciente...</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name} {patient.lastName} - {patient.cc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Fecha de Consulta</label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="mt-1"
                required
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Diagnóstico</label>
              <Textarea 
                placeholder="Describe el diagnóstico detallado..."
                className="min-h-[80px] mt-1"
                value={formData.diagnosis}
                onChange={(e) => handleInputChange('diagnosis', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Tratamiento</label>
              <Textarea 
                placeholder="Describe el tratamiento realizado..."
                className="min-h-[80px] mt-1"
                value={formData.treatment}
                onChange={(e) => handleInputChange('treatment', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Observaciones (Opcional)</label>
              <Textarea 
                placeholder="Observaciones adicionales..."
                className="mt-1"
                value={formData.observations}
                onChange={(e) => handleInputChange('observations', e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Próxima Cita (Opcional)</label>
              <Input
                type="date"
                value={formData.nextAppointment}
                onChange={(e) => handleInputChange('nextAppointment', e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="bg-goodent-primary hover:bg-goodent-primary/90"
              >
                Guardar Historia
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};