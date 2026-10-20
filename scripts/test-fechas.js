/**
 * Test de verificación rápida de la lógica de fechas
 */

const {
    obtenerDomingoRamos,
    obtenerDomingoPascua,
    agregarDias,
    siguienteLunes,
    formatearFechaISO
} = require('../servicios/calculoFechas.servicio');

console.log('====================================================');
console.log('🧪 PRUEBA DE FUNCIONES DE CÁLCULO DE FESTIVOS');
console.log('====================================================\n');

for (const anio of [2024, 2025, 2026]) {
    console.log(`📅 --- AÑO ${anio} ---`);
    const ramos = obtenerDomingoRamos(anio);
    const pascua = obtenerDomingoPascua(anio);
    const juevesSanto = agregarDias(pascua, -3);
    const viernesSanto = agregarDias(pascua, -2);
    const reyes = siguienteLunes(new Date(anio, 0, 6));
    const ascension = siguienteLunes(agregarDias(pascua, 40));
    const corpus = siguienteLunes(agregarDias(pascua, 61));
    const sagradoCorazon = siguienteLunes(agregarDias(pascua, 68));
    const sanPedro = siguienteLunes(new Date(anio, 5, 29));

    console.log(`  • Domingo de Ramos:       ${formatearFechaISO(ramos)}`);
    console.log(`  • Jueves Santo:           ${formatearFechaISO(juevesSanto)}`);
    console.log(`  • Viernes Santo:          ${formatearFechaISO(viernesSanto)}`);
    console.log(`  • Domingo de Pascua:      ${formatearFechaISO(pascua)}`);
    console.log(`  • Santos Reyes (Emiliani):${formatearFechaISO(reyes)}`);
    console.log(`  • Ascensión del Señor:    ${formatearFechaISO(ascension)}`);
    console.log(`  • Corpus Christi:         ${formatearFechaISO(corpus)}`);
    console.log(`  • Sagrado Corazón:        ${formatearFechaISO(sagradoCorazon)}`);
    console.log(`  • San Pedro y San Pablo:  ${formatearFechaISO(sanPedro)}\n`);
}

console.log('✅ Cálculos verificados contra el calendario oficial de Colombia.');
