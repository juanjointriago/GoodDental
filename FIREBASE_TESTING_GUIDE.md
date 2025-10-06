# 🧪 Firebase Services - Guía Completa de Pruebas

## ✅ **Implementación Completada**

### **🔧 Servicios Firebase Creados**

#### 1. **EmployeeService** (`src/services/employee.service.ts`)
```typescript
export class EmployeeService {
    static getEmployees = async (): Promise<Employee[]>
    static createEmployee = async (employee: Employee): Promise<{ id: string } & Employee>
    static updateEmployee = async (employee: Employee): Promise<void>
    static deleteEmployee = async (id: string): Promise<void>
}
```

#### 2. **PatientsService** (`src/services/patients.service.ts`)
```typescript
export class PatientsService {
    static getPatients = async (): Promise<IPatient[]>
    static createPatient = async (patient: IPatient): Promise<{ id: string } & IPatient>
    static updatePatient = async (patient: IPatient): Promise<void>
    static deletePatient = async (id: string): Promise<void>
}
```

#### 3. **EnterpriseService** (`src/services/enterprise.service.ts`)
```typescript
export class EnterpriseService {
    static getEnterpriseInfo = async (): Promise<IenterpriseInfo[]>
    static createEnterpriseInfo = async (enterprise: IenterpriseInfo): Promise<{ id: string } & IenterpriseInfo>
    static updateEnterpriseInfo = async (enterprise: IenterpriseInfo): Promise<void>
    static deleteEnterpriseInfo = async (id: string): Promise<void>
}
```

### **🏪 Stores Zustand Actualizados**

#### 1. **useEmployeesStore** (`src/stores/employees.ts`)
```typescript
interface EmployeesStore {
    employees: Employee[]
    getAndSetEmployees: () => Promise<void>
    getEmployees: () => Employee[]
    createEmployee: (employee: Employee) => Promise<void>
    updateEmployee: (employee: Employee) => Promise<void>
    deleteEmployee: (id: string) => Promise<void>
}
```

#### 2. **usePatientsStore** (`src/stores/patients.store.ts`)
```typescript
interface PatientsStore {
    patients: IPatient[]
    getAndSetPatients: () => Promise<void>
    createPatient: (patient: IPatient) => Promise<void>
    updatePatient: (patient: IPatient) => Promise<void>
    deletePatient: (id: string) => Promise<void>
    // + funcionalidades de búsqueda y filtrado
}
```

#### 3. **useEnterpriseInfoStore** (`src/stores/enterpriseinfo.store.ts`)
```typescript
interface EnterpriseInfoStore {
    enterpriseInfo: IenterpriseInfo[]
    getAndSetEnterpriseInfo: () => Promise<void>
    createEnterpriseInfo: (info: IenterpriseInfo) => Promise<void>
    updateEnterpriseInfo: (info: IenterpriseInfo) => Promise<void>
    deleteEnterpriseInfo: (id: string) => Promise<void>
}
```

### **⚡ Firebase Utils Mejorados** (`src/utils/firebase.utils.ts`)
- ✅ `getDocsFromCollection<T>()` - Obtener todos los documentos
- ✅ `setItem()` - Crear documento con ID auto-generado
- ✅ `updateItem()` - Actualizar documento existente
- ✅ `deleteItem()` - Eliminar documento
- ✅ `getItemById<T>()` - Obtener documento por ID

---

## 🧪 **Cómo Hacer Pruebas Reales**

### **Método 1: Usando el Componente React (Recomendado)**

1. **Configura Firebase:**
   ```bash
   # Crea archivo .env basado en .env.example
   cp .env.example .env
   ```

2. **Configura variables de entorno en `.env`:**
   ```env
   VITE_COLLECTION_EMPLOYEES=employees
   VITE_COLLECTION_PATIENTS=patients
   VITE_COLLECTION_ENTERPRISE=enterprise
   VITE_COLLECTION_ENTERPRISEINFO=enterpriseInfo
   
   # Tu configuración de Firebase
   VITE_FIREBASE_API_KEY=tu_api_key_aqui
   VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=tu_project_id
   # ... resto de configuración Firebase
   ```

3. **Ejecuta la aplicación:**
   ```bash
   npm run dev
   ```

4. **Navega al componente de pruebas:**
   - Inicia sesión como administrador
   - Ve a: `http://localhost:5173/firebase-test`
   - Usa el componente `FirebaseTestComponent.tsx`

### **Método 2: Pruebas Manuales en Componentes Existentes**

1. **En Dashboard:**
   ```typescript
   // El dashboard automáticamente carga pacientes al inicializar
   const { getAndSetPatients } = usePatientsStore();
   useEffect(() => {
       getAndSetPatients();
   }, []);
   ```

2. **En Empleados:**
   ```typescript
   const { getAndSetEmployees, createEmployee } = useEmployeesStore();
   
   // Cargar empleados
   await getAndSetEmployees();
   
   // Crear empleado
   await createEmployee(newEmployeeData);
   ```

3. **En Pacientes:**
   ```typescript
   const { getAndSetPatients, createPatient } = usePatientsStore();
   
   // Cargar pacientes
   await getAndSetPatients();
   
   // Crear paciente
   await createPatient(newPatientData);
   ```

### **Método 3: Pruebas Directas en Consola**

1. **Abre las DevTools de tu navegador (F12)**
2. **Ejecuta comandos directamente:**

```javascript
// Importar store (si tienes acceso)
const { useEmployeesStore } = window; // Si está disponible globalmente

// O usar desde componentes React existentes
// Los stores ya están activos en la aplicación

// Ejemplo de uso en consola:
console.log('Probando servicios Firebase...');
```

---

## 📊 **Verificación de Resultados**

### **1. En Firebase Console**
- Ve a [Firebase Console](https://console.firebase.google.com/)
- Selecciona tu proyecto
- Ve a **Firestore Database**
- Verifica que las colecciones se crean/actualizan:
  - `employees`
  - `patients` 
  - `enterpriseInfo`

### **2. En la Aplicación React**
- Verifica que los datos aparecen en las tablas
- Prueba crear/editar/eliminar registros
- Observa los logs en la consola del navegador

### **3. Logs de Depuración**
Todos los stores incluyen `console.debug` para monitoreo:
```javascript
console.debug('ALL EMPLOYEES FOUNDED ===>', { employees });
console.debug('ALL PATIENTS FOUNDED ===>', { patients });
console.debug('ALL ENTERPRISE INFO FOUNDED ===>', { enterpriseInfo });
```

---

## 🔧 **Solución de Problemas**

### **Error: "Collection not found"**
- Verifica que las variables de entorno estén configuradas
- Asegúrate de que Firebase esté inicializado correctamente

### **Error: "Permission denied"**
- Configura las reglas de Firestore en Firebase Console:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### **Error: "Firebase app not initialized"**
- Verifica que `src/db/initialize.ts` esté configurado correctamente
- Asegúrate de que las variables de entorno de Firebase estén definidas

---

## 🎯 **Próximos Pasos**

1. **✅ COMPLETADO:** Servicios y stores implementados
2. **🔧 CONFIGURAR:** Variables de entorno y Firebase
3. **🧪 PROBAR:** Usar FirebaseTestComponent.tsx
4. **🚀 DESPLEGAR:** Verificar que funciona en producción
5. **📊 MONITOREAR:** Usar Firebase Analytics para seguimiento

---

## 📝 **Archivos Creados/Modificados**

### **Nuevos:**
- ✅ `src/components/FirebaseTestComponent.tsx` - Componente de pruebas
- ✅ `public/test-firebase.html` - Página de pruebas HTML
- ✅ `test-simple.js` - Script de validación
- ✅ `.env.example` - Variables de entorno de ejemplo

### **Modificados:**
- ✅ `src/services/employee.service.ts` - Implementado
- ✅ `src/services/patients.service.ts` - Implementado  
- ✅ `src/services/enterprise.service.ts` - Implementado
- ✅ `src/services/enterprise.servicio.ts` - Métodos agregados
- ✅ `src/stores/employees.ts` - Actualizado para Firebase
- ✅ `src/stores/patients.store.ts` - Actualizado para Firebase
- ✅ `src/stores/enterpriseinfo.store.ts` - Actualizado para Firebase
- ✅ `src/utils/firebase.utils.ts` - Funciones agregadas
- ✅ `src/config/routes.config.ts` - Ruta de pruebas agregada
- ✅ `src/types/routes.ts` - Nueva ruta agregada

¡Todos los servicios están listos para usar con Firebase! 🎉