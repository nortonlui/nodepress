const Sequelize = require('sequelize');
const connection = new Sequelize('guiapress', 'root', 'root', {
    host: '127.0.0.1',
    dialect: 'mysql',
    timezone: '-03:00'
})

connection.authenticate().then(()=>{
    console.log('Conectado com sucesso');
}).catch((e)=>{
    console.log('Erro: ' + e);
})

module.exports = connection;
