function ClienteRest() {
    this.nick;

    this.agregarUsuario = function (nick) {
        let cli = this;
        $.getJSON("/agregarUsuario/" + nick, function (data) {
            if (data.nick != -1) {
                cli.nick = data.nick;
                $.cookie("nick", data.nick);
                cws.conectar();
                iu.mostrarHome();
            }
            else {
                iu.mostrarModal("El nick ya está en uso");
                iu.mostrarAgregarUsuario();
            }
        });
    }

    this.comprobarUsuario = function () {
        let cli = this;
        $.getJSON("/comprobarUsuario/" + this.nick, function (data) {
            if (data.nick != -1) {
                cws.conectar();
                iu.mostrarHome();
            }
            else {
                iu.mostrarAgregarUsuario();

            }
        });
    }

    this.obtenerPartidas = function () {
        let cli = this;
        $.getJSON("/obtenerPartidasDisponibles/", function (lista) {
            iu.mostrarListaDePartidas(lista);
        });
    }

    this.usuarioSale = function () {
        let nick = this.nick;
        $.getJSON("/salir/" + nick, function (data) {
            $.removeCookie("nick");
            $('#mEPE').remove();
            iu.comprobarCookie();
            cws.usuarioSale(nick, data.codigo);

        })
    }
}