// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || 3000;

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

process.env.SEED = process.env.SEED || 'Clave desarrollo'
process.env.CLIENT_ID = process.env.CLIENT_ID || '50701840309-jsfrg8880n143dieq7uqnl3l0k0hlfll.apps.googleusercontent.com'

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;