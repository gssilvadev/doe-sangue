// Configurando o servidor 
const express = require('express');
const server = express();

// configurar servidor para apresentar arquivos extras 
server.use(express.static('public'));

//habilitar o body 
server.use(express.urlencoded({ extended: true }))

// configurar a conexao com o banco de dados
const pool = require('pg').Pool;
const db = new pool({
  user: 'postgres',
  password: '0606',
  host: 'localhost',
  port: 5432,
  database: 'doe'
})

// Configurnado nunjucks / template engine
const nunjucks = require('nunjucks');
nunjucks.configure('./', {
  express: server,
  noCache: true
})

//DOADORES array
// const donors = [
//   {
//     name: 'Diego Fernandes',
//     blood: 'AB+'
//   },
//   {
//     name: 'João Carli',
//     blood: 'B+'
//   },
//   {
//     name: 'Mayk Brito',
//     blood: 'A+'
//   },
//   {
//     name: 'Cleiton Silva',
//     blood: 'O+'
//   }
// ]

// Configurando a apresentação da pagina
server.get('/', function (req, res) {
  // return res.send('ok cheguei aqui com nodemon!');
  db.query(`select * from donors`, function (err, result) {
    if (err) {
      return res.send(err.message);
    }

    const donors = result.rows;
    return res.render('index.html', { donors });
  })

})

server.post('/', function (req, res) {
  //pegar dados do formulario
  const name = req.body.name;
  const blood = req.body.blood;
  const email = req.body.email;

  //valores para dentro do array
  // donors.unshift({
  //   name,
  //   blood
  // });
  // donors.pop();

  //valores para dentro do banco de dados
  if (name == "" || email == "" || blood == "") {
    return res.send("Todos os campos são obrigatórios");
  }
  const query =
    `insert into donors ("name","email","blood") 
    values ($1, $2, $3)`;
  const values = [name, email, blood];

  db.query(query, values, function (err) {
    // fluxo de erro 
    if (err) {
      return res.send(err.message);
    }
    // fluxo ideal 
    return res.redirect('/');
  })


})

// Ligando o servidor 
server.listen(3000, function () {
  console.log("iniciei o servidor");
});
