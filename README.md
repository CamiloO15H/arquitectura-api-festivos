# Arquitectura de Software II - Evaluación 1 (Seguimiento 20%)
## Modelado Arquitectónico: Microservicio de Festivos (Express.js + MongoDB)

> **Institución:** Instituto Tecnológico Metropolitano (ITM)  
> **Docente:** Fray León Osorio Rivera (`frayosorio@gmail.com`)  
> **Asignatura:** Arquitectura de Software II  
> **Fecha de Entrega:** Septiembre 24, 2026  

---

## 👥 Integrantes del Equipo

| Nombre Completo | Cédula / Identificación | Correo Electrónico Institucional |
| :--- | :--- | :--- |
| *[Nombre Estudiante 1]* | *[C.C. 1]* | *[email1@correo.itm.edu.co]* |
| *[Nombre Estudiante 2]* | *[C.C. 2]* | *[email2@correo.itm.edu.co]* |
| *[Nombre Estudiante 3]* | *[C.C. 3]* | *[email3@correo.itm.edu.co]* |
| *[Nombre Estudiante 4]* | *[C.C. 4]* | *[email4@correo.itm.edu.co]* |
| *[Nombre Estudiante 5]* | *[C.C. 5]* | *[email5@correo.itm.edu.co]* |

---

## 📌 Resumen de la Solución

El presente repositorio contiene la entrega oficial de la **fase de modelado arquitectónico** para la **API RESTful de Festivos de Colombia**, construida sobre el stack **Node.js + Express.js** y persistida en **MongoDB**.

Cumpliendo con los estándares evaluativos del docente Fray León Osorio:
1. **Modelado en Código Vivo (*Diagrams as Code*):** Todo el modelado fue redactado en lenguaje estándar **Mermaid.js**, garantizando interoperabilidad, control de versiones nativo en Git y renderizado directo en GitHub y VS Code.
2. **Correspondencia Fiel con la Implementación:** Los diagramas reflejan directamente los archivos, capas y flujos que se codificarán en la etapa de programación posterior.
3. **Aislamiento de Lógica Algorítmica:** La base de datos no contiene fechas estáticas precalculadas, sino las directrices de cálculo. La arquitectura modela formalmente el componente de servicio encargado de los algoritmos de Pascua y traslados de la Ley Emiliani.

---

## 📊 Diagrama 1: Modelo Objetual de Base de Datos NoSQL (MongoDB)

*Archivo fuente individual:* [`diagrama-objetual-festivos.md`](./diagrama-objetual-festivos.md)

### Justificación
Para bases de datos de documentos como MongoDB, el estándar de modelado no es el modelo relacional tradicional, sino el **Diagrama de Clases** representando **Colecciones y Subdocumentos Embebidos**. 
La colección raíz `TipoFestivo` (`tipos`) agrupa mediante agregación/composición (`*--`) un conjunto de festivos (`0..*`), eliminando la necesidad de llaves foráneas (`FK`) o uniones (`JOIN`) costosas.

```mermaid
classDiagram
    class TipoFestivo {
        +Number id
        +String tipo
        +String modoCalculo
        +Array festivos
    }

    class Festivo {
        +Number dia
        +Number mes
        +String nombre
        +Number diasPascua
    }

    TipoFestivo "1" *-- "0..*" Festivo : contiene embebidos
```

---

## 🏛️ Diagrama 2: Arquitectura por Capas del Microservicio

*Archivo fuente individual:* [`diagrama-arquitectura-festivos.md`](./diagrama-arquitectura-festivos.md)

### Justificación
Sigue un patrón horizontal por capas estricto (*Separation of Concerns*). Incorpora:
* **Entrada y Validación:** El middleware `festivo.validador.js` actúa como *Chain of Responsibility* antes del controlador, garantizando el rechazo temprano de fechas erróneas (ej. 35 de febrero).
* **Lógica de Negocio Desacoplada:** `calculoFechas.servicio.js` aísla las fórmulas astronómicas de la Pascua y los traslados al lunes de la Ley Emiliani.
* **Acceso a Datos:** `festivo.repositorio.js` gestiona directamente las colecciones en MongoDB.

```mermaid
graph TD
    %% Capa de Cliente / Presentación Externa
    subgraph ClientLayer [Capa de Cliente]
        Client[Cliente Web / Móvil / Postman / Swagger UI / Microservicio Calendario]
    end

    %% Capa de Presentación / API Gateway Local
    subgraph PresentationLayer [Capa de Presentación / API]
        Index[index.js / app.js]
        Routes[Rutas Express<br/><i>festivo.rutas.js</i>]
        Validators[Middlewares / Validadores<br/><i>festivo.validador.js</i>]
    end

    %% Capa de Lógica de Negocio
    subgraph BusinessLayer [Capa de Lógica de Negocio]
        Controllers[Controladores<br/><i>festivo.controlador.js</i>]
        Services[Servicios de Negocio / Algoritmos<br/><i>calculoFechas.servicio.js</i>]
    end

    %% Capa de Acceso a Datos
    subgraph DataAccessLayer [Capa de Acceso a Datos]
        Repositories[Repositorios / Modelos<br/><i>festivo.repositorio.js</i>]
    end

    %% Capa de Persistencia
    subgraph PersistenceLayer [Capa de Persistencia]
        DB[(Base de Datos - MongoDB<br/><i>Colección: tipos</i>)]
    end

    %% Flujo de la Petición (Request)
    Client -->|1. Petición HTTP GET/POST/PUT/DELETE| Index
    Index -->|2. Delega enrutamiento a| Routes
    Routes -->|3. Ejecuta validaciones previas| Validators
    Validators -->|4. Pasa filtro mediante next| Controllers
    Controllers -->|5. Solicita reglas / festivos a| Repositories
    Repositories -->|6. Consulta / Modifica documentos| DB

    %% Flujo de la Respuesta (Response) y Cálculo de Negocio
    DB -.->|7. Retorna documentos BSON| Repositories
    Repositories -.->|8. Entrega tipos y reglas a| Controllers
    Controllers -->|9. Envía datos y año para calcular a| Services
    Services -.->|10. Retorna festivos calculados a| Controllers
    Controllers -.->|11. Respuesta JSON / HTTP Status| Client

    %% Estilos de Nodos
    style ClientLayer fill:#e1f5fe,stroke:#0288d1,stroke-width:2px
    style PresentationLayer fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    style BusinessLayer fill:#e8f5e9,stroke:#388e3c,stroke-width:2px
    style DataAccessLayer fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    style PersistenceLayer fill:#ffebee,stroke:#d32f2f,stroke-width:2px
```

---

## 🔌 Especificación de Operaciones y Endpoints

| Método | Endpoint | Descripción de Negocio | Respuesta Esperada |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/festivos/verificar/:anio/:mes/:dia` | Verifica si una fecha puntual es festiva en Colombia. | `"Es Festivo"` / `"No es festivo"` / `"Fecha No valida"` |
| `GET` | `/api/festivos/obtener/:anio` | Devuelve el listado completo de festivos del año (consumido por Spring Boot). | Array JSON de festivos con fechas `AAAA-MM-DD`. |
| `POST`| `/api/festivos/agregar` | Registra una nueva regla de festivo dentro de un tipo existente. | Objeto festivo registrado con `201 Created`. |
| `PUT` | `/api/festivos/modificar` | Actualiza la información o regla de un festivo embebido. | Objeto modificado con `200 OK`. |
| `DELETE`| `/api/festivos/eliminar/:id` | Elimina la configuración de un festivo. | Mensaje de confirmación con `200 OK`. |

---

## ✉️ Plantilla de Correo de Entrega para el Docente

```text
Para: frayosorio@gmail.com
Asunto: Entrega Primer Seguimiento 20% - Diagramas Arquitectura API Festivos - [Nombre del Grupo o Representante]

Estimado profesor Fray León Osorio Rivera,

Compartimos el enlace al repositorio público de GitHub que contiene los diagramas arquitectónicos correspondientes al primer seguimiento (20%) del curso Arquitectura de Software II:

🔗 Link del Repositorio en GitHub:
https://github.com/[USUARIO_O_ORGANIZACION]/[NOMBRE_DEL_REPOSITORIO]

Integrantes del equipo de trabajo:
1. [Nombre Completo 1] - [Documento / C.C.]
2. [Nombre Completo 2] - [Documento / C.C.]
3. [Nombre Completo 3] - [Documento / C.C.]
4. [Nombre Completo 4] - [Documento / C.C.]
5. [Nombre Completo 5] - [Documento / C.C.]

Archivos incluidos en el repositorio:
- README.md (Consolidado general con renderizado nativo en GitHub)
- diagrama-objetual-festivos.md (Modelo NoSQL en sintaxis Mermaid classDiagram)
- diagrama-arquitectura-festivos.md (Arquitectura por capas en sintaxis Mermaid graph TD con subgraphs)

Quedamos atentos a sus comentarios y retroalimentación.

Cordialmente,
[Equipo de Trabajo]
```
