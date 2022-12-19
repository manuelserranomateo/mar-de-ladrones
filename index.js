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

const PORT = process.env.PORT || 3000;
var args = process.argv.slice(2);

let juego = new modelo.Juego(args[0]);
let servidorWS = new sWS.ServidorWS();

/*  http get post put delete (se llaman verbos)
    get "/"
    get "/obtenerPartidas"
    post "/agregarUsuario/:nick" post para enviar mucha informacion
    put "/actualizarPartida"     get si envias poca informacion
    delete "/eliminarPartida"   
    ... etc
    Son las distintas rutas con los parametros que requiera la logica
*/
// app.get('/', (req, res) => { 
//   res
//     .status(200)
//     .send("Hola")
//     .end();
// });

app.use(express.static(__dirname + "/"));

app.get("/", function (req, res) {
  let contenido = fs.readFileSync(__dirname + "/cliente/index.html");
  res.setHeader("Content-type", "text/html");
  res.send(contenido);
});

app.get("/agregarUsuario/:nick", function (req, response) {
  let nick = req.params.nick; 
  let res= juego.agregarUsuario(nick);
  response.send(res);
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
