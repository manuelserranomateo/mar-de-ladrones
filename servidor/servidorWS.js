function ServidorWS(){
    // zona de atributos


    // enviar peticiones
    this.enviarAlRemitente=function(socket,mensaje,datos){
		socket.emit(mensaje,datos);
    }

    this.enviarATodosEnPartida=function(io,codigo,mensaje,datos){
		io.sockets.in(codigo).emit(mensaje,datos)
	}


    // gestionar peticiones
    this.lanzarServidorWS = function(io, juego){
        let cli = this;
        io.on('connection', (socket) => {

            socket.on("crearPartida", function(nick){ 
                let res = juego.jugadorCreaPartida(nick);
                socket.join(res.codigo);
                cli.enviarAlRemitente(socket, "partidaCreada", res);
            });

            socket.on("unirseAPartida", function(nick,codigo){
                let res = juego.jugadorSeUneAPartida(nick, codigo);
                cli.enviarAlRemitente(socket, "unidoAPartida", res);
                socket.join(codigo);
                let partida = juego.obtenerPartida(codigo);
                if (partida.fase.esJugando()){
                    cli.enviarATodosEnPartida(io, codigo, "aJugar", {});
                }
            })
          });
    }
}

module.exports.ServidorWS = ServidorWS; // diff entre servidor y cliente, aqui hace falta exportarlos