process.env.PORT = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

const urlDB = process.env.NODE_ENV === 'dev' ?
'mongodb://localhost:27017/cafe':
'mongodb://cafe-user:123456a@ds019654.mlab.com:19654/cafe'

process.env.URLDB = urlDB;