function Juego(){
    this.partidas = {}; // [] array {} array asociativo(diccionario)
    this.usuarios = {};

    this.agregarUsuario = function(nick){
        if (!this.usuarios[nick]){
            this.usuarios[nick] = new Usuario(nick, this); // con el this le paso el objeto de Juego
        }
    }

    this.eliminarUsuario = function(nick){
        delete this.usuarios[nick];
    }
    
    this.crearPartida = function(nick){
        // obtener codigo unico
        // crear la partida con propietario nick
        // devolver el codigo
        console.log('partida creada');
    }
}

function Usuario(nick, juego){
    this.nick = nick; // Setter
    this.juego = juego;
    this.crearPartida = function(){
        this.juego.crearPartida(this.nick);
    }
}

function Partida(){
    this.codigo = codigo;
}