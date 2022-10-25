function ClienteRest() {
    this.nick;
    this.agregarUsuario = function (nick) { 
        let cli = this;
        $.getJSON("/agregarUsuario/" + nick, function (data) {
            if (data.nick != -1) {
                console.log("Usuario " + data.nick + " registrado")
                cli.nick = data.nick;
                $.cookie("nick",cli.nick);
                cws.conectar();
                iu.mostrarHome();
            }
            else {
                console.log("No se ha podido registrar el usuario")
                iu.mostrarModal("El nick ya está en uso");
                iu.mostrarAgregarUsuario();
            }
        });
    }

    this.crearPartida = function () {
        let cli = this;
        let nick = cli.nick;
        $.getJSON("/crearPartida/" + nick, function (data) {
            if (data.codigo != -1) {
                console.log("Usuario " + nick + " crea partida codigo: " + data.codigo);
                iu.mostrarCodigo(data.codigo);
            }
            else {
                console.log("No se ha podido crear partida")

            }
        });
    }

    this.unirseAPartida = function (codigo) {
        let cli = this;
        $.getJSON("/unirseAPartida/" + cli.nick + "/" + codigo, function (data) {
            if (data.codigo != -1) {
                console.log("Usuario " + cli.nick + " se une a partida codigo: " + data.codigo)
                iu.mostrarCodigo(data.codigo);
            }
            else {
                console.log("No se ha podido unir a partida")
            }
        });
    }

    this.obtenerPartidas = function () {
        let cli = this;
        $.getJSON("/obtenerPartidasDisponibles/", function (lista) {
            iu.mostrarListaDePartidas(lista);
        });
    }

    this.eliminarUsuario = function (){
        let cli = this;
        $.getJSON("/eliminarUsuario/" + cli.nick, function (data) {
            if (data.nick != -1) {
                console.log("Usuario " + data.nick + " eliminado correctamente")
            }
            else {
                console.log("No se ha podido eliminar el usuario")
            }
        });
    }
}