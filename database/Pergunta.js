// Consumindo o sequelize
const Sequelize = require("sequelize");
const connection = require("./database");

// Definindo o model

const Pergunta = connection.define('Perguntas', {
    titulo:{
        type: Sequelize.STRING,
    },
    descricao: {
        type: Sequelize.TEXT, //textos longos
    }
},{});

//Se a tabela já existir, ele não vai forçar a criação dela.
Pergunta.sync({force: false}).then(() => {
    console.log("Tabela criada")
});

module.exports = Pergunta;
