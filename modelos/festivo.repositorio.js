/**
 * Repositorio de Festivos y Tipos en MongoDB
 * Accede a la colección 'tipos' y gestiona los festivos embebidos
 */

const bd = require('./bd');

const FestivoRepositorio = {};

/**
 * Obtiene todos los documentos de la colección 'tipos' (con sus festivos embebidos)
 */
FestivoRepositorio.obtenerTodosLosTipos = async function () {
    const db = bd.obtenerBaseDatos();
    if (!db) throw new Error('Base de datos no inicializada');
    return await db.collection('tipos').find({}).toArray();
};

/**
 * Obtiene un tipo específico por su ID numérico (1, 2, 3, 4)
 */
FestivoRepositorio.obtenerTipoPorId = async function (idTipo) {
    const db = bd.obtenerBaseDatos();
    if (!db) throw new Error('Base de datos no inicializada');
    return await db.collection('tipos').findOne({ id: Number(idTipo) });
};

/**
 * Agrega un nuevo festivo al arreglo 'festivos' del tipo correspondiente ($push)
 */
FestivoRepositorio.agregarFestivo = async function (idTipo, festivo) {
    const db = bd.obtenerBaseDatos();
    if (!db) throw new Error('Base de datos no inicializada');

    const resultado = await db.collection('tipos').updateOne(
        { id: Number(idTipo) },
        { $push: { festivos: festivo } }
    );
    return resultado;
};

/**
 * Modifica un festivo existente en el arreglo embebido ($set con $)
 */
FestivoRepositorio.modificarFestivo = async function (idTipo, nombreActual, datosNuevos) {
    const db = bd.obtenerBaseDatos();
    if (!db) throw new Error('Base de datos no inicializada');

    const updateFields = {};
    if (datosNuevos.nombre !== undefined) updateFields['festivos.$.nombre'] = datosNuevos.nombre;
    if (datosNuevos.dia !== undefined) updateFields['festivos.$.dia'] = Number(datosNuevos.dia);
    if (datosNuevos.mes !== undefined) updateFields['festivos.$.mes'] = Number(datosNuevos.mes);
    if (datosNuevos.diasPascua !== undefined) updateFields['festivos.$.diasPascua'] = Number(datosNuevos.diasPascua);

    const resultado = await db.collection('tipos').updateOne(
        { id: Number(idTipo), 'festivos.nombre': nombreActual },
        { $set: updateFields }
    );
    return resultado;
};

/**
 * Elimina un festivo del arreglo embebido de un tipo ($pull)
 */
FestivoRepositorio.eliminarFestivo = async function (idTipo, nombreFestivo) {
    const db = bd.obtenerBaseDatos();
    if (!db) throw new Error('Base de datos no inicializada');

    const resultado = await db.collection('tipos').updateOne(
        { id: Number(idTipo) },
        { $pull: { festivos: { nombre: nombreFestivo } } }
    );
    return resultado;
};

module.exports = FestivoRepositorio;
