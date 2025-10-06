/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { User, Mail, Phone, MapPin, Calendar, UserPlus, Heart, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { usePatientsStore } from '../../stores/patients.store';
import type { IPatient } from '../../interfaces/patients.interface';

// @ts-nocheck - Temporary suppression for form type issues

const patientSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().min(9, 'Teléfono debe tener al menos 9 caracteres'),
  birthDate: z.string().min(1, 'Fecha de nacimiento es requerida'),
  address: z.string().min(10, 'La dirección debe tener al menos 10 caracteres'),
  emergencyContact: z.string().optional().or(z.literal('')),
  emergencyPhone: z.string().optional().or(z.literal('')),
  medicalHistory: z.string().optional().or(z.literal('')),
  allergies: z.string().optional().or(z.literal('')),
  medications: z.string().optional().or(z.literal('')),
  insuranceProvider: z.string().optional().or(z.literal('')),
  insuranceNumber: z.string().optional().or(z.literal('')),
  isActive: z.boolean().or(z.literal(false))
});

type PatientFormData = z.infer<typeof patientSchema>;

interface PatientFormProps {
  patient?: IPatient | null;
  onSuccess?: () => void;
}

export const PatientForm: React.FC<PatientFormProps> = ({ 
  patient, 
  onSuccess
}) => {
  const { createPatient, updatePatient } = usePatientsStore();
  const isEditing = !!patient;

  const form = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      name: patient?.name || '',
      email: patient?.email || '',
      phone: patient?.phone || '',
      birthDate: patient?.birthDate ? new Date(patient.birthDate).toISOString().split('T')[0] : '',
      address: patient?.address || '',
      emergencyContact: patient?.emergencyContact || '',
      emergencyPhone: patient?.emergencyPhone || '',
      medicalHistory: Array.isArray(patient?.medicalHistory) ? '' : (patient?.medicalHistory || ''),
      allergies: patient?.allergies || '',
      medications: patient?.medications || '',
      insuranceProvider: patient?.insuranceProvider || '',
      insuranceNumber: patient?.insuranceNumber || '',
      isActive: patient?.isActive || false
    },
  });

  const handleSubmit = async (data: PatientFormData) => {
    try {
      const patientData = {
        ...data,
        birthDate: new Date(data.birthDate),
        email: data.email || '',
        emergencyContact: data.emergencyContact || '',
        emergencyPhone: data.emergencyPhone || '',
        medicalHistory: data.medicalHistory || '',
        allergies: data.allergies || '',
        medications: data.medications || '',
        insuranceProvider: data.insuranceProvider || '',
        insuranceNumber: data.insuranceNumber || '',
      };

      if (isEditing && patient) {
        // @ts-expect-error - Temporal para compatibilidad
        await updatePatient(patient.id, { 
          ...patientData, 
          birthDate: new Date(data.birthDate).getTime() 
        });
        toast.success('Paciente actualizado correctamente');
      } else {
        await createPatient({
          ...patientData,
          birthDate: new Date(data.birthDate).getTime(),
          lastName: '',
          cc: `temp-${Date.now()}`,
          role: 'customer',
          city: '',
          country: '',
          medicalHistory: [],
          isActive: true,
        });
        toast.success('Paciente registrado correctamente');
        form.reset();
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast.error(error.message || 'Error al procesar la información');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Información Personal */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-goodent-primary">
            <User className="h-5 w-5" />
            <h3 className="font-medium">Información Personal</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre Completo *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Juan Carlos Pérez"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de Nacimiento *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="date"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Información de Contacto */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-goodent-secondary">
            <Phone className="h-5 w-5" />
            <h3 className="font-medium">Información de Contacto</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="+593 99 999 9999"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="juan@email.com"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dirección *</FormLabel>
                <FormControl>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      placeholder="Av. Principal 123, Distrito, Ciudad"
                      className="pl-10 min-h-[80px]"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Contacto de Emergencia */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-orange-500">
            <UserPlus className="h-5 w-5" />
            <h3 className="font-medium">Contacto de Emergencia (Opcional)</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="emergencyContact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Contacto</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="María Pérez"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="emergencyPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono de Contacto</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="+593 99 999 9999"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Información Médica */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-red-500">
            <Heart className="h-5 w-5" />
            <h3 className="font-medium">Información Médica (Opcional)</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="allergies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alergias</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Penicilina, látex, etc."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="medications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medicamentos Actuales</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Medicamentos que está tomando actualmente"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="medicalHistory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Historial Médico</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Antecedentes médicos relevantes"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Información de Seguro */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-blue-500">
            <Shield className="h-5 w-5" />
            <h3 className="font-medium">Información de Seguro (Opcional)</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="insuranceProvider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proveedor de Seguro</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nombre de la aseguradora"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="insuranceNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Póliza</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Número de la póliza de seguro"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6">
          <Button
            type="submit"
            className="bg-goodent-primary hover:bg-goodent-primary/90"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent border-white" />
                Procesando...
              </>
            ) : (
              <>
                <User className="mr-2 h-4 w-4" />
                {isEditing ? 'Actualizar Paciente' : 'Registrar Paciente'}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};