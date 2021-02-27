const Sequelize = require('sequelize');
const connection = new Sequelize({
    host: '127.0.0.1',
    dialect: 'sqlite',
    storage: 'db.sqlite',
})

connection.authenticate().then(()=>{
    console.log('Conectado com sucesso');
}).catch((e)=>{
    console.log('Erro: ' + e);
})

module.exports = connection;
