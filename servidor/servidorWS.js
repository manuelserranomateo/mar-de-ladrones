function ServidorWS() {
    this.enviarAlRemitente = function (socket, mensaje, datos) {
        socket.emit(mensaje, datos);
    }

    this.enviarATodosEnPartida = function (io, codigo, mensaje, datos) {
        io.sockets.in(codigo).emit(mensaje, datos)
    }

    this.enviarATodos = function (socket, mens, datos) {
        socket.broadcast.emit(mens, datos);
    }

    this.lanzarServidorWS = function (io, juego) {
        let cli = this;
        io.on('connection', (socket) => {
            console.log('Usuario conectado');
            socket.on("crearPartida", function (nick) {
                let res = juego.jugadorCreaPartida(nick);
                let codigoStr = res.codigo.toString();
                socket.join(codigoStr);
                //cli.enviarAlRemitente(socket,"partidaCreada",res);
                cli.enviarATodosEnPartida(io, codigoStr, "partidaCreada", res)
                let lista = juego.obtenerPartidasDisponibles();
                cli.enviarATodos(socket, "actualizarListaPartidas", lista);
            });

            socket.on("unirseAPartida", function (nick, codigo) {
                let codigoStr = codigo.toString();
                socket.join(codigoStr);
                let res = juego.jugadorSeUneAPartida(nick, codigo);
                cli.enviarAlRemitente(socket, "unidoAPartida", res);
                let partida = juego.obtenerPartida(codigo);
                if (partida.esDesplegando()) {
                    let us = juego.obtenerUsuario(nick)
                    let flota = us.obtenerFlota()
                    res = {}
                    res.flota = flota
                    cli.enviarATodosEnPartida(io, codigoStr, "faseDesplegando", res);
                }
            });

            socket.on("abandonarPartida", function (nick, codigo) {
                let jugador = juego.obtenerUsuario(nick);
                let partida = juego.obtenerPartida(codigo)

                let codigoStr = codigo.toString();
                if (jugador && partida) {
                    let rival = partida.obtenerRival(jugador.nick);
                    let res = { codigoP: codigo, nombreA: jugador.nick }
                    partida.abandonarPartida(jugador)
                    //cli.enviarAlRemitente(socket, "partidaAbandonada", res);
                    cli.enviarATodosEnPartida(io, codigoStr, "partidaAbandonada", res);
                    socket.leave(codigoStr)

                }
            });

            socket.on("colocarBarco", function (nick, nombre, x, y) {
                let jugador = juego.obtenerUsuario(nick);
                if (jugador) {
                    jugador.colocarBarco(nombre, x, y)
                    //let estado=us.flota[nombre].desplegado;
                    let desplegado = jugador.obtenerBarcoDesplegado(nombre)
                    //console.log(desplegado)
                    let res = { barco: nombre, x: x, y: y, colocado: desplegado }
                    cli.enviarAlRemitente(socket, "barcoColocado", res);
                }
            });

            socket.on("barcosDesplegados", function (nick) {
                let jugador = juego.obtenerUsuario(nick);
                let partida = jugador.partida
                console.log(partida.esJugando())
                if (partida.esJugando()) {
                    console.log('ya se han desplegado los barcos')
                }
            });

            socket.on("disparar", function (nick, x, y) {
                let jugador = juego.obtenerUsuario(nick);
                if (jugador) {

                    let partida = jugador.partida;
                    jugador.disparar(x, y)
                    let codigoStr = partida.codigo.toString();

                    let res = { jugador: nick, disparoX: x, disparoY: y }

                    cli.enviarATodosEnPartida(io, codigoStr, "disparo", res);
                }
            });
        });
    }

}

module.exports.ServidorWS = ServidorWS;