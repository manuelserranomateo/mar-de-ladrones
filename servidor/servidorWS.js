function ServidorWS() {
    // zona de atributos


    //enviar peticiones
    this.enviarAlRemitente = function (socket, mensaje, datos) {
        socket.emit(mensaje, datos);
    }
    this.enviarATodosEnPartida = function (io, codigo, mensaje, datos) {
        io.sockets.in(codigo).emit(mensaje, datos);
    }
    this.enviarATodos = function (socket, mens, datos) {
        socket.broadcast.emit(mens, datos);
    }


    // gestionar peticiones
    this.lanzarServidorWS = function (io, juego) {
        let cli = this;
        io.on('connection', (socket) => {
            console.log('Usuario conectado');
            socket.on("crearPartida", function (nick) {
                let res = juego.jugadorCreaPartida(nick);
                let codigoStr = res.codigo.toString();
                socket.join(codigoStr);
                cli.enviarATodosEnPartida(io, codigoStr, "partidaCreada", res)
                let lista = juego.obtenerPartidasDisponibles();
                cli.enviarATodos(socket, "actualizarListaPartidas", lista);
            });

            socket.on("unirseAPartida", function (nick, codigo) {
                let res = juego.jugadorSeUneAPartida(nick, codigo);
                let codigoStr = codigo.toString();
                socket.join(codigoStr);
                cli.enviarAlRemitente(socket, "unidoAPartida", res);
                let partida = juego.obtenerPartida(codigo);
            });
            
            socket.on("abandonarPartida", function (nick,codigo) { //por hacer
                let jugador= juego.obtenerUsuario(nick);
                let partida= juego.obtenerPartida(codigo)
                
                let codigoStr = codigo.toString();
                if(jugador && partida){
                    let rival=partida.obtenerRival(jugador.nick);
                    let res={codigoP:codigo,nombreA:jugador.nick,nombreG:rival.nick}
                    partida.abandonarPartida(jugador)
                    //cli.enviarAlRemitente(socket, "partidaAbandonada", res);
                    cli.enviarATodosEnPartida(io, codigoStr, "partidaAbandonada", res);
                    socket.leave(codigoStr)

                }
            });
            socket.on("colocarBarco", function (nick, nombre, x, y) {
                let user = juego.obtenerUsuario(nick);
                let partida = user.partida;
                if (user) {
                    let res = user.colocarBarco(nombre, x, y);
                    cli.enviarAlRemitente(socket, "colocarBarco", res);
                }
            });
            socket.on("barcosDesplegados", function (nick) {
                let user = juego.obtenerUsuario(nick);
                if (user) {
                    user.barcosDesplegados();
                    let partida = user.partida;
                    let res = {}
                    let codigoStr = partida.codigo.toString();
                    cli.enviarATodosEnPartida(io, codigoStr, "aJugar", res);
                }
            });

            socket.on("disparar", function (nick, x, y) {
                let user = juego.obtenerUsuario(nick);
                let partida = user.partida;
                if (user) {
                    user.disparar(x, y);
                    let codigoStr = partida.codigo.toString();
                    if (partida.esFinal()){
                        cli.enviarATodosEnPartida(io, codigoStr, "partidaTerminada", {});
                    }
                }
            });
        });
    }
}

module.exports.ServidorWS = ServidorWS; 