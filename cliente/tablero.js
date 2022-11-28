/*
Esta funcion es una adpatacion de este repositorio: https://github.com/billmei/battleboat
*/
function Tablero() {
    this.placingOnGrid = false
    this.nombreBarco;
    this.flota;

    this.init = function () {
        let humanCells = document.querySelector('.human-player').childNodes;
        for (let k = 0; k < humanCells.length; k++) {
            humanCells[k].self = this;
            humanCells[k].addEventListener('click', this.placementListener, false);
        }

        let computerCells = document.querySelector('.computer-player').childNodes;
        for (let j = 0; j < computerCells.length; j++) {
            computerCells[j].self = this;
            computerCells[j].addEventListener('click', this.shootListener, false);
        }

        let playerRoster = document.querySelector('.fleet-roster').querySelectorAll('li');
        for (let i = 0; i < playerRoster.length; i++) {
            playerRoster[i].self = this;
            playerRoster[i].addEventListener('click', this.rosterListener, false);
        }
    }

    this.placementListener = function (e) {
        let self = e.target.self;
        if (self.placingOnGrid) {
            let x = parseInt(e.target.getAttribute('data-x'), 10);
            let y = parseInt(e.target.getAttribute('data-y'), 10);

            self.colocarBarco(self.nombreBarco, x, y);
        }
    };

    this.rosterListener = function (e) {
        let self = e.target.self;
        let roster = document.querySelectorAll('.fleet-roster li');
        for (let i = 0; i < roster.length; i++) {
            let classes = roster[i].getAttribute('class') || '';
            classes = classes.replace('placing', '');
            roster[i].setAttribute('class', classes);
        }

        self.nombreBarco = e.target.getAttribute('id');
        document.getElementById(self.nombreBarco).setAttribute('class', 'placing');
        self.placingOnGrid = true;
    };

    this.shootListener = function (e) {
        let x = parseInt(e.target.getAttribute('data-x'), 10);
        let y = parseInt(e.target.getAttribute('data-y'), 10);
        console.log('Disparan en x: ', x, 'y: ', y)
        cws.disparar(x, y);
    }

    this.puedesColocarBarco = function (barco, x, y) {
        for (let i = 0; i < barco.tam; i++) {
            console.log('Barco ', barco.nombre, 'colocado en', x + i, y)
            this.updateCell(x + i, y, 'ship', 'human-player');
        }
        this.endPlacing(barco.nombre)
    }

    this.endPlacing = function (nombreBarco) {
        document.getElementById(nombreBarco).setAttribute('class', 'placed');
        this.placingOnGrid = false;
    }

    this.colocarBarco = function (nombre, x, y,) {
        cws.colocarBarco(nombre, x, y)
    }

    this.updateCell = function (x, y, type, targetPlayer) {
        let player = targetPlayer;
        let classes = ['grid-cell', 'grid-cell-' + x + '-' + y, 'grid-' + type];
        document.querySelector('.' + player + ' .grid-cell-' + x + '-' + y).setAttribute('class', classes.join(' '));
    }

    this.mostrarTablero = function (mostrar) {
        let tablero = document.getElementById("tablero");
        if (mostrar) {
            tablero.style.display = "block";
        } else {
            tablero.style.display = "none";
        }
    }

    this.createGrid = function () {
        let gridDiv = document.querySelectorAll('.grid');
        for (let grid = 0; grid < gridDiv.length; grid++) {
            let myNode = gridDiv[grid];
            while (myNode.lastElementChild) {
                myNode.removeChild(myNode.lastElementChild);
            }

            for (let i = 0; i < 10; i++) {
                for (let j = 0; j < 10; j++) {
                    let el = document.createElement('div');
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
    this.mostrarTablero(false)
}
