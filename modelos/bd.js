const { MongoClient } = require('mongodb');
const configBD = require('../configuracion/bd.config');

let url = configBD.URI;
if (!url) {
  if (configBD.USUARIO && configBD.CLAVE) {
    url = `mongodb://${configBD.USUARIO}:${configBD.CLAVE}@${configBD.SERVIDOR}:${configBD.PUERTO}/${configBD.BASEDATOS}`;
  } else {
    url = `mongodb://${configBD.SERVIDOR}:${configBD.PUERTO}/${configBD.BASEDATOS}`;
  }
}

let basedatos = null;
let cliente = null;

module.exports = {
  conectar: async function () {
    try {
      cliente = new MongoClient(url);
      await cliente.connect();
      basedatos = cliente.db(configBD.BASEDATOS);
      console.log('✅ Conexión establecida exitosamente al servidor de MongoDB (BD:', configBD.BASEDATOS, ')');
      return basedatos;
    } catch (error) {
      console.error('❌ Error conectando a MongoDB:', error.message);
      throw error;
    }
  },
  obtenerBaseDatos: function () {
    return basedatos;
  },
  cerrar: async function () {
    if (cliente) {
      await cliente.close();
      basedatos = null;
    }
  }
};
