// es el API Rest
const fs = require('fs')
const express = require('express');
const app = express();

/*  http get post put delete (se llaman verbos)
    get "/"
    get "/obtenerPartidas"
    post "/agregarUsuario/:nick" post para enviar mucha informacion
    put "/actualizarPartida"     get si envias poca informacion
    delete "/eliminarPartida"   
    ... etc
    Son las distintas rutas con los parametros que requiera la logica
*/
app.get('/', (req, res) => { 
  res
    .status(200)
    .send("Hola")
    .end();
});

// Start the server
const PORT = process.env.PORT || 3000; // Util para el despliegue process.env.PORT por si el OS tiene una variable definida

app.listen(PORT, () => { // funcion de callback, 
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
