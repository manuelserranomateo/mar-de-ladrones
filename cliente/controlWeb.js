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
		cadena = cadena + '<button id="btnAU" class="bn632-hover bn19">Iniciar sesion</button></a>';
		cadena = cadena + '<a class="bn632-hover bn19" href="/auth/google">Accede con Google</a>';
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
		$('#gc').remove();
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
			$('#gc').remove();
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
			$('#mEPE').remove();
			$('#mH').remove();
			$('#mAU').remove();
			cws.abandonarPartida();
		})
	}

	this.mostrarListaDePartidas = function (lista) {
		$('#mLP').remove();
		let cadena = '<div id="mLP"><h3>Partidas disponibles</h3>';
		cadena = cadena + '<div class="col" style="margin-top:10px">';
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
	{/* <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
  <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
</svg> */}

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