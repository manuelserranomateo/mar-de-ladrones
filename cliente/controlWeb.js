function ControlWeb() {
	this.comprobarCookie = function () {
		if ($.cookie('nick')) {
			rest.nick = $.cookie('nick');
			rest.comprobarUsuario();
		} else {
			this.mostrarAgregarUsuario();
		}
	}

	this.mostrarAgregarUsuario = function () {
		let cadena = '<div class="row" id="mAU">';
		cadena = cadena + "<div class='col'>"
		cadena = cadena + '<div class="row"><div class="col"><h1>Mar de Ladrones</h1></div></div>';
		cadena = cadena + '<div class="row" style="margin-top:30px">';
		cadena = cadena + '<div class="col">'
		cadena = cadena + '<input type="text" class="form-control mb-2 mr-sm-2 text-center w-75" id="usr" placeholder="Introduce tu nick (max 6 letras)" required></div>';
		cadena = cadena + '<div class="col">';
		cadena = cadena + '<button type="button" id="btnAU" class="btn btn-primary">Iniciar sesión</button>';
		cadena = cadena + '</div>';
		cadena = cadena + '<div id="nota"></div>';
		cadena = cadena + '</div></div>';

		$("#agregarUsuario").append(cadena);

		$("#btnAU").on("click", function (e) {
			if ($('#usr').val() === '' || $('#usr').val().length > 6) {
				e.preventDefault();
				iu.mostrarModal('Nick invalido');
			}
			else {
				let nick = $('#usr').val();
				$("#mAU").remove();
				rest.agregarUsuario(nick);
			}
		})
	}

	this.mostrarHome = function () {
		$('#mH').remove();
		let cadena = "<div class ='row' id='mH'>";
		cadena = cadena + "<div class='col'>";
		cadena = cadena + "<h2>Bienvenido <b>" + rest.nick + "</b></h2>";
		cadena = cadena + "<div style='margin-bottom:15px' id='codigo'></div>"
		cadena = cadena + '<button id="btnBC" class="btn btn-primary mb-2 mr-sm-2">Salir</button>';
		cadena = cadena + "</div></div>";
		$('#agregarUsuario').append(cadena);
		this.mostrarCrearPartida();
		rest.obtenerPartidas();

		$("#btnBC").on("click", function () {
			$("#mCP").remove();
			$('#mLP').remove();
			$('#mH').remove();
			$('#mAU').remove();
			rest.usuarioSale();
		})
	}

	this.mostrarCrearPartida = function () {
		$("#mCP").remove();
		let cadena = '<div id="mCP">';
		cadena = cadena + '<button id="btnCP" class="btn btn-primary mb-2 mr-sm-2">Crear partida</button>';
		cadena = cadena + '<div id="nota"></div>';
		cadena = cadena + '</div></div>';

		$("#crearPartida").append(cadena);

		$("#btnCP").on("click", function () {
			$("#mLP").remove();
			$("#mCP").remove();
			cws.crearPartida();
		})
	}

	this.mostrarCodigo = function (codigo) {
		let cadena = "Codigo de la partida: " + codigo;
		cadena = cadena + '<div style="margin-top:15px">';
		cadena = cadena + '<button id="btnAP" class="btn btn-primary mb-2 mr-sm-2">Abandonar partida</button>';
		cadena = cadena + '</div>';
		this.mostrarEsperarPartidaEncontrada();
		$("#codigo").append(cadena);

		$("#btnAP").on("click", function () {
			$('#mH').remove();
			$('#mAU').remove();
			cws.abandonarPartida();
		})
	}

	this.mostrarListaDePartidas = function (lista) {
		$('#mLP').remove();
		let cadena = '<div id="mLP"><h3>Partidas disponibles</h3>';
		cadena = cadena + '<div class="row" style="margin-top:10px">';
		cadena = cadena + '<ul class="list-group">';
		for (i = 0; i < lista.length; i++) {
			cadena = cadena + "<li class='list-group-item' style='margin-top:10px'><a href='#' value='" + lista[i].codigo +
				"'>Partida creada por <b>" + lista[i].owner + "</b></a></li>";
		}
		cadena = cadena + " </ul>";
		cadena = cadena + " </div></div>";
		$("#listaPartidas").append(cadena);

		$(".list-group a").click(function () {
			codigo = $(this).attr("value");

			if (codigo) {
				$('#mLP').remove();
				$('#mCP').remove();
				cws.unirseAPartida(codigo);
			}
		});
	}

	this.finalPartida = function () {
		$('#mH').remove()
		cws.codigo = undefined;
		$('#gc').remove();
		tablero = new Tablero(10);
		this.mostrarHome()
	}

	this.mostrarEsperarPartidaEncontrada = function () {
		$('#mEPE').remove();
		var cadena = '<div class="mt-5"id="mEPE"><h3>Aun no tienes rival...</h3>';
		cadena = cadena + '<img src="cliente/img/espera.gif">';
		cadena = cadena + '</div>';
		$('#agregarUsuario').append(cadena);
	}

	this.mostrarModal = function (msg) {
		$('#mM').remove();
		let cadena = "<p class='text-dark' id='mM'>" + msg + "</p>";
		$('#contenidoModal').append(cadena);
		$('#miModal').modal("show");
	}
}