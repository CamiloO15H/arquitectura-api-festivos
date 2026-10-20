# Arquitectura de Software II - Repositorio Oficial de Seguimientos

> **Institución:** Instituto Tecnológico Metropolitano (ITM)  
> **Docente:** Fray León Osorio Rivera (`frayosorio@gmail.com`)  
> **Asignatura:** Arquitectura de Software II  
> **Repositorio Oficial:** [https://github.com/CamiloO15H/arquitectura-api-festivos](https://github.com/CamiloO15H/arquitectura-api-festivos)  

---

## 👥 Integrantes del Equipo

| # | Nombre Completo | Usuario GitHub |
| :-: | :--- | :--- |
| 1 | **Camilo Ospina Hernández** | [@CamiloO15H](https://github.com/CamiloO15H) |
| 2 | **Luis David Orozco Moreno** | Integrante |

---

## 📌 Portal de Entregas por Seguimiento

Este repositorio contiene la evolución completa del diseño arquitectónico y la implementación de los microservicios del curso:

```text
├── docs/
│   ├── tercer-seguimiento.md   # 🏆 Implementación API Festivos (Express + MongoDB)
│   ├── segundo-seguimiento.md  # 📅 Modelado API Calendario (Spring Boot - Cebolla)
│   └── primer-seguimiento.md   # 🚀 Modelado inicial API Festivos (NoSQL + Capas)
├── app.js                      # Código fuente del microservicio Express
└── ...
```

---

### 🏆 1. Tercer Seguimiento (20% - ENTREGA ACTUAL): Implementación API Festivos

* **Tecnologías:** Node.js + Express.js + MongoDB Atlas + Swagger UI  
* **Fecha Límite:** **22 de Octubre de 2026**  
* **Estado:** ✅ **100% Funcional y Verificado con Pruebas Automatizadas**  

Implementación real del microservicio RESTful para el cálculo dinámico de festivos en Colombia según la Ley Emiliani y algoritmos astronómicos de Pascua, conectado a un clúster en la nube en **MongoDB Atlas**.

```bash
# Inicio rápido del servidor
npm install
npm start
# 📖 Swagger UI disponible en: http://localhost:3000/api-docs
```

👉 **[📖 Ver Documentación Completa y Guía de Uso del Tercer Seguimiento](./docs/tercer-seguimiento.md)**

---

### 📅 2. Segundo Seguimiento (20%): Modelado Arquitectónico API Calendario

* **Tecnologías:** Java + Spring Boot + Spring Data JPA + PostgreSQL  
* **Fecha de Entrega:** **8 de Octubre de 2026**  
* **Patrón Arquitectónico:** **Arquitectura Cebolla (*Onion Architecture*)**  

Modelado arquitectónico del microservicio de Calendario Laboral que consume la API de Festivos para clasificar y persistir todos los días del año en PostgreSQL.

* 📄 **Documentación consolidada:** **[📖 Ver Documentación del Segundo Seguimiento](./docs/segundo-seguimiento.md)**
* 🏛️ **Diagrama de Arquitectura:** [`diagrama-arquitectura-calendario.md`](./diagrama-arquitectura-calendario.md)
* 📊 **Diagrama de Base de Datos:** [`diagrama-relacional-calendario.md`](./diagrama-relacional-calendario.md)

---

### 🚀 3. Primer Seguimiento (20%): Modelado Arquitectónico API Festivos

* **Tecnologías:** Node.js + Express.js + MongoDB  
* **Fecha de Entrega:** **24 de Septiembre de 2026**  
* **Patrón Arquitectónico:** **Arquitectura en Capas / MVC**  

Modelado inicial del microservicio de Festivos de Colombia, definiendo la estructura objetual en MongoDB y el flujo de llamadas por capas.

* 📄 **Documentación consolidada:** **[📖 Ver Documentación del Primer Seguimiento](./docs/primer-seguimiento.md)**
* 📊 **Diagrama Objetual NoSQL:** [`diagrama-objetual-festivos.md`](./diagrama-objetual-festivos.md)
* 🏛️ **Diagrama por Capas:** [`diagrama-arquitectura-festivos.md`](./diagrama-arquitectura-festivos.md)
