//===================================
// Puerto
//===================================

process.env.PORT = process.env.PORT || 3000;

//===================================
// Entorno
//===================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//===================================
// Vencimiento del token
//===================================
// 60 seg * 60 min * 24 hr * 30 dias

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//===================================
// SEED de autenticación
//===================================

process.env.SEED = process.env.SEED || 'este-es-el-seed-de-desarrollo';

//===================================
// Base de datos
//===================================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

//===================================
// Google CLIENT ID
//===================================
process.env.CLIENT_ID = process.env.CLIENT_ID || '349031596130-rivfapb68ue5v9cpthj243s7mhag8bdv.apps.googleusercontent.com';