# 🏆 Tercer Seguimiento (20%): Implementación API Festivos (Node.js + Express.js + MongoDB)

> **Asignatura:** Arquitectura de Software II  
> **Docente:** Fray León Osorio Rivera (`frayosorio@gmail.com`)  
> **Fecha Límite:** **22 de Octubre de 2026**  
> **Estudiantes:** Camilo Ospina Hernández & Luis David Orozco Moreno  
> **Estado:** ✅ **100% Funcional y Verificado con Pruebas Automatizadas**  

---

## 📌 Resumen de la Implementación

Esta entrega corresponde a la **implementación de código en producción** del microservicio de Festivos de Colombia. La solución calcula dinámicamente las fechas festivas a partir de las reglas almacenadas en **MongoDB Atlas**, aplicando el algoritmo astronómico de Butcher/Meeus (Pascua) y los traslados de la **Ley Emiliani (Ley 51 de 1983)**.

* **Arquitectura:** Por capas / MVC (Rutas, Validadores, Controladores, Servicios, Repositorios).
* **Base de Datos:** MongoDB Atlas en la nube (colección `tipos` con festivos embebidos).
* **Documentación:** Swagger UI interactivo en `/api-docs`.

---

## 🚀 1. Guía Rápida de Instalación y Ejecución

```bash
# 1. Clonar el repositorio
git clone https://github.com/CamiloO15H/arquitectura-api-festivos.git
cd arquitectura-api-festivos

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno (ya configurado con MongoDB Atlas por defecto)
# Puedes revisar o ajustar el archivo .env si deseas cambiar la conexión
cp .env.example .env

# 4. (Opcional) Poblar la base de datos con los festivos oficiales de Colombia
npm run seed

# 5. Iniciar el servidor Express en http://localhost:3000
npm start
```

Salida esperada en consola:
```text
=======================================================
🚀 API Festivos ejecutándose en: http://localhost:3000
📖 Documentación Swagger UI en: http://localhost:3000/api-docs
=======================================================
```

---

## 📖 2. Documentación Interactiva en Vivo (Swagger UI)

Con el servidor iniciado, abre en tu navegador:  
👉 **[http://localhost:3000/api-docs](http://localhost:3000/api-docs)**  

Allí podrás probar cada endpoint con interfaz gráfica y ver los códigos de respuesta en tiempo real.

---

## 🔌 3. Especificación Detallada de Endpoints

### A. Verificar si una fecha es festivo
* **Ruta:** `GET /api/festivos/verificar/:anio/:mes/:dia`
* **Validación previa:** Interceptado por `festivo.validador.js` (verifica validez de fecha gregoriana antes del controlador).
* **Respuestas:**
  * Si la fecha es festivo: `200 OK` $\rightarrow$ `"Es Festivo"`
  * Si es un día laboral o fin de semana común: `200 OK` $\rightarrow$ `"No es festivo"`
  * Si la fecha no existe (ej. 35 de febrero): `200 OK` $\rightarrow$ `"Fecha No valida"`

**Ejemplos de prueba:**
* `GET /api/festivos/verificar/2026/1/1` $\rightarrow$ `"Es Festivo"` *(Año Nuevo - Tipo 1: Fijo)*
* `GET /api/festivos/verificar/2026/1/12` $\rightarrow$ `"Es Festivo"` *(Santos Reyes - Tipo 2: Trasladado por Ley Emiliani)*
* `GET /api/festivos/verificar/2026/4/2` $\rightarrow$ `"Es Festivo"` *(Jueves Santo - Tipo 3: Basado en Pascua)*
* `GET /api/festivos/verificar/2026/6/8` $\rightarrow$ `"Es Festivo"` *(Corpus Christi - Tipo 4: Pascua + Ley Emiliani)*
* `GET /api/festivos/verificar/2026/1/2` $\rightarrow$ `"No es festivo"` *(Día laboral)*
* `GET /api/festivos/verificar/2026/2/35` $\rightarrow$ `"Fecha No valida"` *(Día inexistente)*

---

### B. Obtener todos los festivos de un año
* **Ruta:** `GET /api/festivos/obtener/:anio`
* **Propósito:** Endpoint de integración requerido por el microservicio de Calendario (Spring Boot).
* **Ejemplo:** `GET /api/festivos/obtener/2026`
* **Respuesta:** Array JSON ordenado cronológicamente con los 19 festivos oficiales:
  ```json
  [
    { "festivo": "Año Nuevo", "fecha": "2026-01-01" },
    { "festivo": "Santos Reyes", "fecha": "2026-01-12" },
    { "festivo": "San José", "fecha": "2026-03-23" },
    { "festivo": "Jueves Santo", "fecha": "2026-04-02" },
    { "festivo": "Viernes Santo", "fecha": "2026-04-03" },
    { "festivo": "Domingo de Pascua", "fecha": "2026-04-05" },
    { "festivo": "Día del Trabajo", "fecha": "2026-05-01" },
    { "festivo": "Ascensión del Señor", "fecha": "2026-05-18" },
    { "festivo": "Corpus Christi", "fecha": "2026-06-08" },
    { "festivo": "Sagrado Corazón de Jesús", "fecha": "2026-06-15" },
    { "festivo": "San Pedro y San Pablo", "fecha": "2026-06-29" },
    { "festivo": "Día de la Independencia", "fecha": "2026-07-20" },
    { "festivo": "Batalla de Boyacá", "fecha": "2026-08-07" },
    { "festivo": "Asunción de la Virgen", "fecha": "2026-08-17" },
    { "festivo": "Día de la Raza", "fecha": "2026-10-12" },
    { "festivo": "Todos los Santos", "fecha": "2026-11-02" },
    { "festivo": "Independencia de Cartagena", "fecha": "2026-11-16" },
    { "festivo": "Inmaculada Concepción", "fecha": "2026-12-08" },
    { "festivo": "Navidad", "fecha": "2026-12-25" }
  ]
  ```

---

### C. Operaciones CRUD sobre MongoDB (Colección `tipos`)

* **Agregar festivo (`POST /api/festivos/agregar`):**
  Agrega un nuevo festivo al arreglo embebido del tipo correspondiente (`$push`):
  ```json
  {
    "idTipo": 2,
    "festivo": {
      "dia": 9,
      "mes": 7,
      "nombre": "Virgen de Chiquinquirá"
    }
  }
  ```

* **Modificar festivo (`PUT /api/festivos/modificar`):**
  Actualiza los campos de un festivo existente (`$set`):
  ```json
  {
    "idTipo": 2,
    "nombreActual": "Virgen de Chiquinquirá",
    "datosNuevos": {
      "nombre": "Virgen de Chiquinquirá (Patrona de Colombia)"
    }
  }
  ```

* **Eliminar festivo (`DELETE /api/festivos/eliminar/:idTipo/:nombre`):**
  Elimina el festivo del arreglo embebido mediante `$pull`.

---

## 🧪 4. Pruebas Automatizadas

```bash
# Probar funciones matemáticas aisladas de ServicioFechas.js
npm test

# Probar integración completa contra MongoDB Atlas
node scripts/test-api.js

# Probar servidor HTTP en vivo
node scripts/test-server.js
```

---

## 📂 5. Estructura Física de Archivos

```text
├── app.js                          # Configuración de Express, CORS y servidor
├── configuracion/
│   ├── bd.config.js                # Variables de conexión a MongoDB Atlas
│   └── swagger.config.js           # Especificación OpenAPI 3.0 para Swagger
├── controladores/
│   └── festivo.controlador.js      # Lógica de respuestas HTTP
├── modelos/
│   ├── bd.js                       # Conexión oficial MongoClient
│   └── festivo.repositorio.js      # Operaciones atómicas MongoDB ($push, $set, $pull)
├── rutas/
│   └── festivo.rutas.js            # Enrutamiento de endpoints
├── servicios/
│   └── calculoFechas.servicio.js   # Algoritmo de Butcher/Meeus y Ley Emiliani
├── validadores/
│   └── festivo.validador.js        # Middleware de validación de fechas (Chain of Resp.)
└── scripts/
    ├── seed.js                     # Inicialización de colección 'tipos' en Atlas
    ├── test-api.js                 # Pruebas integrales de BD y endpoints
    ├── test-fechas.js              # Pruebas unitarias de cálculo
    └── test-server.js              # Pruebas HTTP en vivo
```
