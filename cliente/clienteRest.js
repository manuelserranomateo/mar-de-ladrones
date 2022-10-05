function ClienteRest() { // ClienteRest es una funcion global
    this.nick;
    this.agregarUsuario = function (nick) {
        var cli = this; // tipico de JS, se guarda una referencia el objeto para no perder el contexto
        $.getJSON("/agregarUsuario/" + nick, function (data) { // peticion asincrona al servidor
            // el data es lo que contesta el servidor, la proporciona el API REST, el response.send de esta ruta
            // se ejecuta cuando conteste el servidor, funcion de callback
            console.log(data);
            if (data.nick != -1) {
                console.log('Usuario ' + data.nick + ' registrado');
                //ws.nick = data.nick;
                //$.cookie("nick",ws.nick);
                //iu.mostrarHome(data);
            }
            else {
                console.log('El nick ya esta en uso');
                //iu.mostrarModal("El nick ya está en uso");
                //iu.mostrarAgregarJugador();
            }
        });
        // cualquier cosa a partir de aqui, se ejecuta A LA VEZ que la llamada
        // no se puede asumir que el servidor haya contestado, no deben depender
    }

    this.crearPartida = function (nick) {
        var cli = this;
        $.getJSON("/crearPartida/" + nick, function (data) {
            this.nick = nick;
            console.log(data);
            if (data.codigo != -1) {
                console.log('Usuario ' + nick + ' crea la partida ' + data.codigo);
            }
            else {
                console.log('No se ha podido crear la partida ya que el usuario ' + nick + ' no esta registrado');
            }
        });
    }
    this.unirseAPartida=function(nick,codigo){
		let cli=this;
		$.getJSON("/unirseAPartida/"+nick+"/"+codigo,function(data){
			//se ejecuta cuando conteste el servidor
			//console.log(data);
			if (data.codigo!=-1){
				console.log("Usuario "+nick+" se une a partida codigo: "+data.codigo)
				//ws.nick=data.nick;
				//$.cookie("nick",ws.nick);
				//iu.mostrarHome(data);
			}
			else{
				console.log("No se ha podido unir a partida")
				//iu.mostrarModal("El nick ya está en uso");
				//iu.mostrarAgregarJugador();
			}
		});
	}
}