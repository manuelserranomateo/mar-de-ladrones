// es el API Rest
const fs = require('fs');
const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const modelo = require('./servidor/modelo.js');
const sWS = require('./servidor/servidorWS.js');

const PORT = process.env.PORT || 3000; // Util para el despliegue process.env.PORT por si el OS tiene una variable definida
var args = process.argv.slice(2);

let juego = new modelo.Juego(args[0]); // Conectamos API REST con la capa logica (index.js --> modelo.js)
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
