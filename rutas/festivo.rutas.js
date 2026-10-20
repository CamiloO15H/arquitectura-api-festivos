/**
 * Rutas de la API Festivos
 * Mapea los verbos HTTP hacia controladores y asocia validadores
 */

const FestivoControlador = require('../controladores/festivo.controlador');
const FestivoValidador = require('../validadores/festivo.validador');

module.exports = (app) => {
    /**
     * @route GET /api/festivos/verificar/:anio/:mes/:dia
     * @desc Verifica si una fecha puntual es día festivo
     */
    app.get(
        '/api/festivos/verificar/:anio/:mes/:dia',
        FestivoValidador.validarFecha,
        FestivoControlador.verificarFecha
    );

    /**
     * @route GET /api/festivos/obtener/:anio
     * @desc Obtiene todos los festivos de un año con sus fechas calculadas
     */
    app.get(
        '/api/festivos/obtener/:anio',
        FestivoValidador.validarAnio,
        FestivoControlador.obtenerFestivosAnio
    );

    /**
     * @route POST /api/festivos/agregar
     * @desc Agrega una nueva regla de festivo a un tipo existente
     */
    app.post(
        '/api/festivos/agregar',
        FestivoValidador.validarAgregar,
        FestivoControlador.agregar
    );

    /**
     * @route PUT /api/festivos/modificar
     * @desc Modifica una regla de festivo existente
     */
    app.put(
        '/api/festivos/modificar',
        FestivoValidador.validarModificar,
        FestivoControlador.modificar
    );

    /**
     * @route DELETE /api/festivos/eliminar/:idTipo/:nombre
     * @desc Elimina un festivo de un tipo por su nombre
     */
    app.delete(
        '/api/festivos/eliminar/:idTipo/:nombre',
        FestivoControlador.eliminar
    );
};
