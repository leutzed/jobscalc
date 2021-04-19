const express = require("express");
const server = express();
const routes = require("./routes");

//usando template engine
server.set('view engine', 'ejs');

// habilita os arquivos static
server.use(express.static("public"));

// routes
server.use(routes);

server.listen(3000, () => console.log('rodei'));