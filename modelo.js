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
        let codigo = Date.now();
        this.partidas[codigo] = new Partida(codigo, nick); // Valorar si interesa el string de Nick o el objeto 
        return codigo;
    }
    this.unirseAPartida = function (codigo, nick){
        if (this.partidas[codigo]){
            this.partidas[codigo].agregarJugador(nick);
        }
        else {
            console.log('La partida no existe');
        }
    }
    this.obtenerPartidas = function(){
        let lista = [];
        //for(i = 0; i < this.partidas.length; i++) para array normal
        for (let key in this.partidas){ // para array asociativo (diccionario) for each de otros lenguajes
            lista.push({'codigo':key, 'owner': this.partidas[key].owner});
        }
        return lista;
    }
    this.obtenerPartidasDisponibles = function(){
        // devolver solo las partidas en las que haya hueco
    }
}

function Usuario(nick, juego){
    this.nick = nick; // Setter
    this.juego = juego;
    this.crearPartida = function(){
        return this.juego.crearPartida(this.nick);
    }
    this.unirseAPartida = function(codigo){
        this.juego.unirseAPartida(codigo, this.nick);
    }
}

function Partida(codigo, nick){
    this.codigo = codigo;
    this.owner = nick;
    this.jugadores = []; // Array normal
    this.fase="inicial"; // new Inicial(), paradigma de crearlo con un string o con un patron de dise;o (state)
    // this.maxJugadores = 2;
    this.agregarJugador = function(nick){
        if (this.jugadores.length < 2){ // Ese 2 seria la var maxJugadores, se pone asi por si se cambia de idea
            this.jugadores.push(nick);
        } 
        else {
            console.log('La partida esta completa');
        }
    }
    this.agregarJugador(this.owner);
}