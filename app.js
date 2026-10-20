/**
 * Punto de Entrada Principal de la API Festivos (Express.js)
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./configuracion/swagger.config');
const bd = require('./modelos/bd');

const app = express();
const puerto = process.env.PORT || 3000;

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Documentación interactiva Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Ruta raíz de bienvenida
app.get('/', (req, res) => {
    res.json({
        mensaje: 'Bienvenido a la API RESTful de Festivos de Colombia',
        documentacion: `http://localhost:${puerto}/api-docs`,
        endpoints: {
            verificar: `http://localhost:${puerto}/api/festivos/verificar/:anio/:mes/:dia`,
            obtener: `http://localhost:${puerto}/api/festivos/obtener/:anio`
        }
    });
});

// Cargar rutas de la API
require('./rutas/festivo.rutas')(app);

// Conectar a MongoDB y levantar el servidor HTTP
async function iniciarServidor() {
    try {
        await bd.conectar();
        app.listen(puerto, () => {
            console.log(`=======================================================`);
            console.log(`🚀 API Festivos ejecutándose en: http://localhost:${puerto}`);
            console.log(`📖 Documentación Swagger UI en: http://localhost:${puerto}/api-docs`);
            console.log(`=======================================================`);
        });
    } catch (error) {
        console.error('❌ No fue posible iniciar la aplicación por fallo en la base de datos:', error.message);
        process.exit(1);
    }
}

// Iniciar servidor solo si no se requiere como módulo
if (require.main === module) {
    iniciarServidor();
}

module.exports = app;
