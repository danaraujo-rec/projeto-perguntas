// importando o módulo express
const express = require("express");
const app = express();

// Conectando database
const connection = require('./database/database');
connection
    .authenticate()
    .then(() => {
        console.log("Conexão feita com o banco de dados");
    })
    .catch((msgErro) => {
        console.log(msgErro);
    });

//importando o body-parser
const bodyParser = require("body-parser");

// Importando o model pergunta
const Pergunta = require("./database/Pergunta");

// Importando model resposta
const Resposta = require("./database/Resposta");

// Informando ao express usar o EJS
app.set('view engine', 'ejs');

//Informando os arquivos estáticos
app.use(express.static('public'))

//linkando o body parser ao express
//o comando abaixo permite que ao enviar os dados do formulário, o body parse traduza os dados em uma estrutura javascript
app.use(bodyParser.urlencoded({ extended: false }));

//permite a leitura dos dados do formulário enviado via json
app.use(bodyParser.json());

// Criando uma rota padrão
app.get("/", function (req, res) {
    // select * from pergunta 
    Pergunta.findAll({
        raw: true, order: [
            ['id', 'DESC'] //ASC - crescente / DESC - decrescente
        ]
    }).then(perguntas => {
        res.render("index", {
            perguntas: perguntas
        })
    });

});

app.get("/perguntar", function (req, res) {
    res.render("perguntar");
});

//rota para pegar os dados do formulário e salvar no banco de dados
app.post("/salvarpergunta", function (req, res) {
    //pegando as informações do formulário
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    var data = new Date(); //captura a data universal
    //Convertendo para o horário de Brasília
    var dataBrasilia = new Date(data.valueOf() - data.getTimezoneOffset() * 6000);
    // método create é equivalente ao inserte do sql.
    Pergunta.create({
        titulo: titulo,
        descricao: descricao,
        createdAt: dataBrasilia,
        updatedAt: dataBrasilia
    }).then(() => {
        res.redirect("/");
    });
});

app.get("/pergunta/:id", function (req, res) {
    var id = req.params.id;
    //o findOne busca no banco um dado através da condição dada a ele
    Pergunta.findOne({
        where: {
            id: id
        }
    }).then(pergunta => {
        if (pergunta != undefined) { //pergunta achada

            Resposta.findAll({
                where: {
                    perguntaId: pergunta.id
                }
            }).then(respostas => {
                res.render("pergunta", {
                    pergunta: pergunta,
                    respostas: respostas
                });
            });
        } else {
            res.redirect("/");
        }
    });
});

app.post("/responder", function (req, res) {
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta

    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect("/pergunta/" + perguntaId);
    });
});


// Configurando o servidor
app.listen(3000, () => { console.log("Servidor funcionando"); });