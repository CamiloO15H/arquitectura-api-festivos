/**
 * Test de endpoints HTTP en vivo
 */

const app = require('../app');
const bd = require('../modelos/bd');

async function testHttp() {
    try {
        await bd.conectar();
        const server = app.listen(3001, async () => {
            console.log('🌐 Servidor de prueba levantado en puerto 3001.');

            const resBienvenida = await fetch('http://localhost:3001/');
            const jsonBienvenida = await resBienvenida.json();
            console.log('✅ GET / :', jsonBienvenida.mensaje);

            const resVerificarFestivo = await fetch('http://localhost:3001/api/festivos/verificar/2026/1/1');
            const textoFestivo = await resVerificarFestivo.text();
            console.log('✅ GET /api/festivos/verificar/2026/1/1 :', textoFestivo);

            const resVerificarInvalido = await fetch('http://localhost:3001/api/festivos/verificar/2026/2/35');
            const textoInvalido = await resVerificarInvalido.text();
            console.log('✅ GET /api/festivos/verificar/2026/2/35 :', textoInvalido);

            const resObtener = await fetch('http://localhost:3001/api/festivos/obtener/2026');
            const jsonObtener = await resObtener.json();
            console.log(`✅ GET /api/festivos/obtener/2026 : Se recibieron ${jsonObtener.length} festivos.`);

            const resSwagger = await fetch('http://localhost:3001/api-docs/');
            console.log('✅ GET /api-docs/ (Swagger UI Status):', resSwagger.status);

            console.log('\n🎉 ¡Todos los endpoints HTTP respondieron a la perfección!');
            server.close(async () => {
                await bd.cerrar();
                process.exit(0);
            });
        });
    } catch (e) {
        console.error('❌ Error en test HTTP:', e);
        process.exit(1);
    }
}

testHttp();
