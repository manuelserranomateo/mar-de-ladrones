// es el API Rest
const fs = require('fs');
const express = require('express');
const app = express();
const passport = require('passport')

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const modelo = require('./servidor/modelo.js');
const sWS = require('./servidor/servidorWS.js');
const passportSetup = require("./servidor/passport-setup.js");

const PORT = process.env.PORT || 3000; // Util para el despliegue process.env.PORT por si el OS tiene una variable definida
var args = process.argv.slice(2);

let juego = new modelo.Juego(args[0]); // Conectamos API REST con la capa logica (index.js --> modelo.js)
let servidorWS = new sWS.ServidorWS();



app.use(express.static(__dirname + "/"));

app.get("/", function (request, response) {
  let contenido = fs.readFileSync(__dirname + "/cliente/index.html"); // lectura bloqueante
  response.setHeader("Content-type", "text/html");
  response.send(contenido);
});

// en funcion de como se llama en la logica, tmbn tener en cuenta parametros
app.get("/agregarUsuario/:nick", function (request, response) {
  let nick = request.params.nick; // recuperamos parametro de la ruta agregarUsuario
  let res;
  res = juego.agregarUsuario(nick); // este res se llama data en clienteRest.js
  response.send(res); // Siempre responder para no evitar timeouts y cosas raras

  // En la capa REST se evita poner logica, esto se debe hacer en la capa logica
});

app.get("/auth/google",passport.authenticate('google', { scope: ['profile','email'] }));

const cookieSession=require("cookie-session");

app.use(cookieSession({
  name: 'Mar de Ladrones',
  keys: ['key1', 'key2']
}));
app.use(passport.initialize());
app.use(passport.session());


app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/fallo' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/good');
    });
app.get("/good", function (request, response) {
    var nick = request.user.name.givenName;
    if (nick) {
        juego.agregarUsuario(nick);
    }
    response.cookie('nick', nick);
    response.redirect('/');
});

app.get("/fallo", function (request, response) {
    response.send({ nick: "nook" })
})

app.get("/comprobarUsuario/:nick", function (request, response) {
  let nick = request.params.nick;
  let us = juego.obtenerUsuario(nick);
  let res = { "nick": -1 };
  if (us) {
    res.nick = us.nick;
  }
  response.send(res);
})


app.get('/crearPartida/:nick', function (request, response) {
  let nick = request.params.nick;
  let res = juego.jugadorCreaPartida(nick);
  response.send(res);
});

app.get("/unirseAPartida/:nick/:codigo", function (request, response) {
  let nick = request.params.nick;
  let codigo = request.params.codigo;
  let res = juego.jugadorSeUneAPartida(nick, codigo);
  response.send(res);
});

app.get('/obtenerPartidas', function (request, response) {
  let res = juego.obtenerPartidas();
  response.send(res);
});

app.get('/obtenerPartidasDisponibles', function (request, response) {
  let res = juego.obtenerPartidasDisponibles();
  response.send(res);
});

app.get('/salir/:nick', function (request, response) {
  let nick = request.params.nick;
  juego.usuarioSale(nick);
  response.send({res:"ok", codigo: codigo});
});

app.get('/obtenerLogs', function (request, response) {
  juego.obtenerLogs(function (logs){
    response.send(logs)
  })
});

server.listen(PORT, () => {
  console.log(`Aplicacion escuchando en puerto ${PORT}`);
  console.log('Ctrl+C para salir');
});

servidorWS.lanzarServidorWS(io, juego)
