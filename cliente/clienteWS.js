function ClienteWS() {
    this.socket;

    this.conectar = function () {
        this.socket = io();
        this.servidorWS();
    }

    this.crearPartida = function () {
        this.socket.emit("crearPartida", rest.nick);
    }

    this.unirseAPartida = function (codigo) {
        this.socket.emit("unirseAPartida", rest.nick, codigo);
    }
    this.abandonarPartida = function () {
        this.socket.emit("abandonarPartida", rest.nick, cws.codigo);
    }

    this.usuarioSale = function (nick, codigo) {
        this.socket.emit("usuarioSale", rest.nick, codigo)
    }

    this.colocarBarco = function (nombre, x, y, orientacion) {
        this.socket.emit("colocarBarco", rest.nick, nombre, x, y, orientacion)
    }

    this.cambiarOrientacion = function () {
        this.socket.emit('cambiarOrientacion', rest.nick)
    }

    this.barcosDesplegados = function () {
        this.socket.emit("barcosDesplegados", rest.nick)
    }
    this.disparar = function (x, y) {
        this.socket.emit("disparar", rest.nick, x, y)
    }

    this.servidorWS = function () {
        let cli = this;
        this.socket.on("partidaCreada", function (data) {
            if (data.codigo != -1) {
                iu.mostrarCodigo(data.codigo);
                cli.codigo = data.codigo;

            }
            else {
                iu.mostrarModal("No se ha podido crear partida");
                iu.mostrarCrearPartida();
                rest.comprobarUsuario();
            }

        });

        this.socket.on("unidoAPartida", function (data) {
            if (data.codigo != -1) {
                iu.mostrarCodigo(data.codigo);
                cli.codigo = data.codigo;
            }
            else {

            }
        });

        this.socket.on("actualizarListaPartidas", function (lista) {
            if (!cli.codigo) {
                iu.mostrarListaDePartidas(lista);
            }
        });

        this.socket.on("partidaAbandonada", function (data) {
            if (data.codigo != -1) {
                iu.mostrarHome();
                iu.mostrarModal(data.nombreA + " ha abandonado la partida con codigo: " + data.codigoP + "\n" + " Ha ganado " + data.nombreG);
            }
            else {
                iu.mostrarModal(data.nombreA + " ha intentado abandonar la partida pero no ha podido");
            }
        });

        this.socket.on("partidaCancelada", function (res) {
            iu.mostrarModal("Has terminado la partida " + res.codigo + " antes de que se uniese alguien")
            iu.mostrarHome()
        });

        this.socket.on("usuarioSalido", function (res) {
            if (!(res.nick == rest.nick)) {
                iu.mostrarModal("El usuario " + res.nick + " se ha salido a mitad de la partida")
                iu.mostrarHome()
            }
            else {
                iu.mostrarModal("Te has salido a mitad de partida")
            }
        })

        this.socket.on("aJugar", function (res) {
            iu.mostrarTurno(res.nick)
            iu.mostrarModal('Ya se puede disparar!!');
        })

        this.socket.on("faseDesplegando", function (data) {
            tablero.flota = data.flota
            $('#mEPE').remove();
            tablero.elementosGrid()
            tablero.mostrarFlota();
        })

        this.socket.on("barcoColocado", function (res) {
            if (res.barco.desplegado) {
                tablero.terminarDeColocarBarco(res.barco, res.x, res.y)
                cli.barcosDesplegados()
            } else {
                iu.mostrarModal('No se ha podido colocar el barco')
            }
        })

        this.socket.on("disparo", function (res) {
            iu.mostrarTurno(res.turno)
            if (res.atacante == rest.nick) {
                tablero.updateCell(res.x, res.y, res.impacto, 'computer-player');
            }
            else {
                tablero.updateCell(res.x, res.y, res.impacto, 'human-player');
            }
        });

        this.socket.on("turno", function (res) {
            iu.mostrarModal("Respeta los rangos, no es tu turno");
        });

        this.socket.on("faseFinal", function (res) {
            iu.mostrarModal(res + ' ha ganado la partida!!')
            iu.finalPartida()
        });
    }
}