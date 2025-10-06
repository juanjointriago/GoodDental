import React, { useState, useEffect } from 'react';
import { useEmployeesStore } from '../stores/employees';
import { usePatientsStore } from '../stores/patients.store';
import { useEnterpriseInfoStore } from '../stores/enterpriseinfo.store';
import type { Employee } from '../interfaces/employees.interface';
import type { IPatient } from '../interfaces/patients.interface';
import type { IenterpriseInfo } from '../interfaces/enterprise.interface';

export const FirebaseTestComponent: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  // Stores
  const { 
    employees, 
    getAndSetEmployees, 
    createEmployee, 
    updateEmployee, 
    deleteEmployee 
  } = useEmployeesStore();

  const { 
    patients, 
    getAndSetPatients, 
    createPatient, 
    updatePatient, 
    deletePatient 
  } = usePatientsStore();

  const { 
    enterpriseInfo, 
    getAndSetEnterpriseInfo, 
    createEnterpriseInfo, 
    updateEnterpriseInfo, 
    deleteEnterpriseInfo 
  } = useEnterpriseInfoStore();

  const addTestResult = (message: string, isError = false) => {
    const timestamp = new Date().toLocaleTimeString();
    const status = isError ? '❌' : '✅';
    setTestResults(prev => [...prev, `${status} [${timestamp}] ${message}`]);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  // Test Employees
  const testEmployees = async () => {
    try {
      addTestResult('🏢 Iniciando pruebas de Empleados...');

      // 1. Obtener empleados existentes
      await getAndSetEmployees();
      addTestResult(`Empleados encontrados: ${employees.length}`);

      // 2. Crear nuevo empleado
      const testEmployee: Employee = {
        id: `test-emp-${Date.now()}`,
        name: 'Test',
        lastName: 'Employee',
        email: `test.employee.${Date.now()}@gooddental.com`,
        cc: `test-${Date.now()}`,
        phone: '+593 99 999 9999',
        position: 'Dentista Test',
        department: 'medical',
        salary: 3000,
        hireDate: new Date().toISOString().split('T')[0],
        status: 'active',
        role: 'employee',
        address: 'Test Address 123',
        birthDate: Date.parse('1990-01-01'),
        city: 'Quito',
        country: 'Ecuador',
        isActive: true,
        commissionRate: 0.10,
      };

      await createEmployee(testEmployee);
      addTestResult('Empleado creado exitosamente');

      // 3. Actualizar empleado
      const updatedEmployee = { ...testEmployee, salary: 3500 };
      await updateEmployee(updatedEmployee);
      addTestResult('Empleado actualizado exitosamente');

      // 4. Eliminar empleado de prueba
      await deleteEmployee(testEmployee.id);
      addTestResult('Empleado eliminado exitosamente');

      addTestResult('✨ Pruebas de Empleados completadas');

    } catch (error) {
      addTestResult(`Error en pruebas de empleados: ${error}`, true);
    }
  };

  // Test Patients
  const testPatients = async () => {
    try {
      addTestResult('👥 Iniciando pruebas de Pacientes...');

      // 1. Obtener pacientes existentes
      await getAndSetPatients();
      addTestResult(`Pacientes encontrados: ${patients.length}`);

      // 2. Crear nuevo paciente
      const testPatient: IPatient = {
        id: `test-pat-${Date.now()}`,
        name: 'Test',
        lastName: 'Patient',
        email: `test.patient.${Date.now()}@email.com`,
        cc: `test-pat-${Date.now()}`,
        phone: '+593 99 888 8888',
        address: 'Test Patient Address 456',
        birthDate: Date.parse('1985-05-15'),
        role: 'customer',
        city: 'Quito',
        country: 'Ecuador',
        isActive: true,
        emergencyContact: 'Test Emergency Contact',
        emergencyPhone: '+593 99 777 7777',
        medicalHistory: [],
        allergies: 'Ninguna conocida',
        medications: 'Ninguna',
        insuranceProvider: 'Test Insurance',
        insuranceNumber: 'TEST123456',
      };

      await createPatient(testPatient);
      addTestResult('Paciente creado exitosamente');

      // 3. Actualizar paciente
      const updatedPatient = { ...testPatient, allergies: 'Penicilina' };
      await updatePatient(updatedPatient);
      addTestResult('Paciente actualizado exitosamente');

      // 4. Eliminar paciente de prueba
      await deletePatient(testPatient.id);
      addTestResult('Paciente eliminado exitosamente');

      addTestResult('✨ Pruebas de Pacientes completadas');

    } catch (error) {
      addTestResult(`Error en pruebas de pacientes: ${error}`, true);
    }
  };

  // Test Enterprise
  const testEnterprise = async () => {
    try {
      addTestResult('🏥 Iniciando pruebas de Información de Empresa...');

      // 1. Obtener información de empresa existente
      await getAndSetEnterpriseInfo();
      addTestResult(`Información de empresa encontrada: ${enterpriseInfo.length}`);

      // 2. Crear nueva información de empresa
      const testEnterprise: IenterpriseInfo = {
        id: `test-ent-${Date.now()}`,
        name: 'Test Dental Clinic',
        address: 'Test Clinic Address 789',
        phoneNumber: '+593 2 999 9999',
        mobileNumber: '+593 99 666 6666',
        ruc: `test-ruc-${Date.now()}`,
        email: `test.clinic.${Date.now()}@gooddental.com`,
        website: 'https://test.gooddental.com',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        socialMedia: {
          facebook: 'TestDental',
          instagram: '@testdental',
        },
        generalConditions: ['Condición de prueba 1', 'Condición de prueba 2'],
      };

      await createEnterpriseInfo(testEnterprise);
      addTestResult('Información de empresa creada exitosamente');

      // 3. Actualizar información de empresa
      const updatedEnterprise = { 
        ...testEnterprise, 
        name: 'Updated Test Dental Clinic',
        updatedAt: Date.now(),
      };
      await updateEnterpriseInfo(updatedEnterprise);
      addTestResult('Información de empresa actualizada exitosamente');

      // 4. Eliminar información de empresa de prueba
      await deleteEnterpriseInfo(testEnterprise.id!);
      addTestResult('Información de empresa eliminada exitosamente');

      addTestResult('✨ Pruebas de Información de Empresa completadas');

    } catch (error) {
      addTestResult(`Error en pruebas de empresa: ${error}`, true);
    }
  };

  // Ejecutar todas las pruebas
  const runAllTests = async () => {
    setIsRunning(true);
    clearResults();
    
    addTestResult('🚀 Iniciando pruebas completas de Firebase...');
    
    await testEmployees();
    await testPatients();
    await testEnterprise();
    
    addTestResult('🎉 Todas las pruebas completadas!');
    setIsRunning(false);
  };

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await Promise.all([
          getAndSetEmployees(),
          getAndSetPatients(),
          getAndSetEnterpriseInfo(),
        ]);
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };

    loadInitialData();
  }, [getAndSetEmployees, getAndSetPatients, getAndSetEnterpriseInfo]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">🧪 Firebase Services Test</h1>
        <p className="text-gray-600">
          Pruebas de CRUD para Empleados, Pacientes e Información de Empresa
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800">👥 Empleados</h3>
          <p className="text-2xl font-bold text-blue-900">{employees.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold text-green-800">🏥 Pacientes</h3>
          <p className="text-2xl font-bold text-green-900">{patients.length}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="font-semibold text-purple-800">🏢 Empresa</h3>
          <p className="text-2xl font-bold text-purple-900">{enterpriseInfo.length}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-wrap gap-3">
        <button
          onClick={runAllTests}
          disabled={isRunning}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isRunning ? '🔄 Ejecutando...' : '🚀 Ejecutar Todas las Pruebas'}
        </button>

        <button
          onClick={testEmployees}
          disabled={isRunning}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-400"
        >
          🏢 Test Empleados
        </button>

        <button
          onClick={testPatients}
          disabled={isRunning}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
        >
          👥 Test Pacientes
        </button>

        <button
          onClick={testEnterprise}
          disabled={isRunning}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400"
        >
          🏥 Test Empresa
        </button>

        <button
          onClick={clearResults}
          disabled={isRunning}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400"
        >
          🧹 Limpiar
        </button>
      </div>

      {/* Results */}
      <div className="bg-gray-50 border rounded-lg p-4">
        <h3 className="font-semibold mb-3">📋 Resultados de las Pruebas</h3>
        <div className="bg-black text-green-400 p-4 rounded font-mono text-sm max-h-96 overflow-y-auto">
          {testResults.length === 0 ? (
            <p className="text-gray-500">Haz clic en "Ejecutar Pruebas" para comenzar...</p>
          ) : (
            testResults.map((result, index) => (
              <div key={index} className="mb-1">
                {result}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-800 mb-2">📝 Instrucciones:</h4>
        <ol className="list-decimal list-inside text-yellow-700 space-y-1">
          <li>Asegúrate de que Firebase esté configurado correctamente</li>
          <li>Verifica que las variables de entorno estén definidas</li>
          <li>Ejecuta las pruebas individuales o todas juntas</li>
          <li>Observa los resultados en la consola de arriba</li>
          <li>Verifica en Firebase Console que los datos se crean/actualizan/eliminan</li>
        </ol>
      </div>
    </div>
  );
};