/**
 * Controlador de Festivos
 * Orquesta la lógica de negocio y las respuestas HTTP
 */

const FestivoRepositorio = require('../modelos/festivo.repositorio');
const {
    calcularFechaFestivo,
    formatearFechaISO
} = require('../servicios/calculoFechas.servicio');

const FestivoControlador = {};

/**
 * Verifica si una fecha puntual es día festivo en Colombia
 * GET /api/festivos/verificar/:anio/:mes/:dia
 * Respuestas: "Es Festivo" | "No es festivo" | "Fecha No valida"
 */
FestivoControlador.verificarFecha = async (req, res) => {
    try {
        const anio = Number(req.params.anio);
        const mes = Number(req.params.mes);
        const dia = Number(req.params.dia);

        const tipos = await FestivoRepositorio.obtenerTodosLosTipos();

        for (const tipo of tipos) {
            if (!tipo.festivos || !Array.isArray(tipo.festivos)) continue;

            for (const festivo of tipo.festivos) {
                const fechaCalculada = calcularFechaFestivo(tipo.id, festivo, anio);

                const cAnio = fechaCalculada.getFullYear();
                const cMes = fechaCalculada.getMonth() + 1;
                const cDia = fechaCalculada.getDate();

                if (cAnio === anio && cMes === mes && cDia === dia) {
                    return res.status(200).send('Es Festivo');
                }
            }
        }

        return res.status(200).send('No es festivo');
    } catch (error) {
        console.error('Error al verificar fecha:', error);
        return res.status(500).json({ error: 'Error interno al verificar la fecha', detalle: error.message });
    }
};

/**
 * Devuelve el listado completo de todos los festivos del año con sus fechas calculadas
 * GET /api/festivos/obtener/:anio
 * Consumido por el Microservicio 2 (Calendario en Spring Boot)
 */
FestivoControlador.obtenerFestivosAnio = async (req, res) => {
    try {
        const anio = Number(req.params.anio);
        const tipos = await FestivoRepositorio.obtenerTodosLosTipos();
        const listaFestivos = [];

        for (const tipo of tipos) {
            if (!tipo.festivos || !Array.isArray(tipo.festivos)) continue;

            for (const festivo of tipo.festivos) {
                const fechaCalculada = calcularFechaFestivo(tipo.id, festivo, anio);
                listaFestivos.push({
                    festivo: festivo.nombre,
                    fecha: formatearFechaISO(fechaCalculada)
                });
            }
        }

        // Ordenar cronológicamente
        listaFestivos.sort((a, b) => a.fecha.localeCompare(b.fecha));

        return res.status(200).json(listaFestivos);
    } catch (error) {
        console.error('Error al obtener festivos del año:', error);
        return res.status(500).json({ error: 'Error interno al obtener festivos', detalle: error.message });
    }
};

/**
 * Agrega un nuevo festivo dentro de un tipo existente
 * POST /api/festivos/agregar
 */
FestivoControlador.agregar = async (req, res) => {
    try {
        const { idTipo, festivo } = req.body;
        const resultado = await FestivoRepositorio.agregarFestivo(idTipo, festivo);

        if (resultado.matchedCount === 0) {
            return res.status(404).json({ mensaje: `Tipo con id ${idTipo} no encontrado` });
        }

        return res.status(201).json({
            mensaje: 'Festivo agregado exitosamente',
            idTipo,
            festivo
        });
    } catch (error) {
        console.error('Error agregando festivo:', error);
        return res.status(500).json({ error: 'Error agregando festivo', detalle: error.message });
    }
};

/**
 * Modifica los datos de un festivo existente
 * PUT /api/festivos/modificar
 */
FestivoControlador.modificar = async (req, res) => {
    try {
        const { idTipo, nombreActual, datosNuevos } = req.body;
        const resultado = await FestivoRepositorio.modificarFestivo(idTipo, nombreActual, datosNuevos);

        if (resultado.matchedCount === 0) {
            return res.status(404).json({ mensaje: `No se encontró el festivo '${nombreActual}' en el tipo ${idTipo}` });
        }

        return res.status(200).json({
            mensaje: 'Festivo modificado exitosamente',
            idTipo,
            nombreActual,
            datosNuevos
        });
    } catch (error) {
        console.error('Error modificando festivo:', error);
        return res.status(500).json({ error: 'Error modificando festivo', detalle: error.message });
    }
};

/**
 * Elimina un festivo por idTipo y nombre
 * DELETE /api/festivos/eliminar/:idTipo/:nombre
 */
FestivoControlador.eliminar = async (req, res) => {
    try {
        const idTipo = Number(req.params.idTipo);
        const nombre = req.params.nombre;

        const resultado = await FestivoRepositorio.eliminarFestivo(idTipo, nombre);

        if (resultado.modifiedCount === 0) {
            return res.status(404).json({ mensaje: `No se encontró el festivo '${nombre}' en el tipo ${idTipo}` });
        }

        return res.status(200).json({
            mensaje: `Festivo '${nombre}' eliminado exitosamente del tipo ${idTipo}`
        });
    } catch (error) {
        console.error('Error eliminando festivo:', error);
        return res.status(500).json({ error: 'Error eliminando festivo', detalle: error.message });
    }
};

module.exports = FestivoControlador;
