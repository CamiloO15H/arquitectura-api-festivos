/**
 * Validadores y Middlewares de la API Festivos
 * Implementa el patrón Chain of Responsibility antes de delegar a los controladores
 */

const { esFechaValida } = require('../servicios/calculoFechas.servicio');

const FestivoValidador = {};

/**
 * Valida la existencia y validez de la fecha gregoriana para la ruta:
 * GET /api/festivos/verificar/:anio/:mes/:dia
 */
FestivoValidador.validarFecha = (req, res, next) => {
    const { anio, mes, dia } = req.params;

    if (!anio || !mes || !dia) {
        return res.status(200).send('Fecha No valida');
    }

    if (!esFechaValida(anio, mes, dia)) {
        return res.status(200).send('Fecha No valida');
    }

    // Fecha correcta, pasa al controlador
    next();
};

/**
 * Valida que el parámetro de año sea un número válido:
 * GET /api/festivos/obtener/:anio
 */
FestivoValidador.validarAnio = (req, res, next) => {
    const anio = Number(req.params.anio);

    if (!Number.isInteger(anio) || anio < 1000 || anio > 9999) {
        return res.status(400).json({
            mensaje: 'Año no válido. Debe ser un número entero de cuatro dígitos (ej. 2026).'
        });
    }

    next();
};

/**
 * Valida el cuerpo de la petición para agregar un nuevo festivo
 */
FestivoValidador.validarAgregar = (req, res, next) => {
    const { idTipo, festivo } = req.body;

    if (!idTipo || !festivo || !festivo.nombre) {
        return res.status(400).json({
            mensaje: 'Debe incluir idTipo y el objeto festivo con al menos el campo nombre.'
        });
    }

    const tipo = Number(idTipo);
    if (![1, 2, 3, 4].includes(tipo)) {
        return res.status(400).json({
            mensaje: 'idTipo inválido. Debe ser 1 (Fijo), 2 (Puente Ley Emiliani), 3 (Pascua) o 4 (Pascua + Puente).'
        });
    }

    if ((tipo === 1 || tipo === 2) && (!festivo.dia || !festivo.mes)) {
        return res.status(400).json({
            mensaje: 'Para tipos 1 y 2, los campos día y mes son obligatorios.'
        });
    }

    if ((tipo === 3 || tipo === 4) && festivo.diasPascua === undefined) {
        return res.status(400).json({
            mensaje: 'Para tipos 3 y 4, el campo diasPascua es obligatorio.'
        });
    }

    next();
};

/**
 * Valida el cuerpo de la petición para modificar un festivo existente
 */
FestivoValidador.validarModificar = (req, res, next) => {
    const { idTipo, nombreActual, datosNuevos } = req.body;

    if (!idTipo || !nombreActual || !datosNuevos) {
        return res.status(400).json({
            mensaje: 'Debe incluir idTipo, nombreActual y el objeto datosNuevos.'
        });
    }

    next();
};

module.exports = FestivoValidador;
