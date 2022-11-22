/*
Esta funcion es una adpatacion de este repositorio: https://github.com/billmei/battleboat
*/

function Tablero() {
    this.placingOnGrid = false
    this.nombreBarco;
    this.flota;

    this.init = function () {
        var humanCells = document.querySelector('.human-player').childNodes;
        for (var k = 0; k < humanCells.length; k++) {
            humanCells[k].self = this;
            humanCells[k].addEventListener('click', this.placementListener, false);
        }

        var playerRoster = document.querySelector('.fleet-roster').querySelectorAll('li');
        for (var i = 0; i < playerRoster.length; i++) {
            playerRoster[i].self = this;
            playerRoster[i].addEventListener('click', this.rosterListener, false);
        }
    }
    this.placementListener = function (e) {
        var self = e.target.self;
        if (self.placingOnGrid) {
            var x = parseInt(e.target.getAttribute('data-x'), 10);
            var y = parseInt(e.target.getAttribute('data-y'), 10);

            self.colocarBarco(self.nombreBarco, x, y);
        }
    };

    this.rosterListener = function (e) {
        var self = e.target.self;
        var roster = document.querySelectorAll('.fleet-roster li');
        for (var i = 0; i < roster.length; i++) {
            var classes = roster[i].getAttribute('class') || '';
            classes = classes.replace('placing', '');
            roster[i].setAttribute('class', classes);
        }

        self.nombreBarco = e.target.getAttribute('id');
        document.getElementById(self.nombreBarco).setAttribute('class', 'placing');
        self.placingOnGrid = true;
    };

    this.puedesColocarBarco = function (barco, x, y) {
        for (var i = 0; i < barco.tam; i++) {
            this.updateCell(x + i, y, 'ship', 'human-player');
        }
        this.endPlacing(barco.nombre)
    }

    this.endPlacing = function (nombreBarco) {
        document.getElementById(nombreBarco).setAttribute('class', 'placed');
        this.placingOnGrid = false;
    };

    this.colocarBarco = function (nombre, x, y,) {
        cws.colocarBarco(nombre, x, y)
    }

    this.updateCell = function (x, y, type, targetPlayer) {
        var player = targetPlayer;
        var classes = ['grid-cell', 'grid-cell-' + x + '-' + y, 'grid-' + type];
        document.querySelector('.' + player + ' .grid-cell-' + x + '-' + y).setAttribute('class', classes.join(' '));
    };

    this.mostrarTablero = function () {

    }

    this.createGrid = function () {
        var gridDiv = document.querySelectorAll('.grid');
        for (var grid = 0; grid < gridDiv.length; grid++) {
            for (var i = 0; i < 10; i++) {
                for (var j = 0; j < 10; j++) {
                    var el = document.createElement('div');
                    el.setAttribute('data-x', j);
                    el.setAttribute('data-y', i);
                    el.setAttribute('class', 'grid-cell grid-cell-' + j + '-' + i);
                    gridDiv[grid].appendChild(el);
                }
            }
        }
    };

    this.createGrid()
    this.init()
}
