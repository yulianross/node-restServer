process.env.PORT = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

const urlDB = process.env.NODE_ENV === 'dev' ?
'mongodb://localhost:27017/cafe':
process.env.MONGO_URI;

process.env.URLDB = urlDB;

// ================================
// vencimiento del token
// ================================

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// ================================
// seed de autenticación
// ================================

process.env.SEED = process.env.SEED || 'este es el seed de desarrollo';

// ================================
// seed de autenticación
// ================================

process.env.CLIENT_ID = process.env.CLIENT_ID || '499378251179-taqtsjss4epsvuctgu3ik196n2ab2utq.apps.googleusercontent.com';