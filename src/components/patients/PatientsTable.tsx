import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Plus } from 'lucide-react';
import { usePatientsStore } from '../../stores/patients.store';
import type { IPatient } from '../../interfaces/patients.interface';
import { AddPatientForm } from './AddPatientForm';

export function PatientsTable() {
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
  
  const {
    patients,
    getAndSetPatients,
    deletePatient,
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

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este paciente?')) {
      await deletePatient(id);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with Add Patient Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pacientes</h1>
          <p className="text-muted-foreground">
            Gestiona la información de los pacientes registrados
          </p>
        </div>
        <Button 
          className="bg-goodent-primary hover:bg-goodent-primary/90"
          onClick={() => setIsAddPatientModalOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Agregar Paciente
        </Button>
      </div>

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
                          onClick={() => console.log('Ver:', patient.id)}
                        >
                          Ver
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(patient.id)}
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

      {/* Add Patient Modal */}
      <AddPatientForm 
        open={isAddPatientModalOpen} 
        onClose={() => setIsAddPatientModalOpen(false)} 
      />
    </div>
  );
}
