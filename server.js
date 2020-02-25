//Comfigurando servidor
const express = require('express');
const server = express();

//Configurar o servidor para apresentar arquivos staticos
server.use(express.static('public'));

//Abilitar body no formulario
server.use(express.urlencoded({extended: true}));

//Configurar conexão com banco de dados
const Pool = require('pg').Pool;
const db = new Pool({
    user: 'postgres',
    port: 5432,
    database: 'doe'
})

//Configurando a template engine
const nunjucks = require('nunjucks');
nunjucks.configure('./', {
    express: server,
    noCache: true
})


//Configurar a apresentação da pagina
server.get('/', function(req, res) {
    db.query('SELECT * FROM donors ORDER BY id desc LIMIT 4;', function(err, result){
        if (err) return res.send('Erro no banco de dados');
        const donors = result.rows;
        return res.render('index.html', {donors});
    })
})


server.post('/', function(req, res) {
    //Obter os dados do formulario
    const name = req.body.name;
    const email = req.body.email;
    const blood = req.body.blood;

    //Testa se algum dos campos do formulario esta vazio, e se estiver retorna menssagem de volta
    if (name == '' || email == '' || blood == '') {
        return res.send('Todos os campos são obrigatorios.');
    }

    const query = `INSERT INTO donors ("name", "email", "blood") VALUES ($1, $2, $3)`;

    const values = [name, email, blood];

    db.query(query, values, function(err){
        //fluxo de erro
        if (err) return res.send('Erro no banco de dados');
        //fluxo ideal
        return res.redirect('/');
    });
})

//ligar o servidor e permitir acesso a pota 3000
server.listen(3000, function(){
    console.log('Iniciado servidor.');
});