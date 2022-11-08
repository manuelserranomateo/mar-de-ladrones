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
        for (let codigo in this.partidas) {
            if (this.partidas[codigo].owner.nick == nick) {
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

    this.jugadorSeUneAPartida = function (nick, codigo) {
        let usr = this.usuarios[nick];
        let res = { "codigo": -1 };
        if (usr) {
            let valor = usr.unirseAPartida(codigo);
            //let valor=this.unirseAPartida(codigo,usr)
            res = { "codigo": valor };
        }
        return res;
    }


    this.crearPartida = function (user) { // Diagrama de secuencia de crearPartida, Usuario -> Juego -> Partida
        let codigo = Date.now();
        this.partidas[codigo] = new Partida(codigo, user); // Valorar si interesa el string de Nick o el objeto 
        return codigo;
    }


    this.unirseAPartida = function (codigo, usr) {
        let res = -1;
        if (this.partidas[codigo]) {
            res = this.partidas[codigo].agregarJugador(usr);
        }
        else {
            console.log("La partida no existe");
        }
        return res;
    }

    this.obtenerPartidas = function () {
        let lista = [];
        for (let key in this.partidas) {
            lista.push({ 'codigo': key, 'owner': this.partidas[key].owner.nick });
        }
        return lista;
    }


    this.obtenerPartidasDisponibles = function () {
        let lista = [];
        for (let key in this.partidas) {
            if (this.partidas[key].jugadores.length < 2)
                lista.push({ 'codigo': key, 'owner': this.partidas[key].owner.nick });
        }
        return lista;

    }

    this.obtenerPartida = function (codigo) {
        return this.partidas[codigo];
    }

    this.obtenerUsuario = function (nick) {
        return this.usuarios[nick];
    }
}

function Usuario(nick, juego) {
    this.nick = nick;
    this.juego = juego;
    this.tableroPropio;
    this.tableroRival;
    this.partida;
    this.flota = {};
    this.crearPartida = function () {
        return this.juego.crearPartida(this);
    }
    this.unirseAPartida = function (codigo) {
        return this.juego.unirseAPartida(codigo, this);
    }

    this.inicializarTableros = function (dim) {
        this.tableroPropio = new Tablero(dim);
        this.tableroRival = new Tablero(dim);

    }

    this.inicializarFlota = function () {
        // this.flota.push(new Barco("b2", 2));
        // this.flota.push(new Barco("b4", 4));
        this.flota["b2"] = new Barco("b2", 2);
        this.flota["b4"] = new Barco("b4", 4);
    }

    this.colocarBarco = function (nombre, x, y) {
        if (this.partida.fase == "desplegando") {
            let barco = this.flota[nombre];
            this.tableroPropio.colocarBarco(barco, x, y)
        }
    }

    this.todosDesplegados = function () {
        for (let key in this.flota) {
            if (!this.flota[key].desplegado) {
                return false;
            }
        }
        return true;
    }

    this.barcosDesplegados = function () {
        this.partida.barcosDesplegados();
    }

    this.disparar = function (x, y) {
        this.partida.disparar(this.nick, x, y);
    }

    this.meDisparan = function (x, y) {
        this.tableroPropio.meDisparan(x, y);
    }

    this.obtenerEstado = function (x, y) {
        return this.tableroPropio.obtenerEstado(x, y);
    }

    this.marcarEstado = function (estado, x, y) {
        this.tableroRival.marcarEstado(estado, x, y);
        if (estado == "agua") {
            this.partida.cambiarTurno(this.nick);
        }
    }

    this.flotaHundida = function () {
        for (let key in this.flota) {
            if (this.flota[key].estado!="hundido") {
                return false;
            }
        }
        return true;
    }
}

function Partida(codigo, user) {
    this.codigo = codigo;
    this.owner = user;
    this.jugadores = [];
    this.fase = "inicial";
    this.maxJugadores = 2;
    this.agregarJugador = function (usr) {
        let res = this.codigo;
        if (this.hayHueco()) {
            this.jugadores.push(usr);
            console.log("El usuario " + usr.nick + " se une a la partida " + this.codigo);
            usr.partida = this;
            usr.inicializarTableros(5);
            usr.inicializarFlota();
            this.comprobarFase();
        }
        else {
            res = -1;
            console.log("La partida está completa")
        }
        return res;
    }
    this.comprobarFase = function () {
        if (!this.hayHueco()) {
            this.fase = "desplegando";
        }
    }
    this.hayHueco = function () {
        return (this.jugadores.length < this.maxJugadores); // solo tocamos aqui por si hay que cambiar el n de jugadores
    }

    this.estoy = function (nick) {
        for (i = 0; i < this.jugadores.length; i++) {
            if (this.jugadores[i].nick == nick) {
                return true
            }
        }
        return false;
    }

    this.esJugando = function () {
        return this.fase == "jugando";
    }

    this.esDesplegando = function () {
        return this.fase == "desplegando";
    }

    this.esFinal = function () {
        return this.fase == "final";
    }

    this.flotasDesplegadas = function () {
        for (i = 0; i < this.jugadores.length; i++) {
            if (!this.jugadores[i].todosDesplegados()) {
                return false;
            }
        }
        return true;
    }
    this.barcosDesplegados = function () {
        if (this.flotasDesplegadas()) {
            this.fase = "jugando";
            this.asignarTurnoInicial();
        }
    }
    this.asignarTurnoInicial = function () {
        this.turno = this.jugadores[0];
    }

    this.cambiarTurno = function(nick){
        this.turno = this.obtenerRival(nick);
    }

    this.obtenerRival = function (nick) {
        let rival;
        for (i = 0; i < this.jugadores.length; i++) {
            if (this.jugadores[i].nick != nick) {
                rival = this.jugadores[i];
            }
        }
        return rival;
    }
    this.obtenerJugador = function (nick) {
        let jugador;
        for (i = 0; i < this.jugadores.length; i++) {
            if (this.jugadores[i].nick == nick) {
                jugador = this.jugadores[i];
            }
        }
        return jugador;
    }

    this.disparar = function (nick, x, y) {
        let atacante = this.obtenerJugador(nick);
        if (this.turno.nick == atacante.nick) {
            let atacado = this.obtenerRival(nick);
            atacado.meDisparan(x, y);
            let estado = atacado.obtenerEstado(x, y);
            atacante.marcarEstado(estado, x, y);
            this.comprobarFin(atacado);
        }
        else {
            console.log('No es tu turno');
        }
    }

    this.comprobarFin = function(jugador){
        if (jugador.flotaHundida()){
            this.fase="final";
            console.log('Fin de la partida');
            console.log('Gana ' + this.turno.nick);
        }
    }

    this.agregarJugador(this.owner);
}

function Tablero(size) {
    this.size = size; // filas = columnas
    this.casillas;
    this.crearTablero = function (tam) {
        this.casillas = new Array(tam);
        for (x = 0; x < tam; x++) {
            this.casillas[x] = new Array(tam);
            for (y = 0; y < tam; y++) {
                this.casillas[x][y] = new Casilla(x, y);
            }
        }
    }
    this.colocarBarco = function (barco, x, y) {
        if (this.casillasLibres(x, y, barco.tam)) {
            for (i = x; i < barco.tam; i++) {
                this.casillas[i][y].contiene = barco;
            }
            barco.desplegado = true;
        }
    }

    this.casillasLibres = function (x, y, tam) {
        for (i = x; i < tam; i++) {
            let contiene = this.casillas[i][y].contiene;
            if (!contiene.esAgua()) {
                return false;
            }
        }
        return true;
    }

    this.meDisparan = function (x, y) {
        this.casillas[x][y].contiene.meDisparan();
    }

    this.obtenerEstado = function (x, y) {
        return this.casillas[x][y].contiene.obtenerEstado();
    }

    this.marcarEstado = function (estado, x, y) {
        this.casillas[x][y].contiene = estado;
    }

    this.crearTablero(size);
}

function Casilla(x, y) {
    this.x = x;
    this.y = y;
    this.contiene = new Agua();
}

function Barco(nombre, tam) {
    this.nombre = nombre;
    this.tam = tam;
    //this.orientacion; lo podemos implementar nosotros
    this.desplegado = false;
    this.estado = "intacto";
    this.disparos = 0;
    this.esAgua = function () {
        return false;
    }

    this.meDisparan = function () {
        console.log("Barco");
        this.disparos++;
        if (this.disparos < this.tam) {
            this.estado = "tocado";
        }
        else {
            this.estado = "hundido";
        }
    }

    this.obtenerEstado = function () {
        return this.estado;
    }
}

function Agua() {
    this.nombre = "agua";

    this.esAgua = function () {
        return true;
    }

    this.meDisparan = function () {
        console.log("Agua")
    }

    this.obtenerEstado = function () {
        return "agua";
    }
}

function Inicial(){  //En esta por ejemplo el agregar jugador
	this.nombre="inicial"
}

module.exports.Juego = Juego;