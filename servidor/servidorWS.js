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
            socket.on("crearPartida", function (nick) {
                let res = juego.jugadorCreaPartida(nick);
                let codigoStr = res.codigo.toString();
                socket.join(codigoStr);
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
                    cli.enviarATodosEnPartida(io, codigoStr, "partidaAbandonada", res);
                    socket.leave(codigoStr)

                }
            });

            socket.on("colocarBarco", function (nick, nombre, x, y) {
                let jugador = juego.obtenerUsuario(nick);
                if (jugador) {
                    jugador.colocarBarco(nombre, x, y)
                    let desplegado = jugador.obtenerBarcoDesplegado(nombre, x)
                    console.log(desplegado)
                    let res = { barco: nombre, x: x, y: y, colocado: desplegado }
                    cli.enviarAlRemitente(socket, "barcoColocado", res);
                }
            });

            socket.on("barcosDesplegados", function (nick) {
                let jugador = juego.obtenerUsuario(nick);
                if (jugador) {
                    let partida = jugador.partida;
                    let res = jugador.barcosDesplegados();
                    let codigoStr = partida.codigo.toString();
                    if (partida.esJugando()) {
                        cli.enviarATodosEnPartida(io, codigoStr, "aJugar", {});
                    }
                }
            });

            socket.on("disparar", function (nick, x, y) {
                let jugador = juego.obtenerUsuario(nick);
                if (jugador) {
                    let partida = jugador.partida;
                    let estado = jugador.meDisparan(x, y)
                    console.log(estado)
                    jugador.disparar(x, y)
                    let res = { estado: estado }
                    cli.enviarATodosEnPartida(io, partida.codigo.toString(), "disparo", res);
                }
            });
        });
    }
}

module.exports.ServidorWS = ServidorWS;