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

    // gestionar peticiones
    this.servidorWS = function () {
        let cli = this;
        this.socket.on("partidaCreada", function (data) {
            //data.codigo = 123;
            if (data.codigo != -1) {
                console.log("Usuario " + rest.nick + " crea partida codigo: " + data.codigo);
                iu.mostrarCodigo(data.codigo);
                cli.codigo = codigo;
            }
            else {
                console.log("No se ha podido crear partida");
            }
        });

        // actualizar partida
        // this.socket.on("actualizarListaPartidas", function(lista)){

        // }

        // a Jugar

        // Abandonar
    }
}