let cad = require('./cad.js')

function Juego(test) {
    this.partidas = {};
    this.usuarios = {};
    this.cad = new cad.Cad(); // capa de acceso a datos
    this.test = test

    this.agregarUsuario = function (nick, guardar) {
        let res = { "nick": -1 };
        if (!this.usuarios[nick]) {
            this.usuarios[nick] = new Usuario(nick, this);
            this.insertarLog({ "operacion": "crearUsuario", "usuario": nick, "fecha": Date() }, function () {
                console.log("Registro insertado");
            });
            res = { "nick": nick };
            console.log("Nuevo usuario: " + nick);
            if (guardar && (this.test == "false")) {
                this.cad.obtenerOCrearUsuario({ "nick": nick }, function (usr) {
                    console.log("Usuario creado!")
                })
            }
        }
        return res;
    }

    this.eliminarUsuario = function (nick) {
        delete this.usuarios[nick];
    }

    this.usuarioSale = function (nick) {
        if (this.usuarios[nick]) {
            codigo = this.finalizarPartida(nick);
            this.eliminarUsuario(nick);
        }
        this.insertarLog({ 'operacion': 'usuarioSale', 'nick': nick, 'fecha': Date() }, function () {
            console.log('Registro insertado')
        })
        if (codigo) {
            return codigo
        }
    }

    this.jugadorCreaPartida = function (nick) {
        let usr = this.usuarios[nick];
        let res = { codigo: -1 };
        if (usr) {
            let codigo = usr.crearPartida();
            res = { codigo: codigo };
        }
        return res;
    }

    this.jugadorSeUneAPartida = function (nick, codigo) {
        let usr = this.usuarios[nick];
        let res = { "codigo": -1 };
        if (usr) {
            let valor = usr.unirseAPartida(codigo);
            res = { "codigo": valor };
            this.insertarLog({ 'operacion': 'unirPartida', 'nick': nick, 'codigo': codigo, 'fecha': Date() }, function () {
                console.log('Registro insertado')
            })
        }
        return res;
    }

    this.crearPartida = function (user) {
        let codigo = Date.now();
        this.insertarLog({ 'operacion': 'crearPartida', 'owner': user.nick, 'codigo': codigo, 'fecha': Date() }, function () {
            console.log('Registro insertado')
        })
        this.partidas[codigo] = new Partida(codigo, user);
        return codigo;
    }

    this.unirseAPartida = function (codigo, usr) {
        let res = -1;
        if (this.partidas[codigo]) {
            res = this.partidas[codigo].agregarJugador(usr);
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
            if (this.partidas[key].jugadores.length < 2 && this.partidas[key].fase == 'inicial')
                lista.push({ 'codigo': key, 'owner': this.partidas[key].owner.nick });
        }
        return lista;

    }

    this.finalizarPartida = function (nick) {
        for (let key in this.partidas) {
            if ((this.partidas[key].fase == "inicial" || this.partidas[key].fase == "desplegando" || this.partidas[key].fase == "jugando") && this.partidas[key].estoy(nick)) {
                this.partidas[key].fase = "final";
                return this.partidas[key].codigo;

            }
        }
    }

    this.obtenerPartida = function (codigo) {
        return this.partidas[codigo];
    }

    this.obtenerUsuario = function (nick) {
        return this.usuarios[nick];
    }

    this.insertarLog = function (log, callback) {
        if (test == 'false') {
            this.cad.insertarLog(log, callback)
        }
    }
    this.obtenerLogs = function (callback) {
        this.cad.obtenerLogs(callback)
    }

    if (test == 'false') {
        this.cad.conectar(function (db) {
            console.log('conectado a atlas')
        })
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
        this.flota["Bote de remos"] = new Barco("Bote de remos", 1, new Horizontal());
        this.flota["Balandro"] = new Barco("Balandro", 2, new Horizontal());
        this.flota["Bergartin"] = new Barco("Bergartin", 3, new Horizontal());
        this.flota["Galeon"] = new Barco("Galeon", 4, new Horizontal());
    }

    this.colocarBarco = function (nombre, x, y) {
        if (this.partida.fase == "desplegando") {
            let barco = this.flota[nombre];
            this.tableroPropio.colocarBarco(barco, x, y)
            return barco
        }
    }

    this.comprobarLimites = function (tam, x) {
        return this.tableroPropio.comprobarLimites(tam, x)
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
        return this.partida.disparar(this.nick, x, y);
    }

    this.meDisparan = function (x, y) {
        return this.tableroPropio.meDisparan(x, y);
    }

    this.obtenerEstado = function (x, y) {
        return this.tableroPropio.obtenerEstado(x, y);
    }
    this.obtenerEstadoMarcado = function (x, y) {
        return this.tableroRival.obtenerEstado(x, y);
    }

    this.marcarEstado = function (estado, x, y) {
        this.tableroRival.marcarEstado(estado, x, y);
        if (estado == "agua") {
            this.partida.cambiarTurno(this.nick);
        }
    }

    this.flotaHundida = function () {
        for (let key in this.flota) {
            if (this.flota[key].estado != "hundido") {
                return false;
            }
        }
        return true;
    }

    this.finalizarPartidaLog = function (res) {
        this.juego.insertarLog({
            'operacion': 'partidaFinalizada', 'ganador': res.ganador, 'perdedor': res.perdedor,
            'codigo': res.codigo, 'fecha': Date()
        }, function () {
            console.log('Registro insertado')
        })
    }

    this.comprobarLimites = function (tam, x) {
        return this.tableroPropio.comprobarLimites(tam, x)
    }

    this.casillasLibres = function (nombre, x, y) {
        return this.tableroPropio.casillasLibres(nombre, x, y)
    }

    this.obtenerFlota = function () {
        return this.flota;
    }

    this.cambiarOrientacion = function (){
        for (let key in this.flota){
            if (!this.flota[key].desplegado){
                if (this.flota[key].orientacion.nombre == 'horizontal'){
                    this.flota[key].orientacion = new Vertical()
                } else if (this.flota[key].orientacion.nombre == 'vertical'){
                    this.flota[key].orientacion = new Horizontal()
                }
            }
        }
    }

    this.abandonarPartidaLog = function (codigo) {
        this.juego.insertarLog({ 'operacion': 'abandonarPartida', 'nick': this.nick, 'codigo': codigo, 'fecha': Date() }, function () {
            console.log('Registro insertado')
        })
    }

    this.insertarLog = function () {
        return this.juego.insertarLog()
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
            //console.log("El usuario " + usr.nick + " se une a la partida con codigo " + this.codigo);
            usr.partida = this;
            usr.inicializarTableros(10);
            usr.inicializarFlota();
            this.comprobarFase();
        }
        else {
            res = -1;
            //console.log("La partida está completa")
        }
        return res;
    }

    this.comprobarFase = function () {
        if (!this.hayHueco()) {
            this.fase = "desplegando";
        }
    }

    this.abandonarPartida = function (jugador) {
        if (jugador) {
            rival = this.obtenerRival(jugador.nick)
            this.fase = "final";
            if (rival) {
                console.log("Ganador: " + rival.nick);
            }
            jugador.abandonarPartidaLog(this.codigo)
        }
    }

    this.hayHueco = function () {
        return (this.jugadores.length < this.maxJugadores);
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
        console.log('Turno inicial asignado a : ', this.jugadores[0].nick);
    }

    this.cambiarTurno = function (nick) {
        this.turno = this.obtenerRival(nick);
        console.log('Turno asignado a : ', this.turno.nick);
    }

    this.obtenerTurno = function () {
        return this.turno
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
            let estado = atacado.meDisparan(x, y);
            atacante.marcarEstado(estado, x, y);
            this.comprobarFin(atacado);
            console.log(atacante.nick + ' dispara a ' + atacado.nick + ' en casillas ' + x, y);
            return estado
        }
        else {
            console.log('No es tu turno');
        }
    }

    this.comprobarFin = function (jugador) {
        if (jugador.flotaHundida()) {
            this.fase = "final";
            console.log('Fin de la partida');
            console.log('Gana ' + this.turno.nick);
            jugador.finalizarPartidaLog({ 'ganador': this.turno.nick, 'perdedor': jugador.nick, 'codigo': this.codigo })
        }
    }

    this.agregarJugador(this.owner);
}

function Tablero(size) {
    this.size = size;
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
        barco.colocar(this, x, y)
    }

    this.comprobarLimites = function (tam, x) {
        if (x + tam > this.size) {
            console.log('El barco excede los limites del tablero')
            return false
        } else { return true }
    }

    this.casillasLibresHorizontales = function (x, y, tam) {
        for (i = x; i < tam + x; i++) {
            let contiene = this.casillas[i][y].contiene;
            if (!contiene.esAgua()) {
                return false;
            }
        }
        return true;
    }

    this.casillasLibresVerticales = function (x, y, tam) {
        for (i = y; i < tam + y; i++) {
            let contiene = this.casillas[x][i].contiene;
            if (!contiene.esAgua()) {
                return false;
            }
        }
        return true;
    }

    this.meDisparan = function (x, y) {
        return this.casillas[x][y].contiene.meDisparan(this, x, y);
    }

    this.obtenerEstado = function (x, y) {
        return this.casillas[x][y].contiene.obtenerEstado();
    }

    this.marcarEstado = function (estado, x, y) {
        this.casillas[x][y].contiene = estado;
    }

    this.ponerAgua = function (x, y) {
        return this.casillas[x][y].contiene = new Agua();
    }

    this.crearTablero(size);
}

function Casilla(x, y) {
    this.x = x;
    this.y = y;
    this.contiene = new Agua();
}

function Barco(nombre, tam, ori) {
    this.nombre = nombre;
    this.tam = tam;
    this.orientacion = ori;
    this.desplegado = false;
    this.estado = "intacto";
    this.casillas = {};
    this.esAgua = function () {
        return false;
    }


    this.meDisparan = function (tablero, x, y) {
        this.estado = "tocado";
        if (this.orientacion.nombre == "horizontal") {
            this.casillas[x] = 'tocado'
        }
        if (this.orientacion.nombre == "vertical") {
            this.casillas[y] = 'tocado'
        }
        console.log("Tocado")

        if (this.comprobarCasillas()) {
            this.estado = "hundido";
            console.log("Hundido")
        }
        return this.estado;
    }

    this.posicion = function (x, y) {
        this.x = x;
        this.y = y;
        this.desplegado = true;
        this.iniCasillas()
    }

    this.colocar = function (tablero, x, y) {
        this.orientacion.colocarBarco(this, tablero, x, y);
    }

    this.obtenerEstado = function () {
        return this.estado;
    }

    this.comprobarCasillas = function () {
        if (this.orientacion.nombre == "horizontal") {
            for (i = 0; i < this.tam; i++) {
                if (this.casillas[this.x + i] == 'intacto') {
                    return false;
                }
            }
        }
        if (this.orientacion.nombre == "vertical") {
            for (i = 0; i < this.tam; i++) {
                if (this.casillas[this.y + i] == 'intacto') {
                    return false;
                }
            }
        }
        return true;
    }

    this.iniCasillas = function () {
        if (this.orientacion.nombre == 'horizontal'){
            for (i = 0; i < this.tam; i++) {
                this.casillas[i + this.x] = "intacto";
            }
        } else if (this.orientacion.nombre == 'vertical'){
            for (i = 0; i < this.tam; i++) {
                this.casillas[i + this.y] = "intacto";
            }
        }
        
    }
}

function Horizontal() {
    this.nombre = "horizontal"
    this.colocarBarco = function (barco, tablero, x, y) {
        if (tablero.comprobarLimites(barco.tam, x)) {
            if (tablero.casillasLibresHorizontales(x, y, barco.tam)) {
                for (let i = x; i < barco.tam + x; i++) {
                    tablero.casillas[i][y].contiene = barco;
                    console.log('Barco', barco.nombre, 'colocado en', i, y)
                }
                barco.posicion(x, y);
            }
        }
    }
    this.esHorizontal = function () {
        return true;
    }
    this.esVertical = function () {
        return false;
    }
}

function Vertical() {
    this.nombre = "vertical"
    this.colocarBarco = function (barco, tablero, x, y) {
        if (tablero.comprobarLimites(barco.tam, y)) {
            if (tablero.casillasLibresVerticales(x, y, barco.tam)) {
                for (let i = y; i < barco.tam + y; i++) {
                    tablero.casillas[x][i].contiene = barco;
                    console.log('Barco', barco.nombre, 'colocado en', x, i)
                }
                barco.posicion(x, y);
            }
        }
    }

    this.esVertical = function () {
        return true;
    }
    this.esHorizontal = function () {
        return false;
    }

}

function Agua() {
    this.nombre = "agua";
    this.esAgua = function () {
        return true;
    }
    this.meDisparan = function (tablero, x, y) {
        return this.obtenerEstado();
    }
    this.obtenerEstado = function () {
        return "agua";
    }
}

function Inicial() {
    this.nombre = "inicial"
}

module.exports.Juego = Juego;