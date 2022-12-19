let modelo = require("./modelo.js");

const SIZE = 10

describe("El juego...", function () {
  let miJuego;
  let us1, us2, partida;

  beforeEach(function () {
    miJuego = new modelo.Juego(true);
    miJuego.agregarUsuario("pepe");
    miJuego.agregarUsuario("luis");
    let res = miJuego.jugadorCreaPartida("pepe");
    miJuego.jugadorSeUneAPartida("luis", res.codigo);
    us1 = miJuego.obtenerUsuario("pepe");
    us2 = miJuego.obtenerUsuario("luis");
    partida = miJuego.obtenerPartida(res.codigo);
  });

  it("Comprobar nicks de los usuarios", function () {
    expect(us1.nick).toEqual("pepe");
    expect(us2.nick).toEqual("luis");
  });

  it("Comprobar que estan en la partida", function () {
    expect(partida.estoy("pepe")).toEqual(true);
    expect(partida.estoy("luis")).toEqual(true);
  });

  it("Comprobar que tienen tablero propio y rival", function () {
    expect(us1.tableroPropio).toBeDefined();
    expect(us2.tableroPropio).toBeDefined();
    expect(us1.tableroRival).toBeDefined();
    expect(us2.tableroRival).toBeDefined();

    expect(us1.tableroPropio.casillas.length).toEqual(SIZE);
    expect(us2.tableroPropio.casillas.length).toEqual(SIZE);

    //habría que recorrer las SIZE columnas
    for (x = 0; x < SIZE; x++) {
      expect(us1.tableroPropio.casillas[x].length).toEqual(SIZE);
    }
    //  expect(us2.tableroPropio.casillas[0].length).toEqual(SIZE);

    //habría que recorrer todo el tablero
    expect(us1.tableroPropio.casillas[0][0].contiene.esAgua()).toEqual(true);
  });

  it("Comprobar que tienen flota (4 barcos, tam 1,2,3,4)", function () {
    expect(us1.flota).toBeDefined();
    expect(us2.flota).toBeDefined();

    expect(Object.keys(us1.flota).length).toEqual(4);
    expect(Object.keys(us2.flota).length).toEqual(4);

    expect(us1.flota["Bote de remos"].tam).toEqual(1);
    expect(us1.flota["Balandro"].tam).toEqual(2);
    expect(us1.flota["Bergartin"].tam).toEqual(3);
    expect(us1.flota["Galeon"].tam).toEqual(4);
  });

  it("Comprobar que la partida está en fase desplegando", function () {
    expect(partida.esJugando()).toEqual(false);
    expect(partida.esDesplegando()).toEqual(true);
  });

  describe("A jugar Caso 1!", function () {
    beforeEach(function () {
      us1.colocarBarco("Bote de remos", 0, 0, 'horizontal');
      us1.colocarBarco("Balandro", 0, 1, 'horizontal');
      us1.colocarBarco("Bergartin", 0, 2, 'horizontal');
      us1.colocarBarco("Galeon", 0, 3, 'horizontal');
      us1.barcosDesplegados();
      us2.colocarBarco("Bote de remos", 0, 0, 'horizontal');
      us2.colocarBarco("Balandro", 0, 1, 'horizontal');
      us2.colocarBarco("Bergartin", 0, 2, 'vertical');
      us2.colocarBarco("Galeon", 3, 3, 'vertical');
      us2.barcosDesplegados();
    });

    it("Comprobar que las flotas están desplegadas", function () {
      expect(us1.todosDesplegados()).toEqual(true);
      expect(us2.todosDesplegados()).toEqual(true);
      expect(partida.flotasDesplegadas()).toEqual(true);
      expect(partida.esJugando()).toEqual(true);

      // bote-de-remos
      expect(us2.tableroPropio.casillas[0][0].contiene.esAgua()).toEqual(false);
      expect(us2.tableroPropio.casillas[1][0].contiene.esAgua()).toEqual(true);

      // balandro 
      expect(us2.tableroPropio.casillas[0][1].contiene.esAgua()).toEqual(false);
      expect(us2.tableroPropio.casillas[1][1].contiene.esAgua()).toEqual(false);
      expect(us2.tableroPropio.casillas[2][1].contiene.esAgua()).toEqual(true);

      // bergartin
      expect(us2.tableroPropio.casillas[0][2].contiene.esAgua()).toEqual(false);
      expect(us2.tableroPropio.casillas[0][3].contiene.esAgua()).toEqual(false);
      expect(us2.tableroPropio.casillas[0][4].contiene.esAgua()).toEqual(false);
      expect(us2.tableroPropio.casillas[0][5].contiene.esAgua()).toEqual(true);

      // galeon
      expect(us2.tableroPropio.casillas[3][3].contiene.esAgua()).toEqual(false);
      expect(us2.tableroPropio.casillas[3][4].contiene.esAgua()).toEqual(false);
      expect(us2.tableroPropio.casillas[3][5].contiene.esAgua()).toEqual(false);
      expect(us2.tableroPropio.casillas[3][6].contiene.esAgua()).toEqual(false);
      expect(us2.tableroPropio.casillas[3][7].contiene.esAgua()).toEqual(true);
    });

    it("Comprobar jugada que Pepe gana", function () {
      expect(partida.turno.nick).toEqual("pepe");

      // hundir bote-de-remos
      expect(us2.flota["Bote de remos"].estado).toEqual("intacto");
      us1.disparar(0, 0);
      expect(us2.flota["Bote de remos"].estado).toEqual("hundido");

      // hundir balandro
      expect(us2.flota["Balandro"].estado).toEqual("intacto");
      us1.disparar(0, 1)
      expect(us2.flota["Balandro"].estado).toEqual("tocado");
      us1.disparar(1, 1)
      expect(us2.flota["Balandro"].estado).toEqual("hundido");

      // hundir bergartin
      expect(us2.flota["Bergartin"].estado).toEqual("intacto");
      us1.disparar(0, 2)
      expect(us2.flota["Bergartin"].estado).toEqual("tocado");
      us1.disparar(0, 3)
      expect(us2.flota["Bergartin"].estado).toEqual("tocado");
      us1.disparar(0, 4)
      expect(us2.flota["Bergartin"].estado).toEqual("hundido");

      // hundir galeon
      expect(us2.flota["Galeon"].estado).toEqual("intacto");
      us1.disparar(3, 3)
      expect(us2.flota["Galeon"].estado).toEqual("tocado");
      us1.disparar(3, 4)
      expect(us2.flota["Galeon"].estado).toEqual("tocado");
      us1.disparar(3, 5)
      expect(us2.flota["Galeon"].estado).toEqual("tocado");
      us1.disparar(3, 6)
      expect(us2.flota["Galeon"].estado).toEqual("hundido");

      expect(partida.esFinal()).toEqual(true);
      expect(us2.flotaHundida()).toEqual(true);
      expect(us1.flotaHundida()).toEqual(false);
    });

    it("Comprobar el cambio de turno", function () {
      us1.disparar(3, 0);
      expect(partida.turno.nick).toEqual("luis");
    });

    it("Comprobar que no deja disparar sin turno", function () {
      us2.disparar(0, 0);
      expect(us1.flota["Bote de remos"].estado).toEqual("intacto");
    });
  });

  describe("Comprobar colocaciones horizonaltes invalidas", function () {
    beforeEach(function () {
      us1.colocarBarco("Bote de remos", 0, 0, 'horizontal');
      us1.colocarBarco("Balandro", 0, 0, 'horizontal');
      us1.colocarBarco("Bergartin", 0, 2, 'horizontal');
      us1.colocarBarco("Galeon", 6, 0, 'horizontal');
      us1.barcosDesplegados();
      us2.colocarBarco("Bote de remos", 3, 0, 'horizontal');
      us2.colocarBarco("Balandro", 2, 0, 'horizontal');
      us2.colocarBarco("Bergartin", 1, 0, 'horizontal');
      us2.colocarBarco("Galeon", 7, 0, 'horizontal');
      us2.barcosDesplegados();
    });

    it("Comprobar limites del tablero", function (){
      expect(us1.flota["Galeon"].desplegado).toEqual(true);
      expect(us2.flota["Galeon"].desplegado).toEqual(false);
    })

    it("Comprobar que no se puede colocar un barco que colisione con otro", function (){
      expect(us2.flota["Bote de remos"].desplegado).toEqual(true);
      expect(us2.flota["Balandro"].desplegado).toEqual(false);
      expect(us2.flota["Bergartin"].desplegado).toEqual(false);
    })

    it("Comprobar que no se puede colocar un barco encima de otro", function (){
      expect(us1.flota["Bote de remos"].desplegado).toEqual(true);
      expect(us1.flota["Balandro"].desplegado).toEqual(false);
    })
    
  });

  describe("Comprobar colocaciones verticales invalidas", function () {
    beforeEach(function () {
      us1.colocarBarco("Bote de remos", 0, 0, 'vertical');
      us1.colocarBarco("Balandro", 0, 0, 'vertical');
      us1.colocarBarco("Bergartin", 0, 2, 'horizontal');
      us1.colocarBarco("Galeon", 0, 6, 'vertical');
      us1.barcosDesplegados();
      us2.colocarBarco("Bote de remos", 3, 3, 'vertical');
      us2.colocarBarco("Balandro", 3, 2, 'vertical');
      us2.colocarBarco("Bergartin", 2, 3, 'horizontal');
      us2.colocarBarco("Galeon", 0, 7, 'vertical');
      us2.barcosDesplegados();
    });

    it("Comprobar limites del tablero", function (){
      expect(us1.flota["Galeon"].desplegado).toEqual(true);
      expect(us2.flota["Galeon"].desplegado).toEqual(false);
    })

    it("Comprobar que no se puede colocar un barco que colisione con otro", function (){
      expect(us2.flota["Bote de remos"].desplegado).toEqual(true);
      expect(us2.flota["Balandro"].desplegado).toEqual(false);
      expect(us2.flota["Bergartin"].desplegado).toEqual(false);
    })

    it("Comprobar que no se puede colocar un barco encima de otro", function (){
      expect(us1.flota["Bote de remos"].desplegado).toEqual(true);
      expect(us1.flota["Balandro"].desplegado).toEqual(false);
    })
    
  });
});