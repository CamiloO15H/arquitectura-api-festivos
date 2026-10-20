/**
 * Configuración y Especificación OpenAPI / Swagger
 */

const swaggerDocument = {
    openapi: '3.0.0',
    info: {
        title: 'API Festivos de Colombia (Express.js + MongoDB)',
        version: '1.0.0',
        description: 'Microservicio RESTful para el cálculo, verificación y gestión de días festivos en Colombia según la Ley Emiliani (Ley 51 de 1983) y algoritmos astronómicos de Pascua.',
        contact: {
            name: 'Camilo Ospina Hernández & Luis David Orozco Moreno'
        }
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Servidor local de desarrollo'
        }
    ],
    tags: [
        {
            name: 'Consultas',
            description: 'Verificación y obtención de festivos'
        },
        {
            name: 'Administración',
            description: 'Operaciones CRUD sobre las reglas de festivos'
        }
    ],
    paths: {
        '/api/festivos/verificar/{anio}/{mes}/{dia}': {
            get: {
                tags: ['Consultas'],
                summary: 'Verificar si una fecha es día festivo',
                parameters: [
                    { name: 'anio', in: 'path', required: true, schema: { type: 'integer' }, example: 2026 },
                    { name: 'mes', in: 'path', required: true, schema: { type: 'integer' }, example: 1 },
                    { name: 'dia', in: 'path', required: true, schema: { type: 'integer' }, example: 1 }
                ],
                responses: {
                    200: {
                        description: 'Resultado de la verificación',
                        content: {
                            'text/plain': {
                                schema: {
                                    type: 'string',
                                    example: 'Es Festivo'
                                }
                            }
                        }
                    }
                }
            }
        },
        '/api/festivos/obtener/{anio}': {
            get: {
                tags: ['Consultas'],
                summary: 'Obtener todos los festivos de un año',
                description: 'Endpoint requerido por el Microservicio 2 (Calendario en Spring Boot). Devuelve la lista ordenada con sus fechas calculadas.',
                parameters: [
                    { name: 'anio', in: 'path', required: true, schema: { type: 'integer' }, example: 2026 }
                ],
                responses: {
                    200: {
                        description: 'Listado de festivos con fechas calculadas',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            festivo: { type: 'string', example: 'Año Nuevo' },
                                            fecha: { type: 'string', example: '2026-01-01' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        '/api/festivos/agregar': {
            post: {
                tags: ['Administración'],
                summary: 'Agregar un nuevo festivo dentro de un tipo',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    idTipo: { type: 'integer', example: 2, description: '1: Fijo, 2: Puente Ley Emiliani, 3: Pascua, 4: Pascua + Puente' },
                                    festivo: {
                                        type: 'object',
                                        properties: {
                                            dia: { type: 'integer', example: 9 },
                                            mes: { type: 'integer', example: 7 },
                                            nombre: { type: 'string', example: 'Virgen de Chiquinquirá' },
                                            diasPascua: { type: 'integer', example: 0 }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    201: { description: 'Festivo agregado exitosamente' },
                    400: { description: 'Datos inválidos' }
                }
            }
        },
        '/api/festivos/modificar': {
            put: {
                tags: ['Administración'],
                summary: 'Modificar los datos de un festivo existente',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    idTipo: { type: 'integer', example: 2 },
                                    nombreActual: { type: 'string', example: 'Virgen de Chiquinquirá' },
                                    datosNuevos: {
                                        type: 'object',
                                        properties: {
                                            nombre: { type: 'string', example: 'Virgen de Chiquinquirá (Patrona)' },
                                            dia: { type: 'integer', example: 9 },
                                            mes: { type: 'integer', example: 7 }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: { description: 'Festivo modificado exitosamente' },
                    404: { description: 'Festivo no encontrado' }
                }
            }
        },
        '/api/festivos/eliminar/{idTipo}/{nombre}': {
            delete: {
                tags: ['Administración'],
                summary: 'Eliminar un festivo de un tipo por su nombre',
                parameters: [
                    { name: 'idTipo', in: 'path', required: true, schema: { type: 'integer' }, example: 2 },
                    { name: 'nombre', in: 'path', required: true, schema: { type: 'string' }, example: 'Virgen de Chiquinquirá' }
                ],
                responses: {
                    200: { description: 'Festivo eliminado exitosamente' },
                    404: { description: 'Festivo no encontrado' }
                }
            }
        }
    }
};

module.exports = swaggerDocument;
