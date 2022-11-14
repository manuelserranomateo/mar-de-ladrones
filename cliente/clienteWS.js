function ClienteWS() {
    // zona de atributos
    this.socket;
    this.codigo;

    // enviar peticiones
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

    this.colocarBarco = function (nombre, x, y) {
        this.socket.emit("colocarBarco", rest.nick, nombre, x, y);
    }

    this.barcosDesplegados = function () {
        this.socket.emit("barcosDesplegados", rest.nick);
    }

    this.disparar = function (x, y) {
        this.socket.emit("disparar", rest.nick, x, y);
    }

    // gestionar peticiones
    this.servidorWS = function () {
        let cli = this;
        this.socket.on("partidaCreada", function (data) {
            if (data.codigo != -1) {
                console.log("Usuario " + rest.nick + " crea partida codigo: " + data.codigo);
                iu.mostrarCodigo(data.codigo);
                cli.codigo = codigo;
            }
            else {
                console.log("No se ha podido crear partida");
                iu.mostrarModal("No se ha podido crear partida");
                iu.mostrarCrearPartida();
            }
        });
        this.socket.on("unidoAPartida", function (data) {
            if (data.codigo != -1) {
                console.log("Usuario " + rest.nick + " se une a partida codigo: " + data.codigo);
                iu.mostrarCodigo(data.codigo);
                cli.codigo = data.codigo;
            }
            else {
                console.log("No se ha podido unir a partida");
            }
        });
        this.socket.on("actualizarListaPartidas", function (lista) {
            if (!cli.codigo) {
                iu.mostrarListaDePartidas(lista);
            }
        });
        this.socket.on("aJugar", function () {
            iu.mostrarModal("Ambos jugadores en la partida");
        });

        this.socket.on("partidaTerminada", function () {
            iu.mostrarModal("La partida ha terminado");           
        })
    }
}