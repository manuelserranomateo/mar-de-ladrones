// modelo se mantiene aqui y no en servidor por comodidad de depuracion, cuando este acabado se va a servidor
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
    
    this.crearPartida = function(user){ // Diagrama de secuencia de crearPartida, Usuario -> Juego -> Partida
        let codigo = Date.now();
        this.partidas[codigo] = new Partida(codigo, user); // Valorar si interesa el string de Nick o el objeto 
        return codigo;
    }
    this.unirseAPartida = function (codigo, user){
        if (this.partidas[codigo]){
            this.partidas[codigo].agregarJugador(user);
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
        let lista = [];
        for (let key in this.partidas){ 
            if(this.partidas[key].jugadores.length < 2)
                lista.push({'codigo':key, 'owner': this.partidas[key].owner});
        }
        return lista;

    }
}

function Usuario(nick, juego){
    this.nick = nick; // Setter
    this.juego = juego;
    this.crearPartida = function(){
        return this.juego.crearPartida(this);
    }
    this.unirseAPartida = function(codigo){
        this.juego.unirseAPartida(codigo, this);
    }
}

function Partida(codigo, user){
    this.codigo = codigo;
    this.owner = user;
    this.jugadores = []; // Array normal
    this.fase="inicial"; // new Inicial(), paradigma de crearlo con un string o con un patron de dise;o (state)
    // this.maxJugadores = 2;
    this.agregarJugador = function(user){
        if (this.jugadores.length < 2){ // Ese 2 seria la var maxJugadores, se pone asi por si se cambia de idea
            this.jugadores.push(user);
        } 
        else {
            console.log('La partida esta completa');
        }
    }
    this.agregarJugador(this.owner);
}