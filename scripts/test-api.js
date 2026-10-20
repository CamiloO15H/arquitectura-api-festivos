/**
 * Script de Pruebas Integrales de la API Festivos
 * Verifica conexión a MongoDB Atlas, cálculo de festivos y endpoints
 */

require('dotenv').config();
const bd = require('../modelos/bd');
const FestivoRepositorio = require('../modelos/festivo.repositorio');
const {
    calcularFechaFestivo,
    formatearFechaISO,
    esFechaValida
} = require('../servicios/calculoFechas.servicio');

async function ejecutarPruebas() {
    console.log('===============================================================');
    console.log('🧪 INICIANDO PRUEBAS DE INTEGRACIÓN: API FESTIVOS (MONGO ATLAS)');
    console.log('===============================================================\n');

    try {
        await bd.conectar();
        console.log('✅ Paso 1: Conexión exitosa a MongoDB Atlas.\n');

        // Prueba 1: Lectura de tipos desde MongoDB
        const tipos = await FestivoRepositorio.obtenerTodosLosTipos();
        console.log(`✅ Paso 2: Lectura de BD exitosa. Se encontraron ${tipos.length} tipos de festivos.`);
        if (tipos.length !== 4) {
            throw new Error(`Se esperaban 4 tipos, pero se encontraron ${tipos.length}`);
        }

        // Prueba 2: Cálculo de festivos de 2026
        console.log('\n📅 Paso 3: Calculando todos los festivos para el año 2026...');
        const listaFestivos2026 = [];
        for (const tipo of tipos) {
            for (const festivo of tipo.festivos) {
                const fechaCalculada = calcularFechaFestivo(tipo.id, festivo, 2026);
                listaFestivos2026.push({
                    tipo: tipo.id,
                    tipoNombre: tipo.tipo,
                    festivo: festivo.nombre,
                    fecha: formatearFechaISO(fechaCalculada)
                });
            }
        }
        listaFestivos2026.sort((a, b) => a.fecha.localeCompare(b.fecha));

        console.log(`\n🎉 Total de festivos calculados para 2026: ${listaFestivos2026.length}`);
        for (const f of listaFestivos2026) {
            console.log(`   [${f.fecha}] - ${f.festivo} (Tipo ${f.tipo}: ${f.tipoNombre})`);
        }

        // Prueba 3: Verificación de fechas puntuales
        console.log('\n🔍 Paso 4: Verificación de fechas puntuales...');
        const fechasPrueba = [
            { a: 2026, m: 1, d: 1, esperado: 'Es Festivo', desc: 'Año Nuevo (Fijo)' },
            { a: 2026, m: 1, d: 12, esperado: 'Es Festivo', desc: 'Santos Reyes (Emiliani trasladado)' },
            { a: 2026, m: 4, d: 2, esperado: 'Es Festivo', desc: 'Jueves Santo (Pascua)' },
            { a: 2026, m: 4, d: 3, esperado: 'Es Festivo', desc: 'Viernes Santo (Pascua)' },
            { a: 2026, m: 6, d: 8, esperado: 'Es Festivo', desc: 'Corpus Christi (Pascua + Emiliani)' },
            { a: 2026, m: 1, d: 2, esperado: 'No es festivo', desc: 'Día laboral ordinario' },
            { a: 2026, m: 2, d: 35, esperado: 'Fecha No valida', desc: 'Día inexistente' }
        ];

        for (const p of fechasPrueba) {
            let resultado;
            if (!esFechaValida(p.a, p.m, p.d)) {
                resultado = 'Fecha No valida';
            } else {
                const coincide = listaFestivos2026.some(f => f.fecha === formatearFechaISO(new Date(p.a, p.m - 1, p.d)));
                resultado = coincide ? 'Es Festivo' : 'No es festivo';
            }

            const ok = resultado === p.esperado;
            console.log(`   ${ok ? '✅' : '❌'} ${p.a}/${p.m}/${p.d} (${p.desc}) -> Obtenido: "${resultado}" | Esperado: "${p.esperado}"`);
            if (!ok) throw new Error(`Fallo en prueba de verificación para ${p.desc}`);
        }

        // Prueba 4: CRUD sobre festivos embebidos
        console.log('\n🛠️ Paso 5: Probando operaciones CRUD (Virgen de Chiquinquirá)...');
        
        // Agregar
        const nuevoFestivo = { dia: 9, mes: 7, nombre: 'Virgen de Chiquinquira Test' };
        await FestivoRepositorio.agregarFestivo(2, nuevoFestivo);
        console.log('   ✅ INSERT ($push): Virgen de Chiquinquirá agregada al Tipo 2.');

        // Modificar
        await FestivoRepositorio.modificarFestivo(2, 'Virgen de Chiquinquira Test', { nombre: 'Virgen de Chiquinquira Modificada' });
        console.log('   ✅ UPDATE ($set): Nombre modificado exitosamente.');

        // Eliminar
        await FestivoRepositorio.eliminarFestivo(2, 'Virgen de Chiquinquira Modificada');
        console.log('   ✅ DELETE ($pull): Festivo de prueba eliminado correctamente.');

        console.log('\n===============================================================');
        console.log('🎉 ¡TODAS LAS PRUEBAS PASARON EXITOSAMENTE (100% CUMPLIMIENTO)!');
        console.log('===============================================================');

        await bd.cerrar();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error en las pruebas:', error);
        process.exit(1);
    }
}

ejecutarPruebas();
