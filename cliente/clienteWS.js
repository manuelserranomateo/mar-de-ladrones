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
        console.log(rest.nick + " coloca el barco " + nombre + " en " + x,y);
    }

    this.barcosDesplegados = function () {
        this.socket.emit("barcosDesplegados", rest.nick);
        console.log("Jugador " + rest.nick + " despliega los barcos");
    }

    this.disparar = function (x, y) {
        this.socket.emit("disparar", rest.nick, x, y);
        console.log("Jugador " + rest.nick + " dispara a las coordenadas " + x,y);
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
                iu.mostrarModal("No se ha podido crear partida");
                iu.mostrarCrearPartida();
                rest.comprobarUsuario();

            }
        });

        this.socket.on("partidaAbandonada",function(data){
			if (data.codigo!=-1){
				iu.mostrarHome();
                iu.mostrarModal(data.nombreA+" ha abandonado la partida");
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
        });

        this.socket.on("barcoColocado",function(data){
            iu.mostrarModal("Barco: "+ data.barco + " colocado")
        })

        this.socket.on("disparo",function(data){
            iu.mostrarModal("El jugador: "+data.jugador + " ha disparado en la posicion "+ data.disparoX+ " " +data.disparoY)
        })
    }
}