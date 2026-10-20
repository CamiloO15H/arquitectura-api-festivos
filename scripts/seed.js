/**
 * Script de Inicialización y Poblado de Datos (Seed) para MongoDB
 * Crea la colección 'tipos' con los 4 tipos de festivos y las reglas de Colombia
 */

require('dotenv').config();
const bd = require('../modelos/bd');

const datosIniciales = [
    {
        id: 1,
        tipo: 'Fijo',
        modoCalculo: 'No se traslada de fecha',
        festivos: [
            { dia: 1, mes: 1, nombre: 'Año Nuevo' },
            { dia: 1, mes: 5, nombre: 'Día del Trabajo' },
            { dia: 20, mes: 7, nombre: 'Día de la Independencia' },
            { dia: 7, mes: 8, nombre: 'Batalla de Boyacá' },
            { dia: 8, mes: 12, nombre: 'Inmaculada Concepción' },
            { dia: 25, mes: 12, nombre: 'Navidad' }
        ]
    },
    {
        id: 2,
        tipo: 'Ley de Puente festivo',
        modoCalculo: 'Se traslada la fecha al siguiente lunes',
        festivos: [
            { dia: 6, mes: 1, nombre: 'Santos Reyes' },
            { dia: 19, mes: 3, nombre: 'San José' },
            { dia: 29, mes: 6, nombre: 'San Pedro y San Pablo' },
            { dia: 15, mes: 8, nombre: 'Asunción de la Virgen' },
            { dia: 12, mes: 10, nombre: 'Día de la Raza' },
            { dia: 1, mes: 11, nombre: 'Todos los Santos' },
            { dia: 11, mes: 11, nombre: 'Independencia de Cartagena' }
        ]
    },
    {
        id: 3,
        tipo: 'Basado en Pascua',
        modoCalculo: 'Basado en el domingo de Pascua sin traslado',
        festivos: [
            { diasPascua: -3, nombre: 'Jueves Santo' },
            { diasPascua: -2, nombre: 'Viernes Santo' },
            { diasPascua: 0, nombre: 'Domingo de Pascua' }
        ]
    },
    {
        id: 4,
        tipo: 'Basado en Pascua y Ley de Puente festivo',
        modoCalculo: 'Basado en el domingo de Pascua y se traslada al siguiente lunes',
        festivos: [
            { diasPascua: 40, nombre: 'Ascensión del Señor' },
            { diasPascua: 61, nombre: 'Corpus Christi' },
            { diasPascua: 68, nombre: 'Sagrado Corazón de Jesús' }
        ]
    }
];

async function poblarBaseDatos() {
    try {
        console.log('🔄 Conectando a MongoDB para poblar datos iniciales...');
        const db = await bd.conectar();
        const coleccion = db.collection('tipos');

        // Limpiar datos existentes para evitar duplicados en inicialización
        await coleccion.deleteMany({});
        console.log('🧹 Colección "tipos" limpiada con éxito.');

        // Insertar los 4 tipos con sus festivos embebidos
        const resultado = await coleccion.insertMany(datosIniciales);
        console.log(`✅ ¡Éxito! Se insertaron ${resultado.insertedCount} documentos de tipos de festivos.`);

        console.log('\n📋 Resumen de datos cargados en MongoDB:');
        for (const t of datosIniciales) {
            console.log(`  • Tipo ${t.id} (${t.tipo}): ${t.festivos.length} festivos embebidos.`);
        }

        await bd.cerrar();
        console.log('\n🔒 Conexión cerrada. Base de datos lista.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error poblando la base de datos:', error);
        process.exit(1);
    }
}

poblarBaseDatos();
