/**
 * Servicio de Cálculo de Fechas y Festivos
 * Basado en las directrices y fórmulas del docente Fray León Osorio Rivera (ServicioFechas.js)
 */

function obtenerDomingoRamos(anio) {
    const a = anio % 19;
    const b = anio % 4;
    const c = anio % 7;
    const d = (19 * a + 24) % 30;

    const dias = d + (2 * b + 4 * c + 6 * d + 5) % 7;

    let dia = 15 + dias;
    let mes = 3;
    if (dia > 31) {
        mes = 4;
        dia = dia - 31;
    }

    return new Date(anio, mes - 1, dia);
}

function agregarDias(fecha, dias) {
    const nuevaFecha = new Date(fecha);
    nuevaFecha.setDate(nuevaFecha.getDate() + dias);
    return nuevaFecha;
}

function siguienteLunes(fecha) {
    const nuevaFecha = new Date(fecha);
    const diaSemana = nuevaFecha.getDay();
    let diasParaLunes = 0;
    if (diaSemana !== 1) { // 1 = Lunes en JavaScript (0 = Domingo)
        diasParaLunes = (diaSemana === 0) ? 1 : 1 + (7 - diaSemana) % 7;
    }
    return agregarDias(fecha, diasParaLunes);
}

function obtenerDomingoPascua(anio) {
    const domingoRamos = obtenerDomingoRamos(anio);
    return agregarDias(domingoRamos, 7);
}

/**
 * Calcula la fecha calendario de un festivo según su tipo de regla (1, 2, 3 o 4)
 */
function calcularFechaFestivo(tipoId, festivo, anio) {
    switch (Number(tipoId)) {
        case 1:
            // Tipo 1: Fijo
            return new Date(anio, festivo.mes - 1, festivo.dia);
        case 2:
            // Tipo 2: Ley Emiliani (se traslada al siguiente lunes)
            return siguienteLunes(new Date(anio, festivo.mes - 1, festivo.dia));
        case 3: {
            // Tipo 3: Basado en Pascua sin traslado
            const pascua = obtenerDomingoPascua(anio);
            return agregarDias(pascua, festivo.diasPascua);
        }
        case 4: {
            // Tipo 4: Basado en Pascua y se traslada al siguiente lunes
            const pascua = obtenerDomingoPascua(anio);
            const fechaCalculada = agregarDias(pascua, festivo.diasPascua);
            return siguienteLunes(fechaCalculada);
        }
        default:
            throw new Error(`Tipo de festivo desconocido: ${tipoId}`);
    }
}

/**
 * Formatea una instancia Date a string ISO 'AAAA-MM-DD' sin desfase horario
 */
function formatearFechaISO(fecha) {
    const y = fecha.getFullYear();
    const m = String(fecha.getMonth() + 1).padStart(2, '0');
    const d = String(fecha.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

/**
 * Valida si un trío (anio, mes, dia) corresponde a una fecha gregoriana válida
 */
function esFechaValida(anio, mes, dia) {
    const a = Number(anio);
    const m = Number(mes);
    const d = Number(dia);

    if (!Number.isInteger(a) || !Number.isInteger(m) || !Number.isInteger(d)) {
        return false;
    }
    if (a < 1000 || a > 9999) return false;
    if (m < 1 || m > 12) return false;
    if (d < 1 || d > 31) return false;

    const fecha = new Date(a, m - 1, d);
    return fecha.getFullYear() === a && (fecha.getMonth() + 1) === m && fecha.getDate() === d;
}

module.exports = {
    obtenerDomingoRamos,
    obtenerDomingoPascua,
    agregarDias,
    siguienteLunes,
    calcularFechaFestivo,
    formatearFechaISO,
    esFechaValida
};
