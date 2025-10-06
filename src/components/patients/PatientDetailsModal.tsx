import { type FC } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import type { IPatient } from '../../interfaces/patients.interface';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Heart, 
  Shield, 
  AlertTriangle,
  Pill 
} from 'lucide-react';

interface PatientDetailsModalProps {
  patient: IPatient | null;
  open: boolean;
  onClose: () => void;
}

export const PatientDetailsModal: FC<PatientDetailsModalProps> = ({
  patient,
  open,
  onClose
}) => {
  if (!patient) return null;

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return 'No registrada';
    return new Date(timestamp).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Detalles del Paciente
          </DialogTitle>
          <DialogDescription>
            Información completa del paciente y su historia clínica
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información Personal */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <User className="h-5 w-5" />
              Información Personal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Nombre Completo:</span>
                </div>
                <p className="ml-6">{patient.name} {patient.lastName}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Email:</span>
                </div>
                <p className="ml-6">{patient.email}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Teléfono:</span>
                </div>
                <p className="ml-6">{patient.phone}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">Identificación:</span>
                </div>
                <p className="ml-6">{patient.cc}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Fecha de Nacimiento:</span>
                </div>
                <p className="ml-6">{formatDate(patient.birthDate)}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Dirección:</span>
                </div>
                <p className="ml-6">{patient.address}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">Ciudad/País:</span>
                </div>
                <p className="ml-6">{patient.city}, {patient.country}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">Estado:</span>
                </div>
                <div className="ml-6">
                  <Badge variant={patient.isActive ? 'default' : 'destructive'}>
                    {patient.isActive ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Contacto de Emergencia */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Contacto de Emergencia
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Contacto:</span>
                </div>
                <p className="ml-6">{patient.emergencyContact || 'No registrado'}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Teléfono:</span>
                </div>
                <p className="ml-6">{patient.emergencyPhone || 'No registrado'}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Información Médica */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Información Médica
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Alergias:</span>
                </div>
                <p className="ml-6 text-sm bg-muted p-2 rounded">
                  {patient.allergies || 'No se reportan alergias'}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Pill className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Medicamentos:</span>
                </div>
                <p className="ml-6 text-sm bg-muted p-2 rounded">
                  {patient.medications || 'No toma medicamentos'}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Seguro Médico */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Seguro Médico
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">Proveedor:</span>
                </div>
                <p className="ml-6">{patient.insuranceProvider || 'No registrado'}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">Número de póliza:</span>
                </div>
                <p className="ml-6">{patient.insuranceNumber || 'No registrado'}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Historia Clínica */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Historia Clínica
            </h3>
            <div className="space-y-3">
              {patient.medicalHistory && patient.medicalHistory.length > 0 ? (
                patient.medicalHistory.map((record, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{record.treatment || 'Tratamiento'}</h4>
                      <Badge variant="outline">
                        {record.date || 'Fecha no registrada'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Diagnóstico:</strong> {record.diagnosis || 'No especificado'}
                    </p>
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Observaciones:</strong> {record.observations || 'Sin observaciones adicionales'}
                    </p>
                    {record.nextAppointment && (
                      <p className="text-sm text-muted-foreground">
                        <strong>Próxima cita:</strong> {record.nextAppointment}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No hay registros en la historia clínica</p>
                  <p className="text-sm">Los tratamientos aparecerán aquí una vez registrados</p>
                </div>
              )}
            </div>
          </div>

          {/* Información de Registro */}
          <Separator />
          <div>
            <h3 className="text-lg font-semibold mb-3">Información de Registro</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">Fecha de registro:</span>
                <p className="text-muted-foreground">{formatDate(patient.createdAt)}</p>
              </div>
              <div>
                <span className="font-medium">Última actualización:</span>
                <p className="text-muted-foreground">{formatDate(patient.updatedAt)}</p>
              </div>
              <div>
                <span className="font-medium">Último acceso:</span>
                <p className="text-muted-foreground">{formatDate(patient.lastLogin)}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};