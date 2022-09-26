describe("El juego...", function() {
  var miJuego;
  var usr1, usr2;

  beforeEach(function() { // definicion de variables, que se ejecuta siempre antes de cada it
    miJuego = new Juego();
    miJuego.agregarUsuario('pepe');
    miJuego.agregarUsuario('luis');
    usr1 = miJuego.usuarios['pepe'];
    usr2 = miJuego.usuarios['luis'];
  });

  it("inicialmente", function() { // it son los tests
    let lista=miJuego.obtenerPartidas();
    expect(lista.length).toEqual(0); // comprobar que no hay partidas
    expect(usr1.nick).toEqual('pepe');
    expect(usr2.nick).toEqual('luis');
  });

  it("partida creada", function() { // it son los tests
    let codigo = usr1.crearPartida();
    expect(miJuego.partidas[codigo]).toBeDfined();
    let partida = miJuego.partidas[codigo];
    expect(partida.owner).toEqual();
  });

  // escribir secuencia completa en la que usuario1 crea partida, usr2 se une y lo que se puede esperar
  // comprobar que la partida se ha creado, que el propietario es el que deberia ser
  // que la coleccion de jugadores de la partida esta el nick que lo ha creado
  // comprobar el metodo crearPartida, codigo, nick, propietario, coleccion de jugadores
});
