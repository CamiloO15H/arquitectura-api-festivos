# 🚀 Primer Seguimiento (20%): Modelado Arquitectónico API Festivos

> **Asignatura:** Arquitectura de Software II  
> **Docente:** Fray León Osorio Rivera (`frayosorio@gmail.com`)  
> **Fecha Límite:** **24 de Septiembre de 2026**  
> **Estudiantes:** Camilo Ospina Hernández & Luis David Orozco Moreno  
> **Stack Tecnológico:** Node.js + Express.js + MongoDB  
> **Patrón Arquitectónico:** **Arquitectura en Capas / MVC**  

---

## 📌 Resumen del Modelo

Este entregable corresponde a la fase inicial de diseño arquitectónico y modelado de datos para el microservicio de Festivos de Colombia, sentando las bases para la implementación del Tercer Seguimiento.

---

## 📂 Archivos Fuente Individuales

* [`diagrama-objetual-festivos.md`](../diagrama-objetual-festivos.md) - Modelo Objetual de Base de Datos NoSQL en Mermaid.
* [`diagrama-arquitectura-festivos.md`](../diagrama-arquitectura-festivos.md) - Arquitectura por Capas del Microservicio en Mermaid.

---

## 📊 1. Diagrama Objetual NoSQL (MongoDB)

Para bases de datos de documentos como MongoDB, el estándar de modelado es el **Diagrama de Clases** representando **Colecciones y Subdocumentos Embebidos**. La colección raíz `TipoFestivo` (`tipos`) agrupa mediante composición (`*--`) un conjunto de festivos (`0..*`), eliminando llaves foráneas y uniones costosas.

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

## 🏛️ 2. Diagrama de Arquitectura por Capas

Sigue un patrón horizontal por capas estricto (*Separation of Concerns*):
* **Entrada y Validación:** El middleware `festivo.validador.js` actúa como *Chain of Responsibility* (`next()`) antes del controlador.
* **Lógica de Negocio Desacoplada:** `calculoFechas.servicio.js` aísla el cálculo de la Pascua y los traslados al lunes de la Ley Emiliani (Ley 51 de 1983).
* **Acceso a Datos:** `festivo.repositorio.js` gestiona directamente las colecciones en MongoDB.

```mermaid
graph TD
    subgraph ClientLayer [Capa de Cliente]
        Client[Cliente Web / Móvil / Postman / Swagger UI / Microservicio Calendario]
    end

    subgraph PresentationLayer [Capa de Presentación / API]
        Index[app.js]
        Routes[Rutas Express<br/><i>festivo.rutas.js</i>]
        Validators[Middlewares / Validadores<br/><i>festivo.validador.js</i>]
    end

    subgraph BusinessLayer [Capa de Lógica de Negocio]
        Controllers[Controladores<br/><i>festivo.controlador.js</i>]
        Services[Servicios de Negocio / Algoritmos<br/><i>calculoFechas.servicio.js</i>]
    end

    subgraph DataAccessLayer [Capa de Acceso a Datos]
        Repositories[Repositorios / Modelos<br/><i>festivo.repositorio.js</i>]
    end

    subgraph PersistenceLayer [Capa de Persistencia]
        DB[(Base de Datos - MongoDB<br/><i>Colección: tipos</i>)]
    end

    Client -->|1. Petición HTTP| Index
    Index -->|2. Enruta a| Routes
    Routes -->|3. Valida| Validators
    Validators -->|4. Next| Controllers
    Controllers -->|5. Consulta reglas| Repositories
    Repositories -->|6. Query BSON| DB
    DB -.->|7. Documentos BSON| Repositories
    Repositories -.->|8. Reglas| Controllers
    Controllers -->|9. Calcula festivos| Services
    Services -.->|10. Festivos calculados| Controllers
    Controllers -.->|11. Respuesta JSON / Status| Client

    style ClientLayer fill:#e1f5fe,stroke:#0288d1,stroke-width:2px
    style PresentationLayer fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    style BusinessLayer fill:#e8f5e9,stroke:#388e3c,stroke-width:2px
    style DataAccessLayer fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    style PersistenceLayer fill:#ffebee,stroke:#d32f2f,stroke-width:2px
```
