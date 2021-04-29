const express = require("express");
const server = express();
const routes = require("./routes");
const path = require("path");

//usando template engine
server.set('view engine', 'ejs');

// mudar localizacao da pasta views
// nome da pasta, dirname, localizacao da pasta
server.set('views', path.join(__dirname, 'views'));

// habilita os arquivos static
server.use(express.static("public"));

// habilita o request.body
server.use(express.urlencoded({ extended: true }));

// routes
server.use(routes);

server.listen(3000, () => console.log('rodei'));