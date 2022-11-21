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

    this.colocarBarco = function(nombre, x,y,){
        console.log("barco: ", nombre, "x: ", x, "y: ", y)
        for (var j = 0; j < shipCoords.length; j++) {
            this.playerGrid.updateCell(shipCoords[j].x, shipCoords[j].y, 'ship', this.player);
            // habria que cogerse updateCell
        }
        return true
    }

    this.createGrid()
    this.init()
}
