describe("El juego...", function() {
  var miJuego;
  var usr1, usr2, usr3;

  beforeEach(function() { // definicion de variables, que se ejecuta siempre antes de cada it
    miJuego = new Juego();
    miJuego.agregarUsuario('pepe');
    miJuego.agregarUsuario('luis');
    miJuego.agregarUsuario('gabri');
    usr1 = miJuego.usuarios['pepe'];
    usr2 = miJuego.usuarios['luis'];
    usr3 = miJuego.usuarios['gabri'];
  });

  it("inicialmente", function() { // it son los tests
    let lista=miJuego.obtenerPartidas();
    expect(lista.length).toEqual(0); // comprobar que no hay partidas
    expect(usr1.nick).toEqual('pepe');
    expect(usr2.nick).toEqual('luis');
  });

  it("crear partida", function() { 
    let codigo = usr1.crearPartida();
    expect(miJuego.partidas[codigo]).toBeDefined();
    let partida = miJuego.partidas[codigo];
    expect(partida.owner.nick).toEqual(usr1.nick);
    expect(partida.jugadores[0].nick).toEqual(usr1.nick);
    expect(partida.codigo).toEqual(codigo);

    usr2.unirseAPartida(codigo);
    expect(partida.jugadores.length).toEqual(2);
    
    usr3.unirseAPartida(codigo);
    expect(partida.jugadores.length).toEqual(2);  
  });

  xit("el usuario luis se une a la partida", function(){ // al ser xit se deshabilita temporalmente
    // TO-DO
  });
});
