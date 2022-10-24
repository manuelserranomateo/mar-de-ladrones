// modelo se mantiene aqui y no en servidor por comodidad de depuracion, cuando este acabado se va a servidor
function Juego() {
    this.partidas = {}; // [] array {} array asociativo(diccionario)
    this.usuarios = {};

    this.agregarUsuario = function (nick) {
        let res = { "nick": -1 };
        if (!this.usuarios[nick]) {
            this.usuarios[nick] = new Usuario(nick, this); // con el this le paso el objeto de Juego
            res = { "nick": nick };
            console.log('Nuevo usuario: ' + nick);
        }
        return res;
    }

    this.eliminarUsuario = function (nick) {
        let res = { "nick": -1 };
        // eliminar usuario al borrar cookies
        if (this.usuarios[nick]) {
            delete this.usuarios[nick];
            res = { "nick": nick };
        } 
        // eliminar partidas en las que el usuario era propietario
        for (let codigo in this.partidas){
            if (this.partidas[codigo].owner.nick == nick){
                delete this.partidas[codigo];
            }
        }
        return res;
    }

    this.jugadorCreaPartida = function (nick) { // esta funcion comprueba si el usuario existe a dif de crearPartida
        let usr = this.usuarios[nick]; // lo suyo seria con un metodo, ya que si no se expone como esta implementanda la coleccion
        let res = { codigo: -1 };
        if (usr) { // lo suyo seria redefinir esto en el modelo
            let codigo = usr.crearPartida();
            res = { codigo: codigo };
            console.log('Usuario ' + nick + " ha creado la partida " + codigo)
        }
        return res;
    }

    this.jugadorSeUneAPartida=function(nick,codigo){
		let usr = this.usuarios[nick];
		let res={"codigo":-1};
  		if (usr){
    		let valor=usr.unirseAPartida(codigo);
    		//let valor=this.unirseAPartida(codigo,usr)
	    	res={"codigo":valor};
	    }
    	return res;
	}


    this.crearPartida = function (user) { // Diagrama de secuencia de crearPartida, Usuario -> Juego -> Partida
        let codigo = Date.now();
        this.partidas[codigo] = new Partida(codigo, user); // Valorar si interesa el string de Nick o el objeto 
        return codigo;
    }

    
    this.unirseAPartida=function(codigo,usr){
		let res=-1;
		if (this.partidas[codigo]){
			res=this.partidas[codigo].agregarJugador(usr);
		}
		else{
			console.log("La partida no existe");
		}
		return res;
	}

    this.obtenerPartidas = function () {
        let lista = [];
        //for(i = 0; i < this.partidas.length; i++) para array normal
        for (let key in this.partidas) { // para array asociativo (diccionario) for each de otros lenguajes
            lista.push({ 'codigo': key, 'owner': this.partidas[key].owner.nick });
        }
        return lista;
    }
    this.obtenerPartidasDisponibles = function () {
        // devolver solo las partidas en las que haya hueco
        let lista = [];
        for (let key in this.partidas) {
            if (this.partidas[key].jugadores.length < 2)
                lista.push({ 'codigo': key, 'owner': this.partidas[key].owner.nick });
        }
        return lista;

    }
}

function Usuario(nick, juego) {
    this.nick = nick; // Setter
    this.juego = juego;
    this.crearPartida = function () {
        return this.juego.crearPartida(this);
    }
    this.unirseAPartida = function (codigo) {
        return this.juego.unirseAPartida(codigo, this);
    }
}

function Partida(codigo, user) {
    this.codigo = codigo;
    this.owner = user;
    this.jugadores = []; // Array normal
    this.fase = "inicial"; // new Inicial(), paradigma de crearlo con un string o con un patron de dise;o (state)
    this.maxJugadores = 2;
    this.agregarJugador=function(usr){
		let res=this.codigo;
		if (this.hayHueco()){
			this.jugadores.push(usr);
			console.log("El usuario "+usr.nick+" se une a la partida "+this.codigo);
			this.comprobarFase();
		}
		else{
			res=-1;
			console.log("La partida está completa")
		}
		return res;
	}
    this.comprobarFase = function(){
        if(!this.hayHueco()){
            this.fase="jugando";
        }
    }
    this.hayHueco = function(){
        return (this.jugadores.length < this.maxJugadores) // solo tocamos aqui por si hay que cambiar el n de jugadores
    }
    this.agregarJugador(this.owner);
}

module.exports.Juego = Juego;