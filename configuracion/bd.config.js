require('dotenv').config();

module.exports = {
  SERVIDOR: process.env.MONGO_HOST || 'localhost',
  PUERTO: process.env.MONGO_PORT || '27017',
  BASEDATOS: process.env.DB_NAME || 'festivos_db',
  USUARIO: process.env.MONGO_USER || '',
  CLAVE: process.env.MONGO_PASS || '',
  URI: process.env.MONGO_URI || null
};
