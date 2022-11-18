function ClienteRest() {
    this.nick;
    this.agregarUsuario = function (nick) {
        let cli = this;
        $.getJSON("/agregarUsuario/" + nick, function (data) {
            if (data.nick != -1) {
                console.log("Usuario " + data.nick + " registrado")
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

    this.comprobarUsuario = function(){
		let cli= this;
		$.getJSON("/comprobarUsuario/"+this.nick,function(data){
			if (data.nick!=-1){
                console.log("Usuario " + data.nick + " activo")
				cws.conectar();    
				iu.mostrarHome();
		}
			else{
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
                iu.mostrarModal("No se ha podido crear partida")

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
                iu.mostrarModal("No se ha podido unir a partida");
            }
        });
    }

    this.obtenerPartidas = function () {
        let cli = this;
        $.getJSON("/obtenerPartidasDisponibles/", function (lista) {
            iu.mostrarListaDePartidas(lista);
        });
    }

    this.eliminarUsuario = function () {
        let nick = this.nick;
        $.getJSON("/eliminarUsuario/" + nick, function () {
            $.removeCookie("nick");
            iu.comprobarCookie();
        });
    }
}