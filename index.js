const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors')
const jwt = require('jsonwebtoken')
const server = express();

const loginRoutes = require("./src/routes/login");
const criarPartidas = require("./src/routes/criarpartidas")
const signInRoutes = require("./src/routes/signIn")
const search = require("./src/routes/search")

server.use(express.json());
server.use(bodyParser.json());
server.use(cors());

server.listen(3000, () => {
  console.log("Server is running.");
});

server.use("/login", loginRoutes); 
server.use("/criarpartidas", criarPartidas);
server.use("/signIn", signInRoutes);
server.use("/search", search)