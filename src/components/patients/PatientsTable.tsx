import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '../ui/dialog';
// import { Plus } from 'lucide-react'; // Temporalmente comentado
import { usePatientsStore } from '../../stores/patients.store';
import { PatientsService } from '../../services/patients.service';
import type { IPatient } from '../../interfaces/patients.interface';
import { PatientDetailsModal } from './PatientDetailsModal';
import { toast } from 'sonner';
// import { AddPatientForm } from './AddPatientForm'; // Temporalmente comentado

export function PatientsTable() {
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<IPatient | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<IPatient | null>(null);
  // const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false); // Temporalmente comentado
  
  const {
    patients,
    getAndSetPatients,
    setSearchTerm,
    filteredPatients,
  } = usePatientsStore();

  useEffect(() => {
    if (patients.length === 0) {
      getAndSetPatients();
    }
  }, [getAndSetPatients, patients.length]);

  useEffect(() => {
    setSearchTerm(localSearchTerm);
  }, [localSearchTerm, setSearchTerm]);

  const handleViewPatient = (patient: IPatient) => {
    setSelectedPatient(patient);
    setIsDetailsModalOpen(true);
  };

  const handleDeleteClick = (patient: IPatient) => {
    setPatientToDelete(patient);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (patientToDelete) {
      try {
        // Usar la nueva función de desactivación
        await PatientsService.deactivatePatient(patientToDelete.id);
        toast.success('Paciente desactivado correctamente');
        setIsDeleteModalOpen(false);
        setPatientToDelete(null);
        // Recargar la lista de pacientes
        getAndSetPatients();
      } catch (error) {
        toast.error('Error al desactivar paciente');
        console.error('Error deactivating patient:', error);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pacientes</h1>
        <p className="text-muted-foreground">
          Gestiona la información de los pacientes registrados
        </p>
      </div>
      
      {/* Botón "Agregar Paciente" temporalmente oculto
      <div className="flex justify-end mb-4">
        <Button 
          className="bg-goodent-primary hover:bg-goodent-primary/90"
          onClick={() => setIsAddPatientModalOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Agregar Paciente
        </Button>
      </div>
      */}

      <Card>
        <CardHeader>
          <CardTitle>Lista de Pacientes</CardTitle>
          <CardDescription>
            Busca y administra los pacientes registrados en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Buscar pacientes..."
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          {filteredPatients.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {patients.length === 0 
                  ? 'No hay pacientes registrados.' 
                  : 'No se encontraron pacientes.'
                }
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredPatients.map((patient: IPatient) => (
                <Card key={patient.id}>
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">
                          {patient.name} {patient.lastName}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {patient.email}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {patient.phone}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewPatient(patient)}
                        >
                          Ver
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteClick(patient)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="mt-4 text-sm text-muted-foreground">
            Total: {filteredPatients.length} de {patients.length}
          </div>
        </CardContent>
      </Card>

      {/* Patient Details Modal */}
      <PatientDetailsModal 
        patient={selectedPatient}
        open={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedPatient(null);
        }}
      />

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas desactivar el paciente <strong>{patientToDelete?.name} {patientToDelete?.lastName}</strong>?
              <br />
              <br />
              Esta acción cambiará el estado del paciente a inactivo. La información no se eliminará permanentemente y podrá ser reactivada posteriormente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsDeleteModalOpen(false);
                setPatientToDelete(null);
              }}
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
            >
              Confirmar Desactivación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Patient Modal - Temporalmente comentado
      <AddPatientForm 
        open={isAddPatientModalOpen} 
        onClose={() => setIsAddPatientModalOpen(false)} 
      />
      */}
    </div>
  );
}
