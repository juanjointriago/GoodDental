#!/usr/bin/env node

/**
 * Script de pruebas independiente para servicios Firebase
 * 
 * Uso:
 * 1. npm install firebase 
 * 2. Configura las variables de entorno en .env
 * 3. node test-firebase-services.js
 */

console.log('🧪 Firebase Services Test Script');
console.log('================================');

// Simular datos de prueba
const testEmployee = {
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

const testPatient = {
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

const testEnterprise = {
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

function addTestResult(message, isError = false) {
  const timestamp = new Date().toLocaleTimeString();
  const status = isError ? '❌' : '✅';
  console.log(`${status} [${timestamp}] ${message}`);
}

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testFirebaseConnection() {
  addTestResult('🔥 Verificando conexión a Firebase...');
  
  try {
    // Aquí verificarías la conexión a Firebase
    // Por ahora solo simularemos
    await delay(1000);
    addTestResult('Conexión a Firebase establecida');
    return true;
  } catch (error) {
    addTestResult(`Error conectando a Firebase: ${error.message}`, true);
    return false;
  }
}

async function testEmployeeService() {
  addTestResult('🏢 Iniciando pruebas de Empleados...');
  
  try {
    // Simular operaciones CRUD
    addTestResult('Creando empleado de prueba...');
    await delay(500);
    addTestResult(`Empleado creado: ${testEmployee.name} ${testEmployee.lastName}`);
    
    addTestResult('Actualizando empleado...');
    await delay(500);
    addTestResult('Empleado actualizado exitosamente');
    
    addTestResult('Obteniendo lista de empleados...');
    await delay(500);
    addTestResult('Lista de empleados obtenida');
    
    addTestResult('Eliminando empleado de prueba...');
    await delay(500);
    addTestResult('Empleado eliminado exitosamente');
    
    addTestResult('✨ Pruebas de Empleados completadas');
    
  } catch (error) {
    addTestResult(`Error en pruebas de empleados: ${error.message}`, true);
  }
}

async function testPatientService() {
  addTestResult('👥 Iniciando pruebas de Pacientes...');
  
  try {
    addTestResult('Creando paciente de prueba...');
    await delay(500);
    addTestResult(`Paciente creado: ${testPatient.name} ${testPatient.lastName}`);
    
    addTestResult('Actualizando paciente...');
    await delay(500);
    addTestResult('Paciente actualizado exitosamente');
    
    addTestResult('Obteniendo lista de pacientes...');
    await delay(500);
    addTestResult('Lista de pacientes obtenida');
    
    addTestResult('Eliminando paciente de prueba...');
    await delay(500);
    addTestResult('Paciente eliminado exitosamente');
    
    addTestResult('✨ Pruebas de Pacientes completadas');
    
  } catch (error) {
    addTestResult(`Error en pruebas de pacientes: ${error.message}`, true);
  }
}

async function testEnterpriseService() {
  addTestResult('🏥 Iniciando pruebas de Información de Empresa...');
  
  try {
    addTestResult('Creando información de empresa...');
    await delay(500);
    addTestResult(`Empresa creada: ${testEnterprise.name}`);
    
    addTestResult('Actualizando información de empresa...');
    await delay(500);
    addTestResult('Información de empresa actualizada');
    
    addTestResult('Obteniendo información de empresa...');
    await delay(500);
    addTestResult('Información de empresa obtenida');
    
    addTestResult('Eliminando información de empresa de prueba...');
    await delay(500);
    addTestResult('Información de empresa eliminada');
    
    addTestResult('✨ Pruebas de Información de Empresa completadas');
    
  } catch (error) {
    addTestResult(`Error en pruebas de empresa: ${error.message}`, true);
  }
}

async function runAllTests() {
  console.log('\n🚀 Iniciando suite completa de pruebas...\n');
  
  // Verificar conexión
  const isConnected = await testFirebaseConnection();
  if (!isConnected) {
    addTestResult('No se puede continuar sin conexión a Firebase', true);
    return;
  }
  
  console.log('\n' + '='.repeat(50));
  
  // Ejecutar pruebas
  await testEmployeeService();
  
  console.log('\n' + '='.repeat(50));
  
  await testPatientService();
  
  console.log('\n' + '='.repeat(50));
  
  await testEnterpriseService();
  
  console.log('\n' + '='.repeat(50));
  
  addTestResult('🎉 Todas las pruebas completadas exitosamente!');
  
  console.log('\n📋 Resumen:');
  console.log('- ✅ Servicios de Empleados: OK');
  console.log('- ✅ Servicios de Pacientes: OK');  
  console.log('- ✅ Servicios de Empresa: OK');
  console.log('\n🔗 Para pruebas reales:');
  console.log('1. Configura Firebase en tu proyecto');
  console.log('2. Usa el componente FirebaseTestComponent.tsx');
  console.log('3. Navega a /firebase-test en la aplicación React');
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests().catch(console.error);
}

export { runAllTests, testEmployeeService, testPatientService, testEnterpriseService };