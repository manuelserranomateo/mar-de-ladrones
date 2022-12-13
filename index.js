const fs = require('fs');
const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const modelo = require('./servidor/modelo.js');
const sWS = require('./servidor/servidorWS.js');

const PORT = process.env.PORT || 3000;
var args = process.argv.slice(2);

let juego = new modelo.Juego(args[0]);
let servidorWS = new sWS.ServidorWS();

app.use(express.static(__dirname + "/"));

app.get("/", function (req, res) {
  let contenido = fs.readFileSync(__dirname + "/cliente/index.html");
  res.setHeader("Content-type", "text/html");
  res.send(contenido);
});

app.get("/agregarUsuario/:nick", function (req, res) {
  let nick = req.params.nick; 
  let res= juego.agregarUsuario(nick);
  res.send(res);
});

app.get("/comprobarUsuario/:nick", function (req, res) {
  let nick = req.params.nick;
  let us = juego.obtenerUsuario(nick);
  let res = { "nick": -1 };
  if (us) {
    res.nick = us.nick;
  }
  res.send(res);
})


app.get('/crearPartida/:nick', function (req, res) {
  let nick = req.params.nick;
  let res = juego.jugadorCreaPartida(nick);
  res.send(res);
});

app.get("/unirseAPartida/:nick/:codigo", function (req, res) {
  let nick = req.params.nick;
  let codigo = req.params.codigo;
  let res = juego.jugadorSeUneAPartida(nick, codigo);
  res.send(res);
});

app.get('/obtenerPartidas', function (req, res) {
  let res = juego.obtenerPartidas();
  res.send(res);
});

app.get('/obtenerPartidasDisponibles', function (req, res) {
  let res = juego.obtenerPartidasDisponibles();
  res.send(res);
});

app.get('/salir/:nick', function (req, res) {
  let nick = req.params.nick;
  juego.usuarioSale(nick);
  res.send({ res: "ok", codigo: codigo });
});

app.get('/obtenerLogs', function (req, res) {
  juego.obtenerLogs(function (logs) {
    res.send(logs)
  })
});

app.all('*', (req, res) => {
  res.status(404).send('<div><h1>Parece que te has perdido...</h1><img src="/cliente/img/404.webp"></div>');
});

server.listen(PORT, () => {
  console.log(`Aplicacion escuchando en puerto ${PORT}`);
  console.log('Ctrl+C para salir');
});

servidorWS.lanzarServidorWS(io, juego)
