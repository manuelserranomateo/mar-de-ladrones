function ServidorWS(){
    // enviar peticiones

    // gestionar peticiones
    this.lanzarServidorWS = function(io, juego){
        io.on('connection', (socket) => {
            console.log('Usuario conectado');
          });
    }
}

module.exports.ServidorWS = ServidorWS; // diff entre servidor y cliente, aqui hace falta exportarlos