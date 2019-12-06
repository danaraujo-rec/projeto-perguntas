// Consumindo a biblíoteca sequelize
const Sequelize = require("sequelize");

// Construíndo a conexão
const connection = new Sequelize('guiaperguntas', 'root', 'Dan1989', {
    host: 'localhost',
    dialect: 'mysql'
});

// Exportando o banco de dados
module.exports = connection;

