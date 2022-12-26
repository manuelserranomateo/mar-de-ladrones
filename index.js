const fs = require('fs');
const express = require('express');
const app = express();
const passport = require('passport')
const session = require('express-session');

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const modelo = require('./servidor/modelo.js');
const sWS = require('./servidor/servidorWS.js');
const passportSetup = require("./servidor/passport-setup.js");

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

app.get("/agregarUsuario/:nick", function (req, response) {
  let nick = req.params.nick;
  res=juego.agregarUsuario(nick,false);
  response.send(res);
});

const cookieSession = require("cookie-session");

app.use(cookieSession({
  name: 'Mar de Ladrones',
  keys: ['key1', 'key2']
}));
app.use(passport.initialize());
app.use(passport.session());

app.get("/auth/google", passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get(
  '/auth/twitter',
  passport.authenticate('twitter', {
    scope: ['tweet.read', 'users.read', 'offline.access'],
  })
);

app.get(
  '/auth/twitter/callback',
  passport.authenticate('twitter'),
  function (req, res) {
    const userData = JSON.stringify(req.user, undefined, 2);
    res.redirect('/goodTwitter');
  }
);

app.get("/goodTwitter", function (request, response) {
  var nick = request.user.username;
  if (nick) {
    juego.agregarUsuario(nick, true);
  }
  response.cookie('nick', nick);
  response.redirect('/');
});

app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/fallo' }),
  function (req, res) {
    res.redirect('/good');
  });

app.get("/good", function (request, response) {
  var nick = request.user.name.givenName;
  if (nick) {
    juego.agregarUsuario(nick, true);
  }
  response.cookie('nick', nick);
  response.redirect('/');
});

app.get("/fallo", function (request, response) {
  response.send({ nick: "nook" })
})

app.get("/comprobarUsuario/:nick", function (req, response) {
  let nick = req.params.nick;
  let us = juego.obtenerUsuario(nick);
  let res = { "nick": -1 };
  if (us) {
    res.nick = us.nick;
  }
  response.send(res);
})


app.get('/crearPartida/:nick', function (req, response) {
  let nick = req.params.nick;
  let res = juego.jugadorCreaPartida(nick);
  response.send(res);
});

app.get("/unirseAPartida/:nick/:codigo", function (req, response) {
  let nick = req.params.nick;
  let codigo = req.params.codigo;
  let res = juego.jugadorSeUneAPartida(nick, codigo);
  response.send(res);
});

app.get('/obtenerPartidas', function (req, response) {
  let res = juego.obtenerPartidas();
  response.send(res);
});

app.get('/obtenerPartidasDisponibles', function (req, response) {
  let res = juego.obtenerPartidasDisponibles();
  response.send(res);
});

app.get('/salir/:nick', function (req, response) {
  let nick = req.params.nick;
  juego.usuarioSale(nick);
  response.send({ res: "ok", codigo: codigo });
});

app.get('/obtenerLogs', function (req, response) {
  juego.obtenerLogs(function (logs) {
    response.send(logs)
  })
});

app.all('*', (req, response) => {
  response.status(404).send('<div><h1>Parece que te has perdido...</h1><img src="/cliente/img/404.webp"></div>');
});

server.listen(PORT, () => {
  console.log(`Aplicacion escuchando en puerto ${PORT}`);
  console.log('Ctrl+C para salir');
});

servidorWS.lanzarServidorWS(io, juego)
