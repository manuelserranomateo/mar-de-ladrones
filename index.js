// es el API Rest
const fs = require('fs');
const express = require('express');
const app = express();
const modelo = require('./servidor/modelo.js');

const PORT = process.env.PORT || 3000; // Util para el despliegue process.env.PORT por si el OS tiene una variable definida

let juego = new modelo.Juego(); // Conectamos API REST con la capa logica (index.js --> modelo.js)

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
  var contenido = fs.readFileSync(__dirname + "/cliente/index.html");
  response.setHeader("Content-type", "text/html");
  response.send(contenido);
});

// en funcion de como se llama en la logica, tmbn tener en cuenta parametros
app.get("/agregarUsuario/:nick", function (request, response) {
  let nick = request.params.nick; // recuperamos parametro de la ruta agregarUsuario
  let res;
  res = juego.agregarUsuario(nick);
  response.send(res); // Siempre responder para no evitar timeouts y cosas raras

  // En la capa REST se evita poner logica, esto se debe hacer en la capa logica
});

app.get('/crearPartida/:nick', function (request, response) {
  let nick = request.params.nick; // recuperamos parametro de la ruta agregarUsuario
  let res = juego.jugadorCreaPartida(nick);
  response.send(res);
});


// Start the server

app.listen(PORT, () => { // funcion de callback, 
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
