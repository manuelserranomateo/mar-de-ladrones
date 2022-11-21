function Tablero() {
    this.placingOnGrid = false
    this.nombreBarco;
    this.init = function () {
        var humanCells = document.querySelector('.human-player').childNodes;
        for (var k = 0; k < humanCells.length; k++) {
            humanCells[k].self = this;
            humanCells[k].addEventListener('click', this.placementListener, false);
            // humanCells[k].addEventListener('mouseover', this.placementMouseover, false);
            // humanCells[k].addEventListener('mouseout', this.placementMouseout, false);
        }

        // Add a click listener to the roster	
        var playerRoster = document.querySelector('.fleet-roster').querySelectorAll('li');
        for (var i = 0; i < playerRoster.length; i++) {
            playerRoster[i].self = this;
            playerRoster[i].addEventListener('click', this.rosterListener, false);
        }
    }
    this.placementListener = function (e) {
        var self = e.target.self;
        if (self.placingOnGrid) {
            // Extract coordinates from event listener
            var x = parseInt(e.target.getAttribute('data-x'), 10);
            var y = parseInt(e.target.getAttribute('data-y'), 10);
            // Don't screw up the direction if the user tries to place again.
            var successful = self.colocarBarco(self.nombreBarco, x, y);
            if (successful) {
                // console.log("barco: ", self.nombreBarco, "x: ", x, "y: ", y)
                //     // Done placing this ship
                //     self.endPlacing(Game.placeShipType);
                self.placingOnGrid = false;
                // if (self.areAllShipsPlaced()) {
                //     var el = document.getElementById('rotate-button');
                //     el.addEventListener(transitionEndEventName(),(function(){
                //         el.setAttribute('class', 'hidden');
                //         if (gameTutorial.showTutorial) {
                //             document.getElementById('start-game').setAttribute('class', 'highlight');
                //         } else {
                //             document.getElementById('start-game').removeAttribute('class');	
                //         }
                //     }),false);
                //     el.setAttribute('class', 'invisible');
                // }
            }
        }
    };
    this.rosterListener = function (e) {
        var self = e.target.self;
        // Remove all classes of 'placing' from the fleet roster first
        var roster = document.querySelectorAll('.fleet-roster li');
        for (var i = 0; i < roster.length; i++) {
            var classes = roster[i].getAttribute('class') || '';
            classes = classes.replace('placing', '');
            roster[i].setAttribute('class', classes);
        }

        // Set the class of the target ship to 'placing'
        self.nombreBarco = e.target.getAttribute('id');
        document.getElementById(self.nombreBarco).setAttribute('class', 'placing');
        // Game.placeShipDirection = parseInt(document.getElementById('rotate-button').getAttribute('data-direction'), 10);
        self.placingOnGrid = true;
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

    this.colocarBarco = function (nombre, x, y,) {
        cws.colocarBarco(nombre, x, y)
        // this.flota[nombre].tam pero no funsiona
        for (var j = 0; j < 3; j++) {
            this.updateCell(x + j, y, "ship", 'human-player');
        }
        return true
    }

    this.updateCell = function (x, y, type, targetPlayer) {
        var player = 'human-player';
        // if (targetPlayer === CONST.HUMAN_PLAYER) {
        //     player = ;
        // } else if (targetPlayer === CONST.COMPUTER_PLAYER) {
        //     player = 'computer-player';
        // } else {
        //     // Should never be called
        //     console.log("There was an error trying to find the correct player's grid");
        // }

        // switch (type) {
        //     case CONST.CSS_TYPE_EMPTY:
        //         this.cells[x][y] = CONST.TYPE_EMPTY;
        //         break;
        //     case CONST.CSS_TYPE_SHIP:
        //         this.cells[x][y] = CONST.TYPE_SHIP;
        //         break;
        //     case CONST.CSS_TYPE_MISS:
        //         this.cells[x][y] = CONST.TYPE_MISS;
        //         break;
        //     case CONST.CSS_TYPE_HIT:
        //         this.cells[x][y] = CONST.TYPE_HIT;
        //         break;
        //     case CONST.CSS_TYPE_SUNK:
        //         this.cells[x][y] = CONST.TYPE_SUNK;
        //         break;
        //     default:
        //         this.cells[x][y] = CONST.TYPE_EMPTY;
        //         break;
        // }
        var classes = ['grid-cell', 'grid-cell-' + x + '-' + y, 'grid-' + type];
        document.querySelector('.' + player + ' .grid-cell-' + x + '-' + y).setAttribute('class', classes.join(' '));
    };

    this.createGrid()
    this.init()
}
